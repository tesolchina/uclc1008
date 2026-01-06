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
        const rawKeys = data.api_keys || {};
        
        // Normalize key names (blt -> bolatu)
        const keys: Record<string, string> = {};
        for (const [key, value] of Object.entries(rawKeys)) {
          const normalizedKey = key === "blt" ? "bolatu" : key;
          keys[normalizedKey] = value as string;
        }
        
        // Check in priority order: HKBU, OpenRouter, Bolatu, Kimi
        if (keys.hkbu) {
          return { 
            key: keys.hkbu,
            provider: "hkbu", 
            endpoint: "https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-4.1/chat/completions"
          };
        }
        if (keys.openrouter) {
          return { 
            key: keys.openrouter,
            provider: "openrouter", 
            endpoint: "https://openrouter.ai/api/v1/chat/completions"
          };
        }
        if (keys.bolatu) {
          return { 
            key: keys.bolatu,
            provider: "bolatu", 
            endpoint: "https://api.bolatu.com/v1/chat/completions"
          };
        }
        if (keys.kimi) {
          return { 
            key: keys.kimi,
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
      if (row.provider === "bolatu" && row.api_key) {
        return { 
          key: row.api_key, 
          provider: "bolatu",
          endpoint: "https://api.bolatu.com/v1/chat/completions"
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

    // Get user's configured API key
    const userApiConfig = await getUserApiKey(accessToken);
    
    if (!userApiConfig) {
      return new Response(
        JSON.stringify({ error: "No AI service configured. Please configure an API key in API Settings." }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Using user's ${userApiConfig.provider} API key`);
    
    let headers: Record<string, string>;
    let body: any;
    
    if (userApiConfig.provider === "hkbu") {
      // HKBU uses api-key header
      headers = {
        "api-key": userApiConfig.key,
        "Content-Type": "application/json",
      };
      body = {
        messages: [systemMessage, ...messages],
        stream: true,
      };
    } else {
      // OpenRouter, Bolatu, Kimi use Bearer auth
      headers = {
        "Authorization": `Bearer ${userApiConfig.key}`,
        "Content-Type": "application/json",
      };
      
      let model = "gpt-4o-mini"; // default
      if (userApiConfig.provider === "openrouter") {
        model = "openai/gpt-4o-mini";
      } else if (userApiConfig.provider === "bolatu") {
        model = "gpt-4o-mini";
      } else if (userApiConfig.provider === "kimi") {
        model = "moonshot-v1-8k";
      }
      
      body = {
        model,
        messages: [systemMessage, ...messages],
        stream: true,
      };
    }

    const response = await fetch(userApiConfig.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${userApiConfig.provider} API error:`, response.status, errorText);
      
      if (response.status === 401 || response.status === 403) {
        return new Response(
          JSON.stringify({ error: `Invalid or expired ${userApiConfig.provider} API key. Please update your API key in Settings.` }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: `AI service error (${response.status}). Please try again.` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
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
