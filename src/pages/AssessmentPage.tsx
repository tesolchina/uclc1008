import { Link } from "react-router-dom";
import { Target, FileText, Calendar, ArrowRight, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { courseAssignments } from "@/data";

const AssessmentPage = () => {
  // Calculate total weight
  const totalWeight = courseAssignments.reduce((sum, a) => {
    const weight = parseInt(a.weight.replace("%", ""));
    return sum + (isNaN(weight) ? 0 : weight);
  }, 0);

  const weightDiscrepancy = totalWeight !== 100;

  return (
    <div className="space-y-8">
      <section className="hero-shell">
        <div className="hero-glow-orb" aria-hidden="true" />
        <div className="hero-inner">
          <div className="space-y-4">
            <span className="hero-badge">
              <Target className="h-3.5 w-3.5" />
              UCLC 1008 Assessments
            </span>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Assessment & Goals
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Complete overview of all course assessments, their weights, and due dates. 
              Click on any assessment to view detailed requirements and sample responses.
            </p>
          </div>
        </div>
      </section>

      {/* Teacher Note - only shown when there's an issue */}
      {weightDiscrepancy && (
        <Alert variant="destructive" className="border-amber-500/50 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <AlertTriangle className="h-4 w-4 !text-amber-600" />
          <AlertTitle className="text-amber-800 dark:text-amber-300">Teacher Action Required</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-400 space-y-2">
            <p>
              <strong>Weight discrepancy:</strong> Combined assessment weight is {totalWeight}%, not 100%. 
              Please check the source rubric document and update the assignment weights accordingly.
            </p>
            <p>
              <strong>Moodle links:</strong> Remember to add links to the official Moodle assessment pages 
              for each assignment in the assignment data files.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Assessment Summary */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-primary">{courseAssignments.length}</CardTitle>
            <CardDescription>Total Assessments</CardDescription>
          </CardHeader>
        </Card>
        <Card className={`card-elevated ${weightDiscrepancy ? 'border-amber-500/50' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-2xl font-bold ${weightDiscrepancy ? 'text-amber-600' : 'text-primary'}`}>
              {totalWeight}%
            </CardTitle>
            <CardDescription>
              Combined Weight {weightDiscrepancy && <span className="text-amber-600">(should be 100%)</span>}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-primary">13 Weeks</CardTitle>
            <CardDescription>Course Duration</CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Assessment Table */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              All Assessments
            </h2>
            <p className="text-sm text-muted-foreground">
              Click on an assessment to view detailed instructions and requirements.
            </p>
          </div>
        </div>

        <Card className="card-elevated overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {courseAssignments.map((assignment) => (
                <Link
                  key={assignment.id}
                  to={`/week/${assignment.dueWeek}/assignment/${assignment.id}`}
                  className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-muted/50 transition-colors group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm group-hover:text-primary transition-colors">
                        {assignment.title}
                      </span>
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {assignment.type}
                      </Badge>
                      {assignment.duration && (
                        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {assignment.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {assignment.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Week {assignment.dueWeek}
                      </div>
                    </div>
                    <Badge className="min-w-[50px] justify-center">{assignment.weight}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Course Goals */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Course Goals</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="card-elevated">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">What you will be able to do</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground space-y-1.5">
              <p>• Examine academic discourse, including how arguments are constructed using various models.</p>
              <p>• Evaluate arguments in academic texts using appropriate academic conventions.</p>
              <p>• Construct well-supported and logical arguments through the recursive writing process.</p>
              <p>• Formulate critical spoken responses to arguments presented in audio texts.</p>
              <p>• Use AI as a learning partner for independent learning in academic skills.</p>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">How to use this hub strategically</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground space-y-1.5">
              <p>• Preview the reading passages and complete all the homework tasks.</p>
              <p>• Focus on developing skills in summarising, paraphrasing, and synthesising.</p>
              <p>• Practice argumentation models (Toulmin, Rogerian) for ACE assignments.</p>
              <p>• Use AI tools ethically while maintaining academic integrity.</p>
              <p>• Engage actively in peer evaluations and reflective learning.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/week/1">Start with Week 1</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Back to Course Overview</Link>
        </Button>
      </section>
    </div>
  );
};

export default AssessmentPage;
