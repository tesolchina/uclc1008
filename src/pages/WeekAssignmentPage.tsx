import { useParams, Navigate, Link } from "react-router-dom";
import { getWeekById, getWeekMetaById, getAssignmentById, getSkillById } from "@/data/uclc1008-weeks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, FileText, ExternalLink, ArrowLeft, BookOpen } from "lucide-react";

export const WeekAssignmentPage = () => {
  const params = useParams();
  const weekId = Number(params.weekId);
  const assignmentId = params.assignmentId;
  
  const week = Number.isNaN(weekId) ? undefined : getWeekById(weekId);
  const meta = Number.isNaN(weekId) ? undefined : getWeekMetaById(weekId);
  const assignment = assignmentId ? getAssignmentById(assignmentId) : undefined;

  if (!week) {
    return <Navigate to="/" replace />;
  }

  if (!assignment) {
    return <Navigate to={`/week/${weekId}`} replace />;
  }

  const skillsAssessed = assignment.skillsAssessed
    ?.map((sid) => getSkillById(sid))
    .filter((s): s is NonNullable<typeof s> => s !== undefined) || [];

  const typeColors: Record<string, string> = {
    "take-home": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    "in-class": "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    "online": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };

  return (
    <div className="space-y-6">
      <section className="hero-shell">
        <div className="hero-glow-orb" aria-hidden="true" />
        <div className="hero-inner">
          <div className="space-y-3">
            <Link 
              to={`/week/${weekId}`} 
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to {week.title}
            </Link>
            <div className="flex flex-wrap items-center gap-2">
              <span className="week-pill">{week.title}</span>
              <Badge className={typeColors[assignment.type] || "bg-muted"}>
                {assignment.type}
              </Badge>
              <span className="hero-badge font-semibold">{assignment.weight}</span>
              {meta?.dateRange && <span className="hero-badge">{meta.dateRange}</span>}
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {assignment.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              {assignment.description}
            </p>
          </div>
        </div>
      </section>

      {assignment.duration && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Duration: {assignment.duration}</span>
        </div>
      )}

      <section aria-label="Requirements">
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Requirements
            </CardTitle>
            <CardDescription>
              What you need to do for this assignment
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2">
              {assignment.requirements?.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      {skillsAssessed.length > 0 && (
        <section aria-label="Skills assessed">
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <BookOpen className="h-4 w-4 text-primary" />
                Skills Assessed
              </CardTitle>
              <CardDescription>
                The skills this assignment evaluates
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {skillsAssessed.map((skill) => {
                  const categoryColors: Record<string, string> = {
                    reading: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
                    writing: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                    "critical-thinking": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
                    "ai-literacy": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                    speaking: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                  };
                  return (
                    <Badge 
                      key={skill.id} 
                      variant="outline" 
                      className={`${categoryColors[skill.category] || ""} text-xs`}
                      title={skill.description}
                    >
                      {skill.name}
                    </Badge>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {assignment.resources && assignment.resources.length > 0 && (
        <section aria-label="Resources">
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                Resources
              </CardTitle>
              <CardDescription>
                Materials to help you complete this assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2">
                {assignment.resources.map((resource, idx) => (
                  <li key={idx}>
                    {resource.url ? (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        {resource.title}
                      </a>
                    ) : (
                      <span className="text-sm">{resource.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};

export default WeekAssignmentPage;
