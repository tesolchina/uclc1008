import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DUE_DATE = new Date("2026-01-23T18:00:00+08:00"); // 23 Jan 2026, 6pm HKT

const SYSTEM_PROMPT = `You are a helpful AI assistant for the UCLC1008 Pre-course Writing assignment. Your role is to answer questions about the assignment requirements, format, and provide general guidance.

## Assignment Overview:
- **Due Date**: 23 January 2026 (Friday), 6:00 PM Hong Kong Time
- **Weight**: 2.5% of Class Participation (out of 15%)
- **Late submission**: NOT allowed
- **Submission**: Moodle (Individual Section)

## Two Tasks:
1. **Task 1 - Summary Writing**: Write a summary of no more than 300 words on the provided academic article about facial recognition in schools
2. **Task 2 - Argumentative Essay**: Write an essay of no more than 300 words on: "Is it advisable for schools to adopt facial recognition technologies on campus? Why or why not?"

## Key Requirements:
- Both tasks in the SAME Word file (.doc or .docx)
- 12-point Times New Roman font
- Double line spacing
- 1-inch (2.5cm) margins
- Include word count at the end
- Use APA 7th edition in-text citations

## Critical Rules:
- Task 1: Do NOT copy directly from the source - paraphrase in your own words
- Task 1: Do NOT include your own views in the summary
- Task 2: Include your own views and knowledge
- Task 2: Do NOT search for additional sources outside the provided article
- AI-generated text or direct copying = ZERO marks

## Article Source:
Andrejevic & Selwyn (2020). Facial recognition technology in schools: critical questions and concerns. Learning, Media and Technology, 45:2, 115-128.

## Your Guidelines as Assistant:
1. NEVER write any part of the assignment for students - not even examples or sample paragraphs
2. NEVER paraphrase the article content for them
3. NEVER provide thesis statements, topic sentences, or any essay content
4. You CAN explain what a summary should include structurally
5. You CAN explain what makes a good thesis statement in general terms
6. You CAN clarify assignment requirements and format
7. You CAN encourage students and remind them about deadlines
8. You CAN explain APA citation format with the article's author names
9. If asked to help write, politely decline and remind them about academic integrity
10. Always be encouraging but firm about not doing their work for them
11. Keep your answers CONCISE and to the point - aim for 2-4 short sentences unless more detail is genuinely needed
12. Use bullet points or numbered lists when explaining multiple items
13. Avoid unnecessary preambles - get straight to answering the question`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, currentTime } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate days remaining
    const now = currentTime ? new Date(currentTime) : new Date();
    const timeDiff = DUE_DATE.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const hoursRemaining = Math.ceil(timeDiff / (1000 * 60 * 60));
    
    let timeContext = "";
    if (daysRemaining > 1) {
      timeContext = `\n\nCurrent time context: There are ${daysRemaining} days left until the deadline (23 Jan 2026, 6pm). `;
    } else if (daysRemaining === 1) {
      timeContext = `\n\nCurrent time context: The deadline is TOMORROW (23 Jan 2026, 6pm)! `;
    } else if (hoursRemaining > 0) {
      timeContext = `\n\nCurrent time context: URGENT - Only ${hoursRemaining} hours left until the deadline! `;
    } else {
      timeContext = `\n\nCurrent time context: The deadline has passed. No late submissions are accepted. `;
    }

    const enhancedSystemPrompt = SYSTEM_PROMPT + timeContext;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: enhancedSystemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("precourse-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
