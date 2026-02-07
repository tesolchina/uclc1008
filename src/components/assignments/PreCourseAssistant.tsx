import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Bot, 
  Send, 
  Loader2, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  AlertTriangle,
  Sparkles,
  MessageCircle,
  History
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth";
import { generateTeacherStudentId } from "@/components/teacher/TeacherStudentModeSwitch";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ASSIGNMENT_KEY = "pre-course-writing";
const DUE_DATE = new Date("2026-01-23T18:00:00+08:00");

const SUGGESTED_QUESTIONS = [
  "What are the two tasks I need to complete?",
  "How should I format my document?",
  "How do I cite the article in APA format?",
  "What's the difference between Task 1 and Task 2?",
  "Can I use other sources for my essay?",
];

export function PreCourseAssistant() {
  const { user, studentId: authStudentId, isTeacher, isAdmin } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Get effective student ID
  const teacherStudentId = user?.id ? generateTeacherStudentId(user.id) : null;
  const isInStudentMode = !!authStudentId && authStudentId === teacherStudentId;
  const effectiveStudentId = authStudentId || (isInStudentMode ? teacherStudentId : null);

  // Calculate time remaining
  const now = new Date();
  const timeDiff = DUE_DATE.getTime() - now.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  const isPastDue = timeDiff <= 0;
  const isUrgent = daysRemaining <= 3 && !isPastDue;

  // Auto-open and highlight when navigating to #AI
  useEffect(() => {
    if (location.hash === "#AI") {
      setIsOpen(true);
      setIsHighlighted(true);
      // Scroll into view with offset
      setTimeout(() => {
        cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      // Remove highlight after animation
      setTimeout(() => setIsHighlighted(false), 2000);
    }
  }, [location.hash]);

  // Load chat history when opened
  useEffect(() => {
    if (isOpen && effectiveStudentId && messages.length === 0) {
      loadChatHistory();
    }
  }, [isOpen, effectiveStudentId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadChatHistory = async () => {
    if (!effectiveStudentId) return;
    
    setIsLoadingHistory(true);
    try {
      const { data, error } = await supabase
        .from("assignment_chat_history")
        .select("messages")
        .eq("student_id", effectiveStudentId)
        .eq("assignment_key", ASSIGNMENT_KEY)
        .maybeSingle();

      if (error) throw error;
      if (data?.messages && Array.isArray(data.messages)) {
        setMessages(data.messages as unknown as Message[]);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveChatHistory = async (newMessages: Message[]) => {
    if (!effectiveStudentId) return;

    try {
      // Check if record exists
      const { data: existing } = await supabase
        .from("assignment_chat_history")
        .select("id")
        .eq("student_id", effectiveStudentId)
        .eq("assignment_key", ASSIGNMENT_KEY)
        .maybeSingle();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("assignment_chat_history")
          .update({
            messages: JSON.parse(JSON.stringify(newMessages)),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("assignment_chat_history")
          .insert([{
            student_id: effectiveStudentId,
            assignment_key: ASSIGNMENT_KEY,
            messages: JSON.parse(JSON.stringify(newMessages)),
          }]);
        if (error) throw error;
      }
    } catch (error) {
      console.error("Failed to save chat history:", error);
    }
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: messageText.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(
        `/api/precourse-assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: updatedMessages,
            currentTime: new Date().toISOString(),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Add empty assistant message to update
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                if (updated[lastIdx]?.role === "assistant") {
                  updated[lastIdx] = { ...updated[lastIdx], content: assistantContent };
                }
                return updated;
              });
            }
          } catch {
            // Partial JSON, continue
          }
        }
      }

      // Save chat history after successful response
      const finalMessages = [...updatedMessages, { role: "assistant" as const, content: assistantContent }];
      await saveChatHistory(finalMessages);

    } catch (error) {
      console.error("Assistant error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to get response");
      // Remove the empty assistant message if error
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && !last.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const clearHistory = async () => {
    if (!effectiveStudentId) return;
    
    try {
      await supabase
        .from("assignment_chat_history")
        .delete()
        .eq("student_id", effectiveStudentId)
        .eq("assignment_key", ASSIGNMENT_KEY);
      
      setMessages([]);
      toast.success("Chat history cleared");
    } catch (error) {
      toast.error("Failed to clear history");
    }
  };

  return (
    <Card 
      ref={cardRef}
      className={`border-primary/30 bg-gradient-to-br from-primary/5 to-transparent transition-all duration-500 ${
        isHighlighted ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/20" : ""
      }`}
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    Assignment Assistant
                    <Badge variant="secondary" className="text-xs">AI</Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Ask questions about requirements, format, or deadlines
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Time remaining badge */}
                {isPastDue ? (
                  <Badge variant="destructive" className="gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Past Due
                  </Badge>
                ) : isUrgent ? (
                  <Badge variant="destructive" className="gap-1 animate-pulse">
                    <Clock className="h-3 w-3" />
                    {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left!
                  </Badge>
                ) : (
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    {daysRemaining} days left
                  </Badge>
                )}
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-4">
            {/* Time reminder */}
            {!isPastDue && (
              <div className={`p-3 rounded-lg text-sm ${isUrgent ? "bg-destructive/10 border border-destructive/20" : "bg-muted/50"}`}>
                <div className="flex items-start gap-2">
                  <Clock className={`h-4 w-4 mt-0.5 ${isUrgent ? "text-destructive" : "text-muted-foreground"}`} />
                  <div>
                    <p className={isUrgent ? "font-medium text-destructive" : ""}>
                      {isUrgent 
                        ? `Only ${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} until the deadline!`
                        : `You have ${daysRemaining} days to complete this assignment.`}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Due: 23 Jan 2026 (Fri), 6:00 PM • Worth 2.5% of your grade
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Academic integrity reminder */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-sm">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 mt-0.5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-700 dark:text-amber-400">Academic Integrity Reminder</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Write in your own words. Do not use AI-generated text or copy directly from the source. 
                    This assistant can answer questions but will not write any part of your assignment.
                  </p>
                </div>
              </div>
            </div>

            {/* Chat area */}
            <div className="relative">
              {messages.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 -top-1 h-6 text-xs text-muted-foreground z-10"
                  onClick={clearHistory}
                >
                  <History className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              )}
              <ScrollArea className="h-[300px] border rounded-lg p-3" ref={scrollRef}>
                {isLoadingHistory ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <MessageCircle className="h-8 w-8 text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Ask me about assignment requirements, format, or deadlines.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => sendMessage(q)}
                        >
                          {q}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {msg.role === "assistant" ? (
                            <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                              <ReactMarkdown
                                components={{
                                  p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                  ul: ({ children }) => <ul className="mb-2 pl-4 list-disc">{children}</ul>,
                                  ol: ({ children }) => <ol className="mb-2 pl-4 list-decimal">{children}</ol>,
                                  li: ({ children }) => <li className="mb-1">{children}</li>,
                                  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                  code: ({ children }) => <code className="bg-background/50 px-1 py-0.5 rounded text-xs">{children}</code>,
                                }}
                              >
                                {msg.content || "..."}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && messages[messages.length - 1]?.role === "user" && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg px-3 py-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Suggested questions */}
            {messages.length > 0 && messages.length < 4 && (
              <div className="flex flex-wrap gap-1">
                {SUGGESTED_QUESTIONS.filter(
                  q => !messages.some(m => m.content === q)
                ).slice(0, 2).map((q, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7"
                    onClick={() => sendMessage(q)}
                    disabled={isLoading}
                  >
                    {q}
                  </Button>
                ))}
              </div>
            )}

            {/* Input form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about the assignment..."
                className="min-h-[40px] max-h-[100px] resize-none"
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>

            {/* Student ID indicator */}
            {effectiveStudentId && (
              <p className="text-xs text-muted-foreground text-center">
                Chat history saved for {effectiveStudentId.slice(0, 8)}...
              </p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}