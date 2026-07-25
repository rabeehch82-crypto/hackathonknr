// Caregiver Dashboard onboarding: a patient invites a caregiver by email, or a
// caregiver requests access to a patient by email. Direction is inferred from
// the caller's own role.
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { getAuthenticatedUser, userClient } from "../_shared/supabaseClient.ts";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await getAuthenticatedUser(req);
  if (!user) return errorResponse("Unauthorized", 401);

  let body: { targetEmail?: string };
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }
  const targetEmail = body.targetEmail?.trim().toLowerCase();
  if (!targetEmail) return errorResponse("`targetEmail` is required");

  const supabase = userClient(req);

  const { data: callerProfile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profileError || !callerProfile) return errorResponse("Profile not found", 404);
  if (!["patient", "caregiver"].includes(callerProfile.role)) {
    return errorResponse("Only patients and caregivers can create caregiver links", 403);
  }

  const { data: targetId, error: lookupError } = await supabase.rpc("get_user_id_by_email", {
    p_email: targetEmail,
  });
  if (lookupError) return errorResponse(lookupError.message, 500);
  if (!targetId) return errorResponse("No CareBridge account found for that email", 404);
  if (targetId === user.id) return errorResponse("You cannot link yourself as your own caregiver");

  const patientId = callerProfile.role === "patient" ? user.id : targetId;
  const caregiverId = callerProfile.role === "patient" ? targetId : user.id;

  const { data: link, error: insertError } = await supabase
    .from("caregiver_access")
    .insert({ patient_id: patientId, caregiver_id: caregiverId })
    .select()
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return errorResponse("A caregiver link between these two accounts already exists", 409);
    }
    return errorResponse(insertError.message, 500);
  }

  return jsonResponse({ link });
});
