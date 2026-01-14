import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface ObjectiveTaskProps {
  id: string;
  type: "mc" | "true-false" | "fill-blank";
  question: string;
  context?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation?: string;
  hints?: string[];
  onComplete?: (isCorrect: boolean, response: string) => void;
}

export function ObjectiveTask({
  id,
  type,
  question,
  context,
  options,
  correctAnswer,
  explanation,
  hints,
  onComplete,
}: ObjectiveTaskProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = type === "mc" || type === "true-false"
    ? selectedAnswer === String(correctAnswer)
    : selectedAnswer.toLowerCase().trim() === String(correctAnswer).toLowerCase().trim();

  const handleSubmit = () => {
    setSubmitted(true);
    onComplete?.(isCorrect, selectedAnswer);
  };

  const handleRetry = () => {
    setSelectedAnswer("");
    setSubmitted(false);
    setShowHint(false);
  };

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      {/* Question */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm">{question}</p>
          {hints && hints.length > 0 && !submitted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHint(!showHint)}
              className="shrink-0 h-7 px-2 text-xs"
            >
              <Lightbulb className="h-3.5 w-3.5 mr-1" />
              Hint
            </Button>
          )}
        </div>
        {context && (
          <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">{context}</p>
        )}
        {showHint && hints && (
          <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded border border-amber-200">
            💡 {hints[0]}
          </p>
        )}
      </div>

      {/* Answer Input */}
      {type === "mc" && options && (
        <RadioGroup
          value={selectedAnswer}
          onValueChange={setSelectedAnswer}
          disabled={submitted}
          className="space-y-2"
        >
          {options.map((option, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center space-x-2 p-2 rounded-md border transition-colors",
                submitted && isCorrect && idx === correctAnswer && "bg-green-50 border-green-300",
                submitted && selectedAnswer === String(idx) && !isCorrect && "bg-red-50 border-red-300",
                !submitted && selectedAnswer === String(idx) && "bg-primary/5 border-primary/30"
              )}
            >
              <RadioGroupItem value={String(idx)} id={`${id}-${idx}`} />
              <Label htmlFor={`${id}-${idx}`} className="text-sm cursor-pointer flex-1">
                {option}
              </Label>
              {submitted && isCorrect && idx === correctAnswer && (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              )}
              {submitted && selectedAnswer === String(idx) && !isCorrect && (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>
      )}

      {type === "true-false" && (
        <RadioGroup
          value={selectedAnswer}
          onValueChange={setSelectedAnswer}
          disabled={submitted}
          className="flex gap-4"
        >
          {["true", "false"].map((option) => (
            <div
              key={option}
              className={cn(
                "flex items-center space-x-2 p-3 rounded-md border transition-colors flex-1",
                submitted && isCorrect && option === correctAnswer && "bg-green-50 border-green-300",
                submitted && selectedAnswer === option && !isCorrect && "bg-red-50 border-red-300",
                !submitted && selectedAnswer === option && "bg-primary/5 border-primary/30"
              )}
            >
              <RadioGroupItem value={option} id={`${id}-${option}`} />
              <Label htmlFor={`${id}-${option}`} className="text-sm cursor-pointer capitalize">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {type === "fill-blank" && (
        <div className="space-y-2">
          <Input
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            disabled={submitted}
            placeholder="Type your answer..."
            className={cn(
              submitted && isCorrect && "border-green-500 bg-green-50",
              submitted && !isCorrect && "border-red-500 bg-red-50"
            )}
          />
          {submitted && !isCorrect && (
            <p className="text-xs text-muted-foreground">
              Correct answer: <span className="font-medium text-green-600">{correctAnswer}</span>
            </p>
          )}
        </div>
      )}

      {/* Feedback */}
      {submitted && (
        <div className={cn(
          "p-3 rounded-md text-sm",
          isCorrect ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"
        )}>
          <div className="flex items-center gap-2 mb-1">
            {isCorrect ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-700">Correct!</span>
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-amber-700">Not quite right</span>
              </>
            )}
          </div>
          {isCorrect && explanation && <p className="text-muted-foreground">{explanation}</p>}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer}
            size="sm"
          >
            Check Answer
          </Button>
        ) : (
          <Button
            onClick={handleRetry}
            variant="outline"
            size="sm"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}