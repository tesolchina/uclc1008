import { Badge } from "@/components/ui/badge";
import { NumberedText } from "./NumberedText";
import { NumberedParagraph } from "@/data/types";
import { FileText, ExternalLink } from "lucide-react";

interface ArticleExcerptDisplayProps {
  title: string;
  authors: string;
  source: string;
  paragraphs: NumberedParagraph[];
  highlightCitations?: boolean;
  highlightTopicSentences?: boolean;
}

export function ArticleExcerptDisplay({
  title,
  authors,
  source,
  paragraphs,
  highlightCitations = true,
  highlightTopicSentences = true,
}: ArticleExcerptDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Article Header */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/20 text-primary shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-tight">{title}</h3>
            <p className="text-sm text-muted-foreground">{authors}</p>
            <Badge variant="secondary" className="text-xs">
              Conceptual Article
            </Badge>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 p-3 bg-muted/50 rounded-lg text-sm">
        <span className="font-medium">Legend:</span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-amber-200 dark:bg-amber-800"></span>
          Topic Sentence
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-blue-200 dark:bg-blue-800"></span>
          Contains Citation
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-primary/10 text-primary text-xs font-bold">P1</span>
          Paragraph Number
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-muted text-muted-foreground text-xs font-medium">1</span>
          Sentence Number
        </span>
      </div>

      {/* Numbered Paragraphs */}
      <NumberedText
        paragraphs={paragraphs}
        highlightCitations={highlightCitations}
        highlightTopicSentences={highlightTopicSentences}
      />
    </div>
  );
}
