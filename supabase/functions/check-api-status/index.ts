import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HKBU_PLATFORM_URL = "https://auth.hkbu.tech";

// Inline logger to avoid import issues
async function logProcess(entry: {
  operation: string;
  step: string;
  status: "info" | "success" | "warning" | "error";
  message: string;
  details?: Record<string, unknown>;
  sessionId?: string;
}) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseServiceKey) return;

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  try {
    await supabase.from("process_logs").insert({
      operation: entry.operation,
      step: entry.step,
      status: entry.status,
      message: entry.message,
      details: entry.details || {},
      session_id: entry.sessionId || null,
    });
  } catch (err) {
    console.error("Failed to write process log:", err);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const operation = "check-api-status";

  try {
    const { accessToken, sessionId } = await req.json().catch(() => ({}));
    
    await logProcess({
      operation,
      step: "start",
      status: "info",
      message: `Checking API status (authenticated: ${!!accessToken})`,
      sessionId,
    });

    const statuses = [];

    // If not authenticated, show all services as unavailable (except checking env vars)
    if (!accessToken) {
      await logProcess({
        operation,
        step: "no-auth",
        status: "warning",
        message: "No access token provided - showing limited status",
        sessionId,
      });
      
      // Only check env vars for Lovable AI (system-level)
      const lovableKey = Deno.env.get("LOVABLE_API_KEY");
      statuses.push({
        provider: "lovable",
        available: !!lovableKey,
        name: "Lovable AI",
        source: lovableKey ? "env" : null,
      });

      // All user-configured providers show as unavailable without auth
      statuses.push({ provider: "hkbu", available: false, name: "HKBU GenAI", source: null });
      statuses.push({ provider: "openrouter", available: false, name: "OpenRouter", source: null });
      statuses.push({ provider: "bolatu", available: false, name: "Bolatu (BLT)", source: null });
      statuses.push({ provider: "kimi", available: false, name: "Kimi", source: null });

      return new Response(JSON.stringify({ statuses, authenticated: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let hkbuPlatformKeys: Record<string, string> = {};

    // Fetch keys from HKBU platform
    try {
      await logProcess({
        operation,
        step: "fetch-remote",
        status: "info",
        message: "Fetching API keys from HKBU platform...",
        sessionId,
      });

      const response = await fetch(`${HKBU_PLATFORM_URL}/api/user/api-keys`, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const rawKeys = data.api_keys || {};
        // Normalize key names (blt -> bolatu)
        hkbuPlatformKeys = {};
        for (const [key, value] of Object.entries(rawKeys)) {
          const normalizedKey = key === "blt" ? "bolatu" : key;
          hkbuPlatformKeys[normalizedKey] = value as string;
        }
        const foundKeys = Object.keys(hkbuPlatformKeys);
        
        await logProcess({
          operation,
          step: "remote-success",
          status: "success",
          message: `HKBU platform returned ${foundKeys.length} keys`,
          details: { keys: foundKeys },
          sessionId,
        });
      } else {
        await logProcess({
          operation,
          step: "remote-error",
          status: "error",
          message: `HKBU platform error: ${response.status}`,
          details: { status: response.status },
          sessionId,
        });
      }
    } catch (err) {
      await logProcess({
        operation,
        step: "remote-exception",
        status: "error",
        message: `Error fetching from HKBU platform: ${err}`,
        sessionId,
      });
    }

    // Also check local database as fallback
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await logProcess({
      operation,
      step: "fetch-local",
      status: "info",
      message: "Checking local database for API keys...",
      sessionId,
    });

    const { data: storedKeys, error } = await supabase
      .from("api_keys")
      .select("provider, api_key");

    if (error) {
      await logProcess({
        operation,
        step: "local-error",
        status: "error",
        message: `Local database error: ${error.message}`,
        sessionId,
      });
    } else {
      await logProcess({
        operation,
        step: "local-success",
        status: "info",
        message: `Local database returned ${storedKeys?.length || 0} keys`,
        details: { providers: storedKeys?.map(k => k.provider) || [] },
        sessionId,
      });
    }

    const localKeyMap = new Map(storedKeys?.map(k => [k.provider, k.api_key]) || []);

    // Check Lovable AI (from env - always available)
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    statuses.push({
      provider: "lovable",
      available: !!lovableKey,
      name: "Lovable AI",
      source: lovableKey ? "env" : null,
    });

    // Check HKBU GenAI
    const hkbuKey = hkbuPlatformKeys.hkbu || localKeyMap.get("hkbu");
    statuses.push({
      provider: "hkbu",
      available: !!hkbuKey,
      name: "HKBU GenAI",
      source: hkbuPlatformKeys.hkbu ? "hkbu_platform" : (localKeyMap.get("hkbu") ? "local" : null),
    });

    // Check OpenRouter
    const openrouterKey = hkbuPlatformKeys.openrouter || localKeyMap.get("openrouter");
    statuses.push({
      provider: "openrouter",
      available: !!openrouterKey,
      name: "OpenRouter",
      source: hkbuPlatformKeys.openrouter ? "hkbu_platform" : (localKeyMap.get("openrouter") ? "local" : null),
    });

    // Check Bolatu
    const bolatuKey = hkbuPlatformKeys.bolatu || localKeyMap.get("bolatu");
    statuses.push({
      provider: "bolatu",
      available: !!bolatuKey,
      name: "Bolatu (BLT)",
      source: hkbuPlatformKeys.bolatu ? "hkbu_platform" : (localKeyMap.get("bolatu") ? "local" : null),
    });

    // Check Kimi
    const kimiKey = hkbuPlatformKeys.kimi || localKeyMap.get("kimi");
    statuses.push({
      provider: "kimi",
      available: !!kimiKey,
      name: "Kimi",
      source: hkbuPlatformKeys.kimi ? "hkbu_platform" : (localKeyMap.get("kimi") ? "local" : null),
    });

    const availableCount = statuses.filter(s => s.available).length;
    await logProcess({
      operation,
      step: "complete",
      status: "success",
      message: `Status check complete: ${availableCount}/${statuses.length} providers available`,
      details: { statuses: statuses.map(s => ({ provider: s.provider, available: s.available, source: s.source })) },
      sessionId,
    });

    return new Response(JSON.stringify({ statuses, authenticated: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    await logProcess({
      operation,
      step: "exception",
      status: "error",
      message: `Unhandled error: ${error}`,
    });

    return new Response(
      JSON.stringify({ error: "Failed to check API status" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
