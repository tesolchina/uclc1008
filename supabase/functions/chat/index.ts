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
  studentId?: string;
  meta?: {
    weekTitle?: string;
    theme?: string;
    aiPromptHint?: string;
  };
};

// Get API key from HKBU platform or local database
async function getUserApiKey(accessToken: string | undefined, supabase: any): Promise<{ key: string; provider: string; endpoint: string } | null> {
  // Try HKBU platform first if we have an access token
  if (accessToken) {
    try {
      const response = await fetch(`${HKBU_PLATFORM_URL}/api/user/api-keys`, {
        headers: { "Authorization": `Bearer ${accessToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        const keys = data.api_keys || {};
        
        if (keys.hkbu) {
          return { 
            key: keys.hkbu,
            provider: "hkbu", 
            endpoint: "https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-4.1/chat/completions"
          };
        }
      }
    } catch (err) {
      console.error("Error fetching from HKBU platform:", err);
    }
  }

  // Fallback to local database - only HKBU keys
  const { data: storedKeys } = await supabase
    .from("api_keys")
    .select("provider, api_key")
    .eq("provider", "hkbu")
    .order("updated_at", { ascending: false })
    .limit(1);

  if (storedKeys && storedKeys.length > 0 && storedKeys[0].api_key) {
    return { 
      key: storedKeys[0].api_key, 
      provider: "hkbu",
      endpoint: "https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-4.1/chat/completions"
    };
  }

  return null;
}

// Check if student can use shared API
async function checkSharedApiAccess(studentId: string, supabase: any): Promise<{ allowed: boolean; used: number; limit: number }> {
  // Get settings
  const { data: settings } = await supabase
    .from("system_settings")
    .select("key, value");

  let enabled = true;
  let limit = 50;

  if (settings) {
    for (const s of settings) {
      if (s.key === "shared_api_enabled") enabled = s.value?.enabled ?? true;
      if (s.key === "shared_api_daily_limit") limit = s.value?.limit ?? 50;
    }
  }

  if (!enabled) {
    return { allowed: false, used: 0, limit };
  }

  // Check usage
  const today = new Date().toISOString().split("T")[0];
  const { data: usage } = await supabase
    .from("student_api_usage")
    .select("request_count")
    .eq("student_id", studentId)
    .eq("usage_date", today)
    .maybeSingle();

  const used = usage?.request_count ?? 0;
  return { allowed: used < limit, used, limit };
}

// Increment student usage
async function incrementUsage(studentId: string, supabase: any): Promise<void> {
  const today = new Date().toISOString().split("T")[0];
  
  // Upsert usage record
  const { data: existing } = await supabase
    .from("student_api_usage")
    .select("id, request_count")
    .eq("student_id", studentId)
    .eq("usage_date", today)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("student_api_usage")
      .update({ request_count: existing.request_count + 1 })
      .eq("id", existing.id);
  } else {
    await supabase
      .from("student_api_usage")
      .insert({ student_id: studentId, usage_date: today, request_count: 1 });
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const { messages, accessToken, studentId, meta }: RequestPayload = await req.json();

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

    // Get user's configured API key (HKBU only now)
    const userApiConfig = await getUserApiKey(accessToken, supabase);
    
    let apiConfig = userApiConfig;
    let source: "user" | "shared" = "user";
    let usageInfo: { used: number; limit: number } | null = null;

    // If no user key, try shared Lovable AI
    if (!apiConfig) {
      const effectiveStudentId = studentId || "anonymous";
      const sharedAccess = await checkSharedApiAccess(effectiveStudentId, supabase);
      
      if (!sharedAccess.allowed) {
        return new Response(
          JSON.stringify({ 
            error: "Daily AI limit reached. Please add your own HKBU API key for unlimited access.",
            limitReached: true,
            used: sharedAccess.used,
            limit: sharedAccess.limit,
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Use Lovable AI as fallback (no API key required)
      const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
      if (!lovableApiKey) {
        return new Response(
          JSON.stringify({ error: "No AI service available. Please configure an API key in Settings." }),
          { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // Use Lovable AI endpoint (correct URL)
      apiConfig = {
        key: lovableApiKey,
        provider: "lovable",
        endpoint: "https://ai.gateway.lovable.dev/v1/chat/completions",
      };
      source = "shared";
      usageInfo = { used: sharedAccess.used, limit: sharedAccess.limit };

      // Increment usage
      await incrementUsage(effectiveStudentId, supabase);
    }

    console.log(`Using ${source} API (${apiConfig.provider})`);
    
    let headers: Record<string, string>;
    let body: any;
    
    if (apiConfig.provider === "hkbu") {
      headers = {
        "api-key": apiConfig.key,
        "Content-Type": "application/json",
      };
      body = {
        messages: [systemMessage, ...messages],
        stream: true,
      };
    } else {
      // Lovable AI (for shared API - uses OpenAI-compatible format)
      headers = {
        "Authorization": `Bearer ${apiConfig.key}`,
        "Content-Type": "application/json",
      };
      body = {
        model: "google/gemini-2.5-flash",  // Fast and cost-effective for chat
        messages: [systemMessage, ...messages],
        stream: true,
      };
    }

    const response = await fetch(apiConfig.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${apiConfig.provider} API error:`, response.status, errorText);
      
      if (response.status === 401 || response.status === 403) {
        return new Response(
          JSON.stringify({ error: `Invalid API key. Please update your API key in Settings.` }),
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

    // Add source info to response headers
    const responseHeaders: Record<string, string> = {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "X-Api-Source": source,
    };
    
    if (usageInfo) {
      responseHeaders["X-Usage-Used"] = String(usageInfo.used + 1);
      responseHeaders["X-Usage-Limit"] = String(usageInfo.limit);
    }

    return new Response(response.body, { headers: responseHeaders });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
