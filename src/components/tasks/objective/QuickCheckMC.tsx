import { useState, useEffect, useCallback, useRef } from "react";
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, StickyNote, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth";
import { toast } from "sonner";

interface QuickCheckMCProps {
  questionNumber: number;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation?: string;
  questionId?: string;
  weekNumber?: number;
  hourNumber?: number;
  enableAiFeedback?: boolean;
}

export const QuickCheckMC = ({
  questionNumber,
  question,
  options,
  correctAnswer,
  explanation,
  questionId,
  weekNumber,
  hourNumber,
  enableAiFeedback = false,
}: QuickCheckMCProps) => {
  const { studentId, isStudent } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState("");
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [isGettingAiFeedback, setIsGettingAiFeedback] = useState(false);
  
  const autoSaveTimer = useRef<NodeJS.Timeout | null>(null);

  const isCorrect = selectedAnswer === correctAnswer;
  
  const baseId = questionId || `q${questionNumber}-${question.slice(0, 20).replace(/\s/g, '-')}`;
  const uniqueQuestionId = weekNumber && hourNumber 
    ? `week${weekNumber}-hour${hourNumber}-${baseId}`
    : baseId;

  // Reset and reload data when studentId changes
  useEffect(() => {
    // Reset state when studentId changes
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAttempts([]);
    setNotes("");
    setSavedNotes("");
    setSaveStatus("idle");
    setAiFeedback("");
    
    if (studentId && isStudent) {
      loadSavedData();
    }
  }, [studentId, isStudent, uniqueQuestionId]);

  // Autosave notes when they change
  useEffect(() => {
    if (!studentId || !isStudent || notes === savedNotes) return;
    
    if (notes.trim() === "") {
      setSaveStatus("idle");
      return;
    }

    setSaveStatus("saving");
    
    if (autoSaveTimer.current) {
      clearTimeout(autoSaveTimer.current);
    }

    autoSaveTimer.current = setTimeout(() => {
      saveResponse(isCorrect && showFeedback, attempts);
    }, 1500);

    return () => {
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [notes, savedNotes, studentId, isStudent]);

  const loadSavedData = async () => {
    if (!studentId) return;
    
    try {
      // First, try to find data with the new format key
      let { data } = await supabase
        .from('student_task_responses')
        .select('response, ai_feedback, question_key')
        .eq('student_id', studentId)
        .eq('question_key', uniqueQuestionId)
        .maybeSingle();
      
      // If not found, try to find old format data by searching responses that match this question
      if (!data) {
        // Generate old format key pattern (q1-First-words-of-question)
        const oldFormatKey = `q${questionNumber}-${question.slice(0, 20).replace(/\s/g, '-')}`;
        
        const { data: oldData } = await supabase
          .from('student_task_responses')
          .select('response, ai_feedback, question_key')
          .eq('student_id', studentId)
          .ilike('question_key', `${oldFormatKey.substring(0, 15)}%`);
        
        // Find a match by comparing the question text stored in the response
        if (oldData && oldData.length > 0) {
          for (const record of oldData) {
            try {
              const responseData = JSON.parse(record.response as string);
              if (responseData.question) {
                const storedQ = responseData.question.toLowerCase().trim().replace(/\s+/g, ' ');
                const currentQ = question.toLowerCase().trim().replace(/\s+/g, ' ');
                if (storedQ === currentQ || 
                    (storedQ.length > 30 && currentQ.length > 30 && 
                     storedQ.substring(0, 50) === currentQ.substring(0, 50))) {
                  data = record;
                  break;
                }
              }
            } catch {}
          }
        }
      }
      
      if (data) {
        try {
          const responseData = JSON.parse(data.response as string) as { notes?: string; attempts?: string[]; isCorrect?: boolean };
          if (responseData.notes) {
            setNotes(responseData.notes);
            setSavedNotes(responseData.notes);
            setSaveStatus("saved");
          }
          if (responseData.attempts) setAttempts(responseData.attempts);
          if (responseData.isCorrect) {
            setSelectedAnswer(correctAnswer);
            setShowFeedback(true);
          }
        } catch {}
        if (data.ai_feedback) {
          setAiFeedback(data.ai_feedback);
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const handleSelect = (label: string) => {
    if (showFeedback && isCorrect) return;
    
    setSelectedAnswer(label);
    setShowFeedback(true);
    
    const newAttempts = [...attempts, label];
    setAttempts(newAttempts);
    
    if (studentId && isStudent) {
      saveResponse(label === correctAnswer, newAttempts);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const saveResponse = useCallback(async (correct: boolean, attemptsList: string[]) => {
    if (!studentId) return;
    
    try {
      const responseData = JSON.stringify({
        notes,
        attempts: attemptsList,
        isCorrect: correct,
        lastAttempt: new Date().toISOString(),
        weekNumber,
        hourNumber,
        question,
      });

      const { data: existing } = await supabase
        .from('student_task_responses')
        .select('id')
        .eq('student_id', studentId)
        .eq('question_key', uniqueQuestionId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('student_task_responses')
          .update({
            response: responseData,
            is_correct: correct,
            score: correct ? 1 : 0,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('student_task_responses')
          .insert({
            student_id: studentId,
            question_key: uniqueQuestionId,
            response: responseData,
            is_correct: correct,
            score: correct ? 1 : 0,
          });
      }
      
      setSavedNotes(notes);
      setSaveStatus("saved");
    } catch (error) {
      console.error('Error saving response:', error);
      setSaveStatus("idle");
    }
  }, [studentId, uniqueQuestionId, notes, weekNumber, hourNumber, question]);

  const handleGetAiFeedback = async () => {
    if (!studentId || !isCorrect) return;
    
    setIsGettingAiFeedback(true);
    try {
      const response = await supabase.functions.invoke("chat", {
        body: {
          messages: [
            {
              role: "user",
              content: `You are a brief, encouraging academic tutor. A student correctly answered this question:

Question: ${question}
Correct answer: ${correctAnswer}) ${options.find(o => o.label === correctAnswer)?.text}
Student's attempts: ${attempts.join(' → ')}

Give a 1-2 sentence response: affirm their answer and add one quick insight about why this is correct or what they should remember.`,
            },
          ],
          studentId,
          meta: { taskKey: uniqueQuestionId, type: "mc-feedback" },
        },
      });

      let feedback = "";
      if (response.data) {
        const reader = response.data?.getReader?.();
        if (reader) {
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
                  const delta = json.choices?.[0]?.delta?.content;
                  if (delta) feedback += delta;
                } catch {}
              }
            }
          }
        } else if (typeof response.data === "string") {
          feedback = response.data;
        }
      }

      if (feedback) {
        setAiFeedback(feedback);
        // Save feedback to database
        await supabase
          .from("student_task_responses")
          .update({ ai_feedback: feedback })
          .eq("student_id", studentId)
          .eq("question_key", uniqueQuestionId);
      }
    } catch (err) {
      console.error("Error getting AI feedback:", err);
      toast.error("Couldn't get AI feedback");
    } finally {
      setIsGettingAiFeedback(false);
    }
  };

  return (
    <div className={cn(
      "p-4 rounded-lg space-y-3 transition-colors",
      showFeedback 
        ? isCorrect 
          ? "bg-green-500/10 border border-green-500/30" 
          : "bg-amber-500/10 border border-amber-500/30"
        : "bg-muted/30"
    )}>
      <p className="font-medium text-sm">{questionNumber}. {question}</p>
      
      {attempts.length > 0 && !isCorrect && (
        <p className="text-xs text-muted-foreground">
          Attempts: {attempts.length}
        </p>
      )}
      
      <div className="grid gap-2 text-sm">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.label;
          const isCorrectOption = option.label === correctAnswer;
          const wasAttempted = attempts.includes(option.label);
          
          return (
            <button
              key={option.label}
              onClick={() => handleSelect(option.label)}
              disabled={showFeedback && isCorrect}
              className={cn(
                "flex items-center gap-2 p-2 rounded text-left transition-all",
                !showFeedback && "hover:bg-muted/50 cursor-pointer",
                showFeedback && isCorrect && isCorrectOption && "bg-green-500/20 border border-green-500/50",
                showFeedback && isSelected && !isCorrect && "bg-red-500/20 border border-red-500/50",
                !showFeedback && wasAttempted && "opacity-60 bg-red-500/5",
                showFeedback && isCorrect && "cursor-default"
              )}
            >
              <div className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                !showFeedback && isSelected && "border-primary bg-primary text-primary-foreground",
                !showFeedback && !isSelected && "border-muted-foreground/30",
                showFeedback && isCorrect && isCorrectOption && "border-green-500 bg-green-500 text-white",
                showFeedback && isSelected && !isCorrect && "border-red-500 bg-red-500 text-white"
              )}>
                {showFeedback && isCorrect && isCorrectOption && <CheckCircle2 className="h-3 w-3" />}
                {showFeedback && isSelected && !isCorrect && <XCircle className="h-3 w-3" />}
                {(!showFeedback || (!isCorrect && !isSelected)) && option.label}
              </div>
              <span className={cn(
                showFeedback && isCorrect && isCorrectOption && "font-medium text-green-700 dark:text-green-400"
              )}>
                {option.label}) {option.text}
              </span>
            </button>
          );
        })}
      </div>
      
      {showFeedback && (
        <div className={cn(
          "flex items-start gap-2 p-3 rounded-lg text-sm",
          isCorrect ? "bg-green-500/20" : "bg-amber-500/20"
        )}>
          {isCorrect ? (
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
          ) : (
            <HelpCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className={cn(
              "font-medium",
              isCorrect ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"
            )}>
              {isCorrect ? "Correct!" : "Not quite. Think about it and try again!"}
            </p>
            {isCorrect && explanation && (
              <p className="text-muted-foreground mt-1">{explanation}</p>
            )}
            {!isCorrect && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleTryAgain}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      )}

      {/* AI Feedback Section */}
      {showFeedback && isCorrect && enableAiFeedback && (
        <div className="space-y-2">
          {aiFeedback ? (
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-center gap-2 text-xs font-medium text-purple-700 dark:text-purple-400 mb-1">
                <Sparkles className="h-3 w-3" />
                AI Tutor Insight
              </div>
              <p className="text-sm text-muted-foreground">{aiFeedback}</p>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handleGetAiFeedback}
              disabled={isGettingAiFeedback}
              className="gap-1"
            >
              {isGettingAiFeedback ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Getting insight...
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3" />
                  Get AI insight
                </>
              )}
            </Button>
          )}
        </div>
      )}

      {/* Notes Section */}
      <Collapsible open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
            <StickyNote className="h-4 w-4 mr-2" />
            {isNotesOpen ? "Hide Notes" : "Add Notes"}
            {savedNotes && !isNotesOpen && (
              <span className="ml-2 text-xs bg-green-500/20 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Saved
              </span>
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <Textarea
            placeholder="Write your notes here... (e.g., why you chose this answer, what you learned)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px] text-sm"
          />
          <div className="flex items-center justify-between">
            {isStudent ? (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {saveStatus === "saving" && (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Saved automatically
                  </>
                )}
                {saveStatus === "idle" && notes.trim() === "" && "Notes save automatically"}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Log in as a student to save your notes
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
