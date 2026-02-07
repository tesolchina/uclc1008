import { Router, Request, Response } from "express";
import { getFallbackProvider } from "../lib/ai-providers.js";

export const awqGuideFeedbackRouter = Router();

const STEPS = [
  { section: "INTRODUCTION", title: "Background", purpose: "Introduce FRT and its growing use in schools", citationNeeded: false },
  { section: "INTRODUCTION", title: "Topic Focus", purpose: "State that different views exist on FRT in schools", citationNeeded: false },
  { section: "INTRODUCTION", title: "Thesis Statement", purpose: "Preview both perspectives—(1) parents support FRT despite concerns (A), (2) critics warn about consent/surveillance (B)", citationNeeded: false },
  { section: "BODY PARAGRAPH", title: "Topic Sentence", purpose: "Frame the debate—perceived value vs. consent concerns", citationNeeded: false },
  { section: "BODY PARAGRAPH", title: "Article A — Parents Have Concerns", purpose: "Acknowledge parents are aware of privacy risks", citationNeeded: true, citation: "Hong et al. (2022)" },
  { section: "BODY PARAGRAPH", title: "Article A — BUT Parents Still Support", purpose: "Despite concerns, parents value FRT and support continued use", citationNeeded: true, citation: "(Hong et al., 2022)" },
  { section: "BODY PARAGRAPH", title: "Transition to Article B", purpose: "Introduce critical perspective with contrast transition", citationNeeded: true, citation: "Andrejevic and Selwyn (2020)" },
  { section: "BODY PARAGRAPH", title: "Article B — Facial Data is Inescapable", purpose: "Unlike other data, facial data cannot be controlled", citationNeeded: true, citation: "(Andrejevic & Selwyn, 2020)" },
  { section: "BODY PARAGRAPH", title: "Article B — Opt-out is Meaningless", purpose: "Opting out doesn't work—system scans before recognising opt-out", citationNeeded: true, citation: "(Andrejevic & Selwyn, 2020)" },
  { section: "BODY PARAGRAPH", title: "Article B — Coercion in Schools", purpose: "Schools enforce rules that make surveillance easier", citationNeeded: true, citation: "(Andrejevic & Selwyn, 2020)" },
  { section: "BODY PARAGRAPH", title: "Article B — Consent is Inadequate", purpose: "Informed consent impossible due to system requirements", citationNeeded: true, citation: "(Andrejevic & Selwyn, 2020)" },
  { section: "CONCLUSION", title: "Restate the Contrast", purpose: "Summarise tension—parents see value vs. critics warn about consent", citationNeeded: false },
];

const CHAT_SYSTEM_PROMPT = `You are Dr. AWQ, a friendly and knowledgeable academic writing tutor specializing in AWQ (Academic Writing Quiz) summaries.

CONTEXT: Students are practicing writing a 3-paragraph AWQ summary about Facial Recognition Technology (FRT) in schools, using two articles (Article A and Article B).

AWQ STRUCTURE (12 steps):
INTRODUCTION:
1. Background - Introduce FRT use in schools
2. Topic Focus - Acknowledge different views exist
3. Thesis Statement - Preview both perspectives

BODY PARAGRAPH:
4. Topic Sentence - Frame the debate
5-6. Article A points with citations
7. Transition to Article B
8-11. Article B points with citations

CONCLUSION:
12. Restate the contrast

YOUR ROLE:
- Give clear, encouraging feedback on student writing
- Check for: content accuracy, proper paraphrasing, correct citations, academic tone
- Correct citation formats: "Hong et al. (2022)" or "(Hong et al., 2022)" and "Andrejevic and Selwyn (2020)" or "(Andrejevic & Selwyn, 2020)"
- Keep responses concise (2-4 sentences)
- Be specific about improvements needed`;

awqGuideFeedbackRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { stepIndex, studentResponse, fullContext, mode, userText, messages } = req.body;

    let fallback;
    try {
      fallback = getFallbackProvider("google/gemini-3-flash-preview");
    } catch {
      res.status(503).json({ error: "AI service not configured" });
      return;
    }

    let conversationMessages: Array<{ role: string; content: string }> = [];

    if (mode === "chat") {
      conversationMessages = [{ role: "system", content: CHAT_SYSTEM_PROMPT }];
      if (messages && Array.isArray(messages)) {
        for (const msg of messages) {
          conversationMessages.push({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content
          });
        }
      } else if (userText) {
        conversationMessages.push({ role: "user", content: userText });
      }
    } else {
      const step = STEPS[stepIndex];
      if (!step) {
        res.status(400).json({ error: "Invalid step index" });
        return;
      }

      const systemPrompt = `You are Dr. AWQ, a friendly academic writing tutor helping students write AWQ summaries.
      
Your role: Give brief, encouraging feedback on student sentences for Step ${stepIndex + 1}: ${step.title} (${step.section}).

STEP PURPOSE: ${step.purpose}
${step.citationNeeded ? `CITATION REQUIRED: ${(step as any).citation}` : 'NO CITATION NEEDED for this step.'}

EVALUATION CRITERIA:
1. Content accuracy - Does it address the purpose?
2. Paraphrasing - Is it in their own words (not copied)?
3. Citation - Is the citation format correct (if required)?
4. Academic tone - Is it formal and objective?
5. Clarity - Is the sentence clear and concise?

RESPONSE FORMAT:
- Keep feedback to 2-3 sentences
- Be specific about what's good or needs improvement
- If citation is wrong, show the correct format
- End with a brief tip if helpful

IMPORTANT: Be encouraging but honest. Focus on the most important improvement.`;

      const userMessage = `Student's sentence for "${step.title}":
"${studentResponse}"

${fullContext ? `\nContext (previous sentences): ${fullContext}` : ''}

Give brief feedback.`;

      conversationMessages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ];
    }

    const response = await fetch(fallback.endpoint, {
      method: "POST",
      headers: fallback.headers,
      body: JSON.stringify({
        model: fallback.model,
        messages: conversationMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) { res.status(429).json({ error: "Rate limited. Please wait and try again." }); return; }
      if (response.status === 402) { res.status(402).json({ error: "Payment required. Please add credits." }); return; }
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
    console.error("AWQ Guide Feedback error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
    }
  }
});
