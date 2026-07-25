// Personalized health score: a deterministic score from recent vitals and
// medication adherence, plus a short AI-generated plain-language insight.
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { getAuthenticatedUser, userClient, serviceClient } from "../_shared/supabaseClient.ts";
import { chatCompletion } from "../_shared/openai.ts";

const NORMAL_RANGES: Record<string, { min: number; max: number }> = {
  blood_pressure: { min: 90, max: 130 }, // systolic
  blood_sugar: { min: 70, max: 140 },
  heart_rate: { min: 60, max: 100 },
  spo2: { min: 95, max: 100 },
};

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await getAuthenticatedUser(req);
  if (!user) return errorResponse("Unauthorized", 401);

  let body: { patientId?: string };
  try {
    body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
  } catch {
    body = {};
  }
  const patientId = body.patientId ?? user.id;

  const scoped = userClient(req);

  // RLS proves access: this select only succeeds if the caller is the patient,
  // their treating doctor, an authorized caregiver, or an admin.
  const { data: metrics, error: metricsError } = await scoped
    .from("health_metrics")
    .select("metric_type, value, recorded_at")
    .eq("patient_id", patientId)
    .order("recorded_at", { ascending: false })
    .limit(50);
  if (metricsError) return errorResponse("Access denied or no data", 403);

  const { data: reminders } = await scoped
    .from("medication_reminders")
    .select("status")
    .eq("patient_id", patientId)
    .neq("status", "pending")
    .order("scheduled_for", { ascending: false })
    .limit(30);

  const latestByType = new Map<string, number>();
  for (const m of metrics ?? []) {
    if (!latestByType.has(m.metric_type)) latestByType.set(m.metric_type, Number(m.value));
  }

  let vitalsScore = 100;
  let vitalsConsidered = 0;
  for (const [type, range] of Object.entries(NORMAL_RANGES)) {
    const value = latestByType.get(type);
    if (value === undefined) continue;
    vitalsConsidered++;
    if (value < range.min || value > range.max) vitalsScore -= 15;
  }
  if (vitalsConsidered === 0) vitalsScore = 70; // no data yet — neutral default

  const takenCount = (reminders ?? []).filter((r) => r.status === "taken").length;
  const totalCount = (reminders ?? []).length;
  const adherenceScore = totalCount > 0 ? Math.round((takenCount / totalCount) * 100) : 70;

  const score = Math.max(0, Math.min(100, Math.round(vitalsScore * 0.6 + adherenceScore * 0.4)));

  const factors = {
    vitals_score: Math.max(0, vitalsScore),
    adherence_score: adherenceScore,
    latest_vitals: Object.fromEntries(latestByType),
    medication_adherence_rate: totalCount > 0 ? `${takenCount}/${totalCount}` : "no data",
  };

  let insight = "";
  try {
    insight = await chatCompletion(
      [
        {
          role: "system",
          content:
            "You give a one or two sentence, warm, plain-language health insight for a senior " +
            "citizen based on a health score and its factors. No diagnosis. Encourage good habits.",
        },
        { role: "user", content: `Score: ${score}/100. Factors: ${JSON.stringify(factors)}` },
      ],
      { maxTokens: 120 },
    );
  } catch {
    insight = "Keep tracking your health metrics and taking medications on time.";
  }

  const admin = serviceClient();
  const { error: insertError } = await admin
    .from("health_scores")
    .insert({ patient_id: patientId, score, factors: { ...factors, insight } });
  if (insertError) return errorResponse(`Could not save score: ${insertError.message}`, 500);

  return jsonResponse({ patientId, score, factors, insight });
});
