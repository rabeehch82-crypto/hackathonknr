// AI Health Assistant (voice + chat). Holds a running conversation per user,
// persists every turn, and replies with senior-friendly, plain-language guidance.
import { handleOptions } from "../_shared/cors.ts";
import { errorResponse, jsonResponse } from "../_shared/response.ts";
import { getAuthenticatedUser, userClient } from "../_shared/supabaseClient.ts";
import { chatCompletion, ChatMessage } from "../_shared/openai.ts";

const SYSTEM_PROMPT = `You are CareBridge AI's Health Assistant, built for senior citizens and their
caregivers. Always:
- Use short sentences and simple, plain language.
- Be warm, patient, and reassuring.
- Never give a definitive diagnosis; suggest seeing a doctor for anything serious.
- If the user describes an emergency (chest pain, difficulty breathing, stroke signs,
  severe bleeding), clearly tell them to call emergency services or use the SOS button
  right away, before anything else.
- Keep replies under 120 words unless the user asks for more detail.`;

Deno.serve(async (req) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const user = await getAuthenticatedUser(req);
  if (!user) return errorResponse("Unauthorized", 401);

  let body: { conversationId?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return errorResponse("Invalid JSON body");
  }

  const message = body.message?.trim();
  if (!message) return errorResponse("`message` is required");

  const supabase = userClient(req);
  let conversationId = body.conversationId;

  if (!conversationId) {
    const { data, error } = await supabase
      .from("ai_conversations")
      .insert({ user_id: user.id, title: message.slice(0, 60) })
      .select("id")
      .single();
    if (error) return errorResponse(`Could not start conversation: ${error.message}`, 500);
    conversationId = data.id;
  }

  const { error: insertUserMsgError } = await supabase
    .from("ai_messages")
    .insert({ conversation_id: conversationId, role: "user", content: message });
  if (insertUserMsgError) {
    return errorResponse(`Could not save message: ${insertUserMsgError.message}`, 500);
  }

  const { data: history, error: historyError } = await supabase
    .from("ai_messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(20);
  if (historyError) return errorResponse(`Could not load history: ${historyError.message}`, 500);

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(history ?? []).map((m) => ({ role: m.role as ChatMessage["role"], content: m.content })),
  ];

  let reply: string;
  try {
    reply = await chatCompletion(messages);
  } catch (err) {
    return errorResponse((err as Error).message, 502);
  }

  const { error: insertAssistantMsgError } = await supabase
    .from("ai_messages")
    .insert({ conversation_id: conversationId, role: "assistant", content: reply });
  if (insertAssistantMsgError) {
    return errorResponse(`Could not save reply: ${insertAssistantMsgError.message}`, 500);
  }

  await supabase
    .from("ai_conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return jsonResponse({ conversationId, reply });
});
