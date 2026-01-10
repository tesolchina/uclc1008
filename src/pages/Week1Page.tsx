import { Link } from "react-router-dom";
import { week1, week1Meta } from "@/data/weeks/week1";
import { getAssignmentById, Assignment } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ArticleExcerptDisplay } from "@/components/units/ArticleExcerptDisplay";
import { InteractiveUnitViewer } from "@/components/units/InteractiveUnitViewer";
import { Hour1LiveSession } from "@/components/units/Hour1LiveSession";
import { week1Hour1Units, articleExcerpt } from "@/data/units";
import { FileText, AlertCircle, ArrowRight, GraduationCap, PlayCircle } from "lucide-react";

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

  const assignmentsDue = week.assignmentsDue?.map(getAssignmentById).filter(Boolean) as Assignment[] || [];

  return (
    <div className="space-y-4">
      {/* Hero */}
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
              Decoding Academic Journal Articles
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{week.overview}</p>
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {/* Article Excerpt */}
        <CollapsibleSection
          title="📖 Article Excerpt: Facial Recognition in Schools"
          description="This is the article you'll analyze for your Pre-course Writing assignment"
          icon={<FileText className="h-4 w-4 text-primary" />}
          defaultOpen={true}
          className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent"
        >
          <ArticleExcerptDisplay
            title={articleExcerpt.title}
            authors={articleExcerpt.authors}
            source={articleExcerpt.source}
            paragraphs={articleExcerpt.paragraphs}
          />
        </CollapsibleSection>

        {/* Hour 1: Interactive Units + Live Session */}
        <CollapsibleSection
          title="Hour 1: Reading the Pre-course Article"
          description="Discover academic text features through guided exploration"
          icon={<PlayCircle className="h-4 w-4 text-primary" />}
          defaultOpen={true}
          className="border-accent/30 bg-gradient-to-r from-accent/5 to-transparent"
        >
          <div className="space-y-4">
            {/* Live Session for Teachers */}
            <Hour1LiveSession lessonId="week1-hour1" />

            {/* Interactive Units */}
            {week1Hour1Units.map((unit, idx) => (
              <InteractiveUnitViewer
                key={unit.id}
                unit={unit}
                defaultOpen={idx === 0}
              />
            ))}
            
            {/* Assignment Link */}
            <div className="pt-3 border-t">
              <Button size="sm" variant="default" asChild>
                <Link to="/week/1/assignment/pre-course-writing" className="gap-2">
                  <GraduationCap className="h-3.5 w-3.5" />
                  Start Pre-course Writing Assignment
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </CollapsibleSection>

        {/* Assignments Due */}
        {assignmentsDue.length > 0 && (
          <CollapsibleSection
            title="Assignments due this week"
            description="Complete these assessments by the end of this week."
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
      </div>
    </div>
  );
};

export default Week1Page;
