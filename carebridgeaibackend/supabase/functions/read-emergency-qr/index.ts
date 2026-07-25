// Public emergency QR resolution: a first responder scans the QR code (which
// encodes only the opaque qr_token) and gets back the patient's emergency
// medical summary — no login required. Deliberately unauthenticated
// (verify_jwt = false in config.toml); the token itself is the credential, so
// keep it out of shareable links/screenshots.
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { serviceClient } from "../_shared/supabaseClient.ts";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  const url = new URL(req.url);
  const token = req.method === "GET" ? url.searchParams.get("token") : (await req.json().catch(() => ({}))).token;

  if (!token) return errorResponse("`token` is required");

  const admin = serviceClient();
  const { data: card, error } = await admin
    .from("emergency_qr_cards")
    .select("medical_summary, is_active, updated_at")
    .eq("qr_token", token)
    .maybeSingle();

  if (error) return errorResponse(error.message, 500);
  if (!card || !card.is_active) return errorResponse("QR card not found or inactive", 404);

  return jsonResponse({ medicalSummary: card.medical_summary, updatedAt: card.updated_at });
});
