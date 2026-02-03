import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  ArrowRight,
  BookOpen,
  PenLine,
  Target
} from "lucide-react";
import { allHoursData, HourTask, HourData } from "@/data/hourContent";

interface TaskResponse {
  id: string;
  question_key: string | null;
  response: string;
  is_correct: boolean | null;
}

interface WritingDraft {
  id: string;
  task_key: string;
  content: string;
  is_submitted: boolean;
}

interface ParagraphNote {
  id: string;
  paragraph_key: string;
  notes: string;
}

interface StudentTaskProgressProps {
  responses: TaskResponse[];
  writingDrafts: WritingDraft[];
  paragraphNotes: ParagraphNote[];
}

// Extract question stem (the main question without quotes/examples)
// e.g., "Which citation style is this? 'Some example...'" → "which citation style is this?"
const extractQuestionStem = (question: string): string => {
  const normalized = question.toLowerCase().trim().replace(/\s+/g, ' ');
  // Try to extract up to the first quote or specific example marker
  const quoteIndex = normalized.search(/['"]/);
  if (quoteIndex > 10) {
    return normalized.substring(0, quoteIndex).trim();
  }
  // For questions without quotes, use first 40 chars or up to first specific content
  const parenIndex = normalized.indexOf('(');
  if (parenIndex > 10 && parenIndex < 60) {
    return normalized.substring(0, parenIndex).trim();
  }
  return normalized.substring(0, 50);
};

// Check if a response matches a task
// Supports both new format (w1h1-q1) and old format (q1-Question-text)
const responseMatchesTask = (response: TaskResponse, taskId: string, weekNum: number, hourNum: number, taskIndex?: number, taskQuestion?: string): boolean => {
  const questionKey = response.question_key?.toLowerCase() || "";
  
  // METHOD 1: New format - week/hour prefixed keys (e.g., "w1h1-q1", "w1h1-scan1")
  const weekHourPatterns = [
    `w${weekNum}h${hourNum}-`,
    `week${weekNum}-hour${hourNum}-`,
    `week${weekNum}_hour${hourNum}_`,
  ];
  
  if (weekHourPatterns.some(p => questionKey.startsWith(p.toLowerCase()))) {
    return true;
  }
  
  // Check exact match with taskId that already contains week/hour
  if (taskId.match(/^w\d+h\d+-/)) {
    if (questionKey === taskId.toLowerCase() || questionKey.startsWith(taskId.toLowerCase())) {
      return true;
    }
  }
  
  // METHOD 2: Old format - match by question text stored in response JSON
  // This handles responses like "q1-In-the-passage-above" where the question is stored in response.question
  if (taskQuestion) {
    try {
      const parsed = JSON.parse(response.response);
      if (parsed.question && typeof parsed.question === 'string') {
        // Normalize both questions for comparison (remove extra spaces, lowercase)
        const storedQuestion = parsed.question.toLowerCase().trim().replace(/\s+/g, ' ');
        const currentQuestion = taskQuestion.toLowerCase().trim().replace(/\s+/g, ' ');
        
        // Exact match
        if (storedQuestion === currentQuestion) {
          return true;
        }
        
        // First 50 chars match (for minor text differences)
        if (storedQuestion.length > 30 && currentQuestion.length > 30 && 
            storedQuestion.substring(0, 50) === currentQuestion.substring(0, 50)) {
          return true;
        }
        
        // Question stem match (for when examples/quotes changed but question type is same)
        // This helps match old data where the example text changed but the question type is the same
        const storedStem = extractQuestionStem(parsed.question);
        const currentStem = extractQuestionStem(taskQuestion);
        if (storedStem.length > 15 && currentStem.length > 15 && storedStem === currentStem) {
          // If stored data has week/hour metadata, verify it matches
          if (parsed.weekNumber !== undefined && parsed.hourNumber !== undefined) {
            return parsed.weekNumber === weekNum && parsed.hourNumber === hourNum;
          }
          // For old data without metadata, allow match if stems are identical
          // This is acceptable because question stems like "Which citation style is this?" 
          // are unique enough to identify the task type
          return true;
        }
      }
    } catch {}
  }
  
  return false;
};

// Check if a writing draft matches a task
const draftMatchesTask = (draft: WritingDraft, taskId: string, weekNum: number, hourNum: number): boolean => {
  const taskKey = draft.task_key?.toLowerCase() || "";
  const patterns = [
    taskId.toLowerCase(),
    `week${weekNum}_hour${hourNum}`.toLowerCase(),
    `w${weekNum}h${hourNum}`.toLowerCase(),
  ];
  
  return patterns.some(p => taskKey.includes(p) || taskKey.includes(taskId.toLowerCase()));
};

const getTaskTypeIcon = (type: string) => {
  switch (type) {
    case 'mc':
    case 'true-false':
    case 'fill-blank':
      return <Target className="h-3.5 w-3.5" />;
    case 'short-answer':
    case 'sentence':
    case 'paragraph':
      return <PenLine className="h-3.5 w-3.5" />;
    default:
      return <BookOpen className="h-3.5 w-3.5" />;
  }
};

const getTaskTypeLabel = (type: string): string => {
  switch (type) {
    case 'mc': return 'MC';
    case 'true-false': return 'T/F';
    case 'fill-blank': return 'Fill';
    case 'short-answer': return 'Short';
    case 'sentence': return 'Sentence';
    case 'paragraph': return 'Paragraph';
    default: return type;
  }
};

export function StudentTaskProgress({
  responses,
  writingDrafts,
  paragraphNotes,
}: StudentTaskProgressProps) {
  const [openWeeks, setOpenWeeks] = useState<number[]>([1]);

  const toggleWeek = (week: number) => {
    setOpenWeeks(prev => 
      prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week]
    );
  };

  // Group hours by week
  const weekGroups = allHoursData.reduce((acc, hour) => {
    if (!acc[hour.weekNumber]) {
      acc[hour.weekNumber] = [];
    }
    acc[hour.weekNumber].push(hour);
    return acc;
  }, {} as Record<number, HourData[]>);

  // Check if task is completed
  const isTaskCompleted = (task: HourTask, weekNum: number, hourNum: number, taskIndex: number): boolean => {
    return responses.some(r => responseMatchesTask(r, task.id, weekNum, hourNum, taskIndex, task.question));
  };

  // Check if writing task is completed
  const isWritingCompleted = (weekNum: number, hourNum: number): boolean => {
    return writingDrafts.some(d => 
      draftMatchesTask(d, 'writing', weekNum, hourNum) && d.is_submitted
    );
  };

  // Calculate stats
  const getHourStats = (hour: HourData) => {
    const tasks = hour.tasks || [];
    let completed = 0;
    
    tasks.forEach((task, taskIndex) => {
      if (isTaskCompleted(task, hour.weekNumber, hour.hourNumber, taskIndex)) {
        completed++;
      }
    });

    const totalTasks = tasks.length + (hour.writingTask ? 1 : 0);
    if (hour.writingTask && isWritingCompleted(hour.weekNumber, hour.hourNumber)) {
      completed++;
    }

    return { completed, total: totalTasks };
  };

  const getWeekStats = (weekNum: number) => {
    const hours = weekGroups[weekNum] || [];
    let totalTasks = 0;
    let completed = 0;

    hours.forEach(hour => {
      const stats = getHourStats(hour);
      totalTasks += stats.total;
      completed += stats.completed;
    });

    return { completed, total: totalTasks };
  };

  // Get incomplete tasks for a week
  const getIncompleteTasks = (weekNum: number) => {
    const hours = weekGroups[weekNum] || [];
    const incomplete: { hour: HourData; task: HourTask; index: number }[] = [];

    hours.forEach(hour => {
      hour.tasks.forEach((task, idx) => {
        if (!isTaskCompleted(task, hour.weekNumber, hour.hourNumber, idx)) {
          incomplete.push({ hour, task, index: idx });
        }
      });
    });

    return incomplete;
  };

  return (
    <div className="space-y-4">
      {Object.keys(weekGroups).sort((a, b) => Number(a) - Number(b)).map(weekNumStr => {
        const weekNum = Number(weekNumStr);
        const hours = weekGroups[weekNum];
        const weekStats = getWeekStats(weekNum);
        const isWeekOpen = openWeeks.includes(weekNum);
        const progressPercent = weekStats.total > 0 ? (weekStats.completed / weekStats.total) * 100 : 0;
        const incompleteTasks = getIncompleteTasks(weekNum);

        return (
          <Card key={weekNum} className={progressPercent === 100 ? "border-green-200 bg-green-50/30" : ""}>
            <Collapsible open={isWeekOpen} onOpenChange={() => toggleWeek(weekNum)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      {isWeekOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />}
                      <CardTitle className="text-base flex items-center gap-2">
                        Week {weekNum}
                        {progressPercent === 100 && (
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                        )}
                      </CardTitle>
                    </div>
                    
                    {/* Week progress summary - prominent display */}
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-primary">{weekStats.completed}</span>
                        <span className="text-muted-foreground">/</span>
                        <span className="text-lg text-muted-foreground">{weekStats.total}</span>
                      </div>
                      <div className="w-32 hidden sm:block">
                        <Progress value={progressPercent} className="h-2.5" />
                      </div>
                      <Badge 
                        variant={progressPercent === 100 ? "default" : progressPercent > 0 ? "secondary" : "outline"}
                        className="text-xs w-14 justify-center"
                      >
                        {Math.round(progressPercent)}%
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-3">
                  {/* Quick action for incomplete tasks */}
                  {incompleteTasks.length > 0 && (
                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-amber-800">
                            {incompleteTasks.length} task{incompleteTasks.length > 1 ? 's' : ''} remaining
                          </p>
                        </div>
                        <Button size="sm" asChild className="bg-amber-600 hover:bg-amber-700">
                          <Link to={`/week/${weekNum}/hour/${incompleteTasks[0].hour.hourNumber}`}>
                            Continue
                            <ArrowRight className="h-3.5 w-3.5 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Hour breakdown - cleaner cards */}
                  <div className="grid gap-3">
                    {hours.map(hour => {
                      const hourStats = getHourStats(hour);
                      const hourComplete = hourStats.completed === hourStats.total;
                      const hourProgress = hourStats.total > 0 ? (hourStats.completed / hourStats.total) * 100 : 0;

                      return (
                        <HourProgressCard 
                          key={`${weekNum}-${hour.hourNumber}`}
                          hour={hour}
                          weekNum={weekNum}
                          completed={hourStats.completed}
                          total={hourStats.total}
                          hourComplete={hourComplete}
                          hourProgress={hourProgress}
                          tasks={hour.tasks}
                          writingTask={hour.writingTask}
                          isTaskCompleted={(task, idx) => isTaskCompleted(task, hour.weekNumber, hour.hourNumber, idx)}
                          isWritingCompleted={() => isWritingCompleted(hour.weekNumber, hour.hourNumber)}
                        />
                      );
                    })}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}

// Separate component for cleaner hour display
interface HourProgressCardProps {
  hour: HourData;
  weekNum: number;
  completed: number;
  total: number;
  hourComplete: boolean;
  hourProgress: number;
  tasks: HourTask[];
  writingTask?: HourData['writingTask'];
  isTaskCompleted: (task: HourTask, idx: number) => boolean;
  isWritingCompleted: () => boolean;
}

function HourProgressCard({
  hour,
  weekNum,
  completed,
  total,
  hourComplete,
  hourProgress,
  tasks,
  writingTask,
  isTaskCompleted,
  isWritingCompleted,
}: HourProgressCardProps) {
  const [showTasks, setShowTasks] = useState(false);

  return (
    <div className={`rounded-lg border p-3 ${hourComplete ? 'bg-green-50/50 border-green-200' : 'bg-card'}`}>
      {/* Hour header - always visible */}
      <div className="flex items-center justify-between gap-3">
        <Link 
          to={`/week/${weekNum}/hour/${hour.hourNumber}`}
          className="flex-1 min-w-0 hover:text-primary transition-colors"
        >
          <div className="flex items-center gap-2">
            {hourComplete ? (
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className={`font-medium text-sm truncate ${hourComplete ? 'text-green-700' : ''}`}>
              Hour {hour.hourNumber}: {hour.title}
            </span>
          </div>
        </Link>
        
        {/* Progress indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block w-20">
            <Progress value={hourProgress} className="h-1.5" />
          </div>
          <Badge 
            variant={hourComplete ? "default" : "outline"} 
            className={`text-xs font-semibold min-w-[52px] justify-center ${hourComplete ? 'bg-green-600' : ''}`}
          >
            {completed}/{total}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={(e) => {
              e.preventDefault();
              setShowTasks(!showTasks);
            }}
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${showTasks ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Expandable task list */}
      {showTasks && (
        <div className="mt-3 pt-3 border-t space-y-1.5">
          {tasks.map((task, idx) => {
            const taskCompleted = isTaskCompleted(task, idx);
            
            return (
              <Link
                key={task.id}
                to={`/week/${weekNum}/hour/${hour.hourNumber}`}
                className={`flex items-center gap-2 p-2 rounded text-sm transition-colors ${
                  taskCompleted 
                    ? "bg-green-100/70 text-green-700" 
                    : "bg-muted/40 hover:bg-muted/60"
                }`}
              >
                {taskCompleted ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                )}
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                  {getTaskTypeLabel(task.type)}
                </Badge>
                <span className="truncate text-xs">{task.question}</span>
              </Link>
            );
          })}

          {/* Writing task */}
          {writingTask && (
            <Link
              to={`/week/${weekNum}/hour/${hour.hourNumber}`}
              className={`flex items-center gap-2 p-2 rounded text-sm transition-colors ${
                isWritingCompleted()
                  ? "bg-green-100/70 text-green-700" 
                  : "bg-blue-50 hover:bg-blue-100 border border-blue-200"
              }`}
            >
              {isWritingCompleted() ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" />
              ) : (
                <Circle className="h-3.5 w-3.5 text-blue-500 shrink-0" />
              )}
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-blue-300 text-blue-600 shrink-0">
                Writing
              </Badge>
              <span className="truncate text-xs">{writingTask.prompt}</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
