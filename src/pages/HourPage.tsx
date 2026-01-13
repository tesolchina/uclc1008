import { useParams, Link } from "react-router-dom";
import { getHourData } from "@/data/hourContent";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ObjectiveTask } from "@/components/tasks/ObjectiveTask";
import { WritingTask } from "@/components/tasks/WritingTask";
import { AskQuestionButton } from "@/components/tasks/AskQuestionButton";
import { StudentLoginReminder } from "@/components/StudentLoginReminder";
import { QuickCheckMC } from "@/components/lessons/QuickCheckMC";
import { LectureOutline, useSectionProgress, generateSectionId } from "@/features/lecture-mode";
import type { AgendaSectionEnhanced } from "@/features/lecture-mode";
import { ArrowLeft, ArrowRight, Clock, Target, BookOpen, PenLine, CheckCircle2, Lightbulb, FileText, Sparkles, ExternalLink, AlertCircle, Calendar, GraduationCap } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function HourPage() {
  const { weekId, hourId } = useParams();
  const weekNumber = parseInt(weekId || "1");
  const hourNumber = parseInt(hourId || "1");
  const { user } = useAuth();
  
  const hourData = getHourData(weekNumber, hourNumber);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSectionIndices, setCompletedSectionIndices] = useState<number[]>([]);

  // Section progress for students
  const { progress, updateNotes } = useSectionProgress({ weekNumber, hourNumber });

  // Convert agenda to enhanced sections with IDs
  const sectionsWithIds: AgendaSectionEnhanced[] = useMemo(() => {
    if (!hourData?.agenda) return [];
    return hourData.agenda.map((item, index) => ({
      ...item,
      id: generateSectionId(index, item.title),
    }));
  }, [hourData?.agenda]);

  // Build notes map from progress
  const sectionNotes = useMemo(() => {
    const notes: Record<string, string> = {};
    progress.forEach(p => {
      if (p.notes) notes[p.sectionId] = p.notes;
    });
    return notes;
  }, [progress]);

  // Handle section click (for students reviewing completed sections)
  const handleSectionClick = useCallback((index: number) => {
    setCurrentSectionIndex(index);
  }, []);

  // Handle notes change
  const handleNotesChange = useCallback((sectionId: string, notes: string) => {
    updateNotes(sectionId, notes);
  }, [updateNotes]);

  if (!hourData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Hour not found</h2>
        <p className="text-muted-foreground mb-4">This lesson hour doesn't exist yet.</p>
        <Button asChild>
          <Link to={`/week/${weekNumber}`}>Back to Week {weekNumber}</Link>
        </Button>
      </div>
    );
  }

  const handleTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => new Set([...prev, taskId]));
  };

  const objectiveTasks = hourData.tasks.filter(t => 
    t.type === "mc" || t.type === "true-false" || t.type === "fill-blank"
  );
  const writingTasks = hourData.tasks.filter(t => 
    t.type === "short-answer" || t.type === "sentence" || t.type === "paragraph"
  );

  // Navigation
  const prevHour = hourNumber > 1 ? hourNumber - 1 : null;
  const nextHour = hourNumber < 3 ? hourNumber + 1 : null;
  const prevWeek = hourNumber === 1 && weekNumber > 1 ? weekNumber - 1 : null;
  const nextWeek = hourNumber === 3 && weekNumber < 5 ? weekNumber + 1 : null;

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6 min-w-0">
        {/* Sign-in Reminder */}
        {!user && <StudentLoginReminder />}

        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/week/${weekNumber}`} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Week {weekNumber}
            </Link>
          </Button>
          <AskQuestionButton weekNumber={weekNumber} hourNumber={hourNumber} />
        </div>

        {/* Hero Section */}
        <section className="rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border p-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">Week {weekNumber} • Hour {hourNumber}</Badge>
              {hourData.ciloLinks.map((cilo, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">{cilo}</Badge>
              ))}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{hourData.title}</h1>
            <p className="text-muted-foreground">{hourData.theme}</p>
          </div>
        </section>

        {/* Week 1 Hour 1: Restructured Course Introduction */}
        {weekNumber === 1 && hourNumber === 1 && (
          <section className="space-y-6">
            {/* Part 1: Course Introduction */}
            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Part 1: Course Introduction</CardTitle>
                </div>
                <CardDescription>
                  Start by reviewing the key course information on our Course Overview page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="default" className="w-full justify-start h-auto py-3" asChild>
                  <Link to="/" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <div className="text-left flex-1">
                      <div className="font-medium">View Course Overview</div>
                      <div className="text-xs opacity-80">Key facts, schedule, assessments, CILOs & policies</div>
                    </div>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Part 2: Introduction to Skimming & Scanning + Practice */}
            <Card className="border-2 border-green-500/30 bg-green-500/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">Part 2: Skimming & Scanning</CardTitle>
                </div>
                <CardDescription>
                  Learn essential reading techniques for academic texts, then practice with a real article
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Skimming Introduction */}
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    What is Skimming?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Skimming</strong> is a reading technique that allows you to quickly get the main idea and structure of a text 
                    without reading every word. It's essential for academic reading when you need to evaluate many sources.
                  </p>
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Read titles, headings, and subheadings</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Look at the first and last sentences of paragraphs</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Notice bold, italicized, or underlined text</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Check the abstract and conclusion first</span>
                    </div>
                  </div>
                </div>

                {/* Scanning Introduction */}
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-500" />
                    What is Scanning?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Scanning</strong> is used to find specific information quickly. You move your eyes rapidly 
                    over text looking for particular words, numbers, or phrases.
                  </p>
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>Know what you're looking for before you start</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>Move eyes quickly in zigzag pattern</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>Look for keywords, names, dates, or numbers</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                      <span>Use visual cues like formatting and layout</span>
                    </div>
                  </div>
                </div>

                {/* Practice Source */}
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Practice: Explore an Academic Source
                  </h4>
                  <div className="text-sm space-y-2">
                    <p className="text-muted-foreground">Practice skimming and scanning with this article you'll use for Pre-course Writing:</p>
                    <p className="font-medium text-xs">
                      Mark Andrejevic & Neil Selwyn (2020) Facial recognition technology in schools: critical questions and concerns, 
                      <em> Learning, Media and Technology</em>, 45:2, 115-128
                    </p>
                  </div>
                  <Button className="w-full" variant="outline" size="sm" asChild>
                    <a 
                      href="https://www.tandfonline.com/doi/full/10.1080/17439884.2020.1686014#d1e380" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Article (Taylor & Francis Online)
                    </a>
                  </Button>
                </div>

                {/* Quick Check Questions */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Quick Check: Source Exploration
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Answer these questions by skimming/scanning the article page. Click an option to check your answer.
                  </p>
                  
                  <QuickCheckMC
                    questionNumber={1}
                    question="Who is the publisher of this article?"
                    options={[
                      { label: "A", text: "Elsevier" },
                      { label: "B", text: "Taylor & Francis" },
                      { label: "C", text: "Springer Nature" },
                      { label: "D", text: "SAGE Publications" },
                    ]}
                    correctAnswer="B"
                    explanation="Taylor & Francis publishes the journal 'Learning, Media and Technology'. You can see the T&F logo at the top of the article page."
                  />

                  <QuickCheckMC
                    questionNumber={2}
                    question="What is the journal name?"
                    options={[
                      { label: "A", text: "Educational Technology Research" },
                      { label: "B", text: "Learning, Media and Technology" },
                      { label: "C", text: "Computers & Education" },
                      { label: "D", text: "Journal of Digital Learning" },
                    ]}
                    correctAnswer="B"
                    explanation="The journal name appears in the article header and citation information. It's 'Learning, Media and Technology', Volume 45, Issue 2."
                  />

                  <QuickCheckMC
                    questionNumber={3}
                    question="Which universities do the authors come from?"
                    options={[
                      { label: "A", text: "Harvard University & MIT" },
                      { label: "B", text: "Monash University (both authors)" },
                      { label: "C", text: "University of Melbourne & University of Sydney" },
                      { label: "D", text: "University of Oxford & Cambridge" },
                    ]}
                    correctAnswer="B"
                    explanation="Both Mark Andrejevic and Neil Selwyn are affiliated with Monash University in Australia. This is shown in the author information section."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Part 3a: Outlining - Macro Level */}
            <Card className="border-2 border-purple-500/30 bg-purple-500/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg">Part 3a: Outlining – Macro Level</CardTitle>
                </div>
                <CardDescription>
                  Learn to identify the overall structure of academic papers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-purple-500" />
                    What is Macro-Level Outlining?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Macro-level outlining</strong> involves identifying the major sections and overall structure of an academic text. 
                    This helps you understand how the author has organized their argument and how different parts relate to each other.
                  </p>
                </div>

                {/* Example 1: Full Paper Structure */}
                <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                  <h4 className="font-medium text-sm">Example 1: Overall Structure of the Full Paper</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Based on the article headings, here is the macro-level outline:
                  </p>
                  <div className="text-sm space-y-1 pl-4 border-l-2 border-purple-500/50">
                    <p className="font-medium">1. ABSTRACT</p>
                    <p className="font-medium">2. Introduction</p>
                    <p className="font-medium">3. The emergence of facial recognition technology across society</p>
                    <p className="font-medium">4. Problematising the rise of facial recognition</p>
                    <p className="font-medium">5. Facial recognition technologies in education</p>
                    <p className="font-medium">6. Making sense of the take-up of facial recognition technology in schools</p>
                    <p className="font-medium">7. Challenging the take-up of facial recognition in schools</p>
                    <p className="font-medium">8. Discussion</p>
                    <p className="font-medium">9. Conclusion</p>
                    <p className="text-muted-foreground">10. Disclosure statement</p>
                    <p className="text-muted-foreground">11. References</p>
                  </div>
                </div>

                {/* Example 2: Excerpt Structure */}
                <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                  <h4 className="font-medium text-sm">Example 2: Overall Structure of the Excerpt (Pre-course Writing)</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    The excerpt provided for your assignment covers a specific section. Its structure:
                  </p>
                  <div className="text-sm space-y-1 pl-4 border-l-2 border-purple-500/50">
                    <p className="font-medium">1. Context: Introduction to facial recognition in schools</p>
                    <p className="font-medium">2. Main argument: Concerns about surveillance</p>
                    <p className="font-medium">3. Supporting evidence: Examples and implications</p>
                  </div>
                </div>

                {/* Quick Check */}
                <QuickCheckMC
                  questionNumber={4}
                  question="Based on the article headings, what is the overall structure of this paper?"
                  options={[
                    { label: "A", text: "Abstract → Methods → Results → Discussion → Conclusion" },
                    { label: "B", text: "Abstract → Introduction → Context sections → Analysis sections → Discussion → Conclusion" },
                    { label: "C", text: "Introduction → Literature Review → Methodology → Findings" },
                    { label: "D", text: "Summary → Analysis → Recommendations → References" },
                  ]}
                  correctAnswer="B"
                  explanation="The article follows: Abstract → Introduction → 'The emergence of facial recognition technology' → 'Problematising the rise of facial recognition' → 'Facial recognition technologies in education' → 'Making sense of the take-up' → 'Challenging the take-up' → Discussion → Conclusion."
                />

                {/* Writing Practice */}
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-purple-600" />
                    Writing Practice: Create a Macro-Level Outline
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Find another academic article in your field and create a macro-level outline listing all major sections. 
                    Identify how the sections work together to build the author's argument.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Part 3b: Outlining - Micro Level */}
            <Card className="border-2 border-indigo-500/30 bg-indigo-500/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  <CardTitle className="text-lg">Part 3b: Outlining – Micro Level</CardTitle>
                </div>
                <CardDescription>
                  Learn to identify key points within paragraphs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-indigo-500" />
                    What is Micro-Level Outlining?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Micro-level outlining</strong> focuses on identifying the key points within individual paragraphs. 
                    This includes finding the topic sentence, supporting details, and concluding thought.
                  </p>
                  <div className="grid gap-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                      <span><strong>Topic sentence:</strong> The main idea (usually first sentence)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                      <span><strong>Supporting details:</strong> Evidence, examples, explanations</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-indigo-500 mt-0.5 shrink-0" />
                      <span><strong>Concluding thought:</strong> Summary or transition</span>
                    </div>
                  </div>
                </div>

                {/* Example: Paragraph Outline */}
                <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                  <h4 className="font-medium text-sm">Example: Key Points in a Paragraph</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    Consider the first paragraph of the excerpt. A micro-level outline might look like:
                  </p>
                  <div className="text-sm space-y-2 pl-4 border-l-2 border-indigo-500/50">
                    <div>
                      <p className="font-medium text-indigo-700">Topic Sentence:</p>
                      <p className="text-muted-foreground text-xs">Introduces the main concern about FRT in schools</p>
                    </div>
                    <div>
                      <p className="font-medium text-indigo-700">Supporting Details:</p>
                      <p className="text-muted-foreground text-xs">• Specific examples of school implementations</p>
                      <p className="text-muted-foreground text-xs">• Statistics or evidence of adoption</p>
                    </div>
                    <div>
                      <p className="font-medium text-indigo-700">Concluding Thought:</p>
                      <p className="text-muted-foreground text-xs">Raises questions that the paper will address</p>
                    </div>
                  </div>
                </div>

                {/* Writing Practice */}
                <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30 space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-indigo-600" />
                    Writing Practice: Create a Micro-Level Outline
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Choose one paragraph from the article excerpt. Identify and write out:
                  </p>
                  <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                    <li>The topic sentence (main idea)</li>
                    <li>2-3 supporting details or examples</li>
                    <li>The concluding thought (if present)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Pre-course Writing Assignment Card */}
            <Card className="border-2 border-blue-500/30 bg-blue-500/5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PenLine className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base">Pre-course Writing (2.5%)</CardTitle>
                  </div>
                  <Badge className="bg-blue-500 text-white">Due: 23 Jan, 6pm</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Now that you've learned skimming, scanning, and outlining, you're ready for the assignment! Write a 350-word essay based on the article excerpt.
                  You can get <strong>full credit</strong> as long as the similarity rate and AI detection rate are not too high.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">350 words max</Badge>
                  <Badge variant="outline" className="text-xs">Submit on Moodle</Badge>
                  <Badge variant="outline" className="text-xs text-red-600 border-red-500/50">No late submissions</Badge>
                </div>
                <div className="pt-2">
                  <Button size="sm" asChild>
                    <Link to="/week/1/assignment/pre-course-writing" className="flex items-center gap-2">
                      View Assignment Details
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Key Milestones */}
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  Major In-Class Tests (Mark Your Calendar!)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link 
                  to="/week/6/assignment/academic-writing-quiz"
                  className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <PenLine className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="font-medium text-sm">Week 6: Academic Writing Quiz (15%)</p>
                      <p className="text-xs text-muted-foreground">60 mins • Summarise & synthesise 2 excerpts → 300 words</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-amber-600" />
                </Link>
                <Link 
                  to="/week/9/assignment/ace-draft"
                  className="flex items-center justify-between p-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-amber-600" />
                    <div>
                      <p className="font-medium text-sm">Week 9: ACE Draft (15%)</p>
                      <p className="text-xs text-muted-foreground">100 mins • Argument + counterargument + rebuttal → 400 words</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-amber-600" />
                </Link>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Learning Goals */}
        <CollapsibleSection
          title="Learning Goals"
          description="What you'll achieve in this hour"
          icon={<Target className="h-4 w-4 text-primary" />}
          defaultOpen={true}
        >
          <ul className="space-y-2">
            {hourData.learningGoals.map((goal, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                {goal}
              </li>
            ))}
          </ul>
        </CollapsibleSection>

        {/* Key Concepts */}
        {hourData.keyConcepts && hourData.keyConcepts.length > 0 && (
          <CollapsibleSection
            title="Key Concepts"
            description="Essential terms and ideas for this hour"
            icon={<Lightbulb className="h-4 w-4 text-amber-500" />}
            defaultOpen={true}
          >
            <div className="space-y-4">
              {hourData.keyConcepts.map((concept, idx) => (
                <Card key={idx} className="bg-muted/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-semibold text-primary">{concept.term}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>{concept.definition}</p>
                    {concept.example && (
                      <div className="p-2 bg-background rounded border text-xs">
                        <span className="font-medium">Example: </span>{concept.example}
                      </div>
                    )}
                    {concept.tip && (
                      <p className="text-xs text-muted-foreground italic">💡 {concept.tip}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Article Excerpts */}
        {hourData.articles && hourData.articles.length > 0 && (
          <CollapsibleSection
            title="Article Excerpts"
            description="Source materials for this hour"
            icon={<FileText className="h-4 w-4 text-blue-500" />}
            defaultOpen={false}
          >
            <div className="space-y-4">
              {hourData.articles.map((article, idx) => (
                <Card key={idx}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {article.authors} ({article.year})
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{article.title}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {article.abstract && (
                      <div className="text-xs bg-muted/50 p-2 rounded">
                        <span className="font-medium">Abstract: </span>{article.abstract}
                      </div>
                    )}
                    <div className="text-sm whitespace-pre-wrap border-l-2 border-primary/30 pl-3">
                      {article.excerpt}
                    </div>
                    {article.glossary && Object.keys(article.glossary).length > 0 && (
                      <div className="text-xs bg-muted/30 p-2 rounded">
                        <p className="font-medium mb-1">Glossary:</p>
                        {Object.entries(article.glossary).map(([term, def]) => (
                          <p key={term}><strong>{term}:</strong> {def}</p>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Objective Tasks */}
        {objectiveTasks.length > 0 && (
          <CollapsibleSection
            title="Quick Check Tasks"
            description="Multiple choice, true/false, and fill-in-the-blank with instant feedback"
            icon={<BookOpen className="h-4 w-4 text-primary" />}
            defaultOpen={true}
          >
            <div className="space-y-4">
              {objectiveTasks.map((task) => (
                <ObjectiveTask
                  key={task.id}
                  id={task.id}
                  type={task.type as "mc" | "true-false" | "fill-blank"}
                  question={task.question}
                  context={task.context}
                  options={task.options}
                  correctAnswer={task.correctAnswer!}
                  explanation={task.explanation}
                  hints={task.hints}
                  onComplete={(isCorrect) => {
                    if (isCorrect) handleTaskComplete(task.id);
                  }}
                />
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Writing Tasks */}
        {writingTasks.length > 0 && (
          <CollapsibleSection
            title="Writing Tasks"
            description="Practice academic writing with AI feedback"
            icon={<PenLine className="h-4 w-4 text-primary" />}
            defaultOpen={true}
          >
            <div className="space-y-4">
              {writingTasks.map((task) => (
                <WritingTask
                  key={task.id}
                  id={task.id}
                  type={task.type as "short-answer" | "sentence" | "paragraph"}
                  question={task.question}
                  context={task.context}
                  wordLimit={task.wordLimit}
                  hints={task.hints}
                  modelAnswer={task.modelAnswer}
                  onComplete={() => handleTaskComplete(task.id)}
                />
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Main Writing Task */}
        {hourData.writingTask && (
          <CollapsibleSection
            title="Hour Writing Task"
            description="The main writing practice for this hour"
            icon={<PenLine className="h-4 w-4 text-amber-500" />}
            defaultOpen={true}
            className="border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-transparent"
          >
            <WritingTask
              id={`${hourData.weekNumber}-${hourData.hourNumber}-main`}
              type="paragraph"
              question={hourData.writingTask.prompt}
              wordLimit={hourData.writingTask.wordLimit}
              modelAnswer={hourData.writingTask.modelAnswer}
              rubricCriteria={hourData.writingTask.rubricCriteria}
              onComplete={() => handleTaskComplete("main-writing")}
            />
          </CollapsibleSection>
        )}

        {/* Progress & Navigation */}
        <div className="bg-muted/30 rounded-lg p-4 border">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-medium text-sm">Progress</p>
              <p className="text-xs text-muted-foreground">
                {completedTasks.size} / {hourData.tasks.length + (hourData.writingTask ? 1 : 0)} tasks completed
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {prevHour && (
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/week/${weekNumber}/hour/${prevHour}`}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Hour {prevHour}
                  </Link>
                </Button>
              )}
              {prevWeek && hourNumber === 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link to={`/week/${prevWeek}/hour/3`}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Week {prevWeek}
                  </Link>
                </Button>
              )}
              {nextHour && (
                <Button size="sm" asChild>
                  <Link to={`/week/${weekNumber}/hour/${nextHour}`}>
                    Hour {nextHour} <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
              {nextWeek && hourNumber === 3 && (
                <Button size="sm" asChild>
                  <Link to={`/week/${nextWeek}/hour/1`}>
                    Week {nextWeek} <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}