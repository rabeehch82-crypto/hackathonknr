// Text-to-speech: reads AI replies / prescription explanations aloud for
// senior users. Returns raw audio bytes (audio/mpeg) rather than a JSON blob.
import { handleOptions, corsHeaders } from "../_shared/cors.ts";
import { errorResponse } from "../_shared/response.ts";
import { getAuthenticatedUser } from "../_shared/supabaseClient.ts";
import { synthesizeSpeech } from "../_shared/openai.ts";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await getAuthenticatedUser(req);
  if (!user) return errorResponse("Unauthorized", 401);

  let body: { text?: string; voice?: string };
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }
  if (!body.text?.trim()) return errorResponse("`text` is required");
  if (body.text.length > 4000) return errorResponse("`text` must be 4000 characters or fewer");

  try {
    const audio = await synthesizeSpeech(body.text, body.voice ?? "alloy");
    return new Response(audio, {
      headers: { ...corsHeaders, "Content-Type": "audio/mpeg" },
    });
  } catch (err) {
    return errorResponse((err as Error).message, 502);
  }
});
