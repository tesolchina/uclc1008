import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AiFeedbackHint } from "@/components/api/AiFeedbackHint";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Lightbulb, 
  Sparkles, 
  BookOpen, 
  PenLine,
  AlertCircle,
  RotateCcw,
  Loader2
} from "lucide-react";

// Source sentences for paraphrasing practice
const SOURCE_SENTENCES = [
  {
    id: "sent1",
    text: "Facial recognition technology is now being introduced across various aspects of public life.",
    citation: "Andrejevic & Selwyn, 2020",
    keywords: ["facial recognition", "introduced", "public life", "various aspects"],
    difficulty: "beginner"
  },
  {
    id: "sent2",
    text: "The research demonstrates that technology significantly impacts education in ways that require careful consideration.",
    citation: "Hong et al., 2022",
    keywords: ["research", "technology", "impacts", "education", "consideration"],
    difficulty: "beginner"
  },
  {
    id: "sent3",
    text: "Parents support the use of face recognition systems in elementary schools due to perceived value and convenience.",
    citation: "Hong et al., 2022",
    keywords: ["parents", "support", "face recognition", "elementary schools", "perceived value", "convenience"],
    difficulty: "intermediate"
  }
];

const PARAPHRASING_STRATEGIES = [
  { id: "synonyms", label: "Synonym Replacement", description: "Replace words with similar meanings" },
  { id: "word-forms", label: "Word Form Changes", description: "Change verb → noun, adjective → adverb" },
  { id: "voice", label: "Active ↔ Passive Voice", description: "Change sentence voice" },
  { id: "structure", label: "Sentence Structure", description: "Reorder or restructure the sentence" },
];

const STEPS = [
  { id: 1, title: "Understand", icon: BookOpen, description: "What's the main idea?" },
  { id: 2, title: "Plan", icon: Lightbulb, description: "Choose strategies" },
  { id: 3, title: "Draft", icon: PenLine, description: "Write your paraphrase" },
  { id: 4, title: "Cite", icon: CheckCircle2, description: "Add citation" },
  { id: 5, title: "Check", icon: Sparkles, description: "Review with AI" },
];

interface ParaphraseCoachProps {
  studentId?: string;
  onComplete?: (sentenceId: string, data: ParaphraseAttempt) => void;
}

interface ParaphraseAttempt {
  sentenceId: string;
  understanding: string;
  strategies: string[];
  draft: string;
  citationStyle: "author-prominent" | "info-prominent";
  finalVersion: string;
  aiFeedback: string;
  similarity?: number;
}

export function ParaphraseCoach({ studentId, onComplete }: ParaphraseCoachProps) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [understanding, setUnderstanding] = useState("");
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [citationStyle, setCitationStyle] = useState<"author-prominent" | "info-prominent" | null>(null);
  const [finalVersion, setFinalVersion] = useState("");
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [similarity, setSimilarity] = useState<number | null>(null);
  const [completedSentences, setCompletedSentences] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const currentSentence = SOURCE_SENTENCES[currentSentenceIndex];
  const progress = (currentStep / 5) * 100;

  // Get AI hint for current step
  const getAIHint = useCallback(async () => {
    setIsLoading(true);
    setAiHint(null);
    
    try {
      const stepContext = {
        1: `The student is trying to understand this sentence: "${currentSentence.text}". They wrote: "${understanding}". Give a brief Socratic hint (1-2 sentences) to help them identify the main idea. Don't give the answer directly.`,
        2: `The student is choosing paraphrasing strategies for: "${currentSentence.text}". They selected: ${selectedStrategies.join(", ") || "none yet"}. Give a brief hint about which strategies might work well for this sentence.`,
        3: `Original: "${currentSentence.text}". Student's paraphrase draft: "${draft}". 

YOUR PRIMARY CONCERN: Does this paraphrase RETAIN THE ORIGINAL MEANING accurately?

Give brief feedback (3-4 sentences):
1. First, assess meaning preservation - does the paraphrase say the same thing as the original?
2. Then check for patchwriting - is it too close to the original in wording?
3. Identify specific words/phrases that need changing.`,
        4: `The student is adding a citation. Source: ${currentSentence.citation}. Help them understand when to use author-prominent vs info-prominent citations. Keep it to 1-2 sentences.`,
        5: `Original: "${currentSentence.text}". 
Student's paraphrase: "${finalVersion}"
Source: ${currentSentence.citation}

ASSESSMENT PRIORITIES (in order of importance):
1. **MEANING PRESERVATION (Most Important)**: Does the paraphrase accurately convey the SAME meaning as the original? Are there any meaning distortions, additions, or omissions?
2. **Patchwriting Check**: Is the wording sufficiently different from the original? Identify any phrases that are too similar.
3. **Citation Accuracy**: Is the citation correctly formatted?

After your feedback, ALWAYS provide:
**IMPROVED VERSION:**
Write an improved paraphrase based on the student's work that:
- Preserves the exact meaning of the original
- Uses different vocabulary and structure
- Maintains proper citation

Be constructive and explain WHY your version is an improvement.`,
      };

      const chatUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      
      const response = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [{ role: "user", content: stepContext[currentStep as keyof typeof stepContext] }],
          studentId: studentId || "anonymous",
          meta: {
            weekTitle: "Week 1 Hour 2",
            theme: "Paraphrasing Practice",
            aiPromptHint: "You are an expert academic writing tutor. Your PRIMARY concern is whether the paraphrase retains the original meaning accurately. Secondary concerns are patchwriting and citation. For Step 5, always provide an improved version based on the student's work.",
            mode: "paraphrase-coach"
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Handle streaming response
      const reader = response.body.getReader();
      let fullText = "";
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const json = JSON.parse(line.slice(6));
              const content = json.choices?.[0]?.delta?.content;
              if (content) fullText += content;
            } catch {}
          }
        }
      }
      
      if (currentStep === 5) {
        setAiFeedback(fullText.trim() || "Feedback not available.");
        // Calculate simple similarity
        const simScore = calculateSimilarity(currentSentence.text, finalVersion);
        setSimilarity(simScore);
      } else {
        setAiHint(fullText.trim() || "No hint available.");
      }
    } catch (err) {
      console.error("AI hint error:", err);
      toast({
        title: "Hint unavailable",
        description: "Could not get AI guidance. Please continue with your work.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentSentence, currentStep, understanding, selectedStrategies, draft, finalVersion, studentId, toast]);

  // Calculate text similarity (simple word overlap)
  const calculateSimilarity = (original: string, paraphrase: string): number => {
    const originalWords = original.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const paraphraseWords = paraphrase.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    
    let matches = 0;
    for (const word of originalWords) {
      if (paraphraseWords.includes(word)) matches++;
    }
    
    return Math.round((matches / originalWords.length) * 100);
  };

  const handleStrategyToggle = (strategyId: string) => {
    setSelectedStrategies(prev => 
      prev.includes(strategyId) 
        ? prev.filter(s => s !== strategyId)
        : [...prev, strategyId]
    );
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1: return understanding.trim().length >= 10;
      case 2: return selectedStrategies.length >= 2;
      case 3: return draft.trim().length >= 15;
      case 4: return citationStyle !== null;
      case 5: return finalVersion.trim().length >= 15;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      // Auto-fill final version from draft + citation on step 4→5
      if (currentStep === 4 && !finalVersion) {
        const citation = currentSentence.citation;
        if (citationStyle === "author-prominent") {
          setFinalVersion(`${citation.split(",")[0]} (${citation.split(", ")[1]}) ${draft.charAt(0).toLowerCase()}${draft.slice(1)}`);
        } else {
          setFinalVersion(`${draft} (${citation}).`);
        }
      }
      setCurrentStep(prev => prev + 1);
      setAiHint(null);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setAiHint(null);
    }
  };

  const handleComplete = async () => {
    // Save to database
    if (studentId) {
      try {
        await supabase.from("student_task_responses").insert({
          student_id: studentId,
          task_id: `paraphrase-${currentSentence.id}`,
          response: JSON.stringify({
            understanding,
            strategies: selectedStrategies,
            draft,
            citationStyle,
            finalVersion
          }),
          ai_feedback: aiFeedback,
          is_correct: similarity !== null && similarity < 50,
        });
      } catch (err) {
        console.error("Save error:", err);
      }
    }

    // Mark as completed
    setCompletedSentences(prev => new Set([...prev, currentSentence.id]));
    
    if (onComplete) {
      onComplete(currentSentence.id, {
        sentenceId: currentSentence.id,
        understanding,
        strategies: selectedStrategies,
        draft,
        citationStyle: citationStyle!,
        finalVersion,
        aiFeedback: aiFeedback || "",
        similarity: similarity ?? undefined
      });
    }

    toast({
      title: "Practice completed! 🎉",
      description: "Great work on your paraphrasing practice.",
    });
  };

  const handleReset = () => {
    setCurrentStep(1);
    setUnderstanding("");
    setSelectedStrategies([]);
    setDraft("");
    setCitationStyle(null);
    setFinalVersion("");
    setAiFeedback(null);
    setAiHint(null);
    setSimilarity(null);
  };

  const handleNextSentence = () => {
    if (currentSentenceIndex < SOURCE_SENTENCES.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
      handleReset();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Original Sentence:</p>
              <p className="text-sm leading-relaxed">"{currentSentence.text}"</p>
              <p className="text-xs text-muted-foreground mt-2">— {currentSentence.citation}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">
                💭 In your own words, what is the main idea of this sentence?
              </label>
              <p className="text-xs text-muted-foreground mb-2">Don't paraphrase yet — just explain what it means.</p>
              <Textarea
                value={understanding}
                onChange={(e) => setUnderstanding(e.target.value)}
                placeholder="The sentence is saying that..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Original:</p>
              <p className="text-sm">"{currentSentence.text}"</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">🎯 Select at least 2 strategies you'll use:</label>
              <p className="text-xs text-muted-foreground mb-3">Check the boxes for strategies you plan to apply.</p>
              
              <div className="space-y-3">
                {PARAPHRASING_STRATEGIES.map(strategy => (
                  <div 
                    key={strategy.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedStrategies.includes(strategy.id) 
                        ? "bg-primary/10 border-primary/40" 
                        : "bg-background hover:bg-muted/50"
                    }`}
                    onClick={() => handleStrategyToggle(strategy.id)}
                  >
                    <Checkbox 
                      checked={selectedStrategies.includes(strategy.id)}
                      onCheckedChange={() => handleStrategyToggle(strategy.id)}
                    />
                    <div>
                      <p className="text-sm font-medium">{strategy.label}</p>
                      <p className="text-xs text-muted-foreground">{strategy.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {selectedStrategies.length > 0 && (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs font-medium text-primary mb-1">Keywords to change:</p>
                <div className="flex flex-wrap gap-1">
                  {currentSentence.keywords.map(kw => (
                    <Badge key={kw} variant="secondary" className="text-xs">{kw}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Original:</p>
                <p className="text-sm">"{currentSentence.text}"</p>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs font-medium text-primary mb-2">Your strategies:</p>
                <div className="flex flex-wrap gap-1">
                  {selectedStrategies.map(s => (
                    <Badge key={s} variant="outline" className="text-xs">
                      {PARAPHRASING_STRATEGIES.find(st => st.id === s)?.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">✍️ Write your paraphrase (don't add citation yet):</label>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Rewrite the sentence using your selected strategies..."
                className="min-h-[120px] mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {draft.length > 0 && `${draft.split(/\s+/).length} words`}
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50 border">
              <p className="text-xs font-medium text-muted-foreground mb-2">Your paraphrase:</p>
              <p className="text-sm">"{draft}"</p>
            </div>
            
            <div>
              <label className="text-sm font-medium">📚 Choose your citation style:</label>
              <p className="text-xs text-muted-foreground mb-3">Source: {currentSentence.citation}</p>
              
              <div className="grid gap-3">
                <div 
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    citationStyle === "author-prominent" 
                      ? "bg-primary/10 border-primary/40" 
                      : "bg-background hover:bg-muted/50"
                  }`}
                  onClick={() => setCitationStyle("author-prominent")}
                >
                  <p className="text-sm font-medium">Author-Prominent (Narrative)</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Example: <span className="font-mono">{currentSentence.citation.split(",")[0]} ({currentSentence.citation.split(", ")[1]}) argues that...</span>
                  </p>
                </div>
                
                <div 
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    citationStyle === "info-prominent" 
                      ? "bg-primary/10 border-primary/40" 
                      : "bg-background hover:bg-muted/50"
                  }`}
                  onClick={() => setCitationStyle("info-prominent")}
                >
                  <p className="text-sm font-medium">Information-Prominent (Parenthetical)</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Example: <span className="font-mono">...your paraphrase ({currentSentence.citation}).</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Original:</p>
                <p className="text-sm">"{currentSentence.text}"</p>
                <p className="text-xs text-muted-foreground mt-1">— {currentSentence.citation}</p>
              </div>
              
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-xs font-medium text-primary mb-2">Your Final Version:</p>
                <Textarea
                  value={finalVersion}
                  onChange={(e) => setFinalVersion(e.target.value)}
                  placeholder="Edit your final paraphrase with citation..."
                  className="min-h-[80px] bg-background"
                />
              </div>
            </div>
            
            {similarity !== null && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Text Similarity:</span>
                  <span className={similarity > 50 ? "text-destructive font-medium" : "text-green-600 font-medium"}>
                    {similarity}% overlap
                  </span>
                </div>
                <Progress 
                  value={similarity} 
                  className={`h-2 ${similarity > 50 ? "[&>div]:bg-destructive" : "[&>div]:bg-green-500"}`}
                />
                <p className="text-xs text-muted-foreground">
                  {similarity > 50 
                    ? "⚠️ High similarity — this may be patchwriting. Try changing more words/structure."
                    : "✅ Good job! Your paraphrase shows significant rewording."}
                </p>
              </div>
            )}
            
            {aiFeedback && (
              <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                <p className="text-xs font-medium text-accent flex items-center gap-1 mb-2">
                  <Sparkles className="h-3 w-3" />
                  AI Feedback
                </p>
                <p className="text-sm text-muted-foreground">{aiFeedback}</p>
                <p className="text-xs text-amber-600 mt-2 italic">
                  ⚠️ AI feedback may contain errors. Consult your teacher for guidance.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Paraphrasing Coach</CardTitle>
              <p className="text-xs text-muted-foreground">Step-by-step guided practice</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Sentence {currentSentenceIndex + 1}/{SOURCE_SENTENCES.length}
            </Badge>
            {completedSentences.has(currentSentence.id) && (
              <Badge className="bg-green-500/10 text-green-600 text-xs">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>
        
        {/* Progress steps */}
        <div className="flex items-center gap-1 mt-4">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            
            return (
              <div key={step.id} className="flex items-center flex-1">
                <div 
                  className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-medium transition-colors ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : isCompleted 
                        ? "bg-primary/20 text-primary" 
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-1 ${isCompleted ? "bg-primary/40" : "bg-muted"}`} />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1 px-1">
          {STEPS.map(step => (
            <span key={step.id} className={step.id === currentStep ? "text-primary font-medium" : ""}>
              {step.title}
            </span>
          ))}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {renderStepContent()}
        
        {/* AI Hint */}
        {aiHint && (
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/30">
            <p className="text-xs font-medium text-accent flex items-center gap-1 mb-1">
              <Lightbulb className="h-3 w-3" />
              AI Hint
            </p>
            <p className="text-sm text-muted-foreground">{aiHint}</p>
          </div>
        )}
        
        {/* API Key Status & Formatting Tips */}
        <AiFeedbackHint />
        
        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={getAIHint}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Lightbulb className="h-4 w-4 mr-1" />
              )}
              Get Hint
            </Button>
            
            {currentStep < 5 ? (
              <Button 
                size="sm" 
                onClick={handleNext}
                disabled={!canProceed()}
              >
                Next
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button 
                size="sm" 
                onClick={aiFeedback ? handleComplete : getAIHint}
                disabled={!canProceed() || isLoading}
              >
                {aiFeedback ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Complete
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Get Final Feedback
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        {/* Next sentence button */}
        {completedSentences.has(currentSentence.id) && currentSentenceIndex < SOURCE_SENTENCES.length - 1 && (
          <div className="pt-4 border-t text-center">
            <Button variant="outline" onClick={handleNextSentence}>
              Practice Next Sentence
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
        
        <p className="text-xs text-center text-muted-foreground">
          ⚠️ AI may make errors. Always verify with your teacher.
        </p>
      </CardContent>
    </Card>
  );
}
