import { BookOpenCheck, Clock3, Compass, GraduationCap, Target, CheckCircle2, AlertTriangle, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// CILOs - Course Intended Learning Outcomes
const cilos = [
  {
    id: 1,
    title: "Critical Reading & Analysis",
    description: "Critically read and analyse academic texts to identify key arguments, evidence, and rhetorical strategies.",
  },
  {
    id: 2,
    title: "Academic Writing",
    description: "Produce coherent academic writing that demonstrates appropriate use of sources, citations, and academic conventions.",
  },
  {
    id: 3,
    title: "Synthesis & Evaluation",
    description: "Synthesise information from multiple sources and evaluate the validity of arguments and evidence.",
  },
  {
    id: 4,
    title: "Academic Communication",
    description: "Communicate ideas effectively in academic contexts, including seminars, presentations, and written assignments.",
  },
  {
    id: 5,
    title: "AI Literacy",
    description: "Demonstrate critical awareness of AI tools in academic work, including appropriate and ethical use.",
  },
];

const Index = () => {
  return (
    <div className="space-y-8">
      <section className="hero-shell">
        <div className="hero-glow-orb" aria-hidden="true" />
        <div className="hero-inner">
          <div className="space-y-4">
            <span className="hero-badge">
              <GraduationCap className="h-3.5 w-3.5" />
              UCLC 1008 · University English I
            </span>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              AI-assisted hub for independent English learning
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Work through 13 weeks of short, focused lessons at your own pace. Use the AI tutor to check your
              understanding, improve your writing, and design extra practice.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/week/1">Start with Week 1</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/assessment">View all assessments</Link>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="week-pill">
                <Clock3 className="mr-1.5 h-3 w-3" /> 20–30 minutes per visit
              </span>
              <span className="week-pill">
                <BookOpenCheck className="mr-1.5 h-3 w-3" /> 13 weekly units
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <Alert variant="destructive" className="border-2 border-destructive/50 bg-destructive/5">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-base font-semibold">Important Notice for Students from Other Sections</AlertTitle>
        <AlertDescription className="mt-2 space-y-2 text-sm">
          <p>
            This website is designed specifically for <strong>Section 53 (Spring 2026)</strong>. Students from other sections 
            are welcome to access these materials for independent study purposes.
          </p>
          <p className="font-medium text-destructive">
            However, you must consult your own section teacher about course requirements, assessment criteria, and 
            how to do well in this course. The materials and guidance here may differ from what your teacher expects.
          </p>
        </AlertDescription>
      </Alert>

      {/* Creator Info */}
      <Card className="card-elevated border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold">Created by Dr Simon Wang</h3>
            <p className="text-xs text-muted-foreground">
              Lecturer in English & Innovation Officer, Language Centre, Hong Kong Baptist University
            </p>
            <p className="text-xs text-muted-foreground">
              This AI-assisted learning hub will be used to teach Section 53 in Spring 2026.
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-3" aria-label="How to use this hub">
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Compass className="h-4 w-4 text-primary" />
              1. Choose your week
            </CardTitle>
            <CardDescription>Select the week that matches where you are in the course timetable.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">
            Each week has clear outcomes, core materials, and stretch tasks. You can always revisit previous weeks.
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4 text-primary" />
              2. Work through tasks
            </CardTitle>
            <CardDescription>Follow the suggested sequence, but pause where you need more time.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">
            Combine listening, reading, and practice activities. Check your understanding after each mini-step.
          </CardContent>
        </Card>
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpenCheck className="h-4 w-4 text-primary" />
              3. Ask the AI tutor
            </CardTitle>
            <CardDescription>Use the AI tutor in each week as your on-demand study partner.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">
            Paste your own sentences, summaries, or questions. Ask for feedback, not just answers, to develop your skills.
          </CardContent>
        </Card>
      </section>

      {/* CILOs Section */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Course Intended Learning Outcomes (CILOs)
            </h2>
            <p className="text-sm text-muted-foreground">
              By the end of this course, you will be able to demonstrate these competencies.
            </p>
          </div>
          <Badge variant="outline" className="text-[11px] uppercase tracking-[0.18em]">
            5 outcomes
          </Badge>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {cilos.map((cilo) => (
            <Card key={cilo.id} className="card-elevated">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-start gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                    {cilo.id}
                  </span>
                  {cilo.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">{cilo.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">Quick Links</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="card-elevated hover:border-primary/50 transition-colors">
            <Link to="/assessment" className="block p-4">
              <CardTitle className="text-sm flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-primary" />
                Assessment & Goals
              </CardTitle>
              <CardDescription className="text-xs">
                View all course assessments, their weights, due dates, and detailed requirements.
              </CardDescription>
            </Link>
          </Card>
          <Card className="card-elevated hover:border-primary/50 transition-colors">
            <Link to="/week/1" className="block p-4">
              <CardTitle className="text-sm flex items-center gap-2 mb-2">
                <BookOpenCheck className="h-4 w-4 text-primary" />
                Week 1: Getting Started
              </CardTitle>
              <CardDescription className="text-xs">
                Begin your journey with an introduction to academic journal articles.
              </CardDescription>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
