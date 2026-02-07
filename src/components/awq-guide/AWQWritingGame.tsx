import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Send, Loader2, ChevronRight, ChevronLeft, Check, Sparkles, 
  RefreshCw, Save, MessageSquare, BookOpen, AlertCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const FUNCTION_URL = `/api/awq-guide-feedback`;

// The 12 AWQ writing steps
const WRITING_STEPS = [
  { id: 1, section: "INTRODUCTION", title: "Background", purpose: "Introduce FRT and its growing use in schools", placeholder: "Write 1-2 sentences introducing facial recognition technology in schools...", citationNeeded: false },
  { id: 2, section: "INTRODUCTION", title: "Topic Focus", purpose: "State that different views exist on FRT in schools", placeholder: "Acknowledge that different perspectives exist...", citationNeeded: false },
  { id: 3, section: "INTRODUCTION", title: "Thesis Statement", purpose: "Preview both perspectives—(1) parents support FRT despite concerns (A), (2) critics warn about consent/surveillance (B)", placeholder: "Preview the two main perspectives from the articles...", citationNeeded: false },
  { id: 4, section: "BODY PARAGRAPH", title: "Topic Sentence", purpose: "Frame the debate—perceived value vs. consent concerns", placeholder: "Frame the central debate or tension between the two perspectives...", citationNeeded: false },
  { id: 5, section: "BODY PARAGRAPH", title: "Article A — Parents Have Concerns", purpose: "Acknowledge parents are aware of privacy risks", placeholder: "Hong et al. (2022) found that parents...", citationNeeded: true, citation: "Hong et al. (2022)" },
  { id: 6, section: "BODY PARAGRAPH", title: "Article A — BUT Parents Still Support", purpose: "Despite concerns, parents value FRT and support continued use", placeholder: "Despite these concerns, the study found that...", citationNeeded: true, citation: "(Hong et al., 2022)" },
  { id: 7, section: "BODY PARAGRAPH", title: "Transition to Article B", purpose: "Introduce critical perspective with contrast transition", placeholder: "However, Andrejevic and Selwyn (2020) argue that...", citationNeeded: true, citation: "Andrejevic and Selwyn (2020)" },
  { id: 8, section: "BODY PARAGRAPH", title: "Article B — Facial Data is Inescapable", purpose: "Unlike other data, facial data cannot be controlled", placeholder: "According to the authors, facial data differs from other forms of data because...", citationNeeded: true, citation: "(Andrejevic & Selwyn, 2020)" },
  { id: 9, section: "BODY PARAGRAPH", title: "Article B — Opt-out is Meaningless", purpose: "Opting out doesn't work—system scans before recognising opt-out", placeholder: "Furthermore, they contend that opting out is ineffective because...", citationNeeded: true, citation: "(Andrejevic & Selwyn, 2020)" },
  { id: 10, section: "BODY PARAGRAPH", title: "Article B — Coercion in Schools", purpose: "Schools enforce rules that make surveillance easier", placeholder: "The school environment, they suggest, creates conditions where...", citationNeeded: true, citation: "(Andrejevic & Selwyn, 2020)" },
  { id: 11, section: "BODY PARAGRAPH", title: "Article B — Consent is Inadequate", purpose: "Informed consent impossible due to system requirements", placeholder: "Ultimately, the authors argue that informed consent is compromised because...", citationNeeded: true, citation: "(Andrejevic & Selwyn, 2020)" },
  { id: 12, section: "CONCLUSION", title: "Restate the Contrast", purpose: "Summarise tension—parents see value vs. critics warn about consent", placeholder: "In conclusion, while parents perceive value in FRT, critics raise significant concerns about...", citationNeeded: false },
];

type Message = { role: "user" | "assistant"; content: string };

interface StepData {
  content: string;
  feedback: string;
  isComplete: boolean;
}

interface AWQWritingGameProps {
  weekNumber?: number;
  hourNumber?: number;
}

export function AWQWritingGame({ weekNumber = 4, hourNumber = 2 }: AWQWritingGameProps) {
  const { studentId } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [stepData, setStepData] = useState<Record<number, StepData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const assignmentKey = `awq-game-w${weekNumber}h${hourNumber}`;
  const step = WRITING_STEPS[currentStep];
  const completedSteps = Object.values(stepData).filter(s => s.isComplete).length;
  const progress = (completedSteps / WRITING_STEPS.length) * 100;

  // Load saved data on mount
  useEffect(() => {
    if (!studentId) return;
    
    async function loadData() {
      try {
        const { data, error } = await supabase
          .from("assignment_chat_history")
          .select("messages")
          .eq("student_id", studentId)
          .eq("assignment_key", assignmentKey)
          .maybeSingle();

        if (error) throw error;
        
        if (data?.messages) {
          const saved = data.messages as { stepData?: Record<number, StepData>; chatMessages?: Message[] };
          if (saved.stepData) setStepData(saved.stepData);
          if (saved.chatMessages) setChatMessages(saved.chatMessages);
        }
      } catch (err) {
        console.error("Failed to load saved data:", err);
      } finally {
        setHistoryLoaded(true);
      }
    }
    
    loadData();
  }, [studentId, assignmentKey]);

  // Auto-save when data changes
  useEffect(() => {
    if (!studentId || !historyLoaded) return;
    if (Object.keys(stepData).length === 0 && chatMessages.length === 0) return;

    async function saveData() {
      setIsSaving(true);
      try {
        // Check if record exists first
        const { data: existing } = await supabase
          .from("assignment_chat_history")
          .select("id")
          .eq("student_id", studentId)
          .eq("assignment_key", assignmentKey)
          .maybeSingle();

        if (existing) {
          await supabase
            .from("assignment_chat_history")
            .update({
              messages: { stepData, chatMessages } as unknown as import("@/integrations/supabase/types").Json,
              updated_at: new Date().toISOString()
            })
            .eq("student_id", studentId)
            .eq("assignment_key", assignmentKey);
        } else {
          await supabase
            .from("assignment_chat_history")
            .insert({
              student_id: studentId,
              assignment_key: assignmentKey,
              messages: { stepData, chatMessages } as unknown as import("@/integrations/supabase/types").Json,
              week_number: weekNumber,
              hour_number: hourNumber,
              context_type: "awq-game"
            });
        }
      } catch (err) {
        console.error("Failed to save:", err);
      } finally {
        setIsSaving(false);
      }
    }

    const timeout = setTimeout(saveData, 2000);
    return () => clearTimeout(timeout);
  }, [stepData, chatMessages, studentId, assignmentKey, historyLoaded, weekNumber, hourNumber]);

  // Scroll chat to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const currentStepData = stepData[currentStep] || { content: "", feedback: "", isComplete: false };

  const updateStepContent = (content: string) => {
    setStepData(prev => ({
      ...prev,
      [currentStep]: { ...currentStepData, content }
    }));
  };

  const getFeedback = async () => {
    if (!currentStepData.content.trim() || !studentId) return;

    setIsLoading(true);
    try {
      // Build context from previous steps
      const fullContext = WRITING_STEPS.slice(0, currentStep)
        .map((s, i) => stepData[i]?.content || "")
        .filter(Boolean)
        .join(" ");

      const resp = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stepIndex: currentStep,
          studentResponse: currentStepData.content,
          fullContext,
          studentId,
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to get feedback");
      }

      // Stream response
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let feedback = "";
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
              feedback += content;
              setStepData(prev => ({
                ...prev,
                [currentStep]: { ...currentStepData, content: currentStepData.content, feedback }
              }));
            }
          } catch {
            // Ignore parse errors
          }
        }
      }

      if (feedback) {
        setStepData(prev => ({
          ...prev,
          [currentStep]: { ...prev[currentStep], feedback, isComplete: true }
        }));
        toast.success("Feedback received!");
      }

    } catch (err) {
      console.error("Feedback error:", err);
      toast.error("Failed to get feedback. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const sendChatMessage = async (userMessage: string) => {
    if (!userMessage.trim() || !studentId) return;

    setIsLoading(true);
    const newMessages: Message[] = [...chatMessages, { role: "user", content: userMessage }];
    setChatMessages(newMessages);
    setChatInput("");

    try {
      const resp = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mode: "chat",
          messages: newMessages.slice(-10),
          studentId,
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error("Failed to get response");
      }

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
              setChatMessages([...newMessages, { role: "assistant", content: assistantContent }]);
            }
          } catch {
            // Ignore parse errors
          }
        }
      }

      if (assistantContent) {
        setChatMessages([...newMessages, { role: "assistant", content: assistantContent }]);
      }

    } catch (err) {
      console.error("Chat error:", err);
      toast.error("Failed to send message.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFullDraft = () => {
    return WRITING_STEPS.map((s, i) => stepData[i]?.content || "").filter(Boolean).join(" ");
  };

  const wordCount = getFullDraft().split(/\s+/).filter(Boolean).length;

  if (!studentId) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <AlertCircle className="h-5 w-5" />
            Login Required
          </CardTitle>
          <CardDescription>
            Register or log in to use the AWQ Writing Game. Your progress will be saved automatically.
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
    <div className="space-y-4">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{completedSteps}/12 steps</Badge>
              <Badge variant="secondary">{wordCount} words</Badge>
              {isSaving && <Badge variant="outline" className="text-muted-foreground"><Save className="h-3 w-3 mr-1" />Saving...</Badge>}
            </div>
            <Badge className={wordCount > 300 ? "bg-red-500" : wordCount > 200 ? "bg-amber-500" : "bg-green-500"}>
              Target: 200-300 words
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Writing Steps Panel */}
        <Card className="flex flex-col" style={{ minHeight: "600px" }}>
          <CardHeader className="pb-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{step.section}</Badge>
              <span className="text-sm text-muted-foreground">Step {currentStep + 1}/12</span>
            </div>
            <CardTitle className="text-lg">{step.title}</CardTitle>
            <CardDescription>{step.purpose}</CardDescription>
            {step.citationNeeded && (
              <Alert className="mt-2">
                <BookOpen className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Citation needed: <strong>{step.citation}</strong>
                </AlertDescription>
              </Alert>
            )}
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            <Textarea
              placeholder={step.placeholder}
              value={currentStepData.content}
              onChange={(e) => updateStepContent(e.target.value)}
              className="flex-1 min-h-[150px] resize-none"
            />
            
            {/* Feedback Display */}
            {currentStepData.feedback && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-1 flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-primary" /> AI Feedback
                </p>
                <div className="text-sm prose prose-sm max-w-none">
                  <ReactMarkdown>{currentStepData.feedback}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              <Button
                onClick={getFeedback}
                disabled={isLoading || !currentStepData.content.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-1" />
                )}
                Get Feedback
              </Button>

              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.min(WRITING_STEPS.length - 1, currentStep + 1))}
                disabled={currentStep === WRITING_STEPS.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {/* Step Navigation */}
            <div className="flex flex-wrap gap-1 mt-4">
              {WRITING_STEPS.map((s, i) => (
                <Button
                  key={i}
                  variant={i === currentStep ? "default" : stepData[i]?.isComplete ? "secondary" : "ghost"}
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => setCurrentStep(i)}
                >
                  {stepData[i]?.isComplete ? <Check className="h-3 w-3" /> : i + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Chat Panel */}
        <Card className="flex flex-col" style={{ minHeight: "600px" }}>
          <CardHeader className="pb-2 flex-shrink-0">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Ask Dr. AWQ
            </CardTitle>
            <CardDescription>
              Questions about AWQ structure, citations, or synthesis
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
              <div className="space-y-3">
                {chatMessages.length === 0 && (
                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Need help?</AlertTitle>
                    <AlertDescription className="text-sm">
                      Ask about citations, synthesis, or any AWQ question!
                    </AlertDescription>
                  </Alert>
                )}
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[90%] rounded-lg p-2 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                ))}
                {isLoading && chatMessages[chatMessages.length - 1]?.role === "user" && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="flex-shrink-0 pt-3 border-t mt-3">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Ask a question..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (chatInput.trim()) sendChatMessage(chatInput);
                    }
                  }}
                  className="min-h-[60px] resize-none text-sm"
                />
                <Button
                  size="sm"
                  onClick={() => chatInput.trim() && sendChatMessage(chatInput)}
                  disabled={isLoading || !chatInput.trim()}
                  className="self-end"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Draft Preview */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Your Full Draft</CardTitle>
          <CardDescription>Preview of your complete AWQ response</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/50 rounded-lg min-h-[100px]">
            {getFullDraft() || <span className="text-muted-foreground italic">Your writing will appear here as you complete each step...</span>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
