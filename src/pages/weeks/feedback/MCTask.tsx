import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";

export interface MCTaskOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MCTaskProps {
  question: string;
  context?: string;
  options: MCTaskOption[];
  explanation: string;
  tip?: string;
}

export function MCTask({ question, context, options, explanation, tip }: MCTaskProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleSelect = (optionId: string) => {
    if (showResult) return;
    setSelectedId(optionId);
    setShowResult(true);
  };

  const selectedOption = options.find(o => o.id === selectedId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  return (
    <div className="space-y-3">
      <p className="font-medium text-sm">{question}</p>
      
      {context && (
        <div className="p-3 rounded bg-muted/50 border text-sm italic">
          "{context}"
        </div>
      )}

      <div className="grid gap-2">
        {options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const showCorrect = showResult && opt.isCorrect;
          
          return (
            <Button
              key={opt.id}
              variant={isSelected ? (opt.isCorrect ? "default" : "destructive") : "outline"}
              className={`justify-start text-left h-auto py-2 px-3 text-sm ${
                showCorrect && !isSelected ? "border-primary/50 bg-primary/5" : ""
              }`}
              onClick={() => handleSelect(opt.id)}
              disabled={showResult}
            >
              <span className="flex-1">{opt.text}</span>
              {isSelected && (
                opt.isCorrect 
                  ? <CheckCircle2 className="h-4 w-4 ml-2 shrink-0" />
                  : <XCircle className="h-4 w-4 ml-2 shrink-0" />
              )}
              {showCorrect && !isSelected && (
                <CheckCircle2 className="h-4 w-4 ml-2 text-primary shrink-0" />
              )}
            </Button>
          );
        })}
      </div>

      {showResult && (
        <div className={`p-3 rounded-lg text-sm space-y-2 ${
          isCorrect ? "bg-primary/10 border border-primary/30" : "bg-destructive/10 border border-destructive/30"
        }`}>
          <p className={isCorrect ? "text-primary font-medium" : "text-destructive font-medium"}>
            {isCorrect ? "✓ Correct!" : "✗ Not quite."}
          </p>
          <p className="text-muted-foreground">{explanation}</p>
          {tip && (
            <p className="text-muted-foreground border-t pt-2 mt-2">
              <span className="font-medium text-primary">💡 Tip:</span> {tip}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
