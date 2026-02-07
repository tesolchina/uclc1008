import { Router, Request, Response } from "express";
import { supabaseAdmin } from "../lib/supabase.js";

export const saveApiKeyRouter = Router();

const HKBU_API_URL = "https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-4.1/chat/completions";

async function validateHkbuApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch(HKBU_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "api-key": apiKey },
      body: JSON.stringify({ messages: [{ role: "user", content: "Hi" }], max_tokens: 5 }),
    });
    if (response.ok) return { valid: true };
    if (response.status === 401 || response.status === 403) return { valid: false, error: "Invalid API key" };
    if (response.status === 429) return { valid: true };
    const errorText = await response.text();
    return { valid: false, error: `API error: ${response.status} - ${errorText}` };
  } catch (err) {
    return { valid: false, error: `Connection error: ${err}` };
  }
}

saveApiKeyRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { provider, apiKey, studentId, testOnly } = req.body;

    if (!provider || !apiKey) {
      res.status(400).json({ error: "Provider and API key are required" });
      return;
    }

    if (!testOnly && !studentId) {
      res.status(400).json({ error: "Please set your Student ID first in Settings" });
      return;
    }

    const validProviders = ["hkbu", "openrouter", "bolatu", "kimi"];
    if (!validProviders.includes(provider)) {
      res.status(400).json({ error: "Invalid provider" });
      return;
    }

    if (provider === "hkbu") {
      const validation = await validateHkbuApiKey(apiKey);
      if (!validation.valid) {
        res.status(400).json({ success: false, validated: false, error: validation.error || "Invalid API key. Please check and try again." });
        return;
      }
    }

    if (testOnly) {
      res.json({ success: true, validated: true, message: "API key is valid!" });
      return;
    }

    if (provider === "hkbu") {
      const { data: existingStudent, error: findErr } = await supabaseAdmin
        .from("students")
        .select("id")
        .eq("student_id", studentId)
        .maybeSingle();

      if (findErr) {
        res.status(500).json({ error: "Failed to save API key to your profile" });
        return;
      }

      if (existingStudent?.id) {
        const { error: updateErr } = await supabaseAdmin
          .from("students")
          .update({ hkbu_api_key: apiKey, updated_at: new Date().toISOString() })
          .eq("id", existingStudent.id);
        if (updateErr) {
          res.status(500).json({ error: "Failed to save API key to your profile" });
          return;
        }
      } else {
        const { error: insertErr } = await supabaseAdmin
          .from("students")
          .insert({ student_id: studentId, hkbu_api_key: apiKey, is_active: true, updated_at: new Date().toISOString() });
        if (insertErr) {
          res.status(500).json({ error: "Failed to save API key to your profile" });
          return;
        }
      }
    }

    res.json({ success: true, validated: true, message: "API key validated and saved successfully!" });
  } catch (error) {
    console.error("save-api-key error:", error);
    res.status(500).json({ error: "Failed to save API key" });
  }
});
