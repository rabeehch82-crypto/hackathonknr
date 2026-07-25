// Accept / decline / revoke a caregiver_access link. RLS already restricts
// updates to the two parties involved; this validates the requested
// transition is legal for the caller's side of the relationship.
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { getAuthenticatedUser, userClient } from "../_shared/supabaseClient.ts";

type Action = "accept" | "decline" | "revoke";
const ACTION_STATUS: Record<Action, string> = {
  accept: "accepted",
  decline: "declined",
  revoke: "revoked",
};

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await getAuthenticatedUser(req);
  if (!user) return errorResponse("Unauthorized", 401);

  let body: { caregiverAccessId?: string; action?: Action };
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }
  if (!body.caregiverAccessId || !body.action) {
    return errorResponse("`caregiverAccessId` and `action` are required");
  }
  if (!(body.action in ACTION_STATUS)) return errorResponse("`action` must be accept, decline, or revoke");

  const supabase = userClient(req);
  const { data: link, error: fetchError } = await supabase
    .from("caregiver_access")
    .select("id, patient_id, caregiver_id, status")
    .eq("id", body.caregiverAccessId)
    .single();
  if (fetchError || !link) return errorResponse("Caregiver link not found or access denied", 404);

  const isPatient = link.patient_id === user.id;
  const isCaregiver = link.caregiver_id === user.id;

  if (body.action === "accept" || body.action === "decline") {
    if (!isPatient) return errorResponse("Only the patient can accept or decline a caregiver request", 403);
    if (link.status !== "pending") return errorResponse("This request has already been responded to", 409);
  }
  if (body.action === "revoke") {
    if (!isPatient && !isCaregiver) return errorResponse("Access denied", 403);
    if (link.status !== "accepted") return errorResponse("Only an active link can be revoked", 409);
  }

  const { data: updated, error: updateError } = await supabase
    .from("caregiver_access")
    .update({ status: ACTION_STATUS[body.action], responded_at: new Date().toISOString() })
    .eq("id", link.id)
    .select()
    .single();

  if (updateError) return errorResponse(updateError.message, 500);

  return jsonResponse({ link: updated });
});
