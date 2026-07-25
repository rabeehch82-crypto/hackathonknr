import { visionChatCompletion } from "./openai.ts";

/**
 * Extracts text from a medical document image. Prefers Google Cloud Vision
 * (matches the PRD's "Tesseract / Google Vision" OCR requirement and is cheap
 * for pure text extraction); if GOOGLE_VISION_API_KEY isn't set, falls back to
 * GPT vision, which can both read and lightly structure the text in one call.
 */
export async function extractText(imageBase64: string): Promise<string> {
  const visionKey = Deno.env.get("GOOGLE_VISION_API_KEY");

  if (visionKey) {
    const res = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${visionKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content: imageBase64 },
              features: [{ type: "DOCUMENT_TEXT_DETECTION" }],
            },
          ],
        }),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Google Vision OCR failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    const text = data.responses?.[0]?.fullTextAnnotation?.text;
    if (text) return text;
    // fall through to GPT vision if Vision returned no text
  }

  return await visionChatCompletion(
    `data:image/jpeg;base64,${imageBase64}`,
    "Extract all text from this medical document image exactly as written, preserving line breaks. Output only the extracted text, no commentary.",
  );
}
