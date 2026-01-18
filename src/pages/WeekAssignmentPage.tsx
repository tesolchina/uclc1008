import { useParams, Navigate, Link } from "react-router-dom";
import { getWeekById, getWeekMetaById, getAssignmentById, getSkillById } from "@/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, FileText, ExternalLink, ArrowLeft, BookOpen, Target } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const WeekAssignmentPage = () => {
  const params = useParams();
  const weekId = Number(params.weekId);
  const assignmentId = params.assignmentId;
  
  const week = Number.isNaN(weekId) ? undefined : getWeekById(weekId);
  const meta = Number.isNaN(weekId) ? undefined : getWeekMetaById(weekId);
  const assignment = assignmentId ? getAssignmentById(assignmentId) : undefined;

  if (!week) {
    return <Navigate to="/course_info" replace />;
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
              <Link 
                to="/assessment"
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mr-2"
              >
                <Target className="h-3 w-3" />
                Assessment & Goals
              </Link>
              <span className="week-pill">{week.title}</span>
              <Badge className={typeColors[assignment.type] || "bg-muted"}>
                {assignment.type}
              </Badge>
              <span className="hero-badge font-semibold">{assignment.weight}</span>
              {assignment.detailedInfo?.exactDueDate ? (
                <span className="hero-badge">{assignment.detailedInfo.exactDueDate}</span>
              ) : (
                meta?.dateRange && <span className="hero-badge">{meta.dateRange}</span>
              )}
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
      {assignment.detailedInfo && (
        <section aria-label="Detailed information">
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                Detailed information
              </CardTitle>
              <CardDescription>
                Additional submission, format and grading details for this assignment
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              <Accordion type="single" collapsible defaultValue="general">
                <AccordionItem value="general">
                  <AccordionTrigger>General</AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-muted-foreground space-y-2">
                      {assignment.detailedInfo.exactDueDate && (
                        <div>Exact due date: <strong className="text-foreground">{assignment.detailedInfo.exactDueDate}</strong></div>
                      )}
                      {assignment.detailedInfo.submissionMethod && (
                        <div>Submission method: <strong className="text-foreground">{assignment.detailedInfo.submissionMethod}</strong></div>
                      )}
                      {assignment.detailedInfo.format && (
                        <div>Format: <strong className="text-foreground">{assignment.detailedInfo.format}</strong></div>
                      )}
                      {assignment.detailedInfo.wordLimit && (
                        <div>Word limit: <strong className="text-foreground">{assignment.detailedInfo.wordLimit}</strong></div>
                      )}
                      {assignment.detailedInfo.timeLimit && (
                        <div>Time limit: <strong className="text-foreground">{assignment.detailedInfo.timeLimit}</strong></div>
                      )}

                      {assignment.detailedInfo.latePolicy && (
                        <div>Late policy: <strong className="text-foreground">{assignment.detailedInfo.latePolicy}</strong></div>
                      )}

                      {assignment.detailedInfo.requiredMaterials && (
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Required materials</p>
                          <ul className="list-disc pl-5">
                            {assignment.detailedInfo.requiredMaterials.map((m, i) => (
                              <li key={i} className="text-sm text-muted-foreground">{m}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="grading">
                  <AccordionTrigger>Grading criteria</AccordionTrigger>
                  <AccordionContent>
                    <div>
                      {assignment.detailedInfo.gradingCriteria ? (
                        <ul className="list-disc pl-5">
                          {assignment.detailedInfo.gradingCriteria.map((g, i) => (
                            <li key={i} className="text-sm text-muted-foreground">{g}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-muted-foreground">No grading criteria provided.</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="instructions">
                  <AccordionTrigger>Instructions</AccordionTrigger>
                  <AccordionContent>
                    <div>
                      {assignment.detailedInfo.instructions ? (
                        <ol className="list-decimal pl-5">
                          {assignment.detailedInfo.instructions.map((ins, i) => (
                            <li key={i} className="text-sm text-muted-foreground">{ins}</li>
                          ))}
                        </ol>
                      ) : (
                        <p className="text-sm text-muted-foreground">No instructions provided.</p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Additional resources (samples moved here) */}
      {(assignment.detailedInfo?.sampleQuestions || assignment.detailedInfo?.sampleResponses) && (
        <section aria-label="Additional resources">
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                Additional resources
              </CardTitle>
              <CardDescription>Sample questions and example responses</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-sm text-muted-foreground space-y-2">
                {assignment.detailedInfo?.sampleQuestions && (
                  <div>
                    <p className="font-medium">Sample questions</p>
                    <ul className="list-disc pl-5">
                      {assignment.detailedInfo.sampleQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {assignment.detailedInfo?.sampleResponses && (
                  <div>
                    <p className="font-medium">Sample responses (summaries)</p>
                    <p className="text-sm text-muted-foreground">Example responses are available in the course materials.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

    </div>
  );
};

export default WeekAssignmentPage;
