import { Router, Request, Response } from "express";
import { getFallbackProvider } from "../lib/ai-providers.js";

export const awqWritingGuideRouter = Router();

const WRITING_STEPS = [
  { id: "read", title: "Read & Understand", instruction: "Read both excerpts carefully. Identify the main argument or purpose of each source.", aiPrompt: "The student is reading the excerpts. Help them understand the main points. Ask what they think each article is mainly about. Keep responses concise (2-3 sentences)." },
  { id: "plan", title: "Plan Your Response", instruction: "List 2-3 key points from each source. Think about how they relate (agree, contrast, elaborate).", aiPrompt: "Help the student plan their AWQ response. Guide them to identify key points and relationships between sources. Ask probing questions. Keep responses focused (3-4 sentences max)." },
  { id: "intro", title: "Write Introduction", instruction: "Write an introduction (2-3 sentences) with background context and a thesis previewing both sources.", aiPrompt: "Review the student's introduction. Check for: (1) Background context, (2) Thesis statement previewing both sources. Give specific, actionable feedback. Be encouraging but point out what's missing. Keep feedback to 3-4 sentences." },
  { id: "body", title: "Write Body Paragraph", instruction: "Write the body (4-6 sentences) synthesising both sources. Show relationships, don't just list!", aiPrompt: "Review the student's body paragraph. Check for: (1) Synthesis not listing, (2) Clear relationships between sources, (3) Proper citations (Author, Year). Give specific feedback on how to improve synthesis. Keep to 4-5 sentences." },
  { id: "conclusion", title: "Write Conclusion", instruction: "Write a conclusion (1-2 sentences) with implications or a broader takeaway.", aiPrompt: "Review the student's conclusion. Check if it provides a meaningful takeaway or implication beyond just summarizing. Suggest improvements if needed. Keep feedback to 2-3 sentences." },
  { id: "review", title: "Final Review", instruction: "Review your complete response. Check citations, word count, and synthesis quality.", aiPrompt: "Provide a comprehensive review of the student's complete AWQ response. Score it on the 5 AWQ criteria (Summary Accuracy, Synthesis, Paraphrasing, Academic Tone, Citations) giving brief feedback on each. Then give 2-3 specific suggestions for improvement. Be constructive and encouraging." }
];

const ARTICLE_EXCERPTS = `
ARTICLE A: Hong et al. (2022) - FRT Acceptance Study
Hong, Li, Kuo & An (2022) investigated Chinese parents' acceptance of facial recognition technology (FRT) in elementary schools. Using survey data from 380 parents in Xuzhou, the researchers found that technological innovativeness positively influenced perceived value (\u03B2=0.447), while dangerous beliefs about virtual worlds negatively affected it (\u03B2=-0.320). Parents generally supported FRT for school security despite privacy concerns.

ARTICLE B: Andrejevic & Selwyn (2020) - Critical Perspective
Andrejevic and Selwyn (2020) critically examine FRT deployment in schools. They argue that facial recognition creates "inescapable" surveillance since students cannot opt out - the technology requires capturing everyone to function. Unlike ID cards which can be left behind, faces cannot be removed. The authors warn this normalizes constant monitoring and raise concerns about consent in educational settings.
`;

awqWritingGuideRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { messages, studentId, step, action } = req.body;

    const currentStep = WRITING_STEPS.find(s => s.id === step) || WRITING_STEPS[0];

    const systemPrompt = `You are Dr. Write, an encouraging AWQ (Academic Writing Quiz) tutor helping a student write a 200-word synthesis of two articles about facial recognition technology in schools.

CURRENT STEP: ${currentStep.title}
STEP INSTRUCTION: ${currentStep.instruction}

YOUR ROLE: ${currentStep.aiPrompt}

ARTICLE EXCERPTS:
${ARTICLE_EXCERPTS}

IMPORTANT RULES:
- Keep responses concise and actionable
- Be encouraging but honest about improvements needed
- Use simple language suitable for university freshmen
- Reference specific parts of their writing when giving feedback
- If they ask for help, give hints rather than full answers
- For the final review step, be thorough but constructive`;

    let fallback;
    try {
      fallback = getFallbackProvider("google/gemini-3-flash-preview");
    } catch {
      res.status(503).json({ error: "AI service not configured" });
      return;
    }

    const response = await fetch(fallback.endpoint, {
      method: "POST",
      headers: fallback.headers,
      body: JSON.stringify({
        model: fallback.model,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) { res.status(429).json({ error: "Rate limited. Please wait a moment and try again." }); return; }
      if (response.status === 402) { res.status(402).json({ error: "AI service unavailable. Please try again later." }); return; }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      res.status(500).json({ error: "AI request failed" });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    try { while (true) { const { done, value } = await reader.read(); if (done) break; res.write(decoder.decode(value, { stream: true })); } } catch {}
    res.end();
  } catch (error) {
    console.error("AWQ Writing Guide error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  }
});
