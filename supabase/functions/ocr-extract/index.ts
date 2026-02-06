import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

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
  "google/gemini-2.5-flash",  // Fast and reliable
  "google/gemini-2.5-pro",    // Higher accuracy fallback
];

async function callOCR(apiKey: string, imageBase64: string, mimeType: string, model: string) {
  console.log(`Attempting OCR with model: ${model}`);
  
  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: OCR_SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Extract all handwritten text from this image. Follow the instructions precisely."
            },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType || 'image/jpeg'};base64,${imageBase64}`
              }
            }
          ]
        }
      ],
      max_tokens: 4096,
      temperature: 0.1,
    }),
  });

  return response;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let lastError = "";
    let usedModel = "";

    // Try each model in order until one succeeds
    for (const model of MODELS) {
      try {
        const response = await callOCR(LOVABLE_API_KEY, imageBase64, mimeType, model);

        if (response.ok) {
          const data = await response.json();
          const extractedText = data.choices?.[0]?.message?.content || "";
          
          if (extractedText) {
            console.log(`OCR extraction complete with ${model}. Text length:`, extractedText.length);
            usedModel = model;
            
            return new Response(
              JSON.stringify({ 
                text: extractedText,
                model: usedModel
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
        }

        // Handle specific error codes
        if (response.status === 429) {
          console.log(`Rate limited on ${model}, trying next...`);
          lastError = "Rate limit exceeded";
          continue;
        }
        
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: "AI service quota exceeded. Please try again later." }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        const errorText = await response.text();
        console.error(`Error with ${model}:`, response.status, errorText);
        lastError = `${model} failed: ${response.status}`;
        
      } catch (modelError) {
        console.error(`Exception with ${model}:`, modelError);
        lastError = modelError instanceof Error ? modelError.message : "Unknown error";
      }
    }

    // All models failed
    console.error("All models failed. Last error:", lastError);
    return new Response(
      JSON.stringify({ error: `OCR extraction failed. ${lastError}. Please try again.` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("OCR extraction error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
