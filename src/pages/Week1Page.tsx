import { Link } from "react-router-dom";
import { week1, week1Meta } from "@/data/weeks/week1";
import { getAssignmentById, getSkillById, Skill, Assignment } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LessonAiTutor } from "@/components/LessonAiTutor";
import { LessonCard } from "@/components/lessons/LessonCard";
import { useLessons } from "@/hooks/useLessons";
import { BookOpen, Lightbulb, Target, Clock, FileText, AlertCircle, CheckCircle2, Bot, Users, ArrowRight, Loader2, CalendarClock } from "lucide-react";

const skillCategoryColors: Record<string, string> = {
  "reading": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  "writing": "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  "critical-thinking": "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  "ai-literacy": "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  "speaking": "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
};

const SkillBadge = ({ skill }: { skill: Skill }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${skillCategoryColors[skill.category]}`}
    title={skill.description}
  >
    {skill.name}
  </span>
);

const AssignmentCard = ({ assignment, isDue }: { assignment: Assignment; isDue: boolean }) => (
  <Link 
    to={`/week/1/assignment/${assignment.id}`}
    className={`block rounded-xl border p-4 transition-colors hover:border-primary/50 ${isDue ? 'border-destructive/50 bg-destructive/5' : 'border-border bg-muted/30'}`}
  >
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="font-semibold text-sm">{assignment.title}</h4>
          <Badge variant={isDue ? "destructive" : "secondary"} className="text-[10px]">
            {assignment.weight}
          </Badge>
          <Badge variant="outline" className="text-[10px] uppercase">
            {assignment.type}
          </Badge>
          {assignment.duration && (
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock className="h-3 w-3" />
              {assignment.duration}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{assignment.description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
    </div>
  </Link>
);

const Week1Page = () => {
  const week = week1;
  const meta = week1Meta;
  
  // Get skills for week 1
  const skillsIntroduced = week.skillsIntroduced?.map(id => getSkillById(id)).filter((s): s is Skill => s !== undefined) || [];
  const skillsReinforced = week.skillsReinforced?.map(id => getSkillById(id)).filter((s): s is Skill => s !== undefined) || [];
  
  // Fetch lessons from database
  const { data: dbLessons, isLoading: lessonsLoading } = useLessons(1);

  const assignmentsDue = week.assignmentsDue?.map(getAssignmentById).filter(Boolean) as Assignment[] || [];
  const assignmentsUpcoming = week.assignmentsUpcoming?.map(getAssignmentById).filter(Boolean) as Assignment[] || [];

  return (
    <div className="space-y-4">
      <section className="hero-shell">
        <div className="hero-glow-orb" aria-hidden="true" />
        <div className="hero-inner">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="week-pill">{week.title}</span>
              <span className="hero-badge">Theme: {week.theme}</span>
              {meta?.dateRange && <span className="hero-badge">{meta.dateRange}</span>}
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              AI-assisted lesson for {week.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{week.overview}</p>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {/* Class Rundown - First Meeting */}
        {week.classRundown && week.classRundown.length > 0 && (
          <CollapsibleSection
            title="Class Rundown - First Meeting"
            description="Hour-by-hour breakdown of your first class session"
            icon={<CalendarClock className="h-4 w-4 text-primary" />}
            defaultOpen={true}
            className="border-primary/30 bg-primary/5"
          >
            <div className="space-y-4">
              {week.classRundown.map((item, idx) => (
                <div 
                  key={idx} 
                  className="relative rounded-xl border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-semibold">
                          {item.time}
                        </Badge>
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                      <ul className="space-y-1.5 pt-2">
                        {item.activities.map((activity, actIdx) => (
                          <li key={actIdx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                            <span>{activity}</span>
                          </li>
                        ))}
                      </ul>
                      {item.assignmentLink && (
                        <div className="pt-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link to={item.assignmentLink} className="gap-2">
                              <FileText className="h-3.5 w-3.5" />
                              View Assignment Details
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Skills Section */}
        {(skillsIntroduced.length > 0 || skillsReinforced.length > 0) && (
          <CollapsibleSection
            title="Skills this week"
            description="Track your skill development throughout the course."
            icon={<Lightbulb className="h-4 w-4 text-accent" />}
            className="border-accent/30 bg-accent/5"
          >
            <div className="space-y-4">
              {skillsIntroduced.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Target className="h-3 w-3" />
                    New skills introduced
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skillsIntroduced.map((skill) => (
                      <SkillBadge key={skill.id} skill={skill} />
                    ))}
                  </div>
                </div>
              )}
              {skillsReinforced.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3" />
                    Skills reinforced from previous weeks
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {skillsReinforced.map((skill) => (
                      <SkillBadge key={skill.id} skill={skill} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CollapsibleSection>
        )}

        {/* Database Lessons */}
        {dbLessons && dbLessons.length > 0 && (
          <CollapsibleSection
            title="Interactive Lessons"
            description="Complete these AI-powered lessons with instant feedback."
            icon={<BookOpen className="h-4 w-4 text-primary" />}
            defaultOpen={true}
          >
            {lessonsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dbLessons.map((lesson) => (
                  <LessonCard
                    key={lesson.id}
                    weekId={1}
                    lessonId={lesson.id}
                    lessonNumber={lesson.lesson_number}
                    title={lesson.title}
                    description={lesson.description || ''}
                    objectives={lesson.objectives}
                  />
                ))}
              </div>
            )}
          </CollapsibleSection>
        )}

        {/* Legacy Lessons (from static data) */}
        {week.lessons && week.lessons.length > 0 && !dbLessons?.length && (
          <CollapsibleSection
            title="Weekly Lessons"
            description="Complete these interactive lessons to build your skills."
            icon={<BookOpen className="h-4 w-4 text-primary" />}
          >
            <div className="space-y-3">
              {week.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between rounded-xl bg-muted/60 px-3 py-2.5 text-sm"
                >
                  <div className="flex flex-col gap-1">
                    <p className="font-medium text-foreground">Lesson {lesson.id}: {lesson.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {lesson.questions.length} practice questions
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link to={`/week/1/lesson/1-${lesson.id}`}>Start Lesson</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Assignments Due This Week */}
        {assignmentsDue.length > 0 && (
          <CollapsibleSection
            title="Assignments due this week"
            description="Complete these assessments during or by the end of this week."
            icon={<AlertCircle className="h-4 w-4 text-destructive" />}
            className="border-destructive/30 bg-destructive/5"
          >
            <div className="space-y-3">
              {assignmentsDue.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} isDue={true} />
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Upcoming Assignments */}
        {assignmentsUpcoming.length > 0 && (
          <CollapsibleSection
            title="Upcoming assignments"
            description="Start preparing for these assessments."
            icon={<FileText className="h-4 w-4 text-muted-foreground" />}
          >
            <div className="space-y-3">
              {assignmentsUpcoming.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} isDue={false} />
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* AI Tutor */}
        <CollapsibleSection
          title="AI tutor for this week"
          description="Open a dedicated chat window to ask questions about this week's lesson and your own writing."
          icon={<Bot className="h-4 w-4 text-primary" />}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">Open AI tutor</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>AI tutor for {week.title}</DialogTitle>
                <DialogDescription>
                  Ask questions about the materials, your summaries, and your drafts for this week.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2">
                <LessonAiTutor
                  weekTitle={week.title}
                  theme={week.theme}
                  aiPromptHint={week.aiPromptHint}
                />
              </div>
            </DialogContent>
          </Dialog>
        </CollapsibleSection>

        {/* In-class Activities */}
        {week.inClassActivities && week.inClassActivities.length > 0 && (
          <CollapsibleSection
            title="In-class activities"
            description="What to expect during your classroom sessions this week."
            icon={<Users className="h-4 w-4 text-primary" />}
            className="border-primary/20 bg-primary/5"
          >
            <ul className="space-y-2 text-sm text-muted-foreground">
              {week.inClassActivities.map((activity) => (
                <li key={activity} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  <span>{activity}</span>
                </li>
              ))}
            </ul>
          </CollapsibleSection>
        )}

        {/* Learning Outcomes */}
        <CollapsibleSection
          title="Learning outcomes"
          description="Focus on these outcomes as you work through the self-access tasks."
          icon={<Target className="h-4 w-4 text-primary" />}
        >
          <ul className="space-y-2 text-sm text-muted-foreground">
            {week.learningOutcomes.map((outcome) => (
              <li key={outcome} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden="true" />
                <span>{outcome}</span>
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        {/* Core Materials */}
        <CollapsibleSection
          title="Core materials"
          description="Complete these resources before moving on to independent practice."
          icon={<BookOpen className="h-4 w-4 text-primary" />}
        >
          <div className="space-y-3">
            {week.resources.map((res) => (
              <div
                key={res.title}
                className="flex items-start justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2.5 text-sm"
              >
                <div className="flex flex-col gap-1">
                  {res.url ? (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground hover:text-primary hover:underline"
                    >
                      {res.title}
                    </a>
                  ) : (
                    <p className="font-medium text-foreground">{res.title}</p>
                  )}
                  {res.description ? (
                    <p className="text-xs text-muted-foreground">{res.description}</p>
                  ) : null}
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-[0.16em]">
                    {res.type}
                  </Badge>
                  {res.duration ? (
                    <span className="text-[11px] text-muted-foreground">{res.duration}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        {/* Independent Practice */}
        <CollapsibleSection
          title="Independent practice"
          description="Use these tasks to stretch yourself after the core materials."
          icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
        >
          <ol className="space-y-2 text-sm text-muted-foreground">
            {week.practiceTasks.map((task, index) => (
              <li key={task} className="flex gap-2">
                <span className="mt-0.5 text-xs font-semibold text-primary/80">{index + 1}.</span>
                <span>{task}</span>
              </li>
            ))}
          </ol>
        </CollapsibleSection>
      </div>
    </div>
  );
};

export default Week1Page;
