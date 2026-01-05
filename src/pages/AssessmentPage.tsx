import { Link } from "react-router-dom";
import { Target, FileText, Calendar, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { courseAssignments } from "@/data";

const AssessmentPage = () => {
  // Calculate total weight
  const totalWeight = courseAssignments.reduce((sum, a) => {
    const weight = parseInt(a.weight.replace("%", ""));
    return sum + (isNaN(weight) ? 0 : weight);
  }, 0);

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

      {/* Assessment Summary */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-primary">{courseAssignments.length}</CardTitle>
            <CardDescription>Total Assessments</CardDescription>
          </CardHeader>
        </Card>
        <Card className="card-elevated">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-primary">{totalWeight}%</CardTitle>
            <CardDescription>Combined Weight</CardDescription>
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
              <p>• Communicate appropriately in common university situations (email, tutorials, group work).</p>
              <p>• Understand and summarise short academic texts and talks.</p>
              <p>• Plan, draft, and refine short academic paragraphs and presentations.</p>
            </CardContent>
          </Card>
          <Card className="card-elevated">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">How to use this hub strategically</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground space-y-1.5">
              <p>• Focus on weeks that connect directly to upcoming assignments.</p>
              <p>• Use the AI tutor to rehearse explanations and practice feedback before submitting work.</p>
              <p>• Record useful phrases and strategies in your own words.</p>
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
