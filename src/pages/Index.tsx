import { BookOpenCheck, Clock3, GraduationCap, Target, CheckCircle2, AlertTriangle, User, ExternalLink, Calendar, FileText, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

// Course Schedule based on Course Information Sheet
const courseSchedule = [
  {
    week: 1,
    dates: "12-16 Jan",
    activities: "Course Introduction • Module 1: Components of Academic Journal Articles",
    assignments: "Flipped Classroom Videos: In-text Citations and End-of-text Reference List, Secondary Citations",
    highlight: false,
  },
  {
    week: 2,
    dates: "19-23 Jan",
    activities: "Module 1: Components of Academic Journal Articles",
    assignments: "Flipped Classroom Video: AI Literacy • Pre-course Writing (2.5%) [Due: 23 Jan, 6pm]",
    highlight: true,
    highlightType: "assignment",
  },
  {
    week: 3,
    dates: "26-30 Jan",
    activities: "Module 2: Summarising, Paraphrasing & Synthesising Skills",
    assignments: "Referencing Quiz (2.5%) [Due: 30 Jan, 6pm]",
    highlight: true,
    highlightType: "assignment",
  },
  {
    week: 4,
    dates: "2-6 Feb",
    activities: "Module 2: Summarising, Paraphrasing & Synthesising Skills",
    assignments: "",
    highlight: false,
  },
  {
    week: 5,
    dates: "9-13 Feb (H: 16-20 Feb)",
    activities: "Module 3: Argumentation Models",
    assignments: "",
    highlight: false,
  },
  {
    week: 6,
    dates: "23-27 Feb",
    activities: "In-class Academic Writing Quiz (15%) [50 mins] • Module 3: Argumentation Models",
    assignments: "",
    highlight: true,
    highlightType: "exam",
  },
  {
    week: 7,
    dates: "2-6 Mar",
    activities: "Module 3: Argumentation Models • Module 4: Critical Response to Academic Arguments",
    assignments: "",
    highlight: false,
  },
  {
    week: 8,
    dates: "9-13 Mar",
    activities: "Module 4: Critical Response to Academic Arguments",
    assignments: "",
    highlight: false,
  },
  {
    week: 9,
    dates: "16-20 Mar",
    activities: "In-class ACE Draft (15%) [100 mins] • Module 4: Critical Response to Academic Arguments",
    assignments: "",
    highlight: true,
    highlightType: "exam",
  },
  {
    week: 10,
    dates: "23-27 Mar",
    activities: "Module 4: Critical Response to Academic Arguments",
    assignments: "",
    highlight: false,
  },
  {
    week: 11,
    dates: "30 Mar - 10 Apr (H: 2-9 Apr)",
    activities: "Module 4: Critical Response to Academic Arguments",
    assignments: "",
    highlight: false,
  },
  {
    week: 12,
    dates: "13-17 Apr",
    activities: "Individual Student Consultations (No classes)",
    assignments: "Peer Evaluation on ACE Draft (5%) [Due: 17 Apr, 6pm]",
    highlight: true,
    highlightType: "assignment",
  },
  {
    week: 13,
    dates: "20-24 Apr",
    activities: "In-class CRAA (20%)",
    assignments: "Reflective Learning Portfolio (10%) [Due: 1 May] • ACE Final (25%) [Due: 1 May]",
    highlight: true,
    highlightType: "exam",
  },
];

// Assessment breakdown
const assessments = [
  { name: "Academic Writing Quiz", weight: "15%", type: "In-class", week: 6, cilos: "1,2,3" },
  { name: "ACE Draft", weight: "15%", type: "In-class", week: 9, cilos: "1,2,3" },
  { name: "ACE Final", weight: "25%", type: "Take-home", week: 13, cilos: "1,2,3,5" },
  { name: "CRAA", weight: "20%", type: "In-class", week: 13, cilos: "1,2,4" },
  { name: "Reflective Learning Portfolio", weight: "10%", type: "Take-home", week: 13, cilos: "5" },
  { name: "Class Participation", weight: "15%", type: "Ongoing", week: null, cilos: "1,2,3,4" },
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
                <a 
                  href="https://buelearning.hkbu.edu.hk/mod/resource/view.php?id=1894083" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Course Info Sheet (Moodle)
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="week-pill">
                <Clock3 className="mr-1.5 h-3 w-3" /> 20–30 minutes per visit
              </span>
              <span className="week-pill">
                <BookOpenCheck className="mr-1.5 h-3 w-3" /> 13 weekly units
              </span>
              <span className="week-pill">
                <Calendar className="mr-1.5 h-3 w-3" /> Semester 2, 2025-26
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <Alert className="border-2 border-primary/50 bg-primary/5">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle className="text-base font-semibold">Important Notice for UE1 Students</AlertTitle>
        <AlertDescription className="mt-2 space-y-2 text-sm text-foreground">
          <p>
            This <strong>AI-powered learning platform</strong> was developed by <strong>Dr Simon Wang</strong> and the UE1 team 
            for students taking University English I (UCLC 1008) in <strong>Spring 2026</strong>.
          </p>
          <p>
            <strong>AI is integrated throughout this platform</strong> to provide personalized feedback, instant explanations, 
            and adaptive learning support. You are encouraged to engage with the AI tutor to enhance your learning experience.
          </p>
          <p className="font-medium text-primary">
            Note: Please consult your own teachers regarding specific course requirements and assessment expectations for your classes.
          </p>
        </AlertDescription>
      </Alert>

      {/* Week 6 Highlight */}
      <Card className="border-2 border-amber-500/50 bg-amber-500/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg">Key Milestone: Week 6 - Academic Writing Quiz (15%)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            The <strong>Academic Writing Quiz</strong> is a major in-class assessment worth <strong>15%</strong> of your final grade. 
            You will summarise, paraphrase and synthesise main claims from two academic journal excerpts in no more than 300 words.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-amber-500/50 text-amber-700">50 minutes</Badge>
            <Badge variant="outline" className="border-amber-500/50 text-amber-700">In-class</Badge>
            <Badge variant="outline" className="border-amber-500/50 text-amber-700">CILOs 1, 2, 3</Badge>
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm" asChild>
              <Link to="/week/1/hour/1">Prepare Now →</Link>
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link to="/assessment">View All Assessments</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Course Schedule */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Course Schedule
            </h2>
            <p className="text-sm text-muted-foreground">
              13-week overview based on the official Course Information Sheet
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a 
              href="https://buelearning.hkbu.edu.hk/mod/resource/view.php?id=1894083" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Full PDF
            </a>
          </Button>
        </div>

        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-16">Week</TableHead>
                <TableHead className="w-32">Dates</TableHead>
                <TableHead>Teaching & Learning Activities</TableHead>
                <TableHead>Assignments / Homework</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courseSchedule.map((item) => (
                <TableRow 
                  key={item.week}
                  className={
                    item.highlight 
                      ? item.highlightType === "exam" 
                        ? "bg-amber-500/10 hover:bg-amber-500/15" 
                        : "bg-blue-500/10 hover:bg-blue-500/15"
                      : ""
                  }
                >
                  <TableCell className="font-medium">
                    <Link to={`/week/${item.week}`} className="hover:text-primary hover:underline">
                      {item.week}
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.dates}</TableCell>
                  <TableCell className="text-sm">
                    {item.highlightType === "exam" && (
                      <Badge className="mr-2 bg-amber-500 text-white">In-class Test</Badge>
                    )}
                    {item.activities}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {item.assignments}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Assessment Summary */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Assessment Summary
          </h2>
          <p className="text-sm text-muted-foreground">
            Your progress will be evaluated through these assessments
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {assessments.map((assessment) => (
            <Card key={assessment.name} className="card-elevated">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{assessment.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs font-bold">{assessment.weight}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-[10px]">{assessment.type}</Badge>
                  {assessment.week && (
                    <Badge variant="outline" className="text-[10px]">Week {assessment.week}</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">CILOs: {assessment.cilos}</p>
              </CardContent>
            </Card>
          ))}
        </div>
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

      {/* Course Policies */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Important Policies
        </h2>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="ai-policy">
            <AccordionTrigger className="text-sm">Use of AI Tools in Assessments</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>
                While the University encourages the ethical use of AI for learning (e.g. for brainstorming ideas, exploring information), 
                submitting the output of generative AI tools as your own work in any assignment is deemed a violation of the University's academic integrity guidelines.
              </p>
              <p>
                If AI detection tools suggest that your assignment contains a high percentage of AI-generated text, 
                you will be required to submit a detailed record of your use of such tools.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="late-policy">
            <AccordionTrigger className="text-sm">Late Assignment Submissions</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Late assignment submissions will incur a penalty—<strong>one percent will be deducted for each day past the deadline</strong> (weekends and statutory holidays included).
              </p>
              <p>
                Any late submissions of more than 7 days past the deadline, without your lecturer's prior approval, will NOT be marked and will receive zero marks.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="plagiarism">
            <AccordionTrigger className="text-sm">Plagiarism Policy</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              <p>
                Plagiarism (i.e. copying from other sources without an acknowledgement or copying other students' work) is NOT tolerated at HKBU. 
                Should a case of plagiarism be established, University regulations will be strictly applied, and these potentially include failing a course or being expelled from the University.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="attendance">
            <AccordionTrigger className="text-sm">Attendance Policy</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              <p>
                Students are expected to attend all scheduled classes. If absence is due to circumstances beyond their control, 
                to apply for make-up work, a written explanation together with supporting documents must be presented to the course instructor 
                for approval within <strong>FIVE calendar days</strong> after the absence.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

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
              Platform developed by Dr Simon Wang. This AI-assisted learning hub leverages artificial intelligence to help students develop critical academic English skills.
            </p>
          </div>
        </CardContent>
      </Card>

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
