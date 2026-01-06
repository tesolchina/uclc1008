import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HKBU_PLATFORM_URL = "https://auth.hkbu.tech";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type RequestPayload = {
  messages: ChatMessage[];
  accessToken?: string;
  meta?: {
    weekTitle?: string;
    theme?: string;
    aiPromptHint?: string;
  };
};

// Get API key from HKBU platform or local database
async function getUserApiKey(accessToken: string | undefined): Promise<{ key: string; provider: string; endpoint: string } | null> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Priority order: HKBU platform keys, then local database keys
  
  // Try HKBU platform first if we have an access token
  if (accessToken) {
    try {
      const response = await fetch(`${HKBU_PLATFORM_URL}/api/user/api-keys`, {
        headers: { "Authorization": `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        const keys = data.api_keys || {};
        
        // Check in priority order
        if (keys.hkbu) {
          return { 
            key: keys.hkbu.replace(/^hkbu_/, ''), // Remove prefix if present
            provider: "hkbu", 
            endpoint: "https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-4.1/chat/completions"
          };
        }
        if (keys.openrouter) {
          return { 
            key: keys.openrouter.replace(/^openrouter_/, ''),
            provider: "openrouter", 
            endpoint: "https://openrouter.ai/api/v1/chat/completions"
          };
        }
        if (keys.kimi) {
          return { 
            key: keys.kimi.replace(/^kimi_/, ''),
            provider: "kimi", 
            endpoint: "https://api.moonshot.cn/v1/chat/completions"
          };
        }
      }
    } catch (err) {
      console.error("Error fetching from HKBU platform:", err);
    }
  }

  // Fallback to local database
  const { data: storedKeys } = await supabase
    .from("api_keys")
    .select("provider, api_key")
    .order("updated_at", { ascending: false });

  if (storedKeys && storedKeys.length > 0) {
    for (const row of storedKeys) {
      if (row.provider === "hkbu" && row.api_key) {
        return { 
          key: row.api_key, 
          provider: "hkbu",
          endpoint: "https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-4.1/chat/completions"
        };
      }
      if (row.provider === "openrouter" && row.api_key) {
        return { 
          key: row.api_key, 
          provider: "openrouter",
          endpoint: "https://openrouter.ai/api/v1/chat/completions"
        };
      }
      if (row.provider === "kimi" && row.api_key) {
        return { 
          key: row.api_key, 
          provider: "kimi",
          endpoint: "https://api.moonshot.cn/v1/chat/completions"
        };
      }
    }
  }

  return null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, accessToken, meta }: RequestPayload = await req.json();

    const weekTitle = meta?.weekTitle ?? "this week";
    const theme = meta?.theme ?? "University English";
    const aiPromptHint = meta?.aiPromptHint ??
      "You are a supportive academic English tutor helping students build confidence and accuracy.";

    const systemMessage: ChatMessage = {
      role: "system",
      content:
        `You are an AI tutor for the course UCLC 1008 University English I. ` +
        `You are currently supporting ${weekTitle} (theme: ${theme}). ` +
        `${aiPromptHint} ` +
        "Give clear, concise explanations, focus on language development, and avoid writing whole assignments for the student.",
    };

    // Try to get user's configured API key first
    const userApiConfig = await getUserApiKey(accessToken);
    
    if (userApiConfig) {
      console.log(`Using user's ${userApiConfig.provider} API key`);
      
      let headers: Record<string, string>;
      let body: any;
      
      if (userApiConfig.provider === "hkbu") {
        headers = {
          "api-key": userApiConfig.key,
          "Content-Type": "application/json",
        };
        body = {
          messages: [systemMessage, ...messages],
          stream: true,
        };
      } else {
        // OpenRouter, Kimi use Bearer auth
        headers = {
          "Authorization": `Bearer ${userApiConfig.key}`,
          "Content-Type": "application/json",
        };
        body = {
          model: userApiConfig.provider === "openrouter" ? "openai/gpt-4o-mini" : "moonshot-v1-8k",
          messages: [systemMessage, ...messages],
          stream: true,
        };
      }

      const response = await fetch(userApiConfig.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      if (response.ok) {
        return new Response(response.body, {
          headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
        });
      } else {
        console.error(`${userApiConfig.provider} API error:`, response.status);
        // Fall through to Lovable AI
      }
    }

    // Fallback to Lovable AI
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "No AI service configured. Please configure an API key in Settings." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Using Lovable AI as fallback");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [systemMessage, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
