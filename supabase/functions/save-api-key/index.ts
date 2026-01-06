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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upsert the API key in the database
    const { error } = await supabase
      .from("api_keys")
      .upsert(
        { provider, api_key: apiKey, updated_at: new Date().toISOString() },
        { onConflict: "provider" }
      );

    if (error) {
      console.error("Error saving API key:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save API key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`API key saved for provider: ${provider}`);

    return new Response(
      JSON.stringify({ success: true, message: `API key saved for ${provider}` }),
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
