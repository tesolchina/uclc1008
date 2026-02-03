import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Send, Loader2, MessageSquare, ExternalLink, Sparkles, RefreshCw, Lock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/awq-guide-feedback`;

type Message = { role: "user" | "assistant"; content: string };

interface HTMLGameWithAIProps {
  weekNumber?: number;
  hourNumber?: number;
}

export function HTMLGameWithAI({ weekNumber = 4, hourNumber = 2 }: HTMLGameWithAIProps) {
  const { studentId } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const assignmentKey = `html-game-ai-w${weekNumber}h${hourNumber}`;

  // Load chat history on mount
  useEffect(() => {
    if (!studentId) return;
    
    async function loadHistory() {
      try {
        const { data, error } = await supabase
          .from("assignment_chat_history")
          .select("messages")
          .eq("student_id", studentId)
          .eq("assignment_key", assignmentKey)
          .maybeSingle();

        if (error) throw error;
        
        if (data?.messages) {
          setMessages(data.messages as Message[]);
        }
      } catch (err) {
        console.error("Failed to load chat history:", err);
      } finally {
        setHistoryLoaded(true);
      }
    }
    
    loadHistory();
  }, [studentId, assignmentKey]);

  // Save chat history when messages change
  useEffect(() => {
    if (!studentId || !historyLoaded || messages.length === 0) return;

    async function saveHistory() {
      try {
        await supabase
          .from("assignment_chat_history")
          .upsert({
            student_id: studentId,
            assignment_key: assignmentKey,
            messages: messages,
            week_number: weekNumber,
            hour_number: hourNumber,
            context_type: "html-game",
            updated_at: new Date().toISOString()
          }, {
            onConflict: "student_id,assignment_key"
          });
      } catch (err) {
        console.error("Failed to save chat history:", err);
      }
    }

    const timeout = setTimeout(saveHistory, 1000);
    return () => clearTimeout(timeout);
  }, [messages, studentId, assignmentKey, historyLoaded, weekNumber, hourNumber]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || !studentId) return;

    setIsLoading(true);
    const newMessages: Message[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");

    try {
      const resp = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          stepNumber: 0, // General feedback mode
          userText: userMessage,
          messages: newMessages.slice(-10), // Last 10 messages for context
          studentId,
          mode: "chat" // Free-form chat mode
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to get AI feedback");
      }

      // Stream response
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);
          
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
            }
          } catch {
            // Ignore parse errors
          }
        }
      }

      if (assistantContent) {
        setMessages([...newMessages, { role: "assistant", content: assistantContent }]);
      }

    } catch (err) {
      console.error("Chat error:", err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm("Clear chat history?")) {
      setMessages([]);
      toast.success("Chat cleared!");
    }
  };

  // Not logged in
  if (!studentId) {
    return (
      <div className="space-y-6">
        {/* HTML Game Iframe - always visible */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Interactive AWQ Writing Guide
            </CardTitle>
            <CardDescription>
              Work through the 12-step writing process. Complete each step to build your AWQ response.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="aspect-[16/10] w-full rounded-lg overflow-hidden border bg-white">
              <iframe
                src="https://tesolchina.github.io/genAI2026/courses/UCLC1008/AIagentDemo/teacherJumpIntoWater/guide_game_FRT.html"
                width="100%"
                height="100%"
                className="border-0"
                title="AWQ Writing Guide Game"
              />
            </div>
            <Button variant="outline" size="sm" asChild>
              <a
                href="https://tesolchina.github.io/genAI2026/courses/UCLC1008/AIagentDemo/teacherJumpIntoWater/guide_game_FRT.html"
                target="_blank"
                rel="noopener noreferrer"
                className="gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Open in New Tab
              </a>
            </Button>
          </CardContent>
        </Card>

        {/* Login reminder for AI chat */}
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Lock className="h-5 w-5" />
              Register for AI Feedback
            </CardTitle>
            <CardDescription>
              Register or log in to get AI feedback on your writing. Your chat history will be saved.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="default" onClick={() => window.location.href = "/auth"}>
              Register / Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HTML Game Iframe */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Interactive AWQ Writing Guide
          </CardTitle>
          <CardDescription>
            Work through the 12-step writing process. Use the AI chat below to get feedback on your writing at any step.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="aspect-[16/10] w-full rounded-lg overflow-hidden border bg-white">
            <iframe
              src="https://tesolchina.github.io/genAI2026/courses/UCLC1008/AIagentDemo/teacherJumpIntoWater/guide_game_FRT.html"
              width="100%"
              height="100%"
              className="border-0"
              title="AWQ Writing Guide Game"
            />
          </div>
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://tesolchina.github.io/genAI2026/courses/UCLC1008/AIagentDemo/teacherJumpIntoWater/guide_game_FRT.html"
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* AI Feedback Chat */}
      <Card className="flex flex-col" style={{ height: "500px" }}>
        <CardHeader className="pb-2 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                AI Writing Feedback
              </CardTitle>
              <CardDescription>
                Paste your writing from any step to get feedback
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 && (
                <Alert>
                  <Sparkles className="h-4 w-4" />
                  <AlertTitle>How to use</AlertTitle>
                  <AlertDescription>
                    <ol className="list-decimal list-inside space-y-1 mt-2 text-sm">
                      <li>Work through the writing guide above</li>
                      <li>Copy your text from any step</li>
                      <li>Paste it here and ask for feedback</li>
                      <li>Example: "Here's my introduction: [paste text]. Is this good?"</li>
                    </ol>
                  </AlertDescription>
                </Alert>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex-shrink-0 pt-4 border-t mt-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Paste your writing and ask for feedback..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) sendMessage(input);
                  }
                }}
                className="min-h-[80px] resize-none"
              />
              <Button
                onClick={() => input.trim() && sendMessage(input)}
                disabled={isLoading || !input.trim()}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
