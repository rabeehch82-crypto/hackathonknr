// Appointment booking with double-booking prevention. A plain insert against
// the appointments table would satisfy RLS but can't express "this doctor
// already has a confirmed slot at this time" — that check belongs here.
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { getAuthenticatedUser, userClient } from "../_shared/supabaseClient.ts";

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await getAuthenticatedUser(req);
  if (!user) return errorResponse("Unauthorized", 401);

  let body: { doctorId?: string; scheduledAt?: string; reason?: string; durationMinutes?: number };
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const { doctorId, scheduledAt, reason } = body;
  const durationMinutes = body.durationMinutes ?? 30;

  if (!doctorId || !scheduledAt) return errorResponse("`doctorId` and `scheduledAt` are required");

  const scheduledDate = new Date(scheduledAt);
  if (Number.isNaN(scheduledDate.getTime())) return errorResponse("`scheduledAt` must be a valid ISO date");
  if (scheduledDate.getTime() < Date.now()) return errorResponse("`scheduledAt` must be in the future");

  const supabase = userClient(req);

  const { data: doctor, error: doctorError } = await supabase
    .from("doctors")
    .select("id, hospital_id")
    .eq("id", doctorId)
    .single();
  if (doctorError || !doctor) return errorResponse("Doctor not found", 404);

  const windowStart = new Date(scheduledDate.getTime() - durationMinutes * 60 * 1000).toISOString();
  const windowEnd = new Date(scheduledDate.getTime() + durationMinutes * 60 * 1000).toISOString();

  const { data: conflicts, error: conflictError } = await supabase
    .from("appointments")
    .select("id")
    .eq("doctor_id", doctorId)
    .in("status", ["requested", "confirmed"])
    .gte("scheduled_at", windowStart)
    .lte("scheduled_at", windowEnd);

  if (conflictError) return errorResponse(conflictError.message, 500);
  if (conflicts && conflicts.length > 0) {
    return errorResponse("This doctor already has an appointment near that time. Please choose another slot.", 409);
  }

  const { data: appointment, error: insertError } = await supabase
    .from("appointments")
    .insert({
      patient_id: user.id,
      doctor_id: doctorId,
      hospital_id: doctor.hospital_id,
      scheduled_at: scheduledDate.toISOString(),
      duration_minutes: durationMinutes,
      reason: reason ?? null,
    })
    .select()
    .single();

  if (insertError) return errorResponse(insertError.message, 500);

  return jsonResponse({ appointment });
});
