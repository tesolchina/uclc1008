import express from "express";
import { corsMiddleware } from "./middleware/cors.js";
import { chatRouter } from "./routes/chat.js";
import { smartTutorRouter } from "./routes/smart-tutor.js";
import { precourseAssistantRouter } from "./routes/precourse-assistant.js";
import { ocrExtractRouter } from "./routes/ocr-extract.js";
import { ocrWritingReviewRouter } from "./routes/ocr-writing-review.js";
import { awqWritingGuideRouter } from "./routes/awq-writing-guide.js";
import { awqGuideFeedbackRouter } from "./routes/awq-guide-feedback.js";
import { poeMarkdownRouter } from "./routes/poe-markdown.js";
import { staffAgentRouter } from "./routes/staff-agent.js";
import { checkApiStatusRouter } from "./routes/check-api-status.js";
import { saveApiKeyRouter } from "./routes/save-api-key.js";
import { revokeApiKeyRouter } from "./routes/revoke-api-key.js";

const app = express();
const PORT = 5000;

app.use(corsMiddleware);
app.use(express.json({ limit: "50mb" }));

app.use("/api/chat", chatRouter);
app.use("/api/smart-tutor", smartTutorRouter);
app.use("/api/precourse-assistant", precourseAssistantRouter);
app.use("/api/ocr-extract", ocrExtractRouter);
app.use("/api/ocr-writing-review", ocrWritingReviewRouter);
app.use("/api/awq-writing-guide", awqWritingGuideRouter);
app.use("/api/awq-guide-feedback", awqGuideFeedbackRouter);
app.use("/api/poe-markdown", poeMarkdownRouter);
app.use("/api/staff-agent", staffAgentRouter);
app.use("/api/check-api-status", checkApiStatusRouter);
app.use("/api/save-api-key", saveApiKeyRouter);
app.use("/api/revoke-api-key", revokeApiKeyRouter);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const isDev = process.env.NODE_ENV !== "production";

async function start() {
  if (!isDev) {
    const path = await import("path");
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT} (${isDev ? "development" : "production"})`);
  });

  if (isDev) {
    const { createServer } = await import("vite");
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev middleware attached");
  }
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
