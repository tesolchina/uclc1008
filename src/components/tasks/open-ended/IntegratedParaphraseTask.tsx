import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AiFeedbackHint } from "@/components/api/AiFeedbackHint";
import { 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  PenLine,
  AlertCircle,
  Loader2,
  Target,
  ArrowRight,
  Trophy,
  RefreshCw
} from "lucide-react";

// Comprehensive test paragraphs (longer, requiring all skills)
const TEST_PARAGRAPHS = [
  {
    id: "test1",
    title: "FRT in Educational Security",
    text: "One prominent educational application of facial recognition technology is campus security. This form of facial recognition is most prevalent in the US, where school shooting incidents have prompted school authorities to annually spend $2.7 billion on-campus security products and services.",
    citation: "Andrejevic & Selwyn, 2020",
    focus: "Paraphrase both sentences using multiple strategies, integrate citation appropriately",
    skills: ["synonym", "structure", "voice", "citation"]
  },
  {
    id: "test2",
    title: "Parental Attitudes Toward FRT",
    text: "Parents support the use of face recognition systems in elementary schools due to perceived value and convenience. The research demonstrates that technology significantly impacts education in ways that require careful consideration by all stakeholders.",
    citation: "Hong et al., 2022",
    focus: "Create a coherent paraphrase that captures both ideas without patchwriting",
    skills: ["synonym", "word-form", "structure", "citation"]
  },
  {
    id: "test3",
    title: "Attendance Monitoring Systems",
    text: "Another application of facial recognition in schools is attendance monitoring – promising to put an end to the inevitable gaps and omissions that arise when human teachers are tasked with repeatedly conducting roll-calls of large student groups.",
    citation: "Puthea et al., 2017, as cited in Andrejevic & Selwyn, 2020",
    focus: "Handle secondary citation while applying paraphrasing strategies",
    skills: ["synonym", "structure", "secondary-citation"]
  }
];

interface IntegratedParaphraseTaskProps {
  studentId?: string;
  onComplete?: () => void;
}

interface TaskAttempt {
  paragraphId: string;
  identifiedStrategies: string[];
  paraphrase: string;
  selfAssessment: string;
  aiFeedback: string | null;
  score: number | null;
}

export function IntegratedParaphraseTask({ studentId, onComplete }: IntegratedParaphraseTaskProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paraphrase, setParaphrase] = useState("");
  const [selfAssessment, setSelfAssessment] = useState("");
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [attempts, setAttempts] = useState<TaskAttempt[]>([]);
  const { toast } = useToast();

  const currentParagraph = TEST_PARAGRAPHS[currentIndex];
  const totalParagraphs = TEST_PARAGRAPHS.length;
  const progress = ((currentIndex + (submitted ? 1 : 0)) / totalParagraphs) * 100;

  const handleSubmit = useCallback(async () => {
    if (!paraphrase.trim() || paraphrase.length < 30) {
      toast({
        title: "Paraphrase too short",
        description: "Please write a more complete paraphrase (at least 30 characters).",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const chatUrl = `/api/chat`;
      
      const response = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `You are an expert academic writing assessor. Evaluate this student's paraphrase comprehensively.

ORIGINAL TEXT:
"${currentParagraph.text}" (${currentParagraph.citation})

STUDENT'S PARAPHRASE:
"${paraphrase}"

STUDENT'S SELF-ASSESSMENT:
"${selfAssessment || 'Not provided'}"

TASK FOCUS: ${currentParagraph.focus}

ASSESSMENT PRIORITIES (in order of importance):

1. **MEANING PRESERVATION (Most Critical)**: Does the paraphrase accurately convey the SAME meaning as the original?
   - Are all key ideas present?
   - Is any information distorted, omitted, or incorrectly added?
   - This is the PRIMARY criterion for a successful paraphrase.

2. **Patchwriting Check**: Is the wording sufficiently different from the original? Identify specific phrases that are too similar.

3. **Strategies Applied**: Which paraphrasing strategies (synonyms, word forms, voice, structure) were effectively used?

4. **Citation Accuracy**: Is the citation format correct for APA 7th?

5. **Overall Assessment**: Strong / Acceptable / Needs Improvement

After your assessment, ALWAYS provide:

**IMPROVED VERSION:**
Based on the student's attempt, write an improved paraphrase that:
- Preserves the EXACT meaning of the original text
- Uses clearly different vocabulary and sentence structure
- Demonstrates effective use of multiple paraphrasing strategies
- Includes proper APA citation

**WHY THIS IS BETTER:**
Briefly explain (2-3 sentences) the specific improvements made.

Keep your total response focused and constructive (about 200-250 words).`
          }],
          studentId: studentId || "anonymous",
          meta: {
            weekTitle: "Week 1 Hour 2",
            theme: "Integrated Paraphrase Assessment",
            aiPromptHint: "Primary concern is meaning preservation. Always provide an improved version based on the student's work.",
            mode: "assessment"
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
              if (content) {
                fullText += content;
                setAiFeedback(fullText);
              }
            } catch {}
          }
        }
      }
      
      // Save to database
      if (studentId && fullText) {
        await supabase.from("student_task_responses").insert({
          student_id: studentId,
          question_key: `w1h2-integrated-${currentParagraph.id}`,
          response: JSON.stringify({ paraphrase, selfAssessment }),
          ai_feedback: fullText,
          is_correct: null,
        });
      }
      
      setSubmitted(true);
      setAttempts(prev => [...prev, {
        paragraphId: currentParagraph.id,
        identifiedStrategies: currentParagraph.skills,
        paraphrase,
        selfAssessment,
        aiFeedback: aiFeedback,
        score: null
      }]);
      
    } catch (err) {
      console.error("AI feedback error:", err);
      toast({
        title: "Feedback unavailable",
        description: "Could not get AI feedback. Your work has been saved.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [paraphrase, selfAssessment, currentParagraph, studentId, toast, aiFeedback]);

  const handleNext = () => {
    if (currentIndex < totalParagraphs - 1) {
      setCurrentIndex(prev => prev + 1);
      setParaphrase("");
      setSelfAssessment("");
      setAiFeedback(null);
      setSubmitted(false);
    } else {
      // All done
      toast({
        title: "Assessment Complete! 🎉",
        description: `You completed ${totalParagraphs} integrated paraphrasing tasks.`,
      });
      if (onComplete) onComplete();
    }
  };

  const handleRetry = () => {
    setParaphrase("");
    setSelfAssessment("");
    setAiFeedback(null);
    setSubmitted(false);
  };

  return (
    <Card className="border-2 border-accent/30">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            <CardTitle className="text-base">Integrated Skills Assessment</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {currentIndex + 1} / {totalParagraphs}
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Apply ALL paraphrasing techniques you've learned. This tests your complete understanding.
        </CardDescription>
        <Progress value={progress} className="h-1.5 mt-2" />
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Source Text */}
        <div className="p-4 rounded-lg bg-muted/50 border space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              Source Text: {currentParagraph.title}
            </p>
            <Badge variant="secondary" className="text-xs">
              {currentParagraph.skills.length} skills tested
            </Badge>
          </div>
          <p className="text-sm leading-relaxed">"{currentParagraph.text}"</p>
          <p className="text-xs text-muted-foreground">— {currentParagraph.citation}</p>
        </div>

        {/* Task Focus */}
        <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <p className="text-xs font-medium text-amber-700 flex items-center gap-1">
            <Target className="h-3 w-3" />
            Task Focus
          </p>
          <p className="text-xs text-muted-foreground mt-1">{currentParagraph.focus}</p>
        </div>

        {/* Paraphrase Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <PenLine className="h-4 w-4 text-primary" />
            Your Paraphrase (with citation)
          </label>
          <Textarea
            value={paraphrase}
            onChange={(e) => setParaphrase(e.target.value)}
            placeholder="Write your complete paraphrase here. Remember to:&#10;• Use at least 2-3 paraphrasing strategies&#10;• Change both words AND structure&#10;• Include proper APA citation&#10;• Preserve the original meaning"
            className="min-h-[140px]"
            disabled={submitted}
          />
          <p className="text-xs text-muted-foreground">
            {paraphrase.split(/\s+/).filter(Boolean).length} words
          </p>
        </div>

        {/* Self-Assessment */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Self-Assessment (which strategies did you use?)
          </label>
          <Textarea
            value={selfAssessment}
            onChange={(e) => setSelfAssessment(e.target.value)}
            placeholder="Example: I used synonym replacement (introduced→implemented), changed voice from active to passive, and restructured the sentence to start with..."
            className="min-h-[80px]"
            disabled={submitted}
          />
        </div>

        {/* AI Feedback */}
        {aiFeedback && (
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/30 space-y-2">
            <p className="text-sm font-medium text-accent-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Assessment
            </p>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {aiFeedback}
            </div>
            <p className="text-xs text-amber-600 italic pt-2 border-t">
              ⚠️ AI feedback is for learning purposes. Consult your teacher for authoritative guidance.
            </p>
          </div>
        )}

        {/* API Key Status & Formatting Tips */}
        <AiFeedbackHint className="pt-2 border-t" />

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          {!submitted ? (
            <Button
              onClick={handleSubmit}
              disabled={isLoading || paraphrase.length < 30}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Submit for Assessment
                </>
              )}
            </Button>
          ) : (
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                onClick={handleRetry}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={handleNext}
                className="flex-1"
              >
                {currentIndex < totalParagraphs - 1 ? (
                  <>
                    Next Task
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    <Trophy className="h-4 w-4 mr-2" />
                    Complete
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Progress Summary */}
        {attempts.length > 0 && (
          <div className="p-3 rounded-lg bg-muted/30 border">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Completed: {attempts.length}/{totalParagraphs} tasks
            </p>
            <div className="flex gap-1">
              {TEST_PARAGRAPHS.map((p, idx) => (
                <div
                  key={p.id}
                  className={`h-2 flex-1 rounded-full ${
                    attempts.some(a => a.paragraphId === p.id)
                      ? "bg-green-500"
                      : idx === currentIndex
                      ? "bg-primary/50"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
