import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, HelpCircle, RotateCcw, StickyNote, Save } from "lucide-react";
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
  questionId?: string; // Unique ID for saving responses
  weekNumber?: number;
  hourNumber?: number;
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
}: QuickCheckMCProps) => {
  const { studentId, isStudent } = useAuth();
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [attempts, setAttempts] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isCorrect = selectedAnswer === correctAnswer;
  
  // Include week/hour in the question key for linking back from teacher dashboard
  const baseId = questionId || `q${questionNumber}-${question.slice(0, 20).replace(/\s/g, '-')}`;
  const uniqueQuestionId = weekNumber && hourNumber 
    ? `week${weekNumber}-hour${hourNumber}-${baseId}`
    : baseId;

  // Load saved notes on mount
  useEffect(() => {
    if (studentId && isStudent) {
      loadSavedData();
    }
  }, [studentId, isStudent]);

  const loadSavedData = async () => {
    if (!studentId) return;
    
    try {
      const { data } = await supabase
        .from('student_task_responses')
        .select('response, ai_feedback')
        .eq('student_id', studentId)
        .eq('question_key', uniqueQuestionId)
        .maybeSingle();
      
      if (data) {
        try {
          const responseData = JSON.parse(data.response as string) as { notes?: string; attempts?: string[]; isCorrect?: boolean };
          if (responseData.notes) setNotes(responseData.notes);
          if (responseData.attempts) setAttempts(responseData.attempts);
          if (responseData.isCorrect) {
            setSelectedAnswer(correctAnswer);
            setShowFeedback(true);
          }
        } catch {
          // Response might not be JSON
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const handleSelect = (label: string) => {
    if (showFeedback && isCorrect) return; // Only prevent if already correct
    
    setSelectedAnswer(label);
    setShowFeedback(true);
    
    const newAttempts = [...attempts, label];
    setAttempts(newAttempts);
    
    // Auto-save attempt
    if (studentId && isStudent) {
      saveResponse(label === correctAnswer, newAttempts);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const saveResponse = async (correct: boolean, attemptsList: string[]) => {
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

      // Check if record exists
      const { data: existing } = await supabase
        .from('student_task_responses')
        .select('id')
        .eq('student_id', studentId)
        .eq('question_key', uniqueQuestionId)
        .maybeSingle();

      if (existing) {
        // Update existing record
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
        // Insert new record
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
    } catch (error) {
      console.error('Error saving response:', error);
    }
  };

  const handleSaveNotes = async () => {
    if (!studentId) {
      toast.error('Please log in to save notes');
      return;
    }
    
    setIsSaving(true);
    try {
      await saveResponse(isCorrect && showFeedback, attempts);
      toast.success('Notes saved!');
    } catch (error) {
      toast.error('Failed to save notes');
    } finally {
      setIsSaving(false);
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
                // Only show green for correct when answered correctly
                showFeedback && isCorrect && isCorrectOption && "bg-green-500/20 border border-green-500/50",
                // Show red for currently wrong answer
                showFeedback && isSelected && !isCorrect && "bg-red-500/20 border border-red-500/50",
                // Dim previously tried wrong answers
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

      {/* Notes Section */}
      <Collapsible open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground">
            <StickyNote className="h-4 w-4 mr-2" />
            {isNotesOpen ? "Hide Notes" : "Add Notes"}
            {notes && !isNotesOpen && <span className="ml-2 text-xs bg-primary/10 px-1.5 py-0.5 rounded">Saved</span>}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2 space-y-2">
          <Textarea
            placeholder="Write your notes here... (e.g., why you chose this answer, what you learned)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[80px] text-sm"
          />
          <div className="flex justify-end">
            <Button 
              size="sm" 
              onClick={handleSaveNotes}
              disabled={isSaving || !isStudent}
            >
              <Save className="h-3 w-3 mr-1" />
              {isSaving ? "Saving..." : "Save Notes"}
            </Button>
          </div>
          {!isStudent && (
            <p className="text-xs text-muted-foreground">
              Log in as a student to save your notes
            </p>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
