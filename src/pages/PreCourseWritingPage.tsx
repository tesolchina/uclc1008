import { Link, useLocation } from "react-router-dom";
import { preCourseWriting, preCourseWritingArticle } from "@/data/assignments/preCourseWriting";
import { week2, week2Meta } from "@/data/weeks/week2";
import { week1, week1Meta } from "@/data/weeks/week1";
import { getSkillById } from "@/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, FileText, ExternalLink, ArrowLeft, BookOpen, ScrollText, Quote, AlertTriangle, ShieldAlert } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { useAuth } from "@/contexts/AuthContext";

const PreCourseWritingPage = () => {
  const location = useLocation();
  const { profile } = useAuth();
  const assignment = preCourseWriting;
  
  // Determine if user came from week 1 or week 2
  const isFromWeek1 = location.pathname.includes("/week/1/");
  const week = isFromWeek1 ? week1 : week2;
  const meta = isFromWeek1 ? week1Meta : week2Meta;
  const backLink = isFromWeek1 ? "/week/1" : "/week/2";

  // Check if user is a teacher for showing teacher-only resources
  const isTeacher = profile?.role === 'teacher' || profile?.role === 'admin';

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
              to={backLink}
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

      {/* Source Article */}
      <CollapsibleSection
        title="Source Article"
        description="Read this excerpt before completing your tasks"
        icon={<ScrollText className="h-4 w-4 text-primary" />}
        defaultOpen={true}
        className="border-primary/30 bg-primary/5"
      >
        <div className="space-y-4">
          <div className="rounded-lg bg-muted/50 p-4 border border-border">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Full Citation</p>
            <p className="text-sm italic text-foreground">{preCourseWritingArticle.fullCitation}</p>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="text-base font-semibold text-foreground mb-4">Facial recognition technologies in education</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {preCourseWritingArticle.content}
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
            <div className="flex items-start gap-3">
              <Quote className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">Citation Examples (APA 7th)</p>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li><strong>Author-prominent:</strong> Andrejevic and Selwyn (2020) report that...</li>
                  <li><strong>Signal-phrase:</strong> According to Andrejevic and Selwyn (2020),...</li>
                  <li><strong>Information-prominent:</strong> Facial recognition technologies are... (Andrejevic & Selwyn, 2020).</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Essay Topic */}
      <Card className="card-elevated border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="h-4 w-4 text-primary" />
            Essay Topic (Task 2)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <blockquote className="border-l-4 border-primary pl-4 italic text-foreground">
            "Is it advisable for schools to adopt facial recognition technologies on campus? Why or why not?"
          </blockquote>
        </CardContent>
      </Card>

      {/* AI Policy Warning */}
      <Card className="card-elevated border-destructive/30 bg-destructive/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base text-destructive">
            <ShieldAlert className="h-4 w-4" />
            AI Policy & Plagiarism Warning
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2">
            {assignment.detailedInfo?.aiPolicy?.map((policy, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                <span>{policy}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

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
                {assignment.resources.map((resource, idx) => {
                  // Hide teacher-only resources from students
                  if (resource.title.includes("Teacher Folder") && !isTeacher) {
                    return null;
                  }
                  return (
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
                  );
                })}
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
                Detailed Information
              </CardTitle>
              <CardDescription>
                Submission, format and grading details
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
                      {assignment.detailedInfo.latePolicy && (
                        <div>Late policy: <strong className="text-foreground">{assignment.detailedInfo.latePolicy}</strong></div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="grading">
                  <AccordionTrigger>Grading Criteria</AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc pl-5">
                      {assignment.detailedInfo.gradingCriteria?.map((g, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{g}</li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="instructions">
                  <AccordionTrigger>Step-by-Step Instructions</AccordionTrigger>
                  <AccordionContent>
                    <ol className="list-decimal pl-5 space-y-1">
                      {assignment.detailedInfo.instructions?.map((ins, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{ins}</li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Task Summary */}
      {assignment.detailedInfo?.sampleQuestions && (
        <section aria-label="Task Summary">
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-primary" />
                Task Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-3">
                {assignment.detailedInfo.sampleQuestions.map((q, i) => (
                  <li key={i} className="rounded-lg bg-muted/50 p-3">
                    <p className="text-sm font-medium text-foreground">{q}</p>
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

export default PreCourseWritingPage;
