// Scheduled sweep (invoke every 5-10 minutes via an external scheduler or
// pg_cron + pg_net hitting this URL): flags overdue reminders as missed
// (which fires the notify_missed_reminder DB trigger) and pings patients
// whose next dose is coming up soon. Not user-invoked, so it authenticates
// with a shared secret instead of a user JWT (verify_jwt = false in config.toml).
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { serviceClient } from "../_shared/supabaseClient.ts";

const GRACE_PERIOD_MINUTES = 30;
const UPCOMING_WINDOW_MINUTES = 15;

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;

  const cronSecret = Deno.env.get("CRON_SECRET");
  if (cronSecret && req.headers.get("x-cron-secret") !== cronSecret) {
    return errorResponse("Unauthorized", 401);
  }

  const admin = serviceClient();
  const now = new Date();

  const overdueThreshold = new Date(now.getTime() - GRACE_PERIOD_MINUTES * 60 * 1000).toISOString();
  const { data: missed, error: missedError } = await admin
    .from("medication_reminders")
    .update({ status: "missed" })
    .eq("status", "pending")
    .lt("scheduled_for", overdueThreshold)
    .select("id");
  if (missedError) return errorResponse(`Failed marking missed reminders: ${missedError.message}`, 500);

  const upcomingUntil = new Date(now.getTime() + UPCOMING_WINDOW_MINUTES * 60 * 1000).toISOString();
  const { data: upcoming, error: upcomingError } = await admin
    .from("medication_reminders")
    .select("id, patient_id, scheduled_for, medications(name, dosage)")
    .eq("status", "pending")
    .is("notified_at", null)
    .gte("scheduled_for", now.toISOString())
    .lte("scheduled_for", upcomingUntil);
  if (upcomingError) return errorResponse(`Failed loading upcoming reminders: ${upcomingError.message}`, 500);

  let notified = 0;
  for (const reminder of upcoming ?? []) {
    const med = reminder.medications as unknown as { name: string; dosage: string } | null;
    const { error: notifyError } = await admin.from("notifications").insert({
      user_id: reminder.patient_id,
      type: "medication",
      title: "Medication reminder",
      message: `Time to take ${med?.name ?? "your medication"} ${med?.dosage ?? ""}`.trim(),
      data: { reminder_id: reminder.id },
    });
    if (!notifyError) {
      await admin
        .from("medication_reminders")
        .update({ notified_at: now.toISOString() })
        .eq("id", reminder.id);
      notified++;
    }
  }

  return jsonResponse({
    markedMissed: missed?.length ?? 0,
    notified,
    ranAt: now.toISOString(),
  });
});
