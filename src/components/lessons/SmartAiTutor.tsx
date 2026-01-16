import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, Loader2, CheckCircle2, LucideIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

interface SmartAiTutorProps {
  topicId: string;
  topicTitle: string;
  topicIcon: LucideIcon;
  weekNumber: number;
  hourNumber: number;
  studentId: string;
  onComplete: (report: any) => void;
  onBack: () => void;
}

type Message = { role: "user" | "assistant"; content: string };

interface TutorState {
  currentTaskIndex: number;
  currentLevel: number;
  scores: number[];
  responses: { level: number; response: string; score: number; feedback: string }[];
  phase: "introduction" | "testing" | "complete";
}

export function SmartAiTutor({
  topicId,
  topicTitle,
  topicIcon: Icon,
  weekNumber,
  hourNumber,
  studentId,
  onComplete,
  onBack
}: SmartAiTutorProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tutorState, setTutorState] = useState<TutorState>({
    currentTaskIndex: 0,
    currentLevel: 1,
    scores: [],
    responses: [],
    phase: "introduction"
  });
  const [sessionComplete, setSessionComplete] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Start session automatically
  useEffect(() => {
    if (messages.length === 0) {
      startSession();
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startSession = async () => {
    setIsLoading(true);
    try {
      await sendToTutor([{ role: "user", content: "Hello, I'm ready to start the session." }]);
    } catch (error) {
      console.error("Failed to start session:", error);
      toast.error("Failed to start session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendToTutor = async (messagesToSend: Message[]) => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smart-tutor`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: messagesToSend,
          topicId,
          studentId,
          weekNumber,
          hourNumber,
          tutorState
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get response");
    }

    // Handle streaming response
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let assistantContent = "";
    let textBuffer = "";

    // Add placeholder message
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    while (true) {
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
        if (jsonStr === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages(prev => {
              const newMsgs = [...prev];
              newMsgs[newMsgs.length - 1] = { role: "assistant", content: assistantContent };
              return newMsgs;
            });
          }
        } catch {
          // Continue on parse errors
        }
      }
    }

    // Parse the response for state updates
    parseResponseForStateUpdates(assistantContent);
    
    return assistantContent;
  };

  const parseResponseForStateUpdates = (content: string) => {
    // Check for score tag
    const scoreMatch = content.match(/\[SCORE:(\d)\]/);
    if (scoreMatch) {
      const score = parseInt(scoreMatch[1]);
      setTutorState(prev => ({
        ...prev,
        scores: [...prev.scores, score],
        responses: [...prev.responses, {
          level: prev.currentTaskIndex + 1,
          response: messages[messages.length - 1]?.content || "",
          score,
          feedback: content
        }],
        currentTaskIndex: prev.currentTaskIndex + 1,
        phase: prev.currentTaskIndex >= 2 ? "complete" : "testing"
      }));
    }

    // Check for session complete
    if (content.includes("[SESSION_COMPLETE]")) {
      setSessionComplete(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      await sendToTutor(newMessages);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smart-tutor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            action: "generate_report",
            topicId,
            studentId,
            weekNumber,
            hourNumber,
            tutorState
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const report = await response.json();
      onComplete(report);
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Failed to generate report");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Clean content by removing state tags for display
  const cleanContent = (content: string) => {
    return content
      .replace(/\[SCORE:\d\]/g, "")
      .replace(/\[NEXT_TASK\]/g, "")
      .replace(/\[SESSION_COMPLETE\]/g, "")
      .trim();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{topicTitle}</CardTitle>
                <p className="text-xs text-muted-foreground">AI Tutor Session</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {tutorState.scores.map((score, i) => (
                <Badge 
                  key={i} 
                  variant={score >= 2 ? "default" : "secondary"}
                  className="text-xs"
                >
                  Task {i + 1}: {score}/3
                </Badge>
              ))}
              {tutorState.scores.length < 3 && (
                <Badge variant="outline" className="text-xs">
                  Task {tutorState.scores.length + 1} of 3
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Chat Area */}
      <Card className="h-[500px] flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{cleanContent(msg.content)}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t">
          {sessionComplete ? (
            <Button 
              className="w-full" 
              onClick={handleGenerateReport}
              disabled={isGeneratingReport}
            >
              {isGeneratingReport ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Generate My Report
                </>
              )}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer..."
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                size="icon"
                className="h-[60px] w-[60px]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
