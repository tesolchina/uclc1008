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

// Mask API key: show first 2 and last 4 characters
function maskApiKey(key: string | undefined): string | null {
  if (!key || key.length < 8) return key ? "••••••" : null;
  return `${key.slice(0, 2)}${"•".repeat(Math.min(key.length - 6, 10))}${key.slice(-4)}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accessToken, studentId } = await req.json().catch(() => ({}));

    const statuses = [];
    let hkbuPlatformKeys: Record<string, string> = {};

    // Supabase client for local queries
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Run all async operations in parallel for speed
    const [hkbuPlatformResult, studentResult, localKeysResult] = await Promise.all([
      // Fetch keys from HKBU platform (only if authenticated)
      accessToken
        ? fetch(`${HKBU_PLATFORM_URL}/api/user/api-keys`, {
            headers: { "Authorization": `Bearer ${accessToken}` },
          })
            .then(async (res) => {
              if (res.ok) {
                const data = await res.json();
                const rawKeys = data.api_keys || {};
                const normalized: Record<string, string> = {};
                for (const [key, value] of Object.entries(rawKeys)) {
                  normalized[key === "blt" ? "bolatu" : key] = value as string;
                }
                return normalized;
              }
              return {};
            })
            .catch(() => ({}))
        : Promise.resolve({}),
      
      // Read per-student HKBU key
      studentId
        ? supabase
            .from("students")
            .select("hkbu_api_key")
            .eq("student_id", studentId)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      
      // Read local/system keys
      supabase.from("api_keys").select("provider, api_key"),
    ]);

    hkbuPlatformKeys = hkbuPlatformResult;
    const studentHkbuKey = studentResult.data?.hkbu_api_key ?? null;
    const localKeyMap = new Map(localKeysResult.data?.map(k => [k.provider, k.api_key]) || []);

    // Check HKBU GenAI - prioritize: student key > HKBU platform > local
    const hkbuKey = studentHkbuKey || hkbuPlatformKeys.hkbu || localKeyMap.get("hkbu");
    let hkbuSource: string | null = null;
    if (studentHkbuKey) {
      hkbuSource = "student";
    } else if (hkbuPlatformKeys.hkbu) {
      hkbuSource = "hkbu_platform";
    } else if (localKeyMap.get("hkbu")) {
      hkbuSource = "local";
    }
    
    statuses.push({
      provider: "hkbu",
      available: !!hkbuKey,
      name: "HKBU GenAI",
      source: hkbuSource,
      maskedKey: maskApiKey(hkbuKey),
    });

    // Check OpenRouter
    const openrouterKey = hkbuPlatformKeys.openrouter || localKeyMap.get("openrouter");
    statuses.push({
      provider: "openrouter",
      available: !!openrouterKey,
      name: "OpenRouter",
      source: hkbuPlatformKeys.openrouter ? "hkbu_platform" : (localKeyMap.get("openrouter") ? "local" : null),
      maskedKey: maskApiKey(openrouterKey),
    });

    // Check Bolatu
    const bolatuKey = hkbuPlatformKeys.bolatu || localKeyMap.get("bolatu");
    statuses.push({
      provider: "bolatu",
      available: !!bolatuKey,
      name: "Bolatu (BLT)",
      source: hkbuPlatformKeys.bolatu ? "hkbu_platform" : (localKeyMap.get("bolatu") ? "local" : null),
      maskedKey: maskApiKey(bolatuKey),
    });

    // Check Kimi
    const kimiKey = hkbuPlatformKeys.kimi || localKeyMap.get("kimi");
    statuses.push({
      provider: "kimi",
      available: !!kimiKey,
      name: "Kimi",
      source: hkbuPlatformKeys.kimi ? "hkbu_platform" : (localKeyMap.get("kimi") ? "local" : null),
      maskedKey: maskApiKey(kimiKey),
    });

    return new Response(JSON.stringify({ statuses, authenticated: !!accessToken }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("check-api-status error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to check API status" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
