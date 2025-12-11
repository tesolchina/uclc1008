import { useParams, Navigate, Link } from "react-router-dom";
import { getWeekById, getWeekMetaById, courseAssignments, getSkillById, Assignment } from "@/data/uclc1008-weeks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, BookOpen, ExternalLink, ArrowLeft, Target } from "lucide-react";

const skillCategoryColors: Record<string, string> = {
  "reading": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  "writing": "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
  "critical-thinking": "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  "ai-literacy": "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  "speaking": "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
};

export const WeekAssignmentPage = () => {
  const params = useParams();
  const id = Number(params.weekId);
  const week = Number.isNaN(id) ? undefined : getWeekById(id);
  const meta = Number.isNaN(id) ? undefined : getWeekMetaById(id);

  // Find assignments due this week
  const assignmentsDue = courseAssignments.filter((a) => a.dueWeek === id);

  if (!week) {
    return <Navigate to="/" replace />;
  }

  if (assignmentsDue.length === 0) {
    return <Navigate to={`/week/${id}`} replace />;
  }

  const mainAssignment = assignmentsDue[0];
  const skills = mainAssignment.skillsAssessed.map(getSkillById).filter(Boolean);

  return (
    <div className="space-y-6">
      <section className="hero-shell">
        <div className="hero-glow-orb" aria-hidden="true" />
        <div className="hero-inner">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="week-pill">{week.title}</span>
              <Badge variant="destructive" className="text-xs">{mainAssignment.weight}</Badge>
              <Badge variant="outline" className="text-xs uppercase">{mainAssignment.type}</Badge>
              {mainAssignment.duration && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {mainAssignment.duration}
                </span>
              )}
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {mainAssignment.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              {mainAssignment.description}
            </p>
            <div className="pt-2">
              <Link to={`/week/${id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <ArrowLeft className="h-3 w-3" />
                  Back to {week.title}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4" aria-label="Assignment details">
        {/* Requirements */}
        <Card className="card-elevated border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              Requirements
            </CardTitle>
            <CardDescription>
              Make sure you meet all these requirements to complete the assignment successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-3">
              {mainAssignment.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-[10px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Skills Assessed */}
        {skills.length > 0 && (
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                Skills Assessed
              </CardTitle>
              <CardDescription>
                This assignment tests the following skills you've developed throughout the course.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {skills.map((skill) => skill && (
                <div key={skill.id} className="flex items-start gap-3">
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium ${skillCategoryColors[skill.category]}`}
                  >
                    {skill.name}
                  </span>
                  <p className="text-xs text-muted-foreground">{skill.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Resources */}
        {mainAssignment.resources && mainAssignment.resources.length > 0 && (
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Resources & Materials
              </CardTitle>
              <CardDescription>
                Use these resources to prepare for and complete the assignment.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {mainAssignment.resources.map((res, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-muted/60 px-3 py-2.5">
                  <span className="text-sm font-medium">{res.title}</span>
                  {res.url && (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      Open <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Preparation Tips */}
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">How to Prepare</CardTitle>
            <CardDescription>
              Connect this assignment to skills from previous weeks.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground space-y-3">
            <p>
              This assignment builds on skills introduced in earlier weeks. Review the following to prepare:
            </p>
            <ul className="space-y-2">
              {mainAssignment.skillsAssessed.slice(0, 4).map((skillId) => {
                const skill = getSkillById(skillId);
                if (!skill) return null;
                // Find which week introduced this skill
                const introWeek = Array.from({ length: id }, (_, i) => i + 1)
                  .map((wId) => getWeekById(wId))
                  .find((w) => w?.skillsIntroduced.includes(skillId));
                
                return (
                  <li key={skillId} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>
                      <strong>{skill.name}</strong>
                      {introWeek && (
                        <> – introduced in <Link to={`/week/${introWeek.id}`} className="text-primary hover:underline">Week {introWeek.id}</Link></>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Other assignments due this week */}
        {assignmentsDue.length > 1 && (
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Other Assignments Due This Week</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {assignmentsDue.slice(1).map((assignment) => (
                <div key={assignment.id} className="rounded-lg border bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{assignment.title}</h4>
                    <Badge variant="secondary" className="text-[10px]">{assignment.weight}</Badge>
                    <Badge variant="outline" className="text-[10px] uppercase">{assignment.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{assignment.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};

export default WeekAssignmentPage;
