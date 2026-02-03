import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// AWQ Writing Steps
const WRITING_STEPS = [
  {
    id: "read",
    title: "Read & Understand",
    instruction: "Read both excerpts carefully. Identify the main argument or purpose of each source.",
    aiPrompt: "The student is reading the excerpts. Help them understand the main points. Ask what they think each article is mainly about. Keep responses concise (2-3 sentences)."
  },
  {
    id: "plan",
    title: "Plan Your Response",
    instruction: "List 2-3 key points from each source. Think about how they relate (agree, contrast, elaborate).",
    aiPrompt: "Help the student plan their AWQ response. Guide them to identify key points and relationships between sources. Ask probing questions. Keep responses focused (3-4 sentences max)."
  },
  {
    id: "intro",
    title: "Write Introduction",
    instruction: "Write an introduction (2-3 sentences) with background context and a thesis previewing both sources.",
    aiPrompt: "Review the student's introduction. Check for: (1) Background context, (2) Thesis statement previewing both sources. Give specific, actionable feedback. Be encouraging but point out what's missing. Keep feedback to 3-4 sentences."
  },
  {
    id: "body",
    title: "Write Body Paragraph",
    instruction: "Write the body (4-6 sentences) synthesising both sources. Show relationships, don't just list!",
    aiPrompt: "Review the student's body paragraph. Check for: (1) Synthesis not listing, (2) Clear relationships between sources, (3) Proper citations (Author, Year). Give specific feedback on how to improve synthesis. Keep to 4-5 sentences."
  },
  {
    id: "conclusion",
    title: "Write Conclusion",
    instruction: "Write a conclusion (1-2 sentences) with implications or a broader takeaway.",
    aiPrompt: "Review the student's conclusion. Check if it provides a meaningful takeaway or implication beyond just summarizing. Suggest improvements if needed. Keep feedback to 2-3 sentences."
  },
  {
    id: "review",
    title: "Final Review",
    instruction: "Review your complete response. Check citations, word count, and synthesis quality.",
    aiPrompt: "Provide a comprehensive review of the student's complete AWQ response. Score it on the 5 AWQ criteria (Summary Accuracy, Synthesis, Paraphrasing, Academic Tone, Citations) giving brief feedback on each. Then give 2-3 specific suggestions for improvement. Be constructive and encouraging."
  }
];

// Article excerpts for the exercise
const ARTICLE_EXCERPTS = `
ARTICLE A: Hong et al. (2022) - FRT Acceptance Study
Hong, Li, Kuo & An (2022) investigated Chinese parents' acceptance of facial recognition technology (FRT) in elementary schools. Using survey data from 380 parents in Xuzhou, the researchers found that technological innovativeness positively influenced perceived value (β=0.447), while dangerous beliefs about virtual worlds negatively affected it (β=-0.320). Parents generally supported FRT for school security despite privacy concerns.

ARTICLE B: Andrejevic & Selwyn (2020) - Critical Perspective
Andrejevic and Selwyn (2020) critically examine FRT deployment in schools. They argue that facial recognition creates "inescapable" surveillance since students cannot opt out - the technology requires capturing everyone to function. Unlike ID cards which can be left behind, faces cannot be removed. The authors warn this normalizes constant monitoring and raise concerns about consent in educational settings.
`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, studentId, step, action } = await req.json();
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get current step info
    const currentStep = WRITING_STEPS.find(s => s.id === step) || WRITING_STEPS[0];
    
    // Build system prompt based on current step
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

    // Use Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI request failed");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (error) {
    console.error("AWQ Writing Guide error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
