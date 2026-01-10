import { NumberedParagraph } from "@/data/types";
import { cn } from "@/lib/utils";

interface NumberedTextProps {
  paragraphs: NumberedParagraph[];
  highlightCitations?: boolean;
  highlightTopicSentences?: boolean;
  selectedSentences?: number[];
  onSentenceClick?: (paragraphNum: number, sentenceNum: number) => void;
  interactive?: boolean;
}

export function NumberedText({
  paragraphs,
  highlightCitations = true,
  highlightTopicSentences = true,
  selectedSentences = [],
  onSentenceClick,
  interactive = false,
}: NumberedTextProps) {
  return (
    <div className="space-y-6">
      {paragraphs.map((paragraph) => (
        <div key={paragraph.paragraphNumber} className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
              P{paragraph.paragraphNumber}
            </span>
            <span className="text-sm text-muted-foreground font-medium">
              Paragraph {paragraph.paragraphNumber}
            </span>
          </div>
          <div className="pl-4 border-l-2 border-muted space-y-2">
            {paragraph.sentences.map((sentence) => {
              const isSelected = selectedSentences.includes(sentence.sentenceNumber);
              const sentenceKey = `${paragraph.paragraphNumber}-${sentence.sentenceNumber}`;
              
              return (
                <div
                  key={sentenceKey}
                  onClick={() => interactive && onSentenceClick?.(paragraph.paragraphNumber, sentence.sentenceNumber)}
                  className={cn(
                    "flex gap-3 p-2 rounded-lg transition-all",
                    interactive && "cursor-pointer hover:bg-muted/50",
                    isSelected && "bg-primary/10 ring-2 ring-primary",
                    highlightTopicSentences && sentence.isTopicSentence && "bg-amber-50 dark:bg-amber-950/30",
                    highlightCitations && sentence.isCitation && !isSelected && "bg-blue-50 dark:bg-blue-950/30"
                  )}
                >
                  <span className={cn(
                    "inline-flex items-center justify-center min-w-6 h-6 rounded text-xs font-medium",
                    sentence.isTopicSentence 
                      ? "bg-amber-200 text-amber-800 dark:bg-amber-800 dark:text-amber-200" 
                      : sentence.isCitation
                      ? "bg-blue-200 text-blue-800 dark:bg-blue-800 dark:text-blue-200"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {sentence.sentenceNumber}
                  </span>
                  <p className="text-sm leading-relaxed flex-1">
                    {sentence.text}
                  </p>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground pl-4">
            {paragraph.sentences.some(s => s.isTopicSentence) && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-amber-200 dark:bg-amber-800"></span>
                Topic Sentence
              </span>
            )}
            {paragraph.sentences.some(s => s.isCitation) && (
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-200 dark:bg-blue-800"></span>
                Contains Citation
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
