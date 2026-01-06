import { BookOpenCheck, Clock3, GraduationCap, Target, CheckCircle2, AlertTriangle, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// CILOs - Course Intended Learning Outcomes
const cilos = [
  {
    id: 1,
    title: "Examine Academic Discourse",
    description: "Examine academic discourse, including how arguments are constructed using various models and their rhetorical purposes, pattern of development, and style.",
  },
  {
    id: 2,
    title: "Evaluate Arguments in Academic Texts",
    description: "Evaluate arguments in academic texts, as well as summarise and synthesise source materials by using appropriate academic conventions and specific citation and referencing styles (e.g. APA), and understand the rhetorical functions of citations.",
  },
  {
    id: 3,
    title: "Construct Well-Supported Arguments",
    description: "Construct well-supported and logical arguments by engaging in the recursive process of reading, inventing, drafting, reviewing, reflecting, rewriting, revising, and editing.",
  },
  {
    id: 4,
    title: "Formulate Critical Spoken Responses",
    description: "Formulate critical spoken responses to arguments presented in audio texts, utilising various argumentation models to strengthen the responses.",
  },
  {
    id: 5,
    title: "Use AI as Learning Partner",
    description: "Use AI, as a learning partner, and appropriate self-access multimedia resources to foster independent learning in reading, listening, speaking and writing skills.",
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
              University English I (UE1) - Critical Academic Skills
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              This course aims to enhance students' English language skills in critical reading, listening, academic writing, as well as speaking. Work through 13 weeks of focused lessons on academic discourse analysis, argumentation, and AI-assisted learning.
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
            This website is designed specifically for <strong>Semester 2, 2025-26 (UE1)</strong>. Students from other sections
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
            <h3 className="text-sm font-semibold">Course Coordinator: Leo Yu</h3>
            <p className="text-xs text-muted-foreground">
              Language Centre, Hong Kong Baptist University
            </p>
            <p className="text-xs text-muted-foreground">
              This AI-assisted learning hub supports students in developing critical academic English skills for University English I.
            </p>
          </div>
        </CardContent>
      </Card>


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
