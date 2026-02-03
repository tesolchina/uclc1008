import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ChevronLeft, ChevronRight, Sparkles, Lock, Loader2, 
  BookOpen, Target, Quote, FileText, Copy, Check,
  MessageSquare, RotateCcw
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/awq-guide-feedback`;

interface Step {
  number: number;
  section: string;
  title: string;
  purpose: string;
  excerpt: string | null;
  paraphrase: string;
  citation: string;
  citationCode: string | null;
}

const STEPS: Step[] = [
  {
    number: 1, section: "INTRODUCTION", title: "Background",
    purpose: "Introduce FRT and its growing use in schools",
    excerpt: "Facial recognition technology is now being introduced across various aspects of public life. This includes the burgeoning integration of facial recognition... into compulsory schooling to address issues such as campus security, automated registration and student emotion detection.",
    paraphrase: "FRT increasingly used in schools → purposes: security, attendance, monitoring",
    citation: "No citation needed (general background)", citationCode: null
  },
  {
    number: 2, section: "INTRODUCTION", title: "Topic Focus",
    purpose: "State that different views exist on FRT in schools",
    excerpt: "Different views about the adoption of FRT in elementary schools from researchers and other stakeholders have been seen in the research literature and media.",
    paraphrase: "Contrasting views from researchers and stakeholders",
    citation: "No citation needed", citationCode: null
  },
  {
    number: 3, section: "INTRODUCTION", title: "Thesis Statement",
    purpose: "Preview both perspectives—(1) parents support FRT despite concerns (A), (2) critics warn about consent/surveillance (B)",
    excerpt: null,
    paraphrase: "Combine main claims → one supports, one warns",
    citation: "No citation needed (your synthesis)", citationCode: null
  },
  {
    number: 4, section: "BODY PARAGRAPH", title: "Topic Sentence",
    purpose: "Frame the debate—perceived value vs. consent concerns",
    excerpt: null,
    paraphrase: "Debate centres on perceived value (parents) vs. consent/surveillance (critics)",
    citation: "No citation needed (your framing)", citationCode: null
  },
  {
    number: 5, section: "BODY PARAGRAPH", title: "Article A — Parents Have Concerns",
    purpose: "Acknowledge parents are aware of privacy risks",
    excerpt: "The results indicate that the average score of parents' DBVW is 3.865, which is higher than the average level (3.000), indicating that the parents were worried about the disclosure of students' personal privacy.",
    paraphrase: "Parents concerned about → privacy disclosure / personal data",
    citation: "YES — cite Hong et al. (2022)", citationCode: "Hong et al. (2022)"
  },
  {
    number: 6, section: "BODY PARAGRAPH", title: "Article A — BUT Parents Still Support",
    purpose: "Despite concerns, parents value FRT and support continued use",
    excerpt: "On the whole, although the parent respondents thought that the face recognition system had certain risks, they were willing to try technological innovation and they thought the system was valuable, so they intended to continue using it.",
    paraphrase: "Despite risks → perceive value → intend to continue",
    citation: "YES — cite Hong et al. (2022)", citationCode: "(Hong et al., 2022)"
  },
  {
    number: 7, section: "BODY PARAGRAPH", title: "Transition to Article B",
    purpose: "Introduce critical perspective with contrast transition",
    excerpt: null,
    paraphrase: "Use: However / In contrast / On the other hand",
    citation: "YES — introduce Andrejevic and Selwyn (2020)", citationCode: "Andrejevic and Selwyn (2020)"
  },
  {
    number: 8, section: "BODY PARAGRAPH", title: "Article B — Facial Data is Inescapable",
    purpose: "Unlike other data, facial data cannot be controlled",
    excerpt: "Unlike other forms of personal data... facial data lends itself to constant and permanent surveillance. In short, people are always connected to their faces. Thus... there is no option for students to self-curate and restrict what data they 'share'.",
    paraphrase: "Facial data ≠ social media → always connected to face → cannot control",
    citation: "YES — cite Andrejevic and Selwyn (2020)", citationCode: "(Andrejevic & Selwyn, 2020)"
  },
  {
    number: 9, section: "BODY PARAGRAPH", title: "Article B — Opt-out is Meaningless",
    purpose: "Opting out doesn't work—system scans before recognising opt-out",
    excerpt: "Even if opt-out protocols are in place, the system has to scan a student's face before it can recognise that they have opted out.",
    paraphrase: "Opt-out ineffective → must scan first → paradox",
    citation: "YES — cite Andrejevic and Selwyn (2020)", citationCode: "(Andrejevic & Selwyn, 2020)"
  },
  {
    number: 10, section: "BODY PARAGRAPH", title: "Article B — Coercion in Schools (Optional)",
    purpose: "Schools enforce rules that make surveillance easier",
    excerpt: "For example, most schools enforce dress codes that preclude students' faces being covered by hair, hoods or other obtrutions. This makes it difficult for students to obscure their faces from surveillance cameras.",
    paraphrase: "Dress codes → faces exposed → cannot hide from cameras",
    citation: "YES — cite Andrejevic and Selwyn (2020)", citationCode: "(Andrejevic & Selwyn, 2020)"
  },
  {
    number: 11, section: "BODY PARAGRAPH", title: "Article B — Consent is Inadequate",
    purpose: "Informed consent impossible due to system requirements",
    excerpt: "The systems being deployed in schools for security and attendance purposes rely on complete sweeps of classrooms and corridors in order to operate. This renders 'opt-in' and 'opt-out' approaches counter-productive.",
    paraphrase: "Complete sweeps required → opt-in/opt-out doesn't work → consent inadequate",
    citation: "YES — cite Andrejevic and Selwyn (2020)", citationCode: "(Andrejevic & Selwyn, 2020)"
  },
  {
    number: 12, section: "CONCLUSION", title: "Restate the Contrast",
    purpose: "Summarise tension—parents see value vs. critics warn about consent",
    excerpt: null,
    paraphrase: "Parents perceive value + support ↔ Critics warn consent/surveillance concerns",
    citation: "Optional (can cite both or neither)", citationCode: null
  }
];

const CHECKLIST_ITEMS = [
  "Introduction has background and thesis",
  "Body has a topic sentence",
  "Article A ideas are paraphrased and cited (Hong et al., 2022)",
  "Article B ideas are paraphrased and cited (Andrejevic & Selwyn, 2020)",
  "Contrast/synthesis is clear (support vs. concerns)",
  "Conclusion restates the main tension",
  "No direct copying from excerpts",
  "Word count ≤ 300"
];

interface AWQGuideGameProps {
  weekNumber?: number;
  hourNumber?: number;
}

export function AWQGuideGame({ weekNumber = 4, hourNumber = 2 }: AWQGuideGameProps) {
  const { studentId } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[]>(new Array(12).fill(""));
  const [feedback, setFeedback] = useState<string[]>(new Array(12).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(8).fill(false));
  const [copied, setCopied] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  
  const assignmentKey = `awq-guide-w${weekNumber}h${hourNumber}`;
  const step = STEPS[currentStep];

  // Load saved progress
  useEffect(() => {
    if (!studentId) return;
    
    async function loadProgress() {
      try {
        const { data, error } = await supabase
          .from("assignment_chat_history")
          .select("messages")
          .eq("student_id", studentId)
          .eq("assignment_key", assignmentKey)
          .maybeSingle();

        if (error) throw error;
        
        if (data?.messages) {
          const saved = data.messages as { responses?: string[]; feedback?: string[]; checkedItems?: boolean[] };
          if (saved.responses) setResponses(saved.responses);
          if (saved.feedback) setFeedback(saved.feedback);
          if (saved.checkedItems) setCheckedItems(saved.checkedItems);
        }
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setHistoryLoaded(true);
      }
    }
    
    loadProgress();
  }, [studentId, assignmentKey]);

  // Save progress
  useEffect(() => {
    if (!studentId || !historyLoaded) return;

    async function saveProgress() {
      try {
        await supabase
          .from("assignment_chat_history")
          .upsert({
            student_id: studentId,
            assignment_key: assignmentKey,
            messages: { responses, feedback, checkedItems },
            week_number: weekNumber,
            hour_number: hourNumber,
            updated_at: new Date().toISOString()
          }, { onConflict: "student_id,assignment_key" });
      } catch (err) {
        console.error("Failed to save progress:", err);
      }
    }

    const timeout = setTimeout(saveProgress, 1000);
    return () => clearTimeout(timeout);
  }, [responses, feedback, checkedItems, studentId, assignmentKey, historyLoaded]);

  const updateResponse = (value: string) => {
    const newResponses = [...responses];
    newResponses[currentStep] = value;
    setResponses(newResponses);
  };

  const getAIFeedback = async () => {
    if (!responses[currentStep].trim()) {
      toast.error("Please write something first");
      return;
    }

    setIsLoading(true);
    const newFeedback = [...feedback];
    newFeedback[currentStep] = "";
    setFeedback(newFeedback);

    try {
      const previousContext = responses.slice(0, currentStep).filter(r => r).join(" ");
      
      const resp = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          stepIndex: currentStep,
          studentResponse: responses[currentStep],
          fullContext: previousContext || null,
        }),
      });

      if (!resp.ok || !resp.body) throw new Error("Failed to get feedback");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let feedbackContent = "";
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
              feedbackContent += content;
              const updated = [...feedback];
              updated[currentStep] = feedbackContent;
              setFeedback(updated);
            }
          } catch { /* ignore */ }
        }
      }

    } catch (err) {
      console.error("Feedback error:", err);
      toast.error("Failed to get feedback");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 11) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowSummary(true);
    }
  };

  const prevStep = () => {
    if (showSummary) {
      setShowSummary(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    if (confirm("Reset all responses? This cannot be undone.")) {
      setResponses(new Array(12).fill(""));
      setFeedback(new Array(12).fill(""));
      setCheckedItems(new Array(8).fill(false));
      setCurrentStep(0);
      setShowSummary(false);
      toast.success("Reset complete");
    }
  };

  const copyToClipboard = () => {
    const fullText = responses.filter(r => r).join(" ");
    navigator.clipboard.writeText(fullText).then(() => {
      setCopied(true);
      toast.success("Summary copied!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const wordCount = (text: string) => text.trim() ? text.trim().split(/\s+/).length : 0;
  const currentWordCount = wordCount(responses[currentStep]);
  const totalWordCount = wordCount(responses.join(" "));
  const progress = ((currentStep + 1) / 12) * 100;

  // Auth check
  if (!studentId) {
    return (
      <Card className="border-amber-200 bg-amber-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <Lock className="h-5 w-5" />
            Registration Required
          </CardTitle>
          <CardDescription>
            Please register to use the AWQ Writing Guide. Your progress will be saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => window.location.href = "/auth"}>
            Register / Log In
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Summary view
  if (showSummary) {
    const introText = responses.slice(0, 3).filter(r => r).join(" ");
    const bodyText = responses.slice(3, 11).filter(r => r).join(" ");
    const conclusionText = responses[11] || "";

    return (
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">📋 Your Complete Summary</CardTitle>
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`text-center p-4 rounded-lg font-bold text-lg ${totalWordCount <= 300 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              Total: {totalWordCount} words {totalWordCount <= 300 ? "✅" : "⚠️ Over limit!"}
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h4 className="font-semibold">Preview:</h4>
              <div className="space-y-2 text-sm">
                <p><span className="text-blue-600 font-medium">Introduction:</span> {introText || <em className="text-muted-foreground">Not written</em>}</p>
                <p><span className="text-green-600 font-medium">Body:</span> {bodyText || <em className="text-muted-foreground">Not written</em>}</p>
                <p><span className="text-purple-600 font-medium">Conclusion:</span> {conclusionText || <em className="text-muted-foreground">Not written</em>}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">✅ Checklist</h4>
              {CHECKLIST_ITEMS.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Checkbox 
                    checked={checkedItems[idx]} 
                    onCheckedChange={(checked) => {
                      const newChecked = [...checkedItems];
                      newChecked[idx] = !!checked;
                      setCheckedItems(newChecked);
                    }}
                  />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            <Button onClick={copyToClipboard} className="w-full">
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy Summary to Clipboard"}
            </Button>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Editing
          </Button>
        </div>
      </div>
    );
  }

  // Main step view
  return (
    <div className="space-y-4">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">📝 AWQ Summary Writing Guide</CardTitle>
            <Badge variant="outline">{totalWordCount}/300 words</Badge>
          </div>
          <CardDescription>
            FRT in Schools: Hong et al. (2022) vs. Andrejevic & Selwyn (2020)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-1 text-center">Step {currentStep + 1} of 12</p>
        </CardContent>
      </Card>

      {/* Reference Card */}
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-700">📚 Citation Quick Reference</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="bg-white p-2 rounded">
            <strong className="text-purple-800">Article A:</strong> Hong et al. (2022) — 4 authors, use "et al."
          </div>
          <div className="bg-white p-2 rounded">
            <strong className="text-purple-800">Article B:</strong> Andrejevic and Selwyn (2020) — 2 authors, list both
          </div>
        </CardContent>
      </Card>

      {/* Step Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold">
              {step.number}
            </div>
            <div>
              <Badge variant="secondary" className="mb-1">{step.section}</Badge>
              <CardTitle className="text-base">{step.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Purpose */}
          <Alert className="bg-blue-50 border-blue-200">
            <Target className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Purpose:</strong> {step.purpose}
            </AlertDescription>
          </Alert>

          {/* Excerpt */}
          {step.excerpt && (
            <Alert className="bg-amber-50 border-amber-200">
              <Quote className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-900">
                <strong>Excerpt to Paraphrase:</strong>
                <blockquote className="mt-2 italic border-l-2 border-amber-400 pl-3">
                  "{step.excerpt}"
                </blockquote>
              </AlertDescription>
            </Alert>
          )}

          {/* Paraphrase Direction */}
          <Alert className="bg-green-50 border-green-200">
            <FileText className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Paraphrase Direction:</strong> {step.paraphrase}
            </AlertDescription>
          </Alert>

          {/* Citation */}
          <Alert className="bg-pink-50 border-pink-200">
            <BookOpen className="h-4 w-4 text-pink-600" />
            <AlertDescription className="text-pink-800">
              <strong>Citation:</strong> {step.citation}
              {step.citationCode && (
                <code className="ml-2 bg-pink-200 px-2 py-0.5 rounded text-sm">{step.citationCode}</code>
              )}
            </AlertDescription>
          </Alert>

          {/* Writing Area */}
          <div className="space-y-2">
            <label className="font-medium flex items-center gap-2">
              ✍️ Write your sentence:
              <Badge variant="outline">{currentWordCount} words</Badge>
            </label>
            <Textarea
              value={responses[currentStep]}
              onChange={(e) => updateResponse(e.target.value)}
              placeholder="Type your sentence here..."
              className="min-h-[100px]"
            />
          </div>

          {/* AI Feedback Button */}
          <Button 
            onClick={getAIFeedback} 
            disabled={isLoading || !responses[currentStep].trim()}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Get AI Feedback
          </Button>

          {/* AI Feedback Display */}
          {(feedback[currentStep] || isLoading) && (
            <Card className="bg-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  AI Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feedback[currentStep] ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{feedback[currentStep]}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing your sentence...
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>
        <Button onClick={nextStep}>
          {currentStep === 11 ? "View Summary" : "Next"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
