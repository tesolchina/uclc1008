import { Router, Request, Response } from "express";
import { resolveHKBUKey, getFallbackProvider } from "../lib/ai-providers.js";
import { checkSharedApiAccess, incrementUsage, trackTokenUsage } from "../lib/usage-tracker.js";

export const chatRouter = Router();

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type RequestPayload = {
  messages: ChatMessage[];
  accessToken?: string;
  studentId?: string;
  meta?: {
    weekTitle?: string;
    theme?: string;
    aiPromptHint?: string;
  };
};

chatRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { messages, accessToken, studentId, meta }: RequestPayload = req.body;

    const weekTitle = meta?.weekTitle ?? "this week";
    const theme = meta?.theme ?? "University English";
    const aiPromptHint = meta?.aiPromptHint ??
      "You are a supportive academic English tutor helping students build confidence and accuracy.";

    const systemMessage: ChatMessage = {
      role: "system",
      content:
        `You are an AI tutor for the course UCLC 1008 University English I. ` +
        `You are currently supporting ${weekTitle} (theme: ${theme}). ` +
        `${aiPromptHint} ` +
        "Give clear, concise explanations, focus on language development, and avoid writing whole assignments for the student.",
    };

    const hkbuKey = await resolveHKBUKey(accessToken, studentId);

    let apiEndpoint: string;
    let apiHeaders: Record<string, string>;
    let apiBody: any;
    let source: "user" | "shared" = "user";
    let usageInfo: { used: number; limit: number } | null = null;
    let provider: string;

    if (hkbuKey) {
      apiEndpoint = "https://genai.hkbu.edu.hk/api/v0/rest/deployments/gpt-4.1/chat/completions";
      apiHeaders = {
        "api-key": hkbuKey,
        "Content-Type": "application/json",
      };
      apiBody = {
        messages: [systemMessage, ...messages],
        stream: true,
      };
      provider = "hkbu";
    } else {
      const effectiveStudentId = studentId || "anonymous";
      const sharedAccess = await checkSharedApiAccess(effectiveStudentId);

      if (!sharedAccess.allowed) {
        res.status(429).json({
          error: "Daily AI limit reached. Please add your own HKBU API key for unlimited access.",
          limitReached: true,
          used: sharedAccess.used,
          limit: sharedAccess.limit,
        });
        return;
      }

      let fallback;
      try {
        fallback = getFallbackProvider("google/gemini-2.5-flash");
      } catch {
        res.status(503).json({ error: "No AI service available. Please configure an API key in Settings." });
        return;
      }

      apiEndpoint = fallback.endpoint;
      apiHeaders = fallback.headers;
      apiBody = {
        model: fallback.model,
        messages: [systemMessage, ...messages],
        stream: true,
      };
      source = "shared";
      usageInfo = { used: sharedAccess.used, limit: sharedAccess.limit };
      provider = fallback.name;

      await incrementUsage(effectiveStudentId);
    }

    console.log(`Using ${source} API (${provider})`);

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: apiHeaders,
      body: JSON.stringify(apiBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`${provider} API error:`, response.status, errorText);

      if (response.status === 401 || response.status === 403) {
        res.status(401).json({ error: "Invalid API key. Please update your API key in Settings." });
        return;
      }
      if (response.status === 429) {
        res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
        return;
      }

      res.status(500).json({ error: `AI service error (${response.status}). Please try again.` });
      return;
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Api-Source", source);
    if (usageInfo) {
      res.setHeader("X-Usage-Used", String(usageInfo.used + 1));
      res.setHeader("X-Usage-Limit", String(usageInfo.limit));
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    const effectiveStudentId = studentId || "anonymous";

    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    let hasTrackedTokens = false;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        res.write(chunk);

        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && !line.includes("[DONE]")) {
            try {
              const jsonStr = line.slice(6).trim();
              if (jsonStr) {
                const parsed = JSON.parse(jsonStr);
                if (parsed.usage) {
                  totalPromptTokens = parsed.usage.prompt_tokens || 0;
                  totalCompletionTokens = parsed.usage.completion_tokens || 0;
                  hasTrackedTokens = true;
                }
              }
            } catch {}
          }
        }
      }

      if (source === "user" && provider === "hkbu") {
        if (hasTrackedTokens && (totalPromptTokens > 0 || totalCompletionTokens > 0)) {
          await trackTokenUsage(effectiveStudentId, totalPromptTokens, totalCompletionTokens);
          console.log(`Tracked ${totalPromptTokens + totalCompletionTokens} tokens for ${effectiveStudentId}`);
        } else {
          const inputChars = messages.reduce((sum, m) => sum + m.content.length, 0);
          const estimatedPromptTokens = Math.ceil(inputChars / 4);
          await trackTokenUsage(effectiveStudentId, estimatedPromptTokens, 0);
          console.log(`Estimated and tracked ~${estimatedPromptTokens} prompt tokens for ${effectiveStudentId}`);
        }
      }
    } catch (err) {
      console.error("Stream processing error:", err);
    }

    res.end();
  } catch (e) {
    console.error("chat error:", e);
    if (!res.headersSent) {
      res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
    }
  }
});
