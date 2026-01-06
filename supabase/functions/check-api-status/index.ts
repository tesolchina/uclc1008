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
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch all stored API keys from database
    const { data: storedKeys, error } = await supabase
      .from("api_keys")
      .select("provider, api_key");

    if (error) {
      console.error("Error fetching API keys:", error);
    }

    const keyMap = new Map(storedKeys?.map(k => [k.provider, k.api_key]) || []);

    const statuses = [];

    // Check Lovable AI (from env)
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    statuses.push({
      provider: "lovable",
      available: !!lovableKey,
      name: "Lovable AI",
    });

    // Check HKBU GenAI (from database or env)
    const hkbuKey = keyMap.get("hkbu") || Deno.env.get("HKBU_API_KEY");
    statuses.push({
      provider: "hkbu",
      available: !!hkbuKey,
      name: "HKBU GenAI",
    });

    // Check OpenRouter
    const openrouterKey = keyMap.get("openrouter") || Deno.env.get("OPENROUTER_API_KEY");
    statuses.push({
      provider: "openrouter",
      available: !!openrouterKey,
      name: "OpenRouter",
    });

    // Check Bolatu
    const bolatuKey = keyMap.get("bolatu") || Deno.env.get("BOLATU_API_KEY");
    statuses.push({
      provider: "bolatu",
      available: !!bolatuKey,
      name: "Bolatu (BLT)",
    });

    // Check Kimi
    const kimiKey = keyMap.get("kimi") || Deno.env.get("KIMI_API_KEY");
    statuses.push({
      provider: "kimi",
      available: !!kimiKey,
      name: "Kimi",
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
