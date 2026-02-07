import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";

export const checkApiStatusRouter = Router();

const HKBU_PLATFORM_URL = "https://auth.hkbu.tech";

function maskApiKey(key: string | undefined): string | null {
  if (!key || key.length < 8) return key ? "------" : null;
  return `${key.slice(0, 2)}${"*".repeat(Math.min(key.length - 6, 10))}${key.slice(-4)}`;
}

checkApiStatusRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { accessToken, studentId } = req.body || {};

    let hkbuPlatformKeys: Record<string, string> = {};
    if (accessToken) {
      try {
        const r = await fetch(`${HKBU_PLATFORM_URL}/api/user/api-keys`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (r.ok) {
          const data = await r.json();
          const rawKeys = data.api_keys || {};
          for (const [key, value] of Object.entries(rawKeys)) {
            hkbuPlatformKeys[key === "blt" ? "bolatu" : key] = value as string;
          }
        }
      } catch {}
    }

    const [studentResult, localKeysResult] = await Promise.all([
      studentId
        ? supabaseAdmin
            .from("students")
            .select("hkbu_api_key")
            .eq("student_id", studentId)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),

      supabaseAdmin.from("api_keys").select("provider, api_key"),
    ]);

    const studentHkbuKey = studentResult.data?.hkbu_api_key ?? null;
    const localKeyMap = new Map(localKeysResult.data?.map((k: any) => [k.provider, k.api_key]) || []);

    const statuses: any[] = [];

    const hkbuKey = studentHkbuKey || hkbuPlatformKeys.hkbu || localKeyMap.get("hkbu");
    let hkbuSource: string | null = null;
    if (studentHkbuKey) hkbuSource = "student";
    else if (hkbuPlatformKeys.hkbu) hkbuSource = "hkbu_platform";
    else if (localKeyMap.get("hkbu")) hkbuSource = "local";

    statuses.push({ provider: "hkbu", available: !!hkbuKey, name: "HKBU GenAI", source: hkbuSource, maskedKey: maskApiKey(hkbuKey) });

    const openrouterKey = hkbuPlatformKeys.openrouter || localKeyMap.get("openrouter");
    statuses.push({ provider: "openrouter", available: !!openrouterKey, name: "OpenRouter", source: hkbuPlatformKeys.openrouter ? "hkbu_platform" : localKeyMap.get("openrouter") ? "local" : null, maskedKey: maskApiKey(openrouterKey) });

    const bolatuKey = hkbuPlatformKeys.bolatu || localKeyMap.get("bolatu");
    statuses.push({ provider: "bolatu", available: !!bolatuKey, name: "Bolatu (BLT)", source: hkbuPlatformKeys.bolatu ? "hkbu_platform" : localKeyMap.get("bolatu") ? "local" : null, maskedKey: maskApiKey(bolatuKey) });

    const kimiKey = hkbuPlatformKeys.kimi || localKeyMap.get("kimi");
    statuses.push({ provider: "kimi", available: !!kimiKey, name: "Kimi", source: hkbuPlatformKeys.kimi ? "hkbu_platform" : localKeyMap.get("kimi") ? "local" : null, maskedKey: maskApiKey(kimiKey) });

    res.json({ statuses, authenticated: !!accessToken });
  } catch (error) {
    console.error("check-api-status error:", error);
    res.status(500).json({ error: "Failed to check API status" });
  }
});
