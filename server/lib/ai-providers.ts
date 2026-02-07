import { supabaseAdmin } from "./supabase.js";

const HKBU_PLATFORM_URL = "https://auth.hkbu.tech";
const HKBU_ENDPOINT = "https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-4.1/chat/completions";
const OPENROUTER_ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";

export interface AIProviderConfig {
  name: string;
  endpoint: string;
  headers: Record<string, string>;
  model: string;
}

export interface ResolveOptions {
  accessToken?: string;
  studentId?: string;
  preferredModel?: string;
  requireVision?: boolean;
}

async function getHKBUKeyFromOAuth(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${HKBU_PLATFORM_URL}/api/user/api-keys`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (response.ok) {
      const data = await response.json();
      const keys = data.api_keys || {};
      if (keys.hkbu) return keys.hkbu;
    }
  } catch (err) {
    console.error("Error fetching from HKBU platform:", err);
  }
  return null;
}

async function getHKBUKeyFromStudent(studentId: string): Promise<string | null> {
  try {
    const { data: studentRow } = await supabaseAdmin
      .from("students")
      .select("hkbu_api_key")
      .eq("student_id", studentId)
      .maybeSingle();
    return studentRow?.hkbu_api_key || null;
  } catch (err) {
    console.error("Error fetching student HKBU key:", err);
    return null;
  }
}

async function getHKBUSystemKey(): Promise<string | null> {
  try {
    const { data: storedKeys } = await supabaseAdmin
      .from("api_keys")
      .select("provider, api_key")
      .eq("provider", "hkbu")
      .order("updated_at", { ascending: false })
      .limit(1);
    if (storedKeys && storedKeys.length > 0 && storedKeys[0].api_key) {
      return storedKeys[0].api_key;
    }
  } catch (err) {
    console.error("Error fetching system HKBU key:", err);
  }
  return null;
}

export async function resolveHKBUKey(
  accessToken?: string,
  studentId?: string
): Promise<string | null> {
  if (accessToken) {
    const key = await getHKBUKeyFromOAuth(accessToken);
    if (key) return key;
  }
  if (studentId) {
    const key = await getHKBUKeyFromStudent(studentId);
    if (key) return key;
  }
  return await getHKBUSystemKey();
}

export async function resolveAIProvider(options: ResolveOptions): Promise<{
  provider: AIProviderConfig;
  source: "hkbu" | "openrouter" | "replit";
}> {
  const { accessToken, studentId, preferredModel, requireVision } = options;

  if (!requireVision) {
    const hkbuKey = await resolveHKBUKey(accessToken, studentId);
    if (hkbuKey) {
      return {
        provider: {
          name: "hkbu",
          endpoint: HKBU_ENDPOINT,
          headers: {
            "api-key": hkbuKey,
            "Content-Type": "application/json",
          },
          model: "gpt-4.1",
        },
        source: "hkbu",
      };
    }
  }

  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    return {
      provider: {
        name: "openrouter",
        endpoint: OPENROUTER_ENDPOINT,
        headers: {
          Authorization: `Bearer ${openrouterKey}`,
          "Content-Type": "application/json",
        },
        model: preferredModel || "google/gemini-2.5-flash",
      },
      source: "openrouter",
    };
  }

  throw new Error("No AI provider available. Please configure OPENROUTER_API_KEY.");
}

export function getFallbackProvider(preferredModel?: string): AIProviderConfig {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    return {
      name: "openrouter",
      endpoint: OPENROUTER_ENDPOINT,
      headers: {
        Authorization: `Bearer ${openrouterKey}`,
        "Content-Type": "application/json",
      },
      model: preferredModel || "google/gemini-2.5-flash",
    };
  }

  throw new Error("No AI provider available. Please configure OPENROUTER_API_KEY.");
}

export function getPoeProvider(): { endpoint: string; headers: Record<string, string>; model: string } {
  const poeKey = process.env.POE_API_KEY;
  if (!poeKey) {
    throw new Error("POE_API_KEY is not configured");
  }
  return {
    endpoint: "https://api.poe.com/v1/chat/completions",
    headers: {
      Authorization: `Bearer ${poeKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://uclc1008-1.replit.app",
      "X-Title": "UCLC1008 Staff Tools",
    },
    model: "Claude-Sonnet-4.5",
  };
}
