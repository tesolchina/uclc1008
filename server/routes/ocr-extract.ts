import { Router, Request, Response } from "express";
import { getFallbackProvider } from "../lib/ai-providers.js";

export const ocrExtractRouter = Router();

const OCR_SYSTEM_PROMPT = `You are an expert OCR system specialized in handwritten English text extraction.

Your task is to extract ALL text from the handwritten image with near-100% accuracy.

## Instructions:
1. **Preserve Structure**: Maintain paragraph breaks, indentation, and list formatting
2. **Handle Corrections**: 
   - Crossed-out words → mark as ~~strikethrough~~
   - Words written above the line (insertions) → mark with ^caret^ notation
3. **Unclear Text**: If a word is illegible, provide your best guess as [unclear: guess]
4. **Formatting**:
   - Numbered lists → preserve numbering
   - Bullet points → use - or *
   - Underlined text → use **bold**
   - Preserve any visible headings or titles

## Output Format:
- Return ONLY the extracted text in clean markdown format
- Do NOT include any commentary, explanations, or metadata
- Do NOT wrap the output in code blocks
- Start directly with the extracted content`;

const MODELS = [
  "google/gemini-2.5-flash",
  "google/gemini-2.5-pro",
];

async function callOCR(provider: any, imageBase64: string, mimeType: string, model: string) {
  console.log(`Attempting OCR with model: ${model}`);
  const response = await fetch(provider.endpoint, {
    method: "POST",
    headers: provider.headers,
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: OCR_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Extract all handwritten text from this image. Follow the instructions precisely." },
            { type: "image_url", image_url: { url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}` } }
          ]
        }
      ],
      max_tokens: 4096,
      temperature: 0.1,
    }),
  });
  return response;
}

ocrExtractRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      res.status(400).json({ error: "No image provided" });
      return;
    }

    let provider;
    try {
      provider = getFallbackProvider();
    } catch {
      res.status(500).json({ error: "AI service not configured" });
      return;
    }

    let lastError = "";

    for (const model of MODELS) {
      try {
        const response = await callOCR(provider, imageBase64, mimeType, model);

        if (response.ok) {
          const data = await response.json();
          const extractedText = data.choices?.[0]?.message?.content || "";
          if (extractedText) {
            console.log(`OCR extraction complete with ${model}. Text length:`, extractedText.length);
            res.json({ text: extractedText, model });
            return;
          }
        }

        if (response.status === 429) { console.log(`Rate limited on ${model}, trying next...`); lastError = "Rate limit exceeded"; continue; }
        if (response.status === 402) { res.status(402).json({ error: "AI service quota exceeded. Please try again later." }); return; }

        const errorText = await response.text();
        console.error(`Error with ${model}:`, response.status, errorText);
        lastError = `${model} failed: ${response.status}`;
      } catch (modelError) {
        console.error(`Exception with ${model}:`, modelError);
        lastError = modelError instanceof Error ? modelError.message : "Unknown error";
      }
    }

    console.error("All models failed. Last error:", lastError);
    res.status(500).json({ error: `OCR extraction failed. ${lastError}. Please try again.` });
  } catch (error) {
    console.error("OCR extraction error:", error);
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
  }
});
