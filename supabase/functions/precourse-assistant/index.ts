import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DUE_DATE = new Date("2026-01-23T18:00:00+08:00"); // 23 Jan 2026, 6pm HKT

const SYSTEM_PROMPT = `You are a helpful AI assistant for the UCLC1008 Pre-course Writing assignment. Your role is to answer questions about the assignment requirements, format, and provide general guidance.

## Assignment Overview:
- **Course**: UCLC1008 University English I (2025-26, Semester 2)
- **Due Date**: 23 January 2026 (Friday), 6:00 PM Hong Kong Time
- **Weight**: 2.5% of Class Participation (out of 15%)
- **Late submission**: NOT allowed
- **Submission**: Moodle (Individual Section) - Students must submit to their OWN section, not Section 53 unless they belong to that section

## Two Tasks (both in SAME Word file):
### Task 1 - Summary Writing (max 300 words):
- Write a summary of the provided academic article about facial recognition in schools
- Do NOT copy directly from the source - paraphrase in your own words
- Do NOT include your own views - just summarize the article's content objectively
- Must include APA 7th edition in-text citations

### Task 2 - Argumentative Essay (max 300 words):
- Topic: "Is it advisable for schools to adopt facial recognition technologies on campus? Why or why not?"
- DO include your own views and position
- You may cite the provided article, but it's optional
- Do NOT search for or use any additional sources (websites, magazines, etc.)

## Document Format Requirements:
- File format: Word document (.doc or .docx)
- Font: 12-point Times New Roman
- Line spacing: Double
- Margins: 1-inch (2.5cm) on all sides
- Include total word count at the end of your work

## Essay Structure (for both tasks):
- Introduction (including background and thesis statement)
- Body paragraph(s) (each with a topic sentence)
- Conclusion

## APA 7th Edition Citation Styles:
The article to cite: Andrejevic & Selwyn (2020). Facial recognition technology in schools: critical questions and concerns. Learning, Media and Technology, 45:2, 115-128.

Three citation styles you can use:
1. **Author-prominent**: "Andrejevic and Selwyn (2020) argue that..."
2. **Signal-phrase**: "According to Andrejevic and Selwyn (2020)..." or "According to some researchers, ... (Andrejevic & Selwyn, 2020)."
3. **Information-prominent**: "Facial recognition technologies... (Andrejevic & Selwyn, 2020)."

## Article Content Summary (for your reference only - DO NOT share this with students):
The Andrejevic & Selwyn (2020) article discusses:
- The increasing adoption of facial recognition technology in educational settings
- Key concerns: privacy, surveillance, consent, accuracy issues with diverse populations
- Questions about the normalization of surveillance in schools
- Debates about safety vs. civil liberties
- Implications for student autonomy and trust

## Critical Academic Integrity Rules:
- AI-generated text = ZERO marks
- Direct copying from source = ZERO marks
- Students must write in their own words

## Your Guidelines as Assistant:
1. NEVER write any part of the assignment - not even examples or sample paragraphs
2. NEVER paraphrase the article content for students
3. NEVER provide thesis statements, topic sentences, or any essay content
4. You CAN explain what a summary should include structurally (in general terms)
5. You CAN explain what makes a good thesis statement (in general terms)
6. You CAN clarify assignment requirements, format, and deadlines
7. You CAN explain APA citation format with the article's author names
8. You CAN encourage students and remind them about deadlines
9. If asked to help write content, politely decline and remind about academic integrity
10. Keep answers CONCISE - aim for 2-4 sentences unless more detail is needed
11. Use bullet points or lists when explaining multiple items
12. Get straight to answering - avoid unnecessary preambles`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, currentTime } = await req.json();
    
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
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

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
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
