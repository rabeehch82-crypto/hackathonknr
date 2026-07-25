// AI symptom checker: takes a free-text symptom description plus the patient's
// known conditions/allergies and returns a plain-language triage assessment.
// This is explicitly NOT a diagnosis — it nudges urgent cases toward emergency
// care and everything else toward booking a doctor.
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { getAuthenticatedUser, userClient } from "../_shared/supabaseClient.ts";
import { chatCompletion } from "../_shared/openai.ts";

interface SymptomAssessment {
  urgency: "emergency" | "see_doctor_soon" | "self_care" | "unclear";
  assessment: string;
  recommendation: string;
}

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await getAuthenticatedUser(req);
  if (!user) return errorResponse("Unauthorized", 401);

  let body: { symptoms?: string };
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }
  const symptoms = body.symptoms?.trim();
  if (!symptoms) return errorResponse("`symptoms` is required");

  const supabase = userClient(req);
  const { data: profile } = await supabase
    .from("profiles")
    .select("date_of_birth, chronic_conditions, allergies")
    .eq("id", user.id)
    .single();

  const context = profile
    ? `Patient context — age from DOB ${profile.date_of_birth ?? "unknown"}, ` +
      `known conditions: ${(profile.chronic_conditions ?? []).join(", ") || "none reported"}, ` +
      `allergies: ${(profile.allergies ?? []).join(", ") || "none reported"}.`
    : "No patient profile context available.";

  let raw: string;
  try {
    raw = await chatCompletion([
      {
        role: "system",
        content:
          "You are a symptom triage assistant for senior citizens, not a doctor. Given symptoms " +
          "and patient context, respond with STRICT JSON only, no markdown, matching this shape: " +
          `{"urgency": "emergency" | "see_doctor_soon" | "self_care" | "unclear", "assessment": string, "recommendation": string}. ` +
          "Use 'emergency' for anything suggesting stroke, heart attack, severe bleeding, breathing " +
          "difficulty, or loss of consciousness. Keep assessment and recommendation short and in plain language.",
      },
      { role: "user", content: `${context}\n\nSymptoms: ${symptoms}` },
    ]);
  } catch (err) {
    return errorResponse((err as Error).message, 502);
  }

  let result: SymptomAssessment;
  try {
    result = JSON.parse(raw);
  } catch {
    result = { urgency: "unclear", assessment: raw, recommendation: "Please consult a doctor to be sure." };
  }

  if (result.urgency === "emergency") {
    await supabase.from("notifications").insert({
      user_id: user.id,
      type: "emergency",
      title: "Urgent symptoms detected",
      message: "The symptom checker flagged your symptoms as potentially urgent. Please seek immediate care.",
      data: { symptoms },
    });
  }

  return jsonResponse(result);
});
