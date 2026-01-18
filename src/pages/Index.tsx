import { BookOpenCheck, Clock3, GraduationCap, Target, CheckCircle2, AlertTriangle, User, ExternalLink, Calendar, FileText, AlertCircle, Book, PenLine, Mic, Users, Brain, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { CollapsibleSection } from "@/components/CollapsibleSection";

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
    activities: "Course Introduction • Components of Academic Journal Articles",
    assignments: "Flipped Classroom Videos: In-text Citations, Reference List, Secondary Citations",
    highlight: false,
  },
  {
    week: 2,
    dates: "19-23 Jan",
    activities: "Summarising, Paraphrasing & Synthesising Skills",
    assignments: "Pre-course Writing (2.5%) [Due: 23 Jan, 6pm]",
    highlight: true,
    highlightType: "assignment",
    assignmentLink: "/week/1/assignment/pre-course-writing",
  },
  {
    week: 3,
    dates: "26-30 Jan",
    activities: "Summarising, Paraphrasing & Synthesising Skills",
    assignments: "Referencing Quiz (2.5%) [Due: 30 Jan, 6pm]",
    highlight: true,
    highlightType: "assignment",
    assignmentLink: "/week/3/assignment/referencing-quiz",
  },
  {
    week: 4,
    dates: "2-6 Feb",
    activities: "Module 3: Argumentation Models",
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
    activities: "In-class Academic Writing Quiz (15%) [60 mins]",
    assignments: "",
    highlight: true,
    highlightType: "exam",
    assignmentLink: "/week/6/assignment/academic-writing-quiz",
  },
  {
    week: 7,
    dates: "2-6 Mar",
    activities: "Module 4: Critical Response to Academic Arguments",
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
    activities: "In-class ACE Draft (15%) [100 mins]",
    assignments: "",
    highlight: true,
    highlightType: "exam",
    assignmentLink: "/week/9/assignment/ace-draft",
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
    activities: "Individual Student Consultations (No classes)",
    assignments: "Peer Evaluation (5%) [Due: 17 Apr, 6pm]",
    highlight: true,
    highlightType: "assignment",
  },
  {
    week: 12,
    dates: "20-24 Apr",
    activities: "In-class CRAA (20%)",
    assignments: "Reflective Portfolio (10%) + ACE Final (25%) [Due: 1 May]",
    highlight: true,
    highlightType: "exam",
  },
];

// Detailed assessments from PDF
const assessments = [
  {
    name: "Academic Writing Quiz",
    weight: "15%",
    type: "In-class",
    timing: "Week 6 (23-27 Feb) - TBA",
    cilos: "1, 2, 3",
    description: "Students will summarise, paraphrase and synthesise the main claims or arguments from two academic journal excerpts in no more than 300 words, ensuring the use of academic tone and proper citations and references.",
    icon: PenLine,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    link: "/week/6/assignment/academic-writing-quiz",
  },
  {
    name: "ACE Draft",
    weight: "15%",
    type: "In-class",
    timing: "Week 9 (16-20 Mar)",
    cilos: "1, 2, 3",
    description: "Based on academic articles provided, students will write a draft of around 400 words, utilising a specific argumentation model to construct a detailed argument, a counterargument and a rebuttal on a selected topic.",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    link: "/week/9/assignment/ace-draft",
  },
  {
    name: "ACE Final",
    weight: "25%",
    type: "Take-home",
    timing: "Due: 1 May",
    cilos: "1, 2, 3, 5",
    description: "Students will incorporate feedback from teachers, AI tools, and peers during the process of revision and extend the draft to no more than 900 words.",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "CRAA",
    weight: "20%",
    type: "In-class",
    timing: "Week 12 (20-24 Apr)",
    cilos: "1, 2, 4",
    description: "Students will listen to a short audio clip with background information and an argument, then prepare and present a verbal response in the form of a summary and a rebuttal.",
    icon: Mic,
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
  },
  {
    name: "Reflective Learning Portfolio",
    weight: "10%",
    type: "Take-home",
    timing: "Due: 1 May",
    cilos: "5",
    description: "500-word portfolio reflecting on AI use in ACE Final and learning throughout the course, including a record of AI interactions, drafts, and revisions.",
    icon: Brain,
    color: "text-green-600",
    bgColor: "bg-green-500/10",
  },
  {
    name: "Class Participation",
    weight: "15%",
    type: "Ongoing",
    timing: "Whole semester",
    cilos: "1, 2, 3, 4",
    description: "Includes in- and out-of-class activities (5%), Peer Evaluation (5%), Pre-course Writing (2.5%), and Referencing Quiz (2.5%).",
    icon: Users,
    color: "text-cyan-600",
    bgColor: "bg-cyan-500/10",
    subItems: [
      { name: "In/out-of-class activities", weight: "5%", timing: "Whole semester" },
      { name: "Peer Evaluation on ACE Draft", weight: "5%", timing: "13-17 Apr", link: null },
      { name: "Pre-course Writing", weight: "2.5%", timing: "Due: 23 Jan", link: "/week/1/assignment/pre-course-writing" },
      { name: "Referencing Quiz", weight: "2.5%", timing: "Due: 30 Jan", link: "/week/3/assignment/referencing-quiz" },
    ],
  },
];

const Index = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section - Always visible */}
      <section className="hero-shell">
        <div className="hero-glow-orb" aria-hidden="true" />
        <div className="hero-inner">
          <div className="space-y-4">
            <span className="hero-badge">
              <GraduationCap className="h-3.5 w-3.5" />
              UCLC 1008 · University English I
            </span>
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Course Information Sheet
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              University English I (UE1) • Semester 2, 2025-26 • Course Coordinator: Leo Yu
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/week/1/hour/1">Start Week 1</Link>
              </Button>
              <Button asChild variant="outline">
                <a 
                  href="https://buelearning.hkbu.edu.hk/mod/resource/view.php?id=1894083" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  PDF Version
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a 
                  href="https://buelearning.hkbu.edu.hk/pluginfile.php/3346546/mod_resource/content/3/3.01%20UE1%20%282526B%29%20Module%201%20%28Student%29.pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <Book className="h-4 w-4" />
                  Module 1
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Course Aims - Collapsible */}
      <CollapsibleSection
        id="course_aims"
        title="Course Aims & Descriptions"
        icon={<Target className="h-4 w-4 text-primary" />}
        defaultOpen={false}
        className="border-primary/20 bg-primary/5"
      >
        <div className="text-sm text-muted-foreground space-y-3">
          <p>
            This course aims to enhance students' English language skills in <strong>critical reading, listening, academic writing, and speaking</strong>.
          </p>
          <p>This course strengthens students' ability to:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Analyse academic discourse by examining rhetorical and linguistic features, and formulate arguments using various argumentation models</li>
            <li>Respond critically to ideas through examining and evaluating evidence and arguments</li>
            <li>Develop critical thinking, reading and writing skills for crafting well-structured academic essays</li>
            <li>Use reflection and self-assessment to become more independent readers and writers</li>
          </ol>
        </div>
      </CollapsibleSection>

      {/* Key Facts - Collapsible */}
      <CollapsibleSection
        id="key_facts"
        title="Key Facts to Know"
        icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
        defaultOpen={false}
        className="border-green-500/30 bg-green-500/5"
      >
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">5 CILOs</p>
              <p className="text-xs text-muted-foreground">Critical reading, argument evaluation, academic writing, speaking, and AI as learning partner</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">4 Modules</p>
              <p className="text-xs text-muted-foreground">Academic Articles → Summarising/Paraphrasing → Argumentation → Critical Response</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-sm">6 Assessments (100%)</p>
              <p className="text-xs text-muted-foreground">Class Participation (15%), AWQ (15%), ACE Draft (15%), ACE Final (25%), CRAA (20%), Portfolio (10%)</p>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Note to Students - Collapsible */}
      <CollapsibleSection
        id="student_note"
        title="Note to All Students"
        icon={<AlertCircle className="h-4 w-4 text-primary" />}
        defaultOpen={false}
        className="border-primary/50 bg-primary/5"
      >
        <div className="text-sm text-muted-foreground">
          University English I aims to strengthen your ability to read, write and speak critically. 
          To make effective use of our limited class time, you should <strong>preview the reading passages</strong> and <strong>complete all the homework tasks</strong>.
        </div>
      </CollapsibleSection>

      {/* Weekly Teaching Schedule - Collapsible */}
      <CollapsibleSection
        id="weekly_schedule"
        title="Weekly Teaching Schedule"
        icon={<Calendar className="h-4 w-4 text-primary" />}
        defaultOpen={false}
      >
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">Week</TableHead>
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
                  <TableCell className="font-medium text-center">
                    <Link to={`/week/${item.week}`} className="hover:text-primary hover:underline flex items-center justify-center">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold">
                        {item.week}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{item.dates}</TableCell>
                  <TableCell className="text-sm">
                    {item.highlightType === "exam" && (
                      <Badge className="mr-2 bg-amber-500 text-white text-[10px]">In-class Test</Badge>
                    )}
                    {item.highlightType === "exam" && item.assignmentLink ? (
                      <Link to={item.assignmentLink} className="text-primary hover:underline">
                        {item.activities}
                      </Link>
                    ) : (
                      item.activities
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {item.assignmentLink && item.highlightType === "assignment" ? (
                      <Link to={item.assignmentLink} className="text-primary hover:underline">
                        {item.assignments}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">{item.assignments}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CollapsibleSection>

      {/* Assessments Section - Collapsible */}
      <CollapsibleSection
        id="assessments"
        title="Assessments"
        description="Students' progress will be evaluated through the following assessments/tests"
        icon={<Target className="h-4 w-4 text-primary" />}
        defaultOpen={false}
      >
        <div className="grid gap-4">
          {assessments.map((assessment) => (
            <Card key={assessment.name} className={`${assessment.bgColor} border-0`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${assessment.bgColor}`}>
                      <assessment.icon className={`h-5 w-5 ${assessment.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        {assessment.link ? (
                          <Link to={assessment.link} className="hover:underline hover:text-primary">
                            {assessment.name}
                          </Link>
                        ) : (
                          assessment.name
                        )}
                        <Badge variant="secondary" className="text-xs">{assessment.weight}</Badge>
                        {assessment.link && (
                          <Link to={assessment.link}>
                            <ArrowRight className="h-3 w-3 text-muted-foreground hover:text-primary" />
                          </Link>
                        )}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <Badge variant="outline" className="text-[10px]">{assessment.type}</Badge>
                        <Badge variant="outline" className="text-[10px]">{assessment.timing}</Badge>
                        <Badge variant="outline" className="text-[10px]">CILOs {assessment.cilos}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{assessment.description}</p>
                {assessment.subItems && (
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium">Breakdown:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {assessment.subItems.map((sub, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                          {sub.link ? (
                            <Link to={sub.link} className="text-primary hover:underline">
                              {sub.name} ({sub.weight}) - {sub.timing}
                            </Link>
                          ) : (
                            <span>{sub.name} ({sub.weight}) - {sub.timing}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CollapsibleSection>

      {/* CILOs Section - Collapsible */}
      <CollapsibleSection
        id="cilos"
        title="Course Intended Learning Outcomes (CILOs)"
        description="Upon successful completion of this course, students should be able to:"
        icon={<CheckCircle2 className="h-4 w-4 text-primary" />}
        defaultOpen={false}
      >
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
      </CollapsibleSection>

      {/* Course Policies - Collapsible */}
      <CollapsibleSection
        id="course_policies"
        title="Course Policies"
        icon={<FileText className="h-4 w-4 text-primary" />}
        defaultOpen={false}
      >
        <Accordion type="single" collapsible className="w-full">
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
          <AccordionItem value="late-policy">
            <AccordionTrigger className="text-sm">Late Assignment Submissions</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Late assignment submissions will incur a penalty—<strong>one percent will be deducted for each day past the deadline</strong> (weekends and statutory holidays included).
              </p>
              <p>
                Any late submissions of <strong>more than 7 days</strong> past the deadline, without your lecturer's prior approval, will NOT be marked and will receive zero marks.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="plagiarism">
            <AccordionTrigger className="text-sm">Plagiarism Policy</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              <p>
                Plagiarism (copying from other sources without acknowledgement or copying other students' work) is NOT tolerated at HKBU. 
                Should a case of plagiarism be established, University regulations will be strictly applied, potentially including <strong>failing a course or being expelled</strong>.
                Students cannot show, lend, give away or sell parts of their work to other students. If a case is established, <strong>both parties will be punished</strong>.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ai-policy">
            <AccordionTrigger className="text-sm">Use of AI Tools in Assessments</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p>
                While the University encourages the ethical use of AI for learning (e.g. brainstorming ideas, exploring information), 
                <strong>submitting the output of generative AI tools as your own work</strong> is deemed a violation of the University's academic integrity guidelines.
              </p>
              <p>
                If AI detection tools suggest a high percentage of AI-generated text, you will be required to submit a detailed record of your use of such tools. 
                Your instructor may also request an in-person oral or written defence.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="materials">
            <AccordionTrigger className="text-sm">Teaching Materials</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              <p>
                All course handouts, answer keys, assignment details, and relevant supplementary materials will be uploaded to <strong>HKBU Moodle</strong>. 
                All teaching and course materials are protected by copyright. Unauthorized reproduction, distribution, or sharing is strictly prohibited.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CollapsibleSection>

      {/* Creator Info - Collapsible */}
      <CollapsibleSection
        id="course_info"
        title="Course Information"
        icon={<User className="h-4 w-4 text-primary" />}
        defaultOpen={false}
        className="border-primary/20 bg-primary/5"
      >
        <div className="flex items-start gap-4">
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
        </div>
      </CollapsibleSection>

      {/* Quick Links - Collapsible */}
      <CollapsibleSection
        id="quick_links"
        title="Quick Links"
        icon={<ExternalLink className="h-4 w-4 text-primary" />}
        defaultOpen={false}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="card-elevated hover:border-primary/50 transition-colors">
            <Link to="/week/1/hour/1" className="block p-4">
              <CardTitle className="text-sm flex items-center gap-2 mb-2">
                <BookOpenCheck className="h-4 w-4 text-primary" />
                Week 1: Getting Started
              </CardTitle>
              <CardDescription className="text-xs">
                Course introduction and Module 1
              </CardDescription>
            </Link>
          </Card>
          <Card className="card-elevated hover:border-primary/50 transition-colors">
            <Link to="/week/1/assignment/pre-course-writing" className="block p-4">
              <CardTitle className="text-sm flex items-center gap-2 mb-2">
                <PenLine className="h-4 w-4 text-blue-600" />
                Pre-course Writing
              </CardTitle>
              <CardDescription className="text-xs">
                2.5% - Due 23 Jan, 6pm
              </CardDescription>
            </Link>
          </Card>
          <Card className="card-elevated hover:border-primary/50 transition-colors">
            <Link to="/week/3/assignment/referencing-quiz" className="block p-4">
              <CardTitle className="text-sm flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 text-green-600" />
                Referencing Quiz
              </CardTitle>
              <CardDescription className="text-xs">
                2.5% - Due 30 Jan, 6pm
              </CardDescription>
            </Link>
          </Card>
          <Card className="card-elevated hover:border-primary/50 transition-colors">
            <a 
              href="https://buelearning.hkbu.edu.hk/pluginfile.php/3346546/mod_resource/content/3/3.01%20UE1%20%282526B%29%20Module%201%20%28Student%29.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4"
            >
              <CardTitle className="text-sm flex items-center gap-2 mb-2">
                <Book className="h-4 w-4 text-amber-600" />
                Module 1 PDF
                <ExternalLink className="h-3 w-3" />
              </CardTitle>
              <CardDescription className="text-xs">
                Components of Academic Journal Articles
              </CardDescription>
            </a>
          </Card>
        </div>
      </CollapsibleSection>

      <Separator />

      <p className="text-xs text-center text-muted-foreground">
        © 2026 Language Centre - Hong Kong Baptist University
      </p>
    </div>
  );
};

export default Index;
