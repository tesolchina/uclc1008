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
    const { provider, apiKey, accessToken } = await req.json();

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

    // If we have an access token, save to HKBU platform
    if (accessToken) {
      console.log(`Saving API key for ${provider} to HKBU platform...`);
      
      try {
        const response = await fetch(`${HKBU_PLATFORM_URL}/api/user/api-keys`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keyType: provider,
            apiKey: apiKey,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`HKBU platform error: ${response.status}`, errorText);
          return new Response(
            JSON.stringify({ 
              error: `Failed to save to HKBU platform: ${response.status}`,
              details: errorText 
            }),
            { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const result = await response.json();
        console.log(`API key saved to HKBU platform for ${provider}`);

        return new Response(
          JSON.stringify({ 
            success: true, 
            validated: true,
            savedToHkbu: true,
            message: `API key saved to HKBU platform for ${provider}` 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      } catch (err) {
        console.error("Error calling HKBU platform:", err);
        return new Response(
          JSON.stringify({ error: "Failed to connect to HKBU platform" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Fallback: save locally to database if no access token
    console.log(`No access token provided, saving ${provider} key to local database...`);
    
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

    return new Response(
      JSON.stringify({ 
        success: true, 
        validated: true,
        savedToHkbu: false,
        message: `API key saved locally for ${provider}` 
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
