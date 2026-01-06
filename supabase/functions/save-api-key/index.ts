import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// API endpoints for validation
const API_ENDPOINTS: Record<string, { url: string; validateFn: (key: string) => Promise<boolean> }> = {
  hkbu: {
    url: "https://genai.hkbu.edu.hk/api/v0/rest",
    validateFn: async (key: string) => {
      try {
        // Test the API key by fetching models list
        const response = await fetch("https://genai.hkbu.edu.hk/api/v0/rest/models", {
          headers: { "api-key": key },
        });
        return response.ok;
      } catch (error) {
        console.error("HKBU API validation error:", error);
        return false;
      }
    },
  },
  openrouter: {
    url: "https://openrouter.ai/api/v1",
    validateFn: async (key: string) => {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/models", {
          headers: { Authorization: `Bearer ${key}` },
        });
        return response.ok;
      } catch (error) {
        console.error("OpenRouter API validation error:", error);
        return false;
      }
    },
  },
  bolatu: {
    url: "https://api.bolatu.com",
    validateFn: async (key: string) => {
      // For Bolatu, we'll accept the key without validation for now
      // as we don't have their API documentation
      return key.length > 10;
    },
  },
  kimi: {
    url: "https://api.moonshot.cn/v1",
    validateFn: async (key: string) => {
      try {
        const response = await fetch("https://api.moonshot.cn/v1/models", {
          headers: { Authorization: `Bearer ${key}` },
        });
        return response.ok;
      } catch (error) {
        console.error("Kimi API validation error:", error);
        return false;
      }
    },
  },
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

    // Validate the API key with the provider
    const providerConfig = API_ENDPOINTS[provider];
    console.log(`Validating API key for ${provider}...`);
    
    const isValid = await providerConfig.validateFn(apiKey);
    
    if (!isValid) {
      console.log(`API key validation failed for ${provider}`);
      return new Response(
        JSON.stringify({ 
          error: `Invalid API key for ${provider}. Please check your key and try again.`,
          validated: false 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`API key validated successfully for ${provider}`);

    // Save to database
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
        message: `API key validated and saved for ${provider}` 
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
