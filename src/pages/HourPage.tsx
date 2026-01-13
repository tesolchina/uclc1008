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
import { ArrowLeft, ArrowRight, Clock, Target, BookOpen, PenLine, CheckCircle2, Lightbulb, FileText, Sparkles, ExternalLink, AlertCircle, Calendar, GraduationCap, ScrollText, ChevronDown } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Paragraph options for micro-level practice
const PRACTICE_PARAGRAPHS = [
  {
    id: "para2",
    label: "Paragraph 2: Problematising FRT",
    text: "In this sense, facial recognition could be seen as a logical extension of technology-based surveillance trends established in schools from the 1990s onwards. However, in this article, we seek to problematise the specific connotations and possible consequences of facial recognition technology in schools. Drawing on emerging debates amongst communications, media and surveillance scholars, the article addresses a number of specific social challenges and concerns – not least various ways in which this technology might alter the nature of schools and schooling along divisive, authoritarian and oppressive lines."
  },
  {
    id: "para3",
    label: "Paragraph 3: Challenging FRT in Schools",
    text: "These questions over diminished notions of pedagogy and consent are important. Yet, at this point, we would like to argue that there are a number of additional issues and concerns that cast further serious doubt upon the implementation of facial recognition technologies in schools."
  },
  {
    id: "para4",
    label: "Paragraph 4: Dehumanising Nature",
    text: "First is the argument that the statistical processes through which facial recognition technologies quantify and frame a student's face are inherently reductive. Facial recognition technologies work by assigning numerical values to schematic representations of facial features. This constitutes a very reductive engagement with students in contrast to how they would ordinarily be viewed by a human."
  },
  {
    id: "para5",
    label: "Paragraph 5: Gender and Race Issues",
    text: "Another unsettling reduction is their role in foregrounding fixed attributions of students' race and gender in informing school decision-making."
  },
  {
    id: "para6",
    label: "Paragraph 6: Conclusion",
    text: "Thus, it can be strongly argued that schools should not be places where local communities become desensitised to being automatically identified, profiled, and potentially discriminated against."
  }
];

// Micro-level practice component with paragraph selector
function MicroLevelPractice() {
  const [selectedParagraph, setSelectedParagraph] = useState(PRACTICE_PARAGRAPHS[0].id);
  const currentParagraph = PRACTICE_PARAGRAPHS.find(p => p.id === selectedParagraph) || PRACTICE_PARAGRAPHS[0];

  return (
    <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30 space-y-4">
      <h4 className="font-medium text-sm flex items-center gap-2">
        <PenLine className="h-4 w-4 text-indigo-600" />
        Your Turn: Analyze a Paragraph
      </h4>
      
      {/* Paragraph Selector */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-indigo-700">Choose a paragraph to analyze:</label>
        <Select value={selectedParagraph} onValueChange={setSelectedParagraph}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Select a paragraph" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            {PRACTICE_PARAGRAPHS.map((para) => (
              <SelectItem key={para.id} value={para.id}>
                {para.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Selected paragraph */}
      <div className="p-3 rounded bg-background border text-sm">
        <p className="font-medium text-xs text-indigo-600 mb-2">{currentParagraph.label}:</p>
        <p className="text-muted-foreground leading-relaxed">
          "{currentParagraph.text}"
        </p>
      </div>
      
      {/* Writing area */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">
          Create a micro-level outline for the paragraph above. Identify the topic sentence, supporting details, and concluding thought:
        </p>
        <textarea 
          className="w-full min-h-[150px] p-3 rounded-lg border bg-background text-sm resize-y placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          placeholder={"Topic Sentence:\n...\n\nSupporting Details:\n• ...\n• ...\n\nConcluding Thought:\n..."}
        />
        <p className="text-xs text-muted-foreground italic">
          💡 Remember to save your work externally – copy and paste to a document as backup.
        </p>
      </div>
    </div>
  );
}

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

        {/* Learning Goals - moved to top */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Learning Goals</CardTitle>
            </div>
            <CardDescription>What you'll achieve in this hour</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {hourData.learningGoals.map((goal, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  {goal}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

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
            <CollapsibleSection
              title="Part 2: Skimming & Scanning"
              description="Learn essential reading techniques for academic texts, then practice with a real article"
              icon={<BookOpen className="h-4 w-4 text-green-600" />}
              defaultOpen={true}
              className="border-2 border-green-500/30 bg-green-500/5"
            >
              <div className="space-y-4">
                {/* Skimming Introduction */}
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    What is Skimming?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Skimming</strong> is a reading technique that allows you to quickly get the <strong>main idea and overall structure</strong> of a text 
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
                    <strong>Scanning</strong> is used to find <strong>specific information</strong> quickly. You move your eyes rapidly 
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

                {/* Scanning Tasks */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Scanning Practice: Find Specific Information
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Scan the article page to find these specific details. Don't read everything—just locate the information!
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

                  <QuickCheckMC
                    questionNumber={4}
                    question="When was this article published online?"
                    options={[
                      { label: "A", text: "15 January 2020" },
                      { label: "B", text: "27 January 2020" },
                      { label: "C", text: "14 February 2020" },
                      { label: "D", text: "3 March 2020" },
                    ]}
                    correctAnswer="B"
                    explanation="The article shows 'Published online: 27 Jan 2020' in the publication information section."
                  />
                </div>

                {/* Skimming Tasks */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    Skimming Practice: Understand the Big Picture
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Skim the article by reading headings, the abstract, and the first sentence of each section. Don't read in detail!
                  </p>
                  
                  <QuickCheckMC
                    questionNumber={5}
                    question="What is the main topic of this article?"
                    options={[
                      { label: "A", text: "How to implement facial recognition systems in schools" },
                      { label: "B", text: "Critical examination of facial recognition technology use in educational settings" },
                      { label: "C", text: "The benefits of surveillance technology for student safety" },
                      { label: "D", text: "A comparison of different facial recognition software vendors" },
                    ]}
                    correctAnswer="B"
                    explanation="The title and abstract clearly indicate this is a critical examination of FRT in schools, raising 'critical questions and concerns' rather than promoting its use."
                  />

                  <QuickCheckMC
                    questionNumber={6}
                    question="Based on the headings, what is the authors' overall stance on FRT in schools?"
                    options={[
                      { label: "A", text: "Strongly supportive of widespread adoption" },
                      { label: "B", text: "Neutral, presenting only facts without opinion" },
                      { label: "C", text: "Critical and questioning, highlighting concerns" },
                      { label: "D", text: "Focused only on technical implementation details" },
                    ]}
                    correctAnswer="C"
                    explanation="Headings like 'Problematising the rise of facial recognition' and 'Challenging the take-up of facial recognition in schools' indicate a critical, questioning stance."
                  />

                  <QuickCheckMC
                    questionNumber={7}
                    question="What type of article structure does this paper follow?"
                    options={[
                      { label: "A", text: "Experimental study with methods, results, and statistics" },
                      { label: "B", text: "Argumentative/analytical essay discussing issues and concerns" },
                      { label: "C", text: "Case study of a specific school implementation" },
                      { label: "D", text: "Literature review summarizing other research only" },
                    ]}
                    correctAnswer="B"
                    explanation="The structure (Introduction → Context → Analysis → Discussion → Conclusion) with no 'Methods' or 'Results' sections indicates this is an argumentative/analytical piece rather than an empirical study."
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Part 3a: Outlining - Macro Level */}
            <CollapsibleSection
              title="Part 3a: Outlining – Macro Level"
              description="Learn to identify the overall structure of academic papers"
              icon={<FileText className="h-4 w-4 text-purple-600" />}
              defaultOpen={true}
              className="border-2 border-purple-500/30 bg-purple-500/5"
            >
              <div className="space-y-4">
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
                    <p className="font-medium text-purple-700">4. Problematising the rise of facial recognition</p>
                    <p className="font-medium text-purple-700">5. Facial recognition technologies in education</p>
                    <p className="font-medium text-purple-700">6. Making sense of the take-up of facial recognition technology in schools</p>
                    <p className="font-medium text-purple-700">7. Challenging the take-up of facial recognition in schools</p>
                    <p className="font-medium">8. Discussion</p>
                    <p className="font-medium">9. Conclusion</p>
                    <p className="text-muted-foreground">10. Disclosure statement</p>
                    <p className="text-muted-foreground">11. References</p>
                  </div>
                  <p className="text-xs text-purple-600 mt-2">
                    💡 Sections 4-7 (highlighted) form the core argument of the paper.
                  </p>
                </div>

                {/* MC Question on Logical Flow */}
                <QuickCheckMC
                  questionNumber={8}
                  question="What is the logical flow among sections 4-7 of the article?"
                  options={[
                    { label: "A", text: "General concerns → Educational applications → Explaining adoption → Critiquing adoption" },
                    { label: "B", text: "History → Benefits → Costs → Recommendations" },
                    { label: "C", text: "Problem → Solution → Implementation → Evaluation" },
                    { label: "D", text: "Theory → Methodology → Results → Discussion" },
                  ]}
                  correctAnswer="A"
                  explanation="The sections follow a logical progression: Section 4 raises general concerns about FRT → Section 5 describes how FRT is being applied in education → Section 6 explains WHY schools are adopting it → Section 7 challenges and critiques this adoption. This moves from context to critique."
                />

                {/* Example 2: Excerpt Structure */}
                <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    Example 2: Structure of the Excerpt
                    <Badge variant="outline" className="text-xs">Pre-course Writing Source</Badge>
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    The excerpt is from Section 5 "Facial recognition technologies in education". Read the numbered paragraphs below:
                  </p>
                  
                  <Button variant="link" size="sm" className="p-0 h-auto text-purple-600" asChild>
                    <Link to="/week/1/assignment/pre-course-writing">
                      View full assignment page →
                    </Link>
                  </Button>
                </div>

                {/* Toggled Source Text with Numbered Paragraphs */}
                <CollapsibleSection
                  title="Source Text (6 Paragraphs)"
                  description="The excerpt from the article – read and identify the macro structure"
                  icon={<ScrollText className="h-4 w-4 text-purple-500" />}
                  defaultOpen={false}
                  className="border-purple-500/20"
                >
                  <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                    <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <p className="font-bold text-purple-700 text-xs mb-1">Paragraph 1</p>
                      <p>
                        Against this contentious background, then, we need to consider how these technologies are being applied to the specific context of education. While rarely foregrounded in debates about facial recognition in society, the school sector is one of the public settings where this technology is beginning to be taken up and implemented at scale. This is perhaps not surprising given, on the one hand, the role played by the classroom in the development of monitoring and disciplinary practices and, on the other, the increasing normalisation of surveillance in the name of protecting and securing young people.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <p className="font-bold text-purple-700 text-xs mb-1">Paragraph 2</p>
                      <p>
                        One prominent educational application of facial recognition technology is campus security. This form of facial recognition is most prevalent in the US, where school shooting incidents have prompted school authorities to annually spend $2.7 billion on-campus security products and services (Doffman, 2018). Facial recognition systems have now been sold to thousands of US schools, with vendors "pitching the technology as an all-seeing shield against school shootings" (Harwell, 2018, n.p). As well as purporting to identify unauthorised intruders, systems have been developed to make use of video object classification trained to detect gun-shaped objects, alongside more subtle forms of 'anomaly detection' such as students arriving at school in different-than-usual clothes, bags and other apparel (Harwell, 2018).
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <p className="font-bold text-purple-700 text-xs mb-1">Paragraph 3</p>
                      <p>
                        Another application of facial recognition in schools is attendance monitoring – promising to put an end to the inevitable gaps and omissions that arise when human teachers are tasked with repeatedly conducting roll-calls of large student groups (Puthea et al., 2017). This application of facial recognition is proving popular in countries such as the UK and Australia where school shootings and unauthorised campus incursions are rare. For example, the Australian 'Loop-Learn' facial recognition roll-call system has been marketed amidst estimates of saving up to 2.5 hours of teacher time per week.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <p className="font-bold text-purple-700 text-xs mb-1">Paragraph 4</p>
                      <p>
                        Beyond campus-based security and tracking physical bodies, facial recognition is also being used in a number of 'virtual learning' contexts. For example, facial recognition systems are now being developed as a means of ensuring the integrity of various aspects of online courses. This includes controlling access to online educational content (Montgomery & Marais, 2014), as well as using webcam-based facial recognition to authenticate online learners (Valera et al., 2015). Similarly, there is a growing interest in using facial recognition technology for so-called e-assessment security.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <p className="font-bold text-purple-700 text-xs mb-1">Paragraph 5</p>
                      <p>
                        Finally, there is a growing interest in facial detection techniques as an indicator of student 'engagement' and learning. For example, research and development in this area have reported that detecting brief 'facial actions' can prove an accurate indicator of students' (non)engagement with online learning environments – highlighting episodes of boredom, confusion, delight, flow, frustration, and surprise (Dewan et al., 2019). Particularly insightful facial actions with regards to learning are reckoned to include brow-raising, eyelid tightening, and mouth dimpling.
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                      <p className="font-bold text-purple-700 text-xs mb-1">Paragraph 6</p>
                      <p>
                        These largely experimental developments have led some educationalists to enthusiastically anticipate facial learning detection being deployed on a mass scale. As Timms (2016, p. 712) reasons, it might soon be possible to gain a 'real-time' sense of which groups of students are in a 'productive state' and other instances 'where the overall activity is not productive'. The promise of customisation that characterises the development of automated learning systems encourages their incorporation into student learning interfaces.
                      </p>
                    </div>
                  </div>
                </CollapsibleSection>

                {/* MC Questions on Excerpt Structure */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-purple-500" />
                    Quick Check: Macro Structure of the Excerpt
                  </h4>
                  
                  <QuickCheckMC
                    questionNumber={9}
                    question="What is the main focus of each paragraph in the excerpt?"
                    options={[
                      { label: "A", text: "P1: Introduction → P2-4: Three types of applications → P5-6: Engagement monitoring" },
                      { label: "B", text: "P1: History → P2: Benefits → P3: Costs → P4-6: Conclusions" },
                      { label: "C", text: "P1-3: Problem → P4-5: Solution → P6: Implementation" },
                      { label: "D", text: "All paragraphs discuss the same application in different countries" },
                    ]}
                    correctAnswer="A"
                    explanation="P1 introduces FRT in education. P2 covers security, P3 covers attendance, P4 covers online/virtual learning. P5-6 discuss engagement/emotion detection. This shows 4 distinct applications organized logically."
                  />

                  <QuickCheckMC
                    questionNumber={10}
                    question="How are the four applications (security, attendance, online authentication, engagement detection) organized in the excerpt?"
                    options={[
                      { label: "A", text: "From most expensive to least expensive" },
                      { label: "B", text: "From physical/visible surveillance to invisible/emotional surveillance" },
                      { label: "C", text: "Chronologically by when they were invented" },
                      { label: "D", text: "Alphabetically by application name" },
                    ]}
                    correctAnswer="B"
                    explanation="The excerpt moves from visible/physical applications (security cameras, attendance tracking) to increasingly invisible/intimate forms of surveillance (online authentication, then emotion/engagement detection from facial expressions)."
                  />
                </div>

                {/* Writing Practice */}
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-purple-600" />
                    Writing Practice: Narrate the Excerpt Structure
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Write <strong>3 sentences</strong> that summarize what the excerpt covers at the macro level. 
                    Do not summarize the content in detail – just describe the <em>structure</em> and <em>progression</em> of ideas.
                  </p>
                  <div className="p-3 rounded bg-background/80 text-xs text-muted-foreground space-y-2">
                    <p className="font-medium">Example format:</p>
                    <p className="italic">"The excerpt begins by... Then, it moves on to discuss... Finally, it explores..."</p>
                  </div>
                  <textarea 
                    className="w-full min-h-[120px] p-3 rounded-lg border bg-background text-sm resize-y placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Write your 3 sentences here describing the structure and progression of the excerpt..."
                  />
                  <p className="text-xs text-muted-foreground italic">
                    💡 Tip: Your work is saved locally in this browser. Remember to copy your writing to a separate document as backup.
                  </p>
                </div>
              </div>
            </CollapsibleSection>

            {/* Part 3b: Outlining - Micro Level */}
            <CollapsibleSection
              title="Part 3b: Outlining – Micro Level"
              description="Learn to identify key points within paragraphs"
              icon={<FileText className="h-4 w-4 text-indigo-600" />}
              defaultOpen={true}
              className="border-2 border-indigo-500/30 bg-indigo-500/5"
            >
              <div className="space-y-4">
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

                {/* Why Outlining Matters - Hint for Summaries */}
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                  <p className="text-xs text-amber-700 flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      <strong>Why this matters:</strong> Micro-level outlines help you write better summaries. 
                      When you identify the topic sentence and key details, you have the building blocks for a concise summary. 
                      In Week 6, you will use these skills to summarize and synthesize multiple sources!
                    </span>
                  </p>
                </div>

                {/* Demonstration: Example Paragraph from Excerpt */}
                <div className="p-4 rounded-lg border-2 border-indigo-500/50 bg-indigo-500/10 space-y-4">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                    Demonstration: Analyzing an Example Paragraph
                  </h4>
                  
                  {/* The paragraph */}
                  <div className="p-3 rounded bg-background border text-sm space-y-2">
                    <p className="font-medium text-xs text-indigo-600 mb-2">Paragraph 1: Introduction to FRT (Andrejevic & Selwyn, 2020)</p>
                    <p className="text-muted-foreground leading-relaxed">
                      <span className="bg-green-200/50 px-0.5">"The past few years have seen the implementation of automated facial recognition systems across a range of social realms."</span>{" "}
                      <span className="bg-blue-200/50 px-0.5">While these technologies are associated most frequently with promises to strengthen public safety, a growing number of other applications have also emerged – from verifying the identity of bank users, through to "smart billboards" that display advertisements in response to the moods of passers-by.</span>{" "}
                      <span className="bg-amber-200/50 px-0.5">Of particular interest is how facial recognition technologies are beginning to be implemented in school settings.</span>
                    </p>
                  </div>
                  
                  {/* The analysis */}
                  <div className="space-y-3">
                    <p className="text-xs font-medium text-indigo-700">Micro-Level Outline:</p>
                    <div className="text-sm space-y-2 pl-4 border-l-2 border-indigo-500/50">
                      <div className="flex items-start gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-green-400 mt-1 shrink-0"></span>
                        <div>
                          <p className="font-medium text-green-700">Topic Sentence:</p>
                          <p className="text-muted-foreground text-xs">Introduces the general trend: facial recognition is being used in many areas of society.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mt-1 shrink-0"></span>
                        <div>
                          <p className="font-medium text-blue-700">Supporting Details:</p>
                          <p className="text-muted-foreground text-xs">• Main use: public safety</p>
                          <p className="text-muted-foreground text-xs">• Other examples: banking identity verification, smart billboards</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="inline-block w-3 h-3 rounded-full bg-amber-400 mt-1 shrink-0"></span>
                        <div>
                          <p className="font-medium text-amber-700">Concluding Thought / Transition:</p>
                          <p className="text-muted-foreground text-xs">Narrows focus to schools – signals what the paper will discuss next.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Practice with Paragraph Selector */}
                <MicroLevelPractice />
              </div>
            </CollapsibleSection>
          </section>
        )}


        {/* Key Concepts - hide for Week 1 Hour 1 (custom content) */}
        {!(weekNumber === 1 && hourNumber === 1) && hourData.keyConcepts && hourData.keyConcepts.length > 0 && (
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

        {/* Article Excerpts - hide for Week 1 Hour 1 (custom content) */}
        {!(weekNumber === 1 && hourNumber === 1) && hourData.articles && hourData.articles.length > 0 && (
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

        {/* Objective Tasks - hide for Week 1 Hour 1 (custom content) */}
        {!(weekNumber === 1 && hourNumber === 1) && objectiveTasks.length > 0 && (
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

        {/* Writing Tasks - hide for Week 1 Hour 1 (custom content) */}
        {!(weekNumber === 1 && hourNumber === 1) && writingTasks.length > 0 && (
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

        {/* Main Writing Task - hide for Week 1 Hour 1 (custom content) */}
        {!(weekNumber === 1 && hourNumber === 1) && hourData.writingTask && (
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