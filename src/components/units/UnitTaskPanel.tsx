import { useState } from "react";
import { UnitTask } from "@/data/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Lightbulb, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface UnitTaskPanelProps {
  tasks: UnitTask[];
  onComplete?: () => void;
}

export function UnitTaskPanel({ tasks, onComplete }: UnitTaskPanelProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  const currentTask = tasks[currentTaskIndex];
  const isLastTask = currentTaskIndex === tasks.length - 1;

  const handleMCSubmit = () => {
    setShowResult(true);
    if (selectedAnswer === currentTask.correctAnswer) {
      setCompletedTasks(prev => new Set(prev).add(currentTask.id));
    }
  };

  const handleTextSubmit = () => {
    setShowResult(true);
    setCompletedTasks(prev => new Set(prev).add(currentTask.id));
  };

  const handleNext = () => {
    if (isLastTask) {
      onComplete?.();
    } else {
      setCurrentTaskIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setTextAnswer("");
      setShowResult(false);
    }
  };

  const isCorrect = currentTask.type === "mc" && selectedAnswer === currentTask.correctAnswer;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Practice Tasks</h3>
        <div className="flex gap-1">
          {tasks.map((task, idx) => (
            <div
              key={task.id}
              className={cn(
                "w-8 h-2 rounded-full transition-colors",
                idx === currentTaskIndex
                  ? "bg-primary"
                  : completedTasks.has(task.id)
                  ? "bg-green-500"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="w-fit">
              {currentTask.type === "mc" ? "Multiple Choice" : 
               currentTask.type === "short-answer" ? "Short Answer" :
               currentTask.type === "paragraph" ? "Writing Task" :
               "Task"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {currentTaskIndex + 1} / {tasks.length}
            </span>
          </div>
          <CardTitle className="text-lg">{currentTask.question}</CardTitle>
          {currentTask.context && (
            <p className="text-sm text-muted-foreground">{currentTask.context}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* MC Options */}
          {currentTask.type === "mc" && currentTask.options && (
            <div className="space-y-2">
              {currentTask.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => !showResult && setSelectedAnswer(idx)}
                  disabled={showResult}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-all",
                    selectedAnswer === idx
                      ? showResult
                        ? idx === currentTask.correctAnswer
                          ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                          : "border-red-500 bg-red-50 dark:bg-red-950/30"
                        : "border-primary bg-primary/10"
                      : showResult && idx === currentTask.correctAnswer
                      ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium",
                      selectedAnswer === idx
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showResult && idx === currentTask.correctAnswer && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                    {showResult && selectedAnswer === idx && idx !== currentTask.correctAnswer && (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Text Answer */}
          {(currentTask.type === "short-answer" || currentTask.type === "paragraph" || currentTask.type === "sentence") && (
            <div className="space-y-3">
              {currentTask.hints && currentTask.hints.length > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-sm">
                  <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-amber-800 dark:text-amber-200">Hints:</span>
                    <ul className="list-disc list-inside text-amber-700 dark:text-amber-300 mt-1">
                      {currentTask.hints.map((hint, idx) => (
                        <li key={idx}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              <Textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                placeholder="Type your answer here..."
                rows={currentTask.type === "paragraph" ? 6 : 3}
                disabled={showResult}
              />
              {currentTask.wordLimit && (
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Word limit: {currentTask.wordLimit}</span>
                  <span>
                    {textAnswer.trim().split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Result Feedback */}
          {showResult && (
            <Card className={cn(
              "border-2",
              currentTask.type === "mc"
                ? isCorrect
                  ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                  : "border-red-500 bg-red-50 dark:bg-red-950/30"
                : "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
            )}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  {currentTask.type === "mc" ? (
                    isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium mb-1">
                      {currentTask.type === "mc"
                        ? isCorrect
                          ? "Correct!"
                          : "Not quite right"
                        : "Response submitted"}
                    </p>
                    {currentTask.explanation && (
                      <p className="text-sm text-muted-foreground">
                        {currentTask.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            {!showResult ? (
              <Button
                onClick={currentTask.type === "mc" ? handleMCSubmit : handleTextSubmit}
                disabled={
                  (currentTask.type === "mc" && selectedAnswer === null) ||
                  ((currentTask.type === "short-answer" || currentTask.type === "paragraph" || currentTask.type === "sentence") && textAnswer.trim() === "")
                }
              >
                Check Answer
              </Button>
            ) : (
              <Button onClick={handleNext}>
                {isLastTask ? "Complete Unit" : "Next Task"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
