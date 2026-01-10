import { useState, useMemo } from "react";
import { LearningUnit } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, BookOpen, RotateCcw, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { InteractiveSlide } from "./InteractiveSlide";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface InteractiveUnitViewerProps {
  unit: LearningUnit;
  defaultOpen?: boolean;
}

export function InteractiveUnitViewer({ unit, defaultOpen = false }: InteractiveUnitViewerProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  const [isComplete, setIsComplete] = useState(false);

  // Map slides to tasks - each slide may have a corresponding task
  const slideTaskMap = useMemo(() => {
    const map: Record<number, typeof unit.tasks[0] | undefined> = {};
    
    // Distribute tasks across slides (after content slides)
    // For this design, we interleave: content slide -> task slide
    // Tasks follow slides that introduce the concept
    const taskSlideIndices = [1, 2, 5, 8, 10, 12]; // Indices where tasks appear
    
    unit.tasks.forEach((task, idx) => {
      const slideIdx = taskSlideIndices[idx] ?? (idx + 1);
      if (slideIdx < unit.slides.length) {
        map[slideIdx] = task;
      }
    });
    
    return map;
  }, [unit.slides.length, unit.tasks]);

  const totalSlides = unit.slides.length;
  const progress = ((currentSlideIndex + 1) / totalSlides) * 100;
  const completedTaskCount = Object.keys(completedTasks).length;
  const totalTasks = unit.tasks.length;

  const handleNext = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleTaskComplete = (taskId: string, isCorrect: boolean) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: isCorrect
    }));
  };

  const handleRestart = () => {
    setCurrentSlideIndex(0);
    setCompletedTasks({});
    setIsComplete(false);
  };

  const currentSlide = unit.slides[currentSlideIndex];
  const currentTask = slideTaskMap[currentSlideIndex];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className={cn(
          "w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left",
          isOpen 
            ? "bg-primary/5 border-primary/30" 
            : isComplete
            ? "bg-green-50 dark:bg-green-950/20 border-green-500/30"
            : "bg-card hover:bg-muted/50 border-border"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full",
              isComplete
                ? "bg-green-500 text-white"
                : isOpen 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted"
            )}>
              {isComplete ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <BookOpen className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-sm">{unit.title}</h3>
              <p className="text-xs text-muted-foreground">{unit.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {unit.duration}
            </Badge>
            {completedTaskCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {completedTaskCount}/{totalTasks} tasks
              </Badge>
            )}
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-2 space-y-4 p-4 rounded-lg border bg-card">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{currentSlideIndex + 1} / {totalSlides}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Objectives (collapsed) */}
          <Collapsible>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Target className="w-3 h-3" />
                <span>View learning objectives</span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 bg-primary/5 rounded-lg p-3 border border-primary/20">
                <ul className="space-y-1">
                  {unit.objectives.map((obj, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary">{idx + 1}.</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Main Content Area */}
          {!isComplete ? (
            <InteractiveSlide
              slide={currentSlide}
              slideIndex={currentSlideIndex}
              totalSlides={totalSlides}
              task={currentTask}
              onTaskComplete={handleTaskComplete}
              onNext={handleNext}
              isLastSlide={currentSlideIndex === totalSlides - 1}
            />
          ) : (
            // Completion State
            <div className="text-center py-8 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Unit Complete!</h3>
                <p className="text-sm text-muted-foreground">
                  You've completed all {totalSlides} slides and {completedTaskCount} tasks.
                </p>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={handleRestart}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Review Again
                </Button>
              </div>
            </div>
          )}

          {/* Quick Navigation (for jumping) */}
          {!isComplete && (
            <div className="flex items-center justify-center gap-1 pt-2 border-t">
              {Array.from({ length: totalSlides }, (_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    idx === currentSlideIndex 
                      ? "bg-primary w-4" 
                      : idx < currentSlideIndex
                      ? "bg-primary/50"
                      : "bg-muted hover:bg-muted-foreground/30"
                  )}
                  title={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
