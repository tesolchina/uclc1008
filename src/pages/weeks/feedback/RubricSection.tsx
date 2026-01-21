import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, AlertTriangle, CheckCircle2, BookOpen } from "lucide-react";
import { useState } from "react";
import type { RubricCategory } from "./types";
import { RubricTable } from "./RubricTable";
import { rubricTableMap } from "./rubricTables";

interface RubricSectionProps {
  category: RubricCategory;
}

export function RubricSection({ category }: RubricSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tableData = rubricTableMap[category.id];
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border/50 hover:border-border transition-colors">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-3">
                <span className="text-primary">{category.icon}</span>
                {category.title}
              </CardTitle>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Rubric Table */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Grading Rubric (20%)
              </h4>
              {tableData && <RubricTable data={tableData} />}
            </div>

            {/* Common Problems */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Common Problems ({category.commonProblems.length})
              </h4>
              <div className="space-y-3">
                {category.commonProblems.map((problem, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-destructive/5 border border-destructive/20 space-y-2">
                    <p className="font-medium text-sm text-destructive">
                      {idx + 1}. {problem.title}
                    </p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><span className="font-medium">Example:</span> <em>"{problem.example}"</em></p>
                      <p><span className="font-medium text-primary">💡 Tip:</span> {problem.suggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                What We Did Well ({category.strengths.length})
              </h4>
              <div className="space-y-3">
                {category.strengths.map((strength, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
                    <p className="font-medium text-sm text-primary">
                      ✓ {strength.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Example:</span> <em>"{strength.example}"</em>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
