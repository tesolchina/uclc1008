import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Note: This edge function provides an interface for API key management.
// In production, API keys should be managed through the Lovable Cloud secrets.
// This function logs the request but doesn't actually store keys in env vars
// (env vars are read-only at runtime).

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, apiKey } = await req.json();

    if (!provider || !apiKey) {
      return new Response(
        JSON.stringify({ error: "Provider and API key are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validProviders = ["hkbu", "openrouter", "bolatu", "kimi"];
    if (!validProviders.includes(provider)) {
      return new Response(
        JSON.stringify({ error: "Invalid provider" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Map provider to secret name
    const secretNames: Record<string, string> = {
      hkbu: "HKBU_API_KEY",
      openrouter: "OPENROUTER_API_KEY",
      bolatu: "BOLATU_API_KEY",
      kimi: "KIMI_API_KEY",
    };

    const secretName = secretNames[provider];
    
    // Log the configuration request
    // In a real scenario, you'd need to use Supabase Management API or
    // direct the user to configure secrets through Lovable Cloud settings
    console.log(`API key configuration requested for ${secretName}`);
    
    // Return instructions for manual configuration
    return new Response(
      JSON.stringify({
        success: true,
        message: `To configure ${secretName}, please add it through Lovable Cloud secrets.`,
        secretName,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error saving API key:", error);
    return new Response(
      JSON.stringify({ error: "Failed to save API key" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
