import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, imageBase64, extractedText, messages, studentId } = await req.json();
    
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    // Get teacher's custom prompt from system_settings
    const { data: promptSetting } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', 'w4h3_feedback_prompt')
      .maybeSingle();

    const teacherPrompt = promptSetting?.value?.prompt || 
      `Evaluate this AWQ summary based on the 5 criteria (Summary Accuracy, Synthesis, Paraphrasing, Academic Tone, Citations - 20% each). 
       Provide specific, actionable feedback. Point out strengths first, then areas for improvement. 
       Keep feedback concise and encouraging but honest.`;

    // OCR Action: Extract text from image
    if (action === "ocr") {
      if (!imageBase64) {
        throw new Error("No image provided for OCR");
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Extract all handwritten or printed text from this image. 
                         Output ONLY the extracted text, preserving paragraph structure.
                         If the text is hard to read, do your best to interpret it.
                         Do not add any commentary or explanations.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited. Please wait and try again." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error("OCR request failed");
      }

      const data = await response.json();
      const extractedContent = data.choices?.[0]?.message?.content || "";

      return new Response(JSON.stringify({ extractedText: extractedContent }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Feedback Action: Review the edited text
    if (action === "feedback") {
      if (!extractedText) {
        throw new Error("No text provided for feedback");
      }

      const systemPrompt = `You are Dr. Review, an encouraging AWQ feedback tutor.

TEACHER'S INSTRUCTIONS:
${teacherPrompt}

IMPORTANT:
- Be specific about what's good and what needs improvement
- Reference the 5 AWQ criteria when relevant
- Keep feedback concise (aim for 150-200 words)
- End with 2-3 concrete next steps`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
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
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limited. Please wait and try again." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error("Feedback request failed");
      }

      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // Chat Action: Continue conversation
    if (action === "chat") {
      const systemPrompt = `You are Dr. Review, an encouraging AWQ feedback tutor helping students improve their academic writing.
      
TEACHER'S GUIDANCE:
${teacherPrompt}

Keep responses helpful and focused on AWQ improvement. Be concise (2-4 sentences unless they ask for detail).`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
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
          return new Response(JSON.stringify({ error: "Rate limited. Please wait and try again." }), {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error("Chat request failed");
      }

      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    throw new Error("Invalid action");

  } catch (error) {
    console.error("OCR Writing Review error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
