import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HKBU_PLATFORM_URL = "https://auth.hkbu.tech";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accessToken } = await req.json().catch(() => ({}));
    
    const statuses = [];
    let hkbuPlatformKeys: Record<string, string> = {};

    // If we have an access token, fetch keys from HKBU platform
    if (accessToken) {
      try {
        console.log("Fetching API keys from HKBU platform...");
        const response = await fetch(`${HKBU_PLATFORM_URL}/api/user/api-keys`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          hkbuPlatformKeys = data.api_keys || {};
          console.log("HKBU platform keys found:", Object.keys(hkbuPlatformKeys));
        } else {
          console.log("Could not fetch from HKBU platform:", response.status);
        }
      } catch (err) {
        console.error("Error fetching from HKBU platform:", err);
      }
    }

    // Also check local database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data: storedKeys, error } = await supabase
      .from("api_keys")
      .select("provider, api_key");

    if (error) {
      console.error("Error fetching local API keys:", error);
    }

    const localKeyMap = new Map(storedKeys?.map(k => [k.provider, k.api_key]) || []);

    // Check Lovable AI (from env)
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    statuses.push({
      provider: "lovable",
      available: !!lovableKey,
      name: "Lovable AI",
      source: lovableKey ? "env" : null,
    });

    // Check HKBU GenAI
    const hkbuKey = hkbuPlatformKeys.hkbu || localKeyMap.get("hkbu") || Deno.env.get("HKBU_API_KEY");
    statuses.push({
      provider: "hkbu",
      available: !!hkbuKey,
      name: "HKBU GenAI",
      source: hkbuPlatformKeys.hkbu ? "hkbu_platform" : (localKeyMap.get("hkbu") ? "local" : (Deno.env.get("HKBU_API_KEY") ? "env" : null)),
    });

    // Check OpenRouter
    const openrouterKey = hkbuPlatformKeys.openrouter || localKeyMap.get("openrouter") || Deno.env.get("OPENROUTER_API_KEY");
    statuses.push({
      provider: "openrouter",
      available: !!openrouterKey,
      name: "OpenRouter",
      source: hkbuPlatformKeys.openrouter ? "hkbu_platform" : (localKeyMap.get("openrouter") ? "local" : null),
    });

    // Check Bolatu
    const bolatuKey = hkbuPlatformKeys.bolatu || localKeyMap.get("bolatu") || Deno.env.get("BOLATU_API_KEY");
    statuses.push({
      provider: "bolatu",
      available: !!bolatuKey,
      name: "Bolatu (BLT)",
      source: hkbuPlatformKeys.bolatu ? "hkbu_platform" : (localKeyMap.get("bolatu") ? "local" : null),
    });

    // Check Kimi
    const kimiKey = hkbuPlatformKeys.kimi || localKeyMap.get("kimi") || Deno.env.get("KIMI_API_KEY");
    statuses.push({
      provider: "kimi",
      available: !!kimiKey,
      name: "Kimi",
      source: hkbuPlatformKeys.kimi ? "hkbu_platform" : (localKeyMap.get("kimi") ? "local" : null),
    });

    return new Response(JSON.stringify({ statuses }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error checking API status:", error);
    return new Response(
      JSON.stringify({ error: "Failed to check API status" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
