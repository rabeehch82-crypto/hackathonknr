// AI Medical Report Analysis: runs OCR on an already-uploaded record, then asks
// GPT to summarize it in plain language. The caller must already have access to
// the record (enforced by RLS on the initial read); the actual OCR/AI update is
// done with the service role since it writes fields no client-side RLS policy
// exposes for direct AI-generated writes.
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { getAuthenticatedUser, userClient, serviceClient } from "../_shared/supabaseClient.ts";
import { chatCompletion } from "../_shared/openai.ts";
import { extractText } from "../_shared/ocr.ts";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await getAuthenticatedUser(req);
  if (!user) return errorResponse("Unauthorized", 401);

  let body: { recordId?: string };
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  if (!body.recordId) return errorResponse("`recordId` is required");

  const scopedClient = userClient(req);
  // RLS on medical_records ensures this select only succeeds if the caller
  // (patient, uploader, treating doctor, or authorized caregiver) actually has access.
  const { data: record, error: recordError } = await scopedClient
    .from("medical_records")
    .select("id, patient_id, file_path, record_type, title")
    .eq("id", body.recordId)
    .single();

  if (recordError || !record) return errorResponse("Record not found or access denied", 404);

  const admin = serviceClient();
  const { data: fileData, error: downloadError } = await admin.storage
    .from("medical-records")
    .download(record.file_path);

  if (downloadError || !fileData) {
    return errorResponse(`Could not read uploaded file: ${downloadError?.message ?? "unknown error"}`, 500);
  }

  const arrayBuffer = await fileData.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

  let ocrText: string;
  try {
    ocrText = await extractText(base64);
  } catch (err) {
    return errorResponse(`OCR failed: ${(err as Error).message}`, 502);
  }

  let summary: string;
  try {
    summary = await chatCompletion([
      {
        role: "system",
        content:
          "You are a medical report summarizer for senior patients. Read the raw OCR text of a " +
          "medical report and produce: (1) a 3-5 sentence plain-language summary a non-medical " +
          "senior citizen can understand, (2) any values that are outside normal range and what " +
          "that might mean in simple terms, (3) suggested next steps (e.g. 'discuss with your doctor'). " +
          "Never state a diagnosis. Keep it concise and reassuring.",
      },
      { role: "user", content: `Report type: ${record.record_type}\n\nOCR text:\n${ocrText}` },
    ]);
  } catch (err) {
    return errorResponse(`AI summarization failed: ${(err as Error).message}`, 502);
  }

  const { error: updateError } = await admin
    .from("medical_records")
    .update({
      ocr_text: ocrText,
      ai_summary: summary,
      ai_analysis: { analyzed_at: new Date().toISOString(), model: Deno.env.get("OPENAI_CHAT_MODEL") ?? "gpt-5.5" },
    })
    .eq("id", record.id);

  if (updateError) return errorResponse(`Could not save analysis: ${updateError.message}`, 500);

  await admin.from("notifications").insert({
    user_id: record.patient_id,
    type: "ai_summary",
    title: "Report analyzed",
    message: `Your report "${record.title}" has been analyzed by AI.`,
    data: { record_id: record.id },
  });

  return jsonResponse({ recordId: record.id, ocrText, summary });
});
