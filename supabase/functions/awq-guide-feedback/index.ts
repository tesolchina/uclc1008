import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { stepIndex, studentResponse, fullContext } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const step = STEPS[stepIndex];
    if (!step) {
      throw new Error("Invalid step index");
    }

    const systemPrompt = `You are Dr. AWQ, a friendly academic writing tutor helping students write AWQ summaries.
    
Your role: Give brief, encouraging feedback on student sentences for Step ${stepIndex + 1}: ${step.title} (${step.section}).

STEP PURPOSE: ${step.purpose}
${step.citationNeeded ? `CITATION REQUIRED: ${step.citation}` : 'NO CITATION NEEDED for this step.'}

EVALUATION CRITERIA:
1. Content accuracy - Does it address the purpose?
2. Paraphrasing - Is it in their own words (not copied)?
3. Citation - Is the citation format correct (if required)?
4. Academic tone - Is it formal and objective?
5. Clarity - Is the sentence clear and concise?

RESPONSE FORMAT:
- Start with an emoji (✅ good, ⚠️ needs work, 💡 suggestion)
- Keep feedback to 2-3 sentences
- Be specific about what's good or needs improvement
- If citation is wrong, show the correct format
- End with a brief tip if helpful

IMPORTANT: Be encouraging but honest. Focus on the most important improvement.`;

    const userMessage = `Student's sentence for "${step.title}":
"${studentResponse}"

${fullContext ? `\nContext (previous sentences): ${fullContext}` : ''}

Give brief feedback.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please wait and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI request failed");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("AWQ Guide Feedback error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
