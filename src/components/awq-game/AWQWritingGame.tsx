import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BookOpen, 
  Lightbulb, 
  PenLine, 
  FileText, 
  CheckCircle, 
  Send, 
  ArrowRight, 
  ArrowLeft,
  MessageSquare,
  Loader2,
  Lock,
  RefreshCw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/awq-writing-guide`;

// Writing steps configuration
const STEPS = [
  { id: "read", title: "Read & Understand", icon: BookOpen, color: "text-blue-500" },
  { id: "plan", title: "Plan Response", icon: Lightbulb, color: "text-yellow-500" },
  { id: "intro", title: "Write Introduction", icon: PenLine, color: "text-green-500" },
  { id: "body", title: "Write Body", icon: FileText, color: "text-purple-500" },
  { id: "conclusion", title: "Write Conclusion", icon: PenLine, color: "text-orange-500" },
  { id: "review", title: "Final Review", icon: CheckCircle, color: "text-emerald-500" },
];

// Article excerpts
const ARTICLE_A = {
  title: "Hong et al. (2022)",
  subtitle: "FRT Acceptance Study",
  content: `Hong, Li, Kuo & An (2022) investigated Chinese parents' acceptance of facial recognition technology (FRT) in elementary schools. Using survey data from 380 parents in Xuzhou, the researchers found that technological innovativeness positively influenced perceived value (β=0.447), while dangerous beliefs about virtual worlds negatively affected it (β=-0.320). Parents generally supported FRT for school security despite privacy concerns.`
};

const ARTICLE_B = {
  title: "Andrejevic & Selwyn (2020)",
  subtitle: "Critical Perspective",
  content: `Andrejevic and Selwyn (2020) critically examine FRT deployment in schools. They argue that facial recognition creates "inescapable" surveillance since students cannot opt out - the technology requires capturing everyone to function. Unlike ID cards which can be left behind, faces cannot be removed. The authors warn this normalizes constant monitoring and raise concerns about consent in educational settings.`
};

type Message = { role: "user" | "assistant"; content: string };

interface AWQWritingGameProps {
  weekNumber?: number;
  hourNumber?: number;
}

export function AWQWritingGame({ weekNumber = 4, hourNumber = 2 }: AWQWritingGameProps) {
  const { studentId } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, string>>({
    intro: "",
    body: "",
    conclusion: ""
  });
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const assignmentKey = `awq-game-w${weekNumber}h${hourNumber}`;

  // Load chat history on mount
  useEffect(() => {
    if (!studentId) return;
    
    async function loadHistory() {
      try {
        const { data, error } = await supabase
          .from("assignment_chat_history")
          .select("messages, context_type")
          .eq("student_id", studentId)
          .eq("assignment_key", assignmentKey)
          .maybeSingle();

        if (error) throw error;
        
        if (data?.messages) {
          const savedMessages = data.messages as Message[];
          setMessages(savedMessages);
          
          // Try to restore step from context_type
          if (data.context_type) {
            const stepIndex = STEPS.findIndex(s => s.id === data.context_type);
            if (stepIndex >= 0) setCurrentStep(stepIndex);
          }
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
            context_type: STEPS[currentStep].id,
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
  }, [messages, studentId, assignmentKey, currentStep, historyLoaded]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send welcome message when entering a new step
  useEffect(() => {
    if (!historyLoaded) return;
    
    const stepId = STEPS[currentStep].id;
    const hasStepMessage = messages.some(
      m => m.role === "assistant" && m.content.includes(`Step ${currentStep + 1}`)
    );
    
    if (!hasStepMessage && messages.length === 0) {
      sendMessage("", true);
    }
  }, [currentStep, historyLoaded]);

  async function sendMessage(userMessage: string, isAuto = false) {
    if (!studentId) {
      toast.error("Please log in to use the writing guide");
      return;
    }

    setIsLoading(true);
    
    const newMessages = isAuto 
      ? messages 
      : [...messages, { role: "user" as const, content: userMessage }];
    
    if (!isAuto) {
      setMessages(newMessages);
      setInput("");
    }

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          studentId,
          step: STEPS[currentStep].id,
        }),
      });

      if (resp.status === 429 || resp.status === 402) {
        toast.error("AI is busy. Please wait a moment and try again.");
        setIsLoading(false);
        return;
      }

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to get response");
      }

      // Stream the response
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
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleNextStep() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      // Add step transition message
      const nextStep = STEPS[currentStep + 1];
      sendMessage(`I'm ready to move to ${nextStep.title}`);
    }
  }

  function handlePrevStep() {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }

  function handleSubmitDraft(section: "intro" | "body" | "conclusion") {
    if (!drafts[section].trim()) {
      toast.error("Please write something first!");
      return;
    }
    sendMessage(`Here's my ${section}:\n\n${drafts[section]}`);
  }

  function handleReset() {
    if (confirm("Are you sure you want to start over? This will clear your progress.")) {
      setMessages([]);
      setCurrentStep(0);
      setDrafts({ intro: "", body: "", conclusion: "" });
      toast.success("Progress reset. Starting fresh!");
    }
  }

  // Count words in all drafts
  const totalWords = Object.values(drafts).join(" ").split(/\s+/).filter(w => w).length;

  // Check if user is logged in
  if (!studentId) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <Lock className="h-5 w-5" />
            Registration Required
          </CardTitle>
          <CardDescription>
            Please register or log in to access the AI-guided writing game. Your progress will be saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="default" onClick={() => window.location.href = "/auth"}>
            Register / Log In
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">AWQ Writing Guide</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{totalWords}/200 words</Badge>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>
          <Progress value={(currentStep / (STEPS.length - 1)) * 100} className="h-2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStep;
              const isComplete = idx < currentStep;
              return (
                <Button
                  key={step.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`flex-shrink-0 ${isComplete ? "bg-green-100 border-green-300" : ""}`}
                  onClick={() => setCurrentStep(idx)}
                >
                  <Icon className={`h-4 w-4 mr-1 ${isActive ? "" : step.color}`} />
                  {step.title}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Articles & Writing Area */}
        <div className="space-y-4">
          {/* Article Excerpts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Source Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-semibold text-blue-800">{ARTICLE_A.title}</p>
                <p className="text-xs text-blue-600 mb-2">{ARTICLE_A.subtitle}</p>
                <p className="text-sm text-blue-900">{ARTICLE_A.content}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="font-semibold text-purple-800">{ARTICLE_B.title}</p>
                <p className="text-xs text-purple-600 mb-2">{ARTICLE_B.subtitle}</p>
                <p className="text-sm text-purple-900">{ARTICLE_B.content}</p>
              </div>
            </CardContent>
          </Card>

          {/* Writing Area - Show based on step */}
          {(currentStep >= 2 && currentStep <= 4) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <PenLine className="h-4 w-4" />
                  {STEPS[currentStep].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder={
                    currentStep === 2 ? "Write your introduction here (2-3 sentences)..." :
                    currentStep === 3 ? "Write your body paragraph here (4-6 sentences)..." :
                    "Write your conclusion here (1-2 sentences)..."
                  }
                  value={drafts[currentStep === 2 ? "intro" : currentStep === 3 ? "body" : "conclusion"]}
                  onChange={(e) => setDrafts(prev => ({
                    ...prev,
                    [currentStep === 2 ? "intro" : currentStep === 3 ? "body" : "conclusion"]: e.target.value
                  }))}
                  className="min-h-[150px]"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">
                    {drafts[currentStep === 2 ? "intro" : currentStep === 3 ? "body" : "conclusion"]
                      .split(/\s+/).filter(w => w).length} words
                  </span>
                  <Button 
                    size="sm"
                    onClick={() => handleSubmitDraft(
                      currentStep === 2 ? "intro" : currentStep === 3 ? "body" : "conclusion"
                    )}
                    disabled={isLoading}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Get Feedback
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Final Review - Show complete draft */}
          {currentStep === 5 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Your Complete Draft</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {drafts.intro && (
                  <div className="p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-xs font-medium text-green-700 mb-1">Introduction</p>
                    <p className="text-sm">{drafts.intro}</p>
                  </div>
                )}
                {drafts.body && (
                  <div className="p-2 bg-purple-50 rounded border border-purple-200">
                    <p className="text-xs font-medium text-purple-700 mb-1">Body</p>
                    <p className="text-sm">{drafts.body}</p>
                  </div>
                )}
                {drafts.conclusion && (
                  <div className="p-2 bg-orange-50 rounded border border-orange-200">
                    <p className="text-xs font-medium text-orange-700 mb-1">Conclusion</p>
                    <p className="text-sm">{drafts.conclusion}</p>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <Badge variant={totalWords <= 220 ? "default" : "destructive"}>
                    {totalWords}/200 words
                  </Badge>
                  <Button 
                    size="sm"
                    onClick={() => sendMessage(`Please review my complete draft:\n\nIntroduction:\n${drafts.intro}\n\nBody:\n${drafts.body}\n\nConclusion:\n${drafts.conclusion}`)}
                    disabled={isLoading || !drafts.intro || !drafts.body || !drafts.conclusion}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Get Full Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: AI Chat */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader className="pb-2 flex-shrink-0">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Dr. Write - Your AWQ Tutor
            </CardTitle>
            <CardDescription>
              Step {currentStep + 1}: {STEPS[currentStep].title}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            {/* Messages */}
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.length === 0 && !isLoading && (
                  <Alert>
                    <AlertDescription>
                      Welcome! I'm Dr. Write, your AWQ tutor. Let's work through this writing task step by step.
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
                      <div className="prose prose-sm max-w-none">
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

            {/* Input Area */}
            <div className="flex-shrink-0 pt-4 border-t mt-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask a question or share your thoughts..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim()) sendMessage(input);
                    }
                  }}
                  className="min-h-[60px] resize-none"
                />
                <Button
                  onClick={() => input.trim() && sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevStep}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleNextStep}
                  disabled={currentStep === STEPS.length - 1}
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
