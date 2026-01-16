import { useState, useEffect } from "react";
import { MessageCircle, Sparkles, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

type Msg = { role: "user" | "assistant"; content: string };

// Generate or get browser session ID for anonymous usage tracking
function getBrowserSessionId(): string {
  let id = localStorage.getItem("browser_session_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("browser_session_id", id);
  }
  return id;
}

async function streamChat({
  messages,
  meta,
  accessToken,
  studentId,
  onDelta,
  onMeta,
}: {
  messages: Msg[];
  meta: { weekTitle: string; theme: string; aiPromptHint: string };
  accessToken?: string;
  studentId?: string;
  onDelta: (deltaText: string) => void;
  onMeta?: (source: string, used?: number, limit?: number) => void;
}) {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, meta, accessToken, studentId }),
  });

  // Extract metadata from headers
  const apiSource = resp.headers.get("X-Api-Source") || "user";
  const usageUsed = resp.headers.get("X-Usage-Used");
  const usageLimit = resp.headers.get("X-Usage-Limit");
  
  if (onMeta) {
    onMeta(
      apiSource,
      usageUsed ? parseInt(usageUsed) : undefined,
      usageLimit ? parseInt(usageLimit) : undefined
    );
  }

  if (resp.status === 402) {
    throw new Error("PAYMENT_REQUIRED");
  }
  if (resp.status === 429) {
    // Check if it's our daily limit
    const errorData = await resp.json().catch(() => ({}));
    if (errorData.limitReached) {
      throw new Error("DAILY_LIMIT_REACHED");
    }
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
  weekNumber?: number;
  hourNumber?: number;
  contextKey?: string;
}

export const LessonAiTutor = ({ 
  weekTitle, 
  theme, 
  aiPromptHint,
  weekNumber,
  hourNumber,
  contextKey 
}: LessonAiTutorProps) => {
  const { toast } = useToast();
  const { accessToken, profile } = useAuth();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  
  // API source tracking
  const [apiSource, setApiSource] = useState<"user" | "shared" | null>(null);
  const [usageInfo, setUsageInfo] = useState<{ used: number; limit: number } | null>(null);

  const studentId = profile?.hkbu_user_id || getBrowserSessionId();
  const effectiveContextKey = contextKey || (weekNumber && hourNumber ? `w${weekNumber}h${hourNumber}-tutor` : null);

  // Load existing chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!studentId || !effectiveContextKey) {
        setHistoryLoaded(true);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("assignment_chat_history")
          .select("messages")
          .eq("student_id", studentId)
          .eq("assignment_key", effectiveContextKey)
          .single();

        if (data && !error) {
          const loadedMessages = data.messages as Msg[];
          if (Array.isArray(loadedMessages) && loadedMessages.length > 0) {
            setMessages(loadedMessages);
          }
        }
      } catch (err) {
        console.error("Error loading chat history:", err);
      } finally {
        setHistoryLoaded(true);
      }
    };

    loadChatHistory();
  }, [studentId, effectiveContextKey]);

  // Save chat history after each message exchange
  const saveChatHistory = async (newMessages: Msg[]) => {
    if (!studentId || !effectiveContextKey || newMessages.length === 0) return;

    try {
      const { error } = await supabase
        .from("assignment_chat_history")
        .upsert({
          student_id: studentId,
          assignment_key: effectiveContextKey,
          context_type: 'lesson',
          week_number: weekNumber || null,
          hour_number: hourNumber || null,
          messages: newMessages,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'student_id,assignment_key' 
        });

      if (error) {
        console.error("Error saving chat history:", error);
      }
    } catch (err) {
      console.error("Error saving chat history:", err);
    }
  };

  const handleAsk = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: Msg = {
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    let assistantSoFar = "";

    try {
      await streamChat({
        messages: updatedMessages,
        meta: { weekTitle, theme, aiPromptHint },
        accessToken: accessToken || undefined,
        studentId,
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
        onMeta: (source, used, limit) => {
          setApiSource(source as "user" | "shared");
          if (used !== undefined && limit !== undefined) {
            setUsageInfo({ used, limit });
          }
        },
      });

      // Save history after successful response
      const finalMessages: Msg[] = [...updatedMessages, { role: "assistant", content: assistantSoFar }];
      await saveChatHistory(finalMessages);
    } catch (e) {
      const message = e instanceof Error ? e.message : "UNKNOWN";
      if (message === "DAILY_LIMIT_REACHED") {
        toast({
          title: "Daily AI limit reached",
          description: "Add your HKBU API key in Settings for unlimited access.",
          variant: "destructive",
        });
      } else if (message === "PAYMENT_REQUIRED") {
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
              {apiSource && (
                <Badge variant={apiSource === "user" ? "default" : "secondary"} className="ml-2 text-[10px]">
                  {apiSource === "user" ? "Your API" : "Shared"}
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-xs">
              Ask for explanations, feedback on your sentences, or ideas for extra practice related to this week.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {/* Usage indicator for shared API */}
          {apiSource === "shared" && usageInfo && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
              <Info className="h-3.5 w-3.5" />
              <span>
                {usageInfo.limit - usageInfo.used} of {usageInfo.limit} daily requests remaining
              </span>
            </div>
          )}
          
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
            {!historyLoaded ? (
              <p className="text-muted-foreground">Loading conversation...</p>
            ) : messages.length === 0 ? (
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
