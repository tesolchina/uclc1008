import { useState } from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type Msg = { role: "user" | "assistant"; content: string };

async function streamChat({
  messages,
  meta,
  onDelta,
}: {
  messages: Msg[];
  meta: { weekTitle: string; theme: string; aiPromptHint: string };
  onDelta: (deltaText: string) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, meta }),
  });

  if (resp.status === 402) {
    throw new Error("PAYMENT_REQUIRED");
  }
  if (resp.status === 429) {
    throw new Error("RATE_LIMITED");
  }
  if (!resp.ok || !resp.body) {
    throw new Error("REQUEST_FAILED");
  }

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  if (textBuffer.trim()) {
    for (let raw of textBuffer.split("\n")) {
      if (!raw) continue;
      if (raw.endsWith("\r")) raw = raw.slice(0, -1);
      if (raw.startsWith(":") || raw.trim() === "") continue;
      if (!raw.startsWith("data: ")) continue;
      const jsonStr = raw.slice(6).trim();
      if (jsonStr === "[DONE]") continue;
      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        // ignore
      }
    }
  }
}

interface LessonAiTutorProps {
  weekTitle: string;
  theme: string;
  aiPromptHint: string;
}

export const LessonAiTutor = ({ weekTitle, theme, aiPromptHint }: LessonAiTutorProps) => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = {
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      await streamChat({
        messages: [...messages, userMsg],
        meta: { weekTitle, theme, aiPromptHint },
        onDelta: (chunk) => {
          assistantSoFar += chunk;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant") {
              return prev.map((m, idx) => (idx === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
            }
            return [...prev, { role: "assistant", content: assistantSoFar }];
          });
        },
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "UNKNOWN";
      if (message === "PAYMENT_REQUIRED") {
        toast({
          title: "AI usage limit reached",
          description: "Please contact your instructor or workspace owner to top up Lovable AI credits.",
          variant: "destructive",
        });
      } else if (message === "RATE_LIMITED") {
        toast({
          title: "Too many AI requests",
          description: "Please wait a few seconds and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "AI tutor unavailable",
          description: "Something went wrong while contacting the AI tutor.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="ai-panel">
      <div className="ai-panel-inner">
        <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-sm">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              AI tutor for this week
            </CardTitle>
            <CardDescription className="text-xs">
              Ask for explanations, feedback on your sentences, or ideas for extra practice related to this week.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="E.g. Can you help me improve this summary? Or: What are good phrases for this week's topic?"
            className="min-h-[96px] resize-none text-sm"
          />
          <div className="flex items-center justify-between gap-2">
            <p className="hidden text-[11px] text-muted-foreground sm:block">
              Tip: Paste your writing and ask for language-focused feedback, not just a new version.
            </p>
            <Button size="sm" onClick={handleAsk} disabled={isLoading || !input.trim()} className="ml-auto">
              <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
              {isLoading ? "Asking..." : "Ask AI"}
            </Button>
          </div>
          <div className="mt-2 space-y-2 rounded-xl bg-background/70 p-3 text-xs">
            {messages.length === 0 ? (
              <p className="text-muted-foreground">
                Your conversation will appear here. Start by asking a question about this week's content or sharing a short
                paragraph of your writing.
              </p>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="font-medium text-foreground">{m.role === "user" ? "You" : "AI tutor"}</p>
                  <p className="whitespace-pre-wrap text-muted-foreground">{m.content}</p>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default LessonAiTutor;
