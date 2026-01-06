import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const statuses = [];

    // Check Lovable AI (always available in Cloud projects)
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    statuses.push({
      provider: "lovable",
      available: !!lovableKey,
      name: "Lovable AI",
    });

    // Check HKBU GenAI
    const hkbuKey = Deno.env.get("HKBU_API_KEY");
    statuses.push({
      provider: "hkbu",
      available: !!hkbuKey,
      name: "HKBU GenAI",
    });

    // Check OpenRouter
    const openrouterKey = Deno.env.get("OPENROUTER_API_KEY");
    statuses.push({
      provider: "openrouter",
      available: !!openrouterKey,
      name: "OpenRouter",
    });

    // Check Bolatu
    const bolatuKey = Deno.env.get("BOLATU_API_KEY");
    statuses.push({
      provider: "bolatu",
      available: !!bolatuKey,
      name: "Bolatu (BLT)",
    });

    // Check Kimi
    const kimiKey = Deno.env.get("KIMI_API_KEY");
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
