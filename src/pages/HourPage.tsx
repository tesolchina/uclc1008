import { useParams, Link } from "react-router-dom";
import { getHourData } from "@/data/hourContent";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ObjectiveTask } from "@/components/tasks/ObjectiveTask";
import { WritingTask } from "@/components/tasks/WritingTask";
import { AskQuestionButton } from "@/components/tasks/AskQuestionButton";
import { StudentLoginReminder } from "@/components/StudentLoginReminder";
import { LectureOutline, useSectionProgress, generateSectionId } from "@/features/lecture-mode";
import type { AgendaSectionEnhanced } from "@/features/lecture-mode";
import { ArrowLeft, ArrowRight, Clock, Target, BookOpen, PenLine, CheckCircle2, Lightbulb, FileText, Sparkles, ExternalLink, AlertCircle, Calendar, GraduationCap } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HourPage() {
  const { weekId, hourId } = useParams();
  const weekNumber = parseInt(weekId || "1");
  const hourNumber = parseInt(hourId || "1");
  const { user } = useAuth();
  
  const hourData = getHourData(weekNumber, hourNumber);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSectionIndices, setCompletedSectionIndices] = useState<number[]>([]);

  // Section progress for students
  const { progress, updateNotes } = useSectionProgress({ weekNumber, hourNumber });

  // Convert agenda to enhanced sections with IDs
  const sectionsWithIds: AgendaSectionEnhanced[] = useMemo(() => {
    if (!hourData?.agenda) return [];
    return hourData.agenda.map((item, index) => ({
      ...item,
      id: generateSectionId(index, item.title),
    }));
  }, [hourData?.agenda]);

  // Build notes map from progress
  const sectionNotes = useMemo(() => {
    const notes: Record<string, string> = {};
    progress.forEach(p => {
      if (p.notes) notes[p.sectionId] = p.notes;
    });
    return notes;
  }, [progress]);

  // Handle section click (for students reviewing completed sections)
  const handleSectionClick = useCallback((index: number) => {
    setCurrentSectionIndex(index);
  }, []);

  // Handle notes change
  const handleNotesChange = useCallback((sectionId: string, notes: string) => {
    updateNotes(sectionId, notes);
  }, [updateNotes]);

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
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Sign-in Reminder */}
        {!user && <StudentLoginReminder />}

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
            
            {/* Behaviour Change Goal - Now in outline sidebar */}
          </div>
        </section>

        {/* Week 1 Hour 1: Course Introduction Section */}
        {weekNumber === 1 && hourNumber === 1 && (
          <section className="space-y-4">
            {/* Course Docs Card */}
            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Welcome to UE1 - Course Introduction</CardTitle>
                </div>
                <CardDescription>
                  Let's start by reviewing the key course documents and understanding what's ahead
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button variant="outline" className="justify-start h-auto py-3" asChild>
                    <a 
                      href="https://buelearning.hkbu.edu.hk/mod/resource/view.php?id=1894083" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">Course Info Sheet</div>
                        <div className="text-xs text-muted-foreground">Official course document</div>
                      </div>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3" asChild>
                    <Link to="/" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <div className="text-left">
                        <div className="font-medium">Course Overview</div>
                        <div className="text-xs text-muted-foreground">Schedule & CILOs</div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Week 6 Milestone Highlight */}
            <Alert className="border-amber-500/50 bg-amber-500/5">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800 dark:text-amber-300">Key Milestone: Week 6 - Academic Writing Quiz (15%)</AlertTitle>
              <AlertDescription className="text-sm text-amber-700 dark:text-amber-400 space-y-2">
                <p>
                  Everything before Week 6 prepares you for the <strong>Academic Writing Quiz</strong> — an in-class test 
                  where you'll summarise and synthesise two journal article excerpts in 300 words.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-300">50 minutes</Badge>
                  <Badge variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-300">In-class</Badge>
                  <Badge variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-300">CILOs 1, 2, 3</Badge>
                </div>
              </AlertDescription>
            </Alert>

            {/* Pre-course Writing Assignment Card */}
            <Card className="border-2 border-blue-500/30 bg-blue-500/5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PenLine className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base">Pre-course Writing (2.5%)</CardTitle>
                  </div>
                  <Badge className="bg-blue-500 text-white">Due: 23 Jan, 6pm</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Your first assignment! Write a 350-word essay based on a provided article excerpt. 
                  You can get <strong>full credit</strong> as long as the similarity rate and AI detection rate are not too high.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">350 words max</Badge>
                  <Badge variant="outline" className="text-xs">Submit on Moodle</Badge>
                  <Badge variant="outline" className="text-xs text-red-600 border-red-500/50">No late submissions</Badge>
                </div>
                <div className="pt-2">
                  <Button size="sm" asChild>
                    <Link to="/week/1/assignment/pre-course-writing" className="flex items-center gap-2">
                      View Assignment Details
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* What to do discussion prompt */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Target className="h-4 w-4 text-primary" />
                  Getting Things Done (GTD) - Let's Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Before we dive into Module 1, let's think about how to approach the Pre-course Writing:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Set aside time:</strong> How much time will this take? When will you do it?</li>
                  <li><strong>Understand the purpose:</strong> What skills is this assignment testing?</li>
                  <li><strong>Read the rubric:</strong> What do you need to do to get full marks?</li>
                </ul>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Mobile: Lecture Outline (collapsible) */}
        <div className="lg:hidden">
          <LectureOutline
            weekNumber={weekNumber}
            hourNumber={hourNumber}
            sections={sectionsWithIds}
            currentIndex={currentSectionIndex}
            completedIndices={completedSectionIndices}
            isLive={false}
            isTeacher={false}
            onSectionClick={handleSectionClick}
            behaviorGoal={hourData.behaviourChange}
            sectionNotes={sectionNotes}
            onNotesChange={user ? handleNotesChange : undefined}
          />
        </div>

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

      {/* Desktop: Sticky Lecture Outline Sidebar */}
      <aside className="hidden lg:block w-80 shrink-0">
        <div className="sticky top-6">
          <LectureOutline
            weekNumber={weekNumber}
            hourNumber={hourNumber}
            sections={sectionsWithIds}
            currentIndex={currentSectionIndex}
            completedIndices={completedSectionIndices}
            isLive={false}
            isTeacher={false}
            onSectionClick={handleSectionClick}
            behaviorGoal={hourData.behaviourChange}
            sectionNotes={sectionNotes}
            onNotesChange={user ? handleNotesChange : undefined}
          />
        </div>
      </aside>
    </div>
  );
}