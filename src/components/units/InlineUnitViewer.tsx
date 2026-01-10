import { useState } from "react";
import { LearningUnit, SlideContent } from "@/data/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Target, Lightbulb, BookOpen, ClipboardList, CheckCircle } from "lucide-react";
import { UnitSlide } from "./UnitSlide";
import { UnitTaskPanel } from "./UnitTaskPanel";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface InlineUnitViewerProps {
  unit: LearningUnit;
  defaultOpen?: boolean;
}

export function InlineUnitViewer({ unit, defaultOpen = false }: InlineUnitViewerProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showTasks, setShowTasks] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const totalSlides = unit.slides.length;

  const goToNextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <button className={cn(
          "w-full flex items-center justify-between p-4 rounded-lg border transition-all text-left",
          isOpen 
            ? "bg-primary/5 border-primary/30" 
            : "bg-card hover:bg-muted/50 border-border"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full",
              isOpen ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              <BookOpen className="w-5 h-5" />
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
            <Badge variant="secondary" className="text-xs">
              {unit.slides.length} slides
            </Badge>
            {unit.tasks.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {unit.tasks.length} tasks
              </Badge>
            )}
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="mt-2 space-y-4 p-4 rounded-lg border bg-card">
          {/* Objectives */}
          <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-primary">
              <Target className="w-4 h-4" />
              Learning Objectives
            </h4>
            <ul className="space-y-1">
              {unit.objectives.map((obj, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                  <span className="text-primary">{idx + 1}.</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Toggle: Slides / Tasks */}
          <div className="flex items-center gap-2 border-b pb-3">
            <Button
              variant={!showTasks ? "default" : "outline"}
              size="sm"
              onClick={() => setShowTasks(false)}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Slides ({currentSlide + 1}/{totalSlides})
            </Button>
            {unit.tasks.length > 0 && (
              <Button
                variant={showTasks ? "default" : "outline"}
                size="sm"
                onClick={() => setShowTasks(true)}
              >
                <ClipboardList className="w-4 h-4 mr-1" />
                Practice Tasks ({completedTasks.length}/{unit.tasks.length})
              </Button>
            )}
          </div>

          {!showTasks ? (
            <div className="space-y-4">
              {/* Current Slide */}
              <UnitSlide
                slide={unit.slides[currentSlide]}
                slideIndex={currentSlide}
                totalSlides={totalSlides}
              />

              {/* Slide Navigation */}
              <div className="flex items-center justify-between pt-2 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevSlide}
                  disabled={currentSlide === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                
                {/* Slide Dots */}
                <div className="flex gap-1 flex-wrap justify-center max-w-[200px]">
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
                
                <Button
                  size="sm"
                  onClick={goToNextSlide}
                  disabled={currentSlide === totalSlides - 1}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Quick slide jump */}
              <div className="flex gap-1 flex-wrap justify-center">
                {unit.slides.map((slide, idx) => (
                  <Button
                    key={idx}
                    variant={idx === currentSlide ? "default" : "ghost"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setCurrentSlide(idx)}
                  >
                    {idx + 1}. {slide.heading.slice(0, 20)}...
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <UnitTaskPanel 
              tasks={unit.tasks} 
              onComplete={() => {
                // Mark all tasks as complete
                setCompletedTasks(unit.tasks.map(t => t.id));
              }}
            />
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
