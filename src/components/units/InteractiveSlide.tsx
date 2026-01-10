import { useState } from "react";
import { SlideContent, UnitTask, NumberedParagraph } from "@/data/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { NumberedText } from "./NumberedText";
import { cn } from "@/lib/utils";

interface InteractiveSlideProps {
  slide: SlideContent;
  slideIndex: number;
  totalSlides: number;
  task?: UnitTask;
  onTaskComplete?: (taskId: string, isCorrect: boolean) => void;
  onNext: () => void;
  isLastSlide: boolean;
}

export function InteractiveSlide({
  slide,
  slideIndex,
  totalSlides,
  task,
  onTaskComplete,
  onNext,
  isLastSlide,
}: InteractiveSlideProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const isCorrect = task?.type === "mc" 
    ? selectedOption === task.correctAnswer
    : task?.type === "fill-blank"
    ? task.correctAnswer?.toString().toLowerCase().split("|").some(ans => 
        textAnswer.toLowerCase().trim() === ans.toLowerCase().trim()
      )
    : true; // short-answer is always "correct" for progression

  const handleSubmit = () => {
    if (!task) return;
    setIsSubmitted(true);
    onTaskComplete?.(task.id, !!isCorrect);
  };

  const handleContinue = () => {
    // Reset state for next slide
    setSelectedOption(null);
    setTextAnswer("");
    setIsSubmitted(false);
    setShowHint(false);
    onNext();
  };

  return (
    <div className="space-y-4">
      {/* Slide Header */}
      <div className="text-center space-y-2">
        {slide.emoji && (
          <span className="text-4xl block">{slide.emoji}</span>
        )}
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          {slide.heading}
        </h2>
        {slide.subheading && (
          <p className="text-sm text-muted-foreground">
            {slide.subheading}
          </p>
        )}
      </div>

      {/* Points (if any) */}
      {slide.points && slide.points.length > 0 && (
        <Card className="bg-card/50">
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {slide.points.map((point, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <span className="text-primary font-bold">•</span>
                  <span 
                    className="text-foreground"
                    dangerouslySetInnerHTML={{ 
                      __html: point
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-primary">$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    }}
                  />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Numbered Text (article passages) */}
      {slide.numberedText && slide.numberedText.length > 0 && (
        <Card className="bg-muted/30 border-primary/20">
          <CardContent className="pt-4">
            <NumberedText 
              paragraphs={slide.numberedText}
              highlightCitations={true}
              highlightTopicSentences={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Examples */}
      {slide.examples && slide.examples.length > 0 && (
        <div className="grid md:grid-cols-2 gap-3">
          {slide.examples.map((example, idx) => (
            <Card key={idx} className="bg-secondary/20 border-secondary/30">
              <CardContent className="pt-3">
                <p className="text-xs font-semibold text-secondary-foreground mb-1">
                  {example.title}
                </p>
                <p className="text-sm italic text-muted-foreground">
                  "{example.text}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Tip Box */}
      {slide.tip && (
        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-3">
            <div className="flex gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-200 mb-0.5">
                  💡 Key Insight
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {slide.tip}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Section */}
      {task && (
        <Card className={cn(
          "border-2 transition-colors",
          isSubmitted 
            ? isCorrect 
              ? "border-green-500/50 bg-green-50 dark:bg-green-950/20" 
              : "border-orange-500/50 bg-orange-50 dark:bg-orange-950/20"
            : "border-primary/30 bg-primary/5"
        )}>
          <CardContent className="pt-4 space-y-4">
            {/* Task Question */}
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{task.question}</p>
                  {task.context && (
                    <p className="text-xs text-muted-foreground">{task.context}</p>
                  )}
                </div>
              </div>
            </div>

            {/* MC Options */}
            {task.type === "mc" && task.options && (
              <div className="space-y-2">
                {task.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => !isSubmitted && setSelectedOption(idx)}
                    disabled={isSubmitted}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border transition-all text-sm",
                      isSubmitted
                        ? idx === task.correctAnswer
                          ? "border-green-500 bg-green-100 dark:bg-green-900/30"
                          : selectedOption === idx
                          ? "border-red-500 bg-red-100 dark:bg-red-900/30"
                          : "border-border bg-muted/30 opacity-50"
                        : selectedOption === idx
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <span className="font-medium mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                  </button>
                ))}
              </div>
            )}

            {/* Fill-in-blank */}
            {task.type === "fill-blank" && (
              <Input
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your answer..."
                disabled={isSubmitted}
                className={cn(
                  isSubmitted && (isCorrect ? "border-green-500" : "border-orange-500")
                )}
              />
            )}

            {/* Short answer */}
            {task.type === "short-answer" && (
              <div className="space-y-2">
                <Textarea
                  value={textAnswer}
                  onChange={(e) => setTextAnswer(e.target.value)}
                  placeholder="Write your answer..."
                  disabled={isSubmitted}
                  rows={3}
                  className={cn(
                    isSubmitted && "border-green-500"
                  )}
                />
                {task.wordLimit && (
                  <p className="text-xs text-muted-foreground text-right">
                    {textAnswer.split(/\s+/).filter(Boolean).length} / {task.wordLimit} words max
                  </p>
                )}
              </div>
            )}

            {/* Hints */}
            {task.hints && task.hints.length > 0 && !isSubmitted && (
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowHint(!showHint)}
                  className="text-xs"
                >
                  {showHint ? "Hide Hint" : "💡 Need a hint?"}
                </Button>
                {showHint && (
                  <div className="mt-2 p-2 rounded bg-amber-50 dark:bg-amber-950/20 text-xs text-amber-700 dark:text-amber-300">
                    {task.hints.map((hint, idx) => (
                      <p key={idx}>• {hint}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Feedback */}
            {isSubmitted && (
              <div className={cn(
                "p-3 rounded-lg",
                isCorrect 
                  ? "bg-green-100 dark:bg-green-900/30" 
                  : "bg-orange-100 dark:bg-orange-900/30"
              )}>
                <div className="flex items-start gap-2">
                  {isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  )}
                  <div className="space-y-1">
                    <p className={cn(
                      "font-medium text-sm",
                      isCorrect ? "text-green-700 dark:text-green-300" : "text-orange-700 dark:text-orange-300"
                    )}>
                      {isCorrect ? "Correct!" : "Good try!"}
                    </p>
                    {task.explanation && (
                      <p className="text-sm text-muted-foreground">
                        {task.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2">
              {!isSubmitted ? (
                <Button
                  onClick={handleSubmit}
                  disabled={
                    (task.type === "mc" && selectedOption === null) ||
                    ((task.type === "fill-blank" || task.type === "short-answer") && !textAnswer.trim())
                  }
                >
                  Check Answer
                </Button>
              ) : (
                <Button onClick={handleContinue}>
                  {isLastSlide ? "Complete Unit ✓" : "Continue →"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue button if no task */}
      {!task && (
        <div className="flex justify-end pt-2">
          <Button onClick={onNext}>
            {isLastSlide ? "Complete Unit ✓" : "Continue →"}
          </Button>
        </div>
      )}

      {/* Progress indicator */}
      <div className="text-center text-xs text-muted-foreground">
        {slideIndex + 1} of {totalSlides}
      </div>
    </div>
  );
}
