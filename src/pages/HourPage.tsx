import { useParams, Link } from "react-router-dom";
import { getHourData } from "@/data/hourContent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ObjectiveTask } from "@/components/tasks/ObjectiveTask";
import { WritingTask } from "@/components/tasks/WritingTask";
import { AskQuestionButton } from "@/components/tasks/AskQuestionButton";
import { ArrowLeft, ArrowRight, Clock, Target, BookOpen, PenLine, CheckCircle2, Lightbulb, FileText, Sparkles } from "lucide-react";
import { useState } from "react";

export default function HourPage() {
  const { weekId, hourId } = useParams();
  const weekNumber = parseInt(weekId || "1");
  const hourNumber = parseInt(hourId || "1");
  
  const hourData = getHourData(weekNumber, hourNumber);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  if (!hourData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Hour not found</h2>
        <p className="text-muted-foreground mb-4">This lesson hour doesn't exist yet.</p>
        <Button asChild>
          <Link to={`/week/${weekNumber}`}>Back to Week {weekNumber}</Link>
        </Button>
      </div>
    );
  }

  const handleTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => new Set([...prev, taskId]));
  };

  const objectiveTasks = hourData.tasks.filter(t => 
    t.type === "mc" || t.type === "true-false" || t.type === "fill-blank"
  );
  const writingTasks = hourData.tasks.filter(t => 
    t.type === "short-answer" || t.type === "sentence" || t.type === "paragraph"
  );

  // Navigation
  const prevHour = hourNumber > 1 ? hourNumber - 1 : null;
  const nextHour = hourNumber < 3 ? hourNumber + 1 : null;
  const prevWeek = hourNumber === 1 && weekNumber > 1 ? weekNumber - 1 : null;
  const nextWeek = hourNumber === 3 && weekNumber < 5 ? weekNumber + 1 : null;

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/week/${weekNumber}`} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Week {weekNumber}
          </Link>
        </Button>
        <AskQuestionButton weekNumber={weekNumber} hourNumber={hourNumber} />
      </div>

      {/* Hero Section */}
      <section className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border p-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-primary text-primary-foreground">Week {weekNumber} • Hour {hourNumber}</Badge>
            {hourData.ciloLinks.map((cilo, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">{cilo}</Badge>
            ))}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{hourData.title}</h1>
          <p className="text-muted-foreground">{hourData.theme}</p>
          
          {/* Behaviour Change Goal */}
          {hourData.behaviourChange && (
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Long-term Habit</p>
                  <p className="text-sm text-amber-800 dark:text-amber-300">{hourData.behaviourChange}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Learning Goals */}
      <CollapsibleSection
        title="Learning Goals"
        description="What you'll achieve in this hour"
        icon={<Target className="h-4 w-4 text-primary" />}
        defaultOpen={true}
      >
        <ul className="space-y-2">
          {hourData.learningGoals.map((goal, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              {goal}
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Key Concepts */}
      {hourData.keyConcepts && hourData.keyConcepts.length > 0 && (
        <CollapsibleSection
          title="Key Concepts"
          description="Essential terms and ideas for this hour"
          icon={<Lightbulb className="h-4 w-4 text-amber-500" />}
          defaultOpen={true}
        >
          <div className="space-y-4">
            {hourData.keyConcepts.map((concept, idx) => (
              <Card key={idx} className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-primary">{concept.term}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>{concept.definition}</p>
                  {concept.example && (
                    <div className="p-2 bg-background rounded border text-xs">
                      <span className="font-medium">Example: </span>{concept.example}
                    </div>
                  )}
                  {concept.tip && (
                    <p className="text-xs text-muted-foreground italic">💡 {concept.tip}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Article Excerpts */}
      {hourData.articles && hourData.articles.length > 0 && (
        <CollapsibleSection
          title="Article Excerpts"
          description="Source materials for this hour"
          icon={<FileText className="h-4 w-4 text-blue-500" />}
          defaultOpen={false}
        >
          <div className="space-y-4">
            {hourData.articles.map((article, idx) => (
              <Card key={idx}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {article.authors} ({article.year})
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">{article.title}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  {article.abstract && (
                    <div className="text-xs bg-muted/50 p-2 rounded">
                      <span className="font-medium">Abstract: </span>{article.abstract}
                    </div>
                  )}
                  <div className="text-sm whitespace-pre-wrap border-l-2 border-primary/30 pl-3">
                    {article.excerpt}
                  </div>
                  {article.glossary && Object.keys(article.glossary).length > 0 && (
                    <div className="text-xs bg-muted/30 p-2 rounded">
                      <p className="font-medium mb-1">Glossary:</p>
                      {Object.entries(article.glossary).map(([term, def]) => (
                        <p key={term}><strong>{term}:</strong> {def}</p>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Agenda */}
      <CollapsibleSection
        title="Class Agenda"
        description="Today's activities and timing"
        icon={<Clock className="h-4 w-4 text-primary" />}
        defaultOpen={false}
      >
        <div className="space-y-3">
          {hourData.agenda.map((item, idx) => (
            <div key={idx} className="flex gap-3 p-3 rounded-lg bg-muted/50 border">
              <div className="shrink-0 w-16 text-xs font-medium text-muted-foreground">{item.duration}</div>
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">{item.title}</p>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {item.activities.map((activity, i) => (
                    <li key={i}>• {activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      {/* Objective Tasks */}
      {objectiveTasks.length > 0 && (
        <CollapsibleSection
          title="Quick Check Tasks"
          description="Multiple choice, true/false, and fill-in-the-blank with instant feedback"
          icon={<BookOpen className="h-4 w-4 text-primary" />}
          defaultOpen={true}
        >
          <div className="space-y-4">
            {objectiveTasks.map((task) => (
              <ObjectiveTask
                key={task.id}
                id={task.id}
                type={task.type as "mc" | "true-false" | "fill-blank"}
                question={task.question}
                context={task.context}
                options={task.options}
                correctAnswer={task.correctAnswer!}
                explanation={task.explanation}
                hints={task.hints}
                onComplete={(isCorrect) => {
                  if (isCorrect) handleTaskComplete(task.id);
                }}
              />
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Writing Tasks */}
      {writingTasks.length > 0 && (
        <CollapsibleSection
          title="Writing Tasks"
          description="Practice academic writing with AI feedback"
          icon={<PenLine className="h-4 w-4 text-primary" />}
          defaultOpen={true}
        >
          <div className="space-y-4">
            {writingTasks.map((task) => (
              <WritingTask
                key={task.id}
                id={task.id}
                type={task.type as "short-answer" | "sentence" | "paragraph"}
                question={task.question}
                context={task.context}
                wordLimit={task.wordLimit}
                hints={task.hints}
                modelAnswer={task.modelAnswer}
                onComplete={() => handleTaskComplete(task.id)}
              />
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Main Writing Task */}
      {hourData.writingTask && (
        <CollapsibleSection
          title="Hour Writing Task"
          description="The main writing practice for this hour"
          icon={<PenLine className="h-4 w-4 text-amber-500" />}
          defaultOpen={true}
          className="border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-transparent"
        >
          <WritingTask
            id={`${hourData.weekNumber}-${hourData.hourNumber}-main`}
            type="paragraph"
            question={hourData.writingTask.prompt}
            wordLimit={hourData.writingTask.wordLimit}
            modelAnswer={hourData.writingTask.modelAnswer}
            rubricCriteria={hourData.writingTask.rubricCriteria}
            onComplete={() => handleTaskComplete("main-writing")}
          />
        </CollapsibleSection>
      )}

      {/* Progress & Navigation */}
      <div className="bg-muted/30 rounded-lg p-4 border">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="font-medium text-sm">Progress</p>
            <p className="text-xs text-muted-foreground">
              {completedTasks.size} / {hourData.tasks.length + (hourData.writingTask ? 1 : 0)} tasks completed
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {prevHour && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/week/${weekNumber}/hour/${prevHour}`}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Hour {prevHour}
                </Link>
              </Button>
            )}
            {prevWeek && hourNumber === 1 && (
              <Button variant="outline" size="sm" asChild>
                <Link to={`/week/${prevWeek}/hour/3`}>
                  <ArrowLeft className="h-4 w-4 mr-1" /> Week {prevWeek}
                </Link>
              </Button>
            )}
            {nextHour && (
              <Button size="sm" asChild>
                <Link to={`/week/${weekNumber}/hour/${nextHour}`}>
                  Hour {nextHour} <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            )}
            {nextWeek && hourNumber === 3 && (
              <Button size="sm" asChild>
                <Link to={`/week/${nextWeek}/hour/1`}>
                  Week {nextWeek} <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}