import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HKBU_PLATFORM_URL = "https://auth.hkbu.tech";

// Inline logger
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

  const operation = "save-api-key";

  try {
    const { provider, apiKey, accessToken, sessionId } = await req.json();

    await logProcess({
      operation,
      step: "start",
      status: "info",
      message: `Saving API key for ${provider}`,
      details: { provider, hasAccessToken: !!accessToken },
      sessionId,
    });

    if (!provider || !apiKey) {
      await logProcess({
        operation,
        step: "validation-error",
        status: "error",
        message: "Provider and API key are required",
        sessionId,
      });
      return new Response(
        JSON.stringify({ error: "Provider and API key are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validProviders = ["hkbu", "openrouter", "bolatu", "kimi"];
    if (!validProviders.includes(provider)) {
      await logProcess({
        operation,
        step: "validation-error",
        status: "error",
        message: `Invalid provider: ${provider}`,
        sessionId,
      });
      return new Response(
        JSON.stringify({ error: "Invalid provider" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If we have an access token, save to HKBU platform
    if (accessToken) {
      await logProcess({
        operation,
        step: "save-remote",
        status: "info",
        message: `Saving ${provider} key to HKBU platform...`,
        sessionId,
      });
      
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
          await logProcess({
            operation,
            step: "remote-error",
            status: "error",
            message: `HKBU platform error: ${response.status}`,
            details: { status: response.status, error: errorText },
            sessionId,
          });
          return new Response(
            JSON.stringify({ 
              error: `Failed to save to HKBU platform: ${response.status}`,
              details: errorText 
            }),
            { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        await logProcess({
          operation,
          step: "remote-success",
          status: "success",
          message: `API key saved to HKBU platform for ${provider}`,
          sessionId,
        });

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
        await logProcess({
          operation,
          step: "remote-exception",
          status: "error",
          message: `Failed to connect to HKBU platform: ${err}`,
          sessionId,
        });
        return new Response(
          JSON.stringify({ error: "Failed to connect to HKBU platform" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Fallback: save locally to database if no access token
    await logProcess({
      operation,
      step: "save-local",
      status: "warning",
      message: `No access token provided, saving ${provider} key to local database...`,
      sessionId,
    });
    
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
      await logProcess({
        operation,
        step: "local-error",
        status: "error",
        message: `Failed to save API key locally: ${error.message}`,
        sessionId,
      });
      return new Response(
        JSON.stringify({ error: "Failed to save API key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await logProcess({
      operation,
      step: "local-success",
      status: "success",
      message: `API key saved locally for ${provider}`,
      sessionId,
    });

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
    await logProcess({
      operation,
      step: "exception",
      status: "error",
      message: `Unhandled error: ${error}`,
    });
    return new Response(
      JSON.stringify({ error: "Failed to save API key" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
