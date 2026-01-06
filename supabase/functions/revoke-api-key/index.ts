import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const HKBU_PLATFORM_URL = "https://auth.hkbu.tech";

// Map internal provider names to HKBU platform key types
function toHkbuKeyType(provider: string): string {
  if (provider === "bolatu") return "blt";
  return provider;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, accessToken } = await req.json();

    if (!provider) {
      return new Response(
        JSON.stringify({ error: "Provider is required" }),
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

    let revokedFromHkbu = false;
    let hkbuError = null;

    // If we have an access token, try to revoke from HKBU platform
    if (accessToken) {
      const keyType = toHkbuKeyType(provider);
      console.log(`Revoking API key for ${provider} (keyType: ${keyType}) from HKBU platform...`);
      
      try {
        // Try DELETE method first
        let response = await fetch(`${HKBU_PLATFORM_URL}/api/user/api-keys/${keyType}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          // Fallback: try POST with empty apiKey
          console.log(`DELETE failed (${response.status}), trying POST with empty key...`);
          response = await fetch(`${HKBU_PLATFORM_URL}/api/user/api-keys`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              keyType: keyType,
              apiKey: "",
            }),
          });
        }

        if (response.ok) {
          revokedFromHkbu = true;
          console.log(`API key revoked from HKBU platform for ${provider}`);
        } else {
          const errorText = await response.text();
          hkbuError = `HKBU platform returned ${response.status}: ${errorText}`;
          console.log(`Could not revoke from HKBU platform: ${response.status} - ${errorText}`);
        }
      } catch (err) {
        hkbuError = `Error calling HKBU platform: ${err}`;
        console.error(hkbuError);
      }
    }

    // Also remove from local database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from("api_keys")
      .delete()
      .eq("provider", provider);

    if (error) {
      console.error("Error deleting API key from local database:", error);
    } else {
      console.log(`API key deleted from local database for ${provider}`);
    }

    // If HKBU revoke failed but we have an access token, warn the user
    if (accessToken && !revokedFromHkbu && hkbuError) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          revokedFromHkbu: false,
          revokedFromLocal: !error,
          warning: "Could not remove key from HKBU platform. The key may still be synced from your HKBU account.",
          hkbuError,
          message: `Local API key revoked for ${provider}, but remote key may still exist` 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        revokedFromHkbu,
        revokedFromLocal: !error,
        message: `API key revoked for ${provider}` 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error revoking API key:", error);
    return new Response(
      JSON.stringify({ error: "Failed to revoke API key" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
