import { useState, useEffect, useCallback } from "react";
import { LearningUnit } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, BookOpen, ClipboardList, Home } from "lucide-react";
import { UnitSlide } from "./UnitSlide";
import { UnitTaskPanel } from "./UnitTaskPanel";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UnitViewerProps {
  unit: LearningUnit;
  weekId: number;
  onBack?: () => void;
  onComplete?: () => void;
}

type ViewMode = "slides" | "tasks";

export function UnitViewer({ unit, weekId, onBack, onComplete }: UnitViewerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("slides");
  const [slidesCompleted, setSlidesCompleted] = useState(false);

  const totalSlides = unit.slides.length;
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  const goToNextSlide = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      setSlidesCompleted(true);
      if (unit.tasks.length > 0) {
        setViewMode("tasks");
      } else {
        onComplete?.();
      }
    }
  }, [currentSlide, totalSlides, unit.tasks.length, onComplete]);

  const goToPrevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode !== "slides") return;
      
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNextSlide();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, goToNextSlide, goToPrevSlide]);

  const handleTaskComplete = () => {
    onComplete?.();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="container max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <Home className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div className="hidden sm:block">
                <h1 className="font-semibold text-sm">{unit.title}</h1>
                <p className="text-xs text-muted-foreground">{unit.duration}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "slides" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("slides")}
              >
                <BookOpen className="w-4 h-4 mr-1" />
                Slides
              </Button>
              <Button
                variant={viewMode === "tasks" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("tasks")}
                disabled={!slidesCompleted && unit.tasks.length > 0}
              >
                <ClipboardList className="w-4 h-4 mr-1" />
                Tasks
                {!slidesCompleted && unit.tasks.length > 0 && (
                  <Badge variant="secondary" className="ml-1 text-xs">
                    🔒
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          {viewMode === "slides" && (
            <div className="mt-3">
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8">
        {viewMode === "slides" ? (
          <div className="space-y-8">
            {/* Objectives (first slide only) */}
            {currentSlide === 0 && unit.objectives.length > 0 && (
              <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                <h3 className="font-semibold text-sm mb-2 text-primary">
                  🎯 Learning Objectives
                </h3>
                <ul className="space-y-1">
                  {unit.objectives.map((obj, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                      <span>{idx + 1}.</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Current Slide */}
            <UnitSlide
              slide={unit.slides[currentSlide]}
              slideIndex={currentSlide}
              totalSlides={totalSlides}
            />

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={goToPrevSlide}
                disabled={currentSlide === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex gap-1">
                {unit.slides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-colors",
                      idx === currentSlide ? "bg-primary" : "bg-muted hover:bg-muted-foreground/50"
                    )}
                  />
                ))}
              </div>
              
              <Button onClick={goToNextSlide}>
                {currentSlide === totalSlides - 1 ? (
                  unit.tasks.length > 0 ? "Start Tasks" : "Complete"
                ) : (
                  "Next"
                )}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Use ← → arrow keys or spacebar to navigate
            </p>
          </div>
        ) : (
          <UnitTaskPanel tasks={unit.tasks} onComplete={handleTaskComplete} />
        )}
      </main>
    </div>
  );
}
