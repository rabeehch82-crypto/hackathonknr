// AI Prescription Translator: turns a doctor's prescription into plain-language
// instructions in the patient's preferred language.
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { getAuthenticatedUser, userClient, serviceClient } from "../_shared/supabaseClient.ts";
import { chatCompletion } from "../_shared/openai.ts";

const LANGUAGE_NAMES: Record<string, string> = {
  ml: "Malayalam",
  en: "English",
  hi: "Hindi",
  ta: "Tamil",
  te: "Telugu",
  kn: "Kannada",
};

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await getAuthenticatedUser(req);
  if (!user) return errorResponse("Unauthorized", 401);

  let body: { prescriptionId?: string; language?: string };
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }
  if (!body.prescriptionId) return errorResponse("`prescriptionId` is required");

  const scopedClient = userClient(req);
  const { data: prescription, error: prescriptionError } = await scopedClient
    .from("prescriptions")
    .select("id, patient_id, diagnosis, profiles:patient_id(preferred_language)")
    .eq("id", body.prescriptionId)
    .single();

  if (prescriptionError || !prescription) {
    return errorResponse("Prescription not found or access denied", 404);
  }

  const { data: medications, error: medsError } = await scopedClient
    .from("medications")
    .select("name, dosage, frequency, duration_days, instructions, times_per_day")
    .eq("prescription_id", body.prescriptionId);

  if (medsError) return errorResponse(`Could not load medications: ${medsError.message}`, 500);

  const patientProfile = (prescription as unknown as { profiles: { preferred_language: string } | null }).profiles;
  const language = body.language ?? patientProfile?.preferred_language ?? "en";
  const languageName = LANGUAGE_NAMES[language] ?? "English";

  const medicationList = (medications ?? [])
    .map((m) => `- ${m.name} ${m.dosage}, ${m.frequency}, for ${m.duration_days ?? "?"} days. ${m.instructions ?? ""}`)
    .join("\n");

  let explanation: string;
  try {
    explanation = await chatCompletion([
      {
        role: "system",
        content:
          `You explain prescriptions to elderly patients in ${languageName}, in very simple, ` +
          "warm, and clear language. For each medicine, explain what it is generally used for, " +
          "when and how to take it, and one simple safety tip. End with a short reminder to " +
          "contact their doctor if they feel unwell. Do not add medicines that are not listed.",
      },
      {
        role: "user",
        content: `Diagnosis: ${prescription.diagnosis ?? "Not specified"}\n\nMedicines:\n${medicationList}`,
      },
    ]);
  } catch (err) {
    return errorResponse((err as Error).message, 502);
  }

  const admin = serviceClient();
  const { error: updateError } = await admin
    .from("prescriptions")
    .update({ ai_explanation: explanation, ai_explanation_language: language })
    .eq("id", prescription.id);
  if (updateError) return errorResponse(`Could not save explanation: ${updateError.message}`, 500);

  return jsonResponse({ prescriptionId: prescription.id, language, explanation });
});
