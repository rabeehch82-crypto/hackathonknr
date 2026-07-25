// Voice-to-text: accepts multipart/form-data with an "audio" field and returns
// the transcript (Whisper), so voice navigation / voice chat input can work.
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { getAuthenticatedUser } from "../_shared/supabaseClient.ts";
import { transcribeAudio } from "../_shared/openai.ts";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await getAuthenticatedUser(req);
  if (!user) return errorResponse("Unauthorized", 401);

  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    return errorResponse("Send audio as multipart/form-data with an `audio` field");
  }

  const form = await req.formData();
  const audio = form.get("audio");
  if (!(audio instanceof Blob)) return errorResponse("`audio` field must be a file");

  try {
    const text = await transcribeAudio(audio, (audio as File).name ?? "audio.webm");
    return jsonResponse({ text });
  } catch (err) {
    return errorResponse((err as Error).message, 502);
  }
});
