import { SlideContent } from "@/data/types";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { NumberedText } from "./NumberedText";

interface UnitSlideProps {
  slide: SlideContent;
  slideIndex: number;
  totalSlides: number;
}

export function UnitSlide({ slide, slideIndex, totalSlides }: UnitSlideProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        {slide.emoji && (
          <span className="text-5xl block mb-4">{slide.emoji}</span>
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          {slide.heading}
        </h2>
        {slide.subheading && (
          <p className="text-lg text-muted-foreground">
            {slide.subheading}
          </p>
        )}
      </div>

      {/* Points */}
      {slide.points && slide.points.length > 0 && (
        <Card className="bg-card/50">
          <CardContent className="pt-6">
            <ul className="space-y-3">
              {slide.points.map((point, idx) => (
                <li key={idx} className="flex gap-3">
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

      {/* Numbered Text (for article paragraphs) */}
      {slide.numberedText && slide.numberedText.length > 0 && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
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
        <div className="grid md:grid-cols-2 gap-4">
          {slide.examples.map((example, idx) => (
            <Card key={idx} className="bg-secondary/30 border-secondary">
              <CardContent className="pt-4">
                <p className="text-sm font-semibold text-secondary-foreground mb-2">
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
          <CardContent className="pt-4">
            <div className="flex gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">
                  💡 Key Takeaway
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  {slide.tip}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Slide Counter */}
      <div className="text-center text-sm text-muted-foreground">
        Slide {slideIndex + 1} of {totalSlides}
      </div>
    </div>
  );
}
