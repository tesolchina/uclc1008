import { Router, Request, Response } from "express";
import { getFallbackProvider } from "../lib/ai-providers.js";
import { supabaseAdmin } from "../lib/supabase.js";

export const ocrWritingReviewRouter = Router();

ocrWritingReviewRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { action, imageBase64, extractedText, messages, studentId } = req.body;

    let provider;
    try {
      provider = getFallbackProvider();
    } catch {
      res.status(503).json({ error: "AI service not configured" });
      return;
    }

    const { data: promptSetting } = await supabaseAdmin
      .from("system_settings")
      .select("value")
      .eq("key", "w4h3_feedback_prompt")
      .maybeSingle();

    const teacherPrompt = promptSetting?.value?.prompt ||
      `Evaluate this AWQ summary based on the 5 criteria (Summary Accuracy, Synthesis, Paraphrasing, Academic Tone, Citations - 20% each). 
       Provide specific, actionable feedback. Point out strengths first, then areas for improvement. 
       Keep feedback concise and encouraging but honest.`;

    if (action === "ocr") {
      if (!imageBase64) {
        res.status(400).json({ error: "No image provided for OCR" });
        return;
      }

      const response = await fetch(provider.endpoint, {
        method: "POST",
        headers: provider.headers,
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [{
            role: "user",
            content: [
              { type: "text", text: `Extract all handwritten or printed text from this image. Output ONLY the extracted text, preserving paragraph structure. If the text is hard to read, do your best to interpret it. Do not add any commentary or explanations.` },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
            ]
          }],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) { res.status(429).json({ error: "Rate limited. Please wait and try again." }); return; }
        res.status(500).json({ error: "OCR request failed" });
        return;
      }

      const data = await response.json();
      const extractedContent = data.choices?.[0]?.message?.content || "";
      res.json({ extractedText: extractedContent });
      return;
    }

    if (action === "feedback") {
      if (!extractedText) {
        res.status(400).json({ error: "No text provided for feedback" });
        return;
      }

      const systemPrompt = `You are Dr. Review, an encouraging AWQ feedback tutor.

TEACHER'S INSTRUCTIONS:
${teacherPrompt}

IMPORTANT:
- Be specific about what's good and what needs improvement
- Reference the 5 AWQ criteria when relevant
- Keep feedback concise (aim for 150-200 words)
- End with 2-3 concrete next steps`;

      const response = await fetch(provider.endpoint, {
        method: "POST",
        headers: provider.headers,
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            ...(messages || []),
            { role: "user", content: `Please review this AWQ summary:\n\n${extractedText}` }
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) { res.status(429).json({ error: "Rate limited. Please wait and try again." }); return; }
        res.status(500).json({ error: "Feedback request failed" });
        return;
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      try { while (true) { const { done, value } = await reader.read(); if (done) break; res.write(decoder.decode(value, { stream: true })); } } catch {}
      res.end();
      return;
    }

    if (action === "chat") {
      const systemPrompt = `You are Dr. Review, an encouraging AWQ feedback tutor helping students improve their academic writing.
      
TEACHER'S GUIDANCE:
${teacherPrompt}

Keep responses helpful and focused on AWQ improvement. Be concise (2-4 sentences unless they ask for detail).`;

      const response = await fetch(provider.endpoint, {
        method: "POST",
        headers: provider.headers,
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          stream: true,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) { res.status(429).json({ error: "Rate limited. Please wait and try again." }); return; }
        res.status(500).json({ error: "Chat request failed" });
        return;
      }

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      try { while (true) { const { done, value } = await reader.read(); if (done) break; res.write(decoder.decode(value, { stream: true })); } } catch {}
      res.end();
      return;
    }

    res.status(400).json({ error: "Invalid action" });
  } catch (error) {
    console.error("OCR Writing Review error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  }
});
