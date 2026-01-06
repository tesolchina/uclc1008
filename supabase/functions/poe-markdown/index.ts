import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const poeApiKey = Deno.env.get("POE_API_KEY");

if (!poeApiKey) {
  console.error("POE_API_KEY is not configured");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!poeApiKey) {
      return new Response(JSON.stringify({ error: "POE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid 'text' field" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch("https://api.poe.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${poeApiKey}`,
        "Content-Type": "application/json",
        // Recommended headers for Poe external apps
        "HTTP-Referer": "https://uclc1008.lovable.app",
        "X-Title": "UCLC1008 Staff Markdown Helper",
      },
      body: JSON.stringify({
        model: "Claude-Sonnet-4.5",
        messages: [
          {
            role: "system",
            content:
              "You are a careful writing assistant for university English teachers. " +
              "Convert the provided teaching materials into clean, well-structured Markdown suitable for a learning hub. " +
              "Preserve headings, lists, tables, and examples. Do not add extra commentary, just return the Markdown.",
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Poe API error", response.status, errorText);

      const status = response.status;
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Poe API: payment required or quota exceeded." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (status === 429) {
        return new Response(JSON.stringify({ error: "Poe API rate limit reached. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Poe API error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const markdown = data?.choices?.[0]?.message?.content ?? "";

    return new Response(JSON.stringify({ markdown }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("poe-markdown error", error);
    return new Response(JSON.stringify({ error: "Unexpected error in poe-markdown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
