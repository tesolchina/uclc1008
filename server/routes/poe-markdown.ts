import { Router, Request, Response } from "express";
import { getPoeProvider } from "../lib/ai-providers.js";

export const poeMarkdownRouter = Router();

poeMarkdownRouter.post("/", async (req: Request, res: Response) => {
  try {
    let poe;
    try {
      poe = getPoeProvider();
    } catch {
      res.status(500).json({ error: "POE_API_KEY is not configured" });
      return;
    }

    const { text } = req.body;

    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Missing or invalid 'text' field" });
      return;
    }

    const response = await fetch(poe.endpoint, {
      method: "POST",
      headers: poe.headers,
      body: JSON.stringify({
        model: poe.model,
        messages: [
          {
            role: "system",
            content: "You are a careful writing assistant for university English teachers. Convert the provided teaching materials into clean, well-structured Markdown suitable for a learning hub. Preserve headings, lists, tables, and examples. Do not add extra commentary, just return the Markdown.",
          },
          { role: "user", content: text },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Poe API error", response.status, errorText);
      if (response.status === 402) { res.status(402).json({ error: "Poe API: payment required or quota exceeded." }); return; }
      if (response.status === 429) { res.status(429).json({ error: "Poe API rate limit reached. Please try again later." }); return; }
      res.status(500).json({ error: "Poe API error" });
      return;
    }

    const data = await response.json();
    const markdown = data?.choices?.[0]?.message?.content ?? "";
    res.json({ markdown });
  } catch (error) {
    console.error("poe-markdown error", error);
    res.status(500).json({ error: "Unexpected error in poe-markdown" });
  }
});
