import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, BookOpen, ClipboardCheck } from "lucide-react";
import { useState } from "react";
import type { RubricCategory } from "./types";
import { RubricTable } from "./RubricTable";
import { rubricTableMap } from "./rubricTables";
import { MCTask } from "./MCTask";
import { allTasksByCategory } from "./mcTasksData";

interface RubricSectionProps {
  category: RubricCategory;
}

export function RubricSection({ category }: RubricSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tableData = rubricTableMap[category.id];
  const tasks = allTasksByCategory[category.id] || [];
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-border/50 hover:border-border transition-colors">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-3">
                <span className="text-primary">{category.icon}</span>
                {category.title}
                <span className="text-sm font-normal text-muted-foreground">(20%)</span>
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
                Grading Rubric
              </h4>
              {tableData && <RubricTable data={tableData} />}
            </div>

            {/* MC Practice Tasks */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <ClipboardCheck className="h-4 w-4 text-primary" />
                Practice Tasks ({tasks.length})
              </h4>
              <p className="text-sm text-muted-foreground">
                Test your understanding by identifying problems and best practices.
              </p>
              <div className="space-y-4">
                {tasks.map((task, idx) => (
                  <div key={idx} className="p-4 rounded-lg border bg-muted/10">
                    <div className="text-xs text-muted-foreground mb-2">Task {idx + 1} of {tasks.length}</div>
                    <MCTask {...task} />
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
