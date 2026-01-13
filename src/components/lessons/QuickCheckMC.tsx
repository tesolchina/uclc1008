import { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickCheckMCProps {
  questionNumber: number;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation?: string;
}

export const QuickCheckMC = ({
  questionNumber,
  question,
  options,
  correctAnswer,
  explanation,
}: QuickCheckMCProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSelect = (label: string) => {
    if (showFeedback) return; // Prevent changing answer after submission
    setSelectedAnswer(label);
    setShowFeedback(true);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className={cn(
      "p-4 rounded-lg space-y-3 transition-colors",
      showFeedback 
        ? isCorrect 
          ? "bg-green-500/10 border border-green-500/30" 
          : "bg-red-500/10 border border-red-500/30"
        : "bg-muted/30"
    )}>
      <p className="font-medium text-sm">{questionNumber}. {question}</p>
      <div className="grid gap-2 text-sm">
        {options.map((option) => {
          const isSelected = selectedAnswer === option.label;
          const isCorrectOption = option.label === correctAnswer;
          
          return (
            <button
              key={option.label}
              onClick={() => handleSelect(option.label)}
              disabled={showFeedback}
              className={cn(
                "flex items-center gap-2 p-2 rounded text-left transition-all",
                !showFeedback && "hover:bg-muted/50 cursor-pointer",
                showFeedback && isCorrectOption && "bg-green-500/20 border border-green-500/50",
                showFeedback && isSelected && !isCorrectOption && "bg-red-500/20 border border-red-500/50",
                showFeedback && !isSelected && !isCorrectOption && "opacity-50",
                showFeedback && "cursor-default"
              )}
            >
              <div className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                !showFeedback && isSelected && "border-primary bg-primary text-primary-foreground",
                !showFeedback && !isSelected && "border-muted-foreground/30",
                showFeedback && isCorrectOption && "border-green-500 bg-green-500 text-white",
                showFeedback && isSelected && !isCorrectOption && "border-red-500 bg-red-500 text-white"
              )}>
                {showFeedback && isCorrectOption && <CheckCircle2 className="h-3 w-3" />}
                {showFeedback && isSelected && !isCorrectOption && <XCircle className="h-3 w-3" />}
                {!showFeedback && option.label}
              </div>
              <span className={cn(
                showFeedback && isCorrectOption && "font-medium text-green-700 dark:text-green-400"
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
          <div>
            <p className={cn(
              "font-medium",
              isCorrect ? "text-green-700 dark:text-green-400" : "text-amber-700 dark:text-amber-400"
            )}>
              {isCorrect ? "Correct!" : `Not quite. The correct answer is ${correctAnswer}.`}
            </p>
            {explanation && (
              <p className="text-muted-foreground mt-1">{explanation}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
