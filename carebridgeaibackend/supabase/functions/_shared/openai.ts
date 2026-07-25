// Thin wrappers around the OpenAI REST API. No SDK dependency — Edge Functions
// run on Deno, and a couple of `fetch` calls are simpler than pulling in a
// large client just for chat/whisper/tts.

const OPENAI_API_BASE = "https://api.openai.com/v1";

function requireOpenAIKey(): string {
  const key = Deno.env.get("OPENAI_API_KEY");
  if (!key) {
    throw new Error(
      "OPENAI_API_KEY is not configured. Set it with `supabase secrets set OPENAI_API_KEY=...`.",
    );
  }
  return key;
}

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatCompletion(
  messages: ChatMessage[],
  options: { model?: string; temperature?: number; maxTokens?: number } = {},
): Promise<string> {
  const apiKey = requireOpenAIKey();
  const model = options.model ?? Deno.env.get("OPENAI_CHAT_MODEL") ?? "gpt-5.5";

  const res = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.4,
      max_tokens: options.maxTokens ?? 800,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI chat completion failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

/** Sends an image (as a data URL or public URL) to a vision-capable chat model for OCR + analysis. */
export async function visionChatCompletion(
  imageUrl: string,
  prompt: string,
  options: { model?: string; maxTokens?: number } = {},
): Promise<string> {
  const apiKey = requireOpenAIKey();
  const model = options.model ?? Deno.env.get("OPENAI_CHAT_MODEL") ?? "gpt-5.5";

  const res = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: options.maxTokens ?? 1200,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI vision completion failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}

/** Transcribes audio (Whisper). `audio` should be a Blob/File from the incoming request. */
export async function transcribeAudio(audio: Blob, filename = "audio.webm"): Promise<string> {
  const apiKey = requireOpenAIKey();
  const model = Deno.env.get("OPENAI_WHISPER_MODEL") ?? "whisper-1";

  const form = new FormData();
  form.append("file", audio, filename);
  form.append("model", model);

  const res = await fetch(`${OPENAI_API_BASE}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OpenAI transcription failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.text ?? "";
}

/** Synthesizes speech from text. Returns raw MP3 bytes. */
export async function synthesizeSpeech(text: string, voice = "alloy"): Promise<Uint8Array> {
  const apiKey = requireOpenAIKey();
  const model = Deno.env.get("OPENAI_TTS_MODEL") ?? "tts-1";

  const res = await fetch(`${OPENAI_API_BASE}/audio/speech`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, voice, input: text }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI text-to-speech failed (${res.status}): ${errText}`);
  }

  return new Uint8Array(await res.arrayBuffer());
}
