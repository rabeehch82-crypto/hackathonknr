// Emergency SOS & QR Medical Card: (re)generates the patient's QR card, snapshotting
// their current blood group, allergies, chronic conditions, active medications, and
// emergency contacts into `medical_summary` so a scan works even if the patient
// updates their records later — the card always reflects what was true when generated,
// and can be refreshed on demand.
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { getAuthenticatedUser, userClient } from "../_shared/supabaseClient.ts";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await getAuthenticatedUser(req);
  if (!user) return errorResponse("Unauthorized", 401);

  const supabase = userClient(req);

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("full_name, blood_group, allergies, chronic_conditions, phone")
    .eq("id", user.id)
    .single();
  if (profileError || !profile) return errorResponse("Profile not found", 404);

  const { data: activePrescriptions } = await supabase
    .from("prescriptions")
    .select("id, medications(name, dosage)")
    .eq("patient_id", user.id)
    .eq("status", "active");

  const currentMedications = (activePrescriptions ?? [])
    .flatMap((p: { medications: { name: string; dosage: string }[] }) => p.medications ?? [])
    .map((m) => `${m.name} ${m.dosage}`);

  const { data: contacts } = await supabase
    .from("emergency_contacts")
    .select("name, relation, phone, priority")
    .eq("patient_id", user.id)
    .order("priority", { ascending: true });

  const medicalSummary = {
    full_name: profile.full_name,
    phone: profile.phone,
    blood_group: profile.blood_group,
    allergies: profile.allergies ?? [],
    chronic_conditions: profile.chronic_conditions ?? [],
    current_medications: currentMedications,
    emergency_contacts: contacts ?? [],
    generated_at: new Date().toISOString(),
  };

  const { data: existing } = await supabase
    .from("emergency_qr_cards")
    .select("id, qr_token")
    .eq("patient_id", user.id)
    .maybeSingle();

  let qrToken: string;
  if (existing) {
    const { error: updateError } = await supabase
      .from("emergency_qr_cards")
      .update({ medical_summary: medicalSummary, is_active: true })
      .eq("id", existing.id);
    if (updateError) return errorResponse(updateError.message, 500);
    qrToken = existing.qr_token;
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from("emergency_qr_cards")
      .insert({ patient_id: user.id, medical_summary: medicalSummary })
      .select("qr_token")
      .single();
    if (insertError) return errorResponse(insertError.message, 500);
    qrToken = inserted.qr_token;
  }

  return jsonResponse({ qrToken, medicalSummary });
});
