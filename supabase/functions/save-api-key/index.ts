import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Azure OpenAI compatible endpoint for HKBU GenAI - use gpt-4.1 deployment
const HKBU_API_URL = "https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-4.1/chat/completions";

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

// Validate HKBU API key using Azure OpenAI compatible API
async function validateHkbuApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // Use Azure OpenAI format with api-key header
    const response = await fetch(HKBU_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 5,
      }),
    });

    if (response.ok) {
      return { valid: true };
    }

    const errorText = await response.text();
    if (response.status === 401 || response.status === 403) {
      return { valid: false, error: "Invalid API key" };
    }
    
    // Rate limit or other errors - key might still be valid
    if (response.status === 429) {
      return { valid: true }; // Rate limited but key works
    }

    return { valid: false, error: `API error: ${response.status} - ${errorText}` };
  } catch (err) {
    return { valid: false, error: `Connection error: ${err}` };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const operation = "save-api-key";

  try {
    const { provider, apiKey, studentId, sessionId } = await req.json();

    await logProcess({
      operation,
      step: "start",
      status: "info",
      message: `Saving API key for ${provider}`,
      details: { provider, hasStudentId: !!studentId },
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

    if (!studentId) {
      await logProcess({
        operation,
        step: "validation-error",
        status: "error",
        message: "Student ID is required to save API key",
        sessionId,
      });
      return new Response(
        JSON.stringify({ error: "Please set your Student ID first in Settings" }),
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

    // Validate the API key first
    if (provider === "hkbu") {
      await logProcess({
        operation,
        step: "validating",
        status: "info",
        message: "Testing HKBU API key...",
        sessionId,
      });

      const validation = await validateHkbuApiKey(apiKey);
      
      if (!validation.valid) {
        await logProcess({
          operation,
          step: "validation-failed",
          status: "error",
          message: `API key validation failed: ${validation.error}`,
          sessionId,
        });
        return new Response(
          JSON.stringify({ 
            success: false, 
            validated: false,
            error: validation.error || "Invalid API key. Please check and try again." 
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      await logProcess({
        operation,
        step: "validation-success",
        status: "success",
        message: "API key validated successfully",
        sessionId,
      });
    }

    // Save to student database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    await logProcess({
      operation,
      step: "saving-to-student",
      status: "info",
      message: `Saving ${provider} key to student record: ${studentId}`,
      sessionId,
    });

    // Upsert student record with API key
    const { error: studentError } = await supabase
      .from("students")
      .upsert(
        { 
          student_id: studentId, 
          hkbu_api_key: provider === "hkbu" ? apiKey : null,
          updated_at: new Date().toISOString() 
        },
        { onConflict: "student_id" }
      );

    if (studentError) {
      await logProcess({
        operation,
        step: "student-save-error",
        status: "error",
        message: `Failed to save to student record: ${studentError.message}`,
        sessionId,
      });
      return new Response(
        JSON.stringify({ error: "Failed to save API key to your profile" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Also save to api_keys table for backwards compatibility
    await supabase
      .from("api_keys")
      .upsert(
        { provider, api_key: apiKey, updated_at: new Date().toISOString() },
        { onConflict: "provider" }
      );

    await logProcess({
      operation,
      step: "complete",
      status: "success",
      message: `API key validated and saved for student ${studentId}`,
      sessionId,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        validated: true,
        message: `API key validated and saved successfully!` 
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
