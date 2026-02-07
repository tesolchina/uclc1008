import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";

export const revokeApiKeyRouter = Router();

const HKBU_PLATFORM_URL = "https://auth.hkbu.tech";

function toHkbuKeyType(provider: string): string {
  if (provider === "bolatu") return "blt";
  return provider;
}

revokeApiKeyRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { provider, studentId, accessToken } = req.body;

    if (!provider) {
      res.status(400).json({ error: "Provider is required" });
      return;
    }

    const validProviders = ["hkbu", "openrouter", "bolatu", "kimi"];
    if (!validProviders.includes(provider)) {
      res.status(400).json({ error: "Invalid provider" });
      return;
    }

    let revokedFromHkbu = false;
    let hkbuError: string | null = null;

    if (accessToken) {
      const keyType = toHkbuKeyType(provider);
      try {
        let response = await fetch(`${HKBU_PLATFORM_URL}/api/user/api-keys/${keyType}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          response = await fetch(`${HKBU_PLATFORM_URL}/api/user/api-keys`, {
            method: "POST",
            headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
            body: JSON.stringify({ keyType, apiKey: "" }),
          });
        }

        if (response.ok) {
          revokedFromHkbu = true;
        } else {
          const errorText = await response.text();
          hkbuError = `HKBU platform returned ${response.status}: ${errorText}`;
        }
      } catch (err) {
        hkbuError = `Error calling HKBU platform: ${err}`;
      }
    }

    let sharedDeleteError: any = null;
    if (!studentId) {
      const { error } = await supabaseAdmin.from("api_keys").delete().eq("provider", provider);
      sharedDeleteError = error;
    }

    let studentUpdateError: any = null;
    if (studentId && provider === "hkbu") {
      const { error } = await supabaseAdmin
        .from("students")
        .update({ hkbu_api_key: null, updated_at: new Date().toISOString() })
        .eq("student_id", studentId);
      studentUpdateError = error;
    }

    const revokedFromLocal = studentId
      ? (provider === "hkbu" ? !studentUpdateError : true)
      : !sharedDeleteError;

    if (accessToken && !revokedFromHkbu && hkbuError) {
      res.json({
        success: true,
        revokedFromHkbu: false,
        revokedFromLocal,
        warning: "Could not remove key from HKBU platform. The key may still be synced from your HKBU account.",
        hkbuError,
        message: `Local API key revoked for ${provider}, but remote key may still exist`,
      });
      return;
    }

    res.json({ success: true, revokedFromHkbu, revokedFromLocal, message: `API key revoked for ${provider}` });
  } catch (error) {
    console.error("revoke-api-key error:", error);
    res.status(500).json({ error: "Failed to revoke API key" });
  }
});
