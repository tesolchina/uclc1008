import { useParams, Link } from "react-router-dom";
import { getHourData } from "@/data/hourContent";
import { useAuth } from "@/features/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { ObjectiveTask, QuickCheckMC, WritingTask, ParaphraseCoach, AskQuestionButton, ParagraphWithNotes, WritingPracticeWithHistory, IntegratedParaphraseTask, StrategyPracticeTask, ConceptSelectTask } from "@/components/tasks";
import type { ConceptOption } from "@/components/tasks";
import { StudentLoginReminder } from "@/components/StudentLoginReminder";
import { LectureOutline, useSectionProgress, generateSectionId } from "@/features/lecture-mode";
import type { AgendaSectionEnhanced } from "@/features/lecture-mode";
import { TeacherQuestionDashboard } from "@/components/teacher/TeacherQuestionDashboard";
import { Hour3PracticeSession } from "@/components/lessons/Hour3PracticeSession";
import { ArrowLeft, ArrowRight, Clock, Target, BookOpen, PenLine, CheckCircle2, Lightbulb, FileText, Sparkles, ExternalLink, AlertCircle, Calendar, GraduationCap, ScrollText, ChevronDown, Download, LogIn, Loader2, Trophy } from "lucide-react";
import { useState, useMemo, useCallback, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Paragraph options for micro-level practice
// NOTE: These paragraphs MUST match the Source Text in Part 3b for consistency
const PRACTICE_PARAGRAPHS = [
  {
    id: "para1",
    label: "Paragraph 1: FRT in Education Context",
    text: "Against this contentious background, then, we need to consider how these technologies are being applied to the specific context of education. While rarely foregrounded in debates about facial recognition in society, the school sector is one of the public settings where this technology is beginning to be taken up and implemented at scale. This is perhaps not surprising given, on the one hand, the role played by the classroom in the development of monitoring and disciplinary practices and, on the other, the increasing normalisation of surveillance in the name of protecting and securing young people."
  },
  {
    id: "para2",
    label: "Paragraph 2: Campus Security",
    text: "One prominent educational application of facial recognition technology is campus security. This form of facial recognition is most prevalent in the US, where school shooting incidents have prompted school authorities to annually spend $2.7 billion on-campus security products and services (Doffman, 2018). Facial recognition systems have now been sold to thousands of US schools, with vendors 'pitching the technology as an all-seeing shield against school shootings' (Harwell, 2018, n.p). As well as purporting to identify unauthorised intruders, systems have been developed to make use of video object classification trained to detect gun-shaped objects, alongside more subtle forms of 'anomaly detection' such as students arriving at school in different-than-usual clothes, bags and other apparel (Harwell, 2018)."
  },
  {
    id: "para3",
    label: "Paragraph 3: Attendance Monitoring",
    text: "Another application of facial recognition in schools is attendance monitoring – promising to put an end to the inevitable gaps and omissions that arise when human teachers are tasked with repeatedly conducting roll-calls of large student groups (Puthea et al., 2017). This application of facial recognition is proving popular in countries such as the UK and Australia where school shootings and unauthorised campus incursions are rare. For example, the Australian 'Loop-Learn' facial recognition roll-call system has been marketed amidst estimates of saving up to 2.5 hours of teacher time per week."
  },
  {
    id: "para4",
    label: "Paragraph 4: Virtual Learning",
    text: "Beyond campus-based security and tracking physical bodies, facial recognition is also being used in a number of 'virtual learning' contexts. For example, facial recognition systems are now being developed as a means of ensuring the integrity of various aspects of online courses. This includes controlling access to online educational content (Montgomery & Marais, 2014), as well as using webcam-based facial recognition to authenticate online learners (Valera et al., 2015). Similarly, there is a growing interest in using facial recognition technology for so-called e-assessment security."
  },
  {
    id: "para5",
    label: "Paragraph 5: Engagement Detection",
    text: "Finally, there is a growing interest in facial detection techniques as an indicator of student 'engagement' and learning. For example, research and development in this area have reported that detecting brief 'facial actions' can prove an accurate indicator of students' (non)engagement with online learning environments – highlighting episodes of boredom, confusion, delight, flow, frustration, and surprise (Dewan et al., 2019). Particularly insightful facial actions with regards to learning are reckoned to include brow-raising, eyelid tightening, and mouth dimpling."
  },
  {
    id: "para6",
    label: "Paragraph 6: Future of Facial Learning Detection",
    text: "These largely experimental developments have led some educationalists to enthusiastically anticipate facial learning detection being deployed on a mass scale. As Timms (2016, p. 712) reasons, it might soon be possible to gain a 'real-time' sense of which groups of students are in a 'productive state' and other instances 'where the overall activity is not productive'. The promise of customisation that characterises the development of automated learning systems encourages their incorporation into student learning interfaces."
  }
];

// Concept options for different task types
const PARAPHRASING_STRATEGIES: ConceptOption[] = [
  { id: "synonyms", label: "Synonym Replacement", description: "Replace words with similar-meaning words", example: "introduced → implemented" },
  { id: "wordforms", label: "Word Form Changes", description: "Change word forms (verb → noun, adjective → adverb)", example: "impacts → impact" },
  { id: "voice", label: "Active ↔ Passive Voice", description: "Switch between active and passive voice", example: "Researchers collected → Data was collected" },
  { id: "structure", label: "Sentence Structure", description: "Reorder, combine, or split sentences", example: "Because X, Y → Y resulted from X" }
];

const AWQ_SKILLS: ConceptOption[] = [
  { id: "paraphrasing", label: "Paraphrasing Skills", description: "Restating ideas in your own words while keeping meaning" },
  { id: "summarizing", label: "Summarizing Skills", description: "Condensing main ideas in shorter form" },
  { id: "critical-thinking", label: "Critical Thinking", description: "Analyzing and evaluating ideas, not just repeating" },
  { id: "comprehension", label: "Reading Comprehension", description: "Understanding complex academic texts accurately" }
];

const CITATION_CONCEPTS: ConceptOption[] = [
  { id: "author-prominent", label: "Author-Prominent Citation", description: "Author name is part of the sentence", example: "Hong et al. (2022) argue that..." },
  { id: "info-prominent", label: "Info-Prominent Citation", description: "Focus on information, author in parentheses", example: "...according to research (Hong et al., 2022)" },
  { id: "secondary-source", label: "Secondary Source Citation", description: "Citing through another source", example: "(Smith, 2018, as cited in Jones, 2020)" }
];

const OUTLINING_CONCEPTS: ConceptOption[] = [
  { id: "topic-sentence", label: "Topic Sentence", description: "Identify the main idea of each paragraph" },
  { id: "logical-flow", label: "Logical Flow", description: "How ideas progress from one section to another" },
  { id: "structural-patterns", label: "Structural Patterns", description: "Recognize patterns like problem-solution, cause-effect" },
  { id: "transitions", label: "Transitions", description: "Words/phrases connecting ideas between paragraphs" }
];

const SKIMMING_SCANNING_CONCEPTS: ConceptOption[] = [
  { id: "skimming", label: "Skimming", description: "Reading quickly for overall meaning and structure" },
  { id: "scanning", label: "Scanning", description: "Searching for specific information quickly" },
  { id: "headings", label: "Using Headings", description: "Leveraging titles and headers to understand structure" },
  { id: "first-last", label: "First/Last Sentences", description: "Reading opening and closing sentences of paragraphs" }
];

// Week 1 Hour 1 has 10 MC questions + 2 writing tasks = 12 total tasks
const WEEK1_HOUR1_TOTAL_TASKS = 12;

// Local storage key for progress
const getProgressKey = (weekNumber: number, hourNumber: number) => 
  `ue1_progress_w${weekNumber}h${hourNumber}`;

// Writing task with AI feedback component
function WritingTaskWithFeedback({ 
  taskId, 
  placeholder, 
  onComplete,
  studentId
}: { 
  taskId: string; 
  placeholder: string; 
  onComplete: (taskId: string) => void;
  studentId?: string;
}) {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setFeedback(null);
    
    try {
      const chatUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      
      const resp = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `You are a concise, critical academic writing tutor. Provide brief feedback (2-3 sentences max) on this student's response. Be direct about what's good and what could be improved.

Student's response:
${text}

Give critical but constructive feedback. Be specific and actionable.`
            }
          ],
          studentId: studentId || "anonymous",
          meta: {
            taskId,
            type: "reflection-feedback"
          }
        }),
      });

      if (!resp.ok) {
        throw new Error(`AI request failed (${resp.status})`);
      }

      if (!resp.body) {
        throw new Error("AI stream unavailable");
      }

      // Stream the response
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed?.choices?.[0]?.delta?.content;
            if (content) {
              fullText += content;
              setFeedback(fullText); // Update feedback progressively
            }
          } catch {
            // Incomplete JSON, put back in buffer
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }

      // Save to database
      if (studentId && fullText) {
        await supabase.from("student_task_responses").insert({
          student_id: studentId,
          question_key: taskId,
          response: text,
          ai_feedback: fullText,
          is_correct: null,
        });
      }

      onComplete(taskId);
    } catch (err) {
      console.error("AI feedback error:", err);
      toast({
        title: "Feedback unavailable",
        description: "Could not get AI feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <textarea 
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full min-h-[150px] p-3 rounded-lg border bg-background text-sm resize-y placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        placeholder={placeholder}
      />
      
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground italic">
          💡 Remember to save your work externally.
        </p>
        <Button 
          size="sm" 
          onClick={handleSubmit} 
          disabled={!text.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              Getting Feedback...
            </>
          ) : (
            "Submit for Feedback"
          )}
        </Button>
      </div>

      {feedback && (
        <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-2">
          <p className="text-xs font-medium text-blue-700 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            AI Feedback
          </p>
          <p className="text-sm text-muted-foreground">{feedback}</p>
          <p className="text-xs text-amber-600 italic">
            ⚠️ AI feedback may contain errors. Always consult your teacher for authoritative guidance.
          </p>
        </div>
      )}
    </div>
  );
}

// Micro-level practice component with paragraph selector and AI feedback
function MicroLevelPractice({ onComplete, studentId }: { onComplete: (taskId: string) => void; studentId?: string }) {
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
      
      {/* Writing area with AI feedback and autosave */}
      <WritingPracticeWithHistory
        taskKey={`w1h1-micro-outline-${selectedParagraph}`}
        title="Create a Micro-Level Outline"
        instructions="Identify the topic sentence, supporting details, and concluding thought for the paragraph above."
        exampleFormat="Topic Sentence: [main idea]&#10;Supporting Details:&#10;• [detail 1]&#10;• [detail 2]&#10;Concluding Thought: [wrap-up]"
        placeholder={"Topic Sentence:\n...\n\nSupporting Details:\n• ...\n• ...\n\nConcluding Thought:\n..."}
        studentId={studentId}
        className="bg-transparent border-0 p-0"
      />
    </div>
  );
}

// Helper to get student ID from localStorage
function getStoredStudentId(): string | undefined {
  try {
    return localStorage.getItem("ue1_student_id") || undefined;
  } catch {
    return undefined;
  }
}

export default function HourPage() {
  const { weekId, hourId } = useParams();
  const weekNumber = parseInt(weekId || "1");
  const hourNumber = parseInt(hourId || "1");
  const { user, studentId, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const hourData = getHourData(weekNumber, hourNumber);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [completedSectionIndices, setCompletedSectionIndices] = useState<number[]>([]);
  const [hasUnsavedWork, setHasUnsavedWork] = useState(false);

  const isLoggedIn = isAuthenticated;

  // Calculate total tasks for Week 1 Hour 1 (10 MC + 2 writing)
  const totalTasks = weekNumber === 1 && hourNumber === 1 
    ? WEEK1_HOUR1_TOTAL_TASKS 
    : hourData?.tasks.length + (hourData?.writingTask ? 1 : 0) || 0;

  // Load saved progress from localStorage
  useEffect(() => {
    if (!hourData) return;
    const key = getProgressKey(weekNumber, hourNumber);
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completedTasks) {
          setCompletedTasks(new Set(parsed.completedTasks));
        }
      }
    } catch (e) {
      console.error("Error loading progress:", e);
    }
  }, [weekNumber, hourNumber, hourData]);

  // Save progress to localStorage
  useEffect(() => {
    if (!hourData || completedTasks.size === 0) return;
    const key = getProgressKey(weekNumber, hourNumber);
    try {
      localStorage.setItem(key, JSON.stringify({
        completedTasks: Array.from(completedTasks),
        savedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.error("Error saving progress:", e);
    }
  }, [completedTasks, weekNumber, hourNumber, hourData]);

  // Warn before leaving with unsaved work
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedWork) {
        e.preventDefault();
        e.returnValue = "You have unsaved work. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedWork]);

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

  // Generate progress report as Markdown
  const generateReport = useCallback(() => {
    const date = new Date().toLocaleString();
    const completedList = Array.from(completedTasks).join("\n- ");
    
    const report = `# Week ${weekNumber} Hour ${hourNumber} Progress Report
Generated: ${date}
Student ID: ${studentId || "Not logged in"}

## Completed Tasks (${completedTasks.size}/${totalTasks})
${completedList ? `- ${completedList}` : "No tasks completed yet"}

## Notes
Remember to also save any written responses separately.

---
*This report was generated from UE1 Learning Platform*
`;
    return report;
  }, [completedTasks, weekNumber, hourNumber, studentId, totalTasks]);

  // Download report as MD file
  const downloadReport = useCallback(() => {
    const report = generateReport();
    const blob = new Blob([report], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `week${weekNumber}_hour${hourNumber}_progress.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Report downloaded", description: "Check your downloads folder." });
  }, [generateReport, weekNumber, hourNumber, toast]);

  if (!hourData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Hour not found</h2>
        <p className="text-muted-foreground mb-4">This lesson hour does not exist yet.</p>
        <Button asChild>
          <Link to={`/week/${weekNumber}`}>Back to Week {weekNumber}</Link>
        </Button>
      </div>
    );
  }

  const handleTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => new Set([...prev, taskId]));
    setHasUnsavedWork(false); // Mark as saved when completing
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
        {!user && !studentId && <StudentLoginReminder />}

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

        {/* Teacher Dashboard - Hidden by default, for teachers only */}
        <TeacherQuestionDashboard weekNumber={weekNumber} hourNumber={hourNumber} />

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

        {/* Week 1 Hour 2: Paraphrasing Fundamentals - Structured like Hour 1 */}
        {weekNumber === 1 && hourNumber === 2 && (
          <section className="space-y-6">
            {/* Part 1: Why Paraphrase? */}
            <CollapsibleSection
              title="Part 1: Why Paraphrase?"
              description="Understand the importance of paraphrasing for academic writing and the AWQ"
              icon={<BookOpen className="h-4 w-4 text-blue-600" />}
              defaultOpen={false}
              className="border-2 border-blue-500/30 bg-blue-500/5"
            >
              <div className="space-y-4">
                {/* Concept Introduction */}
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    What is Paraphrasing?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Paraphrasing</strong> is restating someone else's ideas in <strong>YOUR OWN words</strong> while keeping the original meaning. 
                    The AWQ requires paraphrasing — <span className="text-red-600 font-medium">NO direct quotes allowed!</span>
                  </p>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <p className="text-sm font-medium text-amber-700 mb-2">🎯 The 3 Skills Assessed in AWQ:</p>
                    <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                      <li><strong>Paraphrasing</strong> — Restate ideas in your own words</li>
                      <li><strong>Summarizing</strong> — Condense main ideas (shorter than original)</li>
                      <li><strong>Synthesizing</strong> — Connect ideas across multiple sources</li>
                    </ol>
                  </div>
                </div>

                {/* Key Difference Box */}
                <div className="grid md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border bg-green-500/5 border-green-500/30">
                    <p className="text-xs font-medium text-green-700 mb-1">Paraphrase</p>
                    <p className="text-sm text-muted-foreground">Same length, different words</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-blue-500/5 border-blue-500/30">
                    <p className="text-xs font-medium text-blue-700 mb-1">Summary</p>
                    <p className="text-sm text-muted-foreground">Shorter, main ideas only</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-purple-500/5 border-purple-500/30">
                    <p className="text-xs font-medium text-purple-700 mb-1">Direct Quote</p>
                    <p className="text-sm text-muted-foreground">Exact words with "quotation marks"</p>
                  </div>
                </div>

                {/* MC Questions for Part 1 */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Quick Check
                  </h4>
                  
                  <QuickCheckMC
                    questionNumber={1}
                    question="What is the main difference between paraphrasing and summarizing?"
                    options={[
                      { label: "A", text: "Paraphrasing is longer than the original; summarizing is shorter" },
                      { label: "B", text: "Paraphrasing restates the same content in different words; summarizing condenses the main ideas" },
                      { label: "C", text: "Paraphrasing requires citations; summarizing does not" },
                      { label: "D", text: "Paraphrasing is for quotes; summarizing is for ideas" },
                    ]}
                    correctAnswer="B"
                    explanation="Paraphrasing = same length, different words (restate). Summarizing = shorter, main ideas only (condense). Both require citations!"
                  />

                  <QuickCheckMC
                    questionNumber={2}
                    question="For the AWQ, which approach is correct?"
                    options={[
                      { label: "A", text: "Quote directly: 'FRT raises concerns about student privacy' (Andrejevic & Selwyn, 2020)." },
                      { label: "B", text: "Paraphrase: Student privacy issues are a significant consideration regarding FRT (Andrejevic & Selwyn, 2020)." },
                      { label: "C", text: "Summarize without citation: FRT has privacy concerns." },
                      { label: "D", text: "Use your own opinion: I think FRT has privacy problems." },
                    ]}
                    correctAnswer="B"
                    explanation="AWQ requires PARAPHRASING with citations — no direct quotes allowed! Option B paraphrases correctly with a citation."
                  />
                </div>

                {/* AI Writing Task for Part 1 */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-blue-500" />
                    Reflection Task
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    In your own words, explain WHY paraphrasing (not quoting) is required for the AWQ. What skills does it test that direct quotation doesn't?
                  </p>
                  <ConceptSelectTask
                    taskId="w1h2-part1-reflection"
                    concepts={AWQ_SKILLS}
                    selectionTitle="Which skills does the AWQ test that direct quotation doesn't?"
                    selectionDescription="Select the skills you think are being assessed through paraphrasing."
                    writingTitle="Explain your reasoning"
                    placeholder="In 2-3 sentences, explain WHY these skills matter for academic writing and why quoting wouldn't test them..."
                    minSelection={1}
                    aiPrompt={`You are an academic writing tutor for university students.

STUDENT'S RESPONSE:
{response}

SKILLS THE STUDENT SELECTED:
{concepts}

The student was asked: "Why is paraphrasing (not quoting) required for the AWQ? What skills does it test that direct quotation doesn't?"

Provide brief feedback (3-4 sentences):
1. Are the selected skills relevant? Did they miss any important ones?
2. Is their explanation clear and accurate?
3. One suggestion to deepen their understanding.`}
                    onComplete={handleTaskComplete}
                    studentId={studentId}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Part 2: The 4 Paraphrasing Strategies */}
            <CollapsibleSection
              title="Part 2: The 4 Paraphrasing Strategies"
              description="Learn and apply four key techniques for effective paraphrasing"
              icon={<PenLine className="h-4 w-4 text-green-600" />}
              defaultOpen={false}
              className="border-2 border-green-500/30 bg-green-500/5"
            >
              <div className="space-y-4">
                {/* Strategy Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Strategy 1 */}
                  <div className="p-4 rounded-lg border bg-background space-y-2">
                    <p className="font-medium text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-700 flex items-center justify-center text-xs font-bold">1</span>
                      Synonym Replacement
                    </p>
                    <p className="text-xs text-muted-foreground">Replace words with similar-meaning words.</p>
                    <div className="text-xs p-2 bg-muted/50 rounded">
                      <span className="text-red-500 line-through">introduced</span> → <span className="text-green-600">implemented</span>, 
                      <span className="text-red-500 line-through ml-2">various</span> → <span className="text-green-600">numerous</span>
                    </div>
                    <p className="text-xs text-amber-600 italic">⚠️ Don't abuse the thesaurus! Check context fit.</p>
                  </div>

                  {/* Strategy 2 */}
                  <div className="p-4 rounded-lg border bg-background space-y-2">
                    <p className="font-medium text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-700 flex items-center justify-center text-xs font-bold">2</span>
                      Word Form Changes
                    </p>
                    <p className="text-xs text-muted-foreground">Change word forms (verb → noun, adjective → adverb).</p>
                    <div className="text-xs p-2 bg-muted/50 rounded">
                      "technology is <span className="text-red-500 line-through">introduced</span>" → "the <span className="text-green-600">introduction</span> of technology"
                    </div>
                    <p className="text-xs text-amber-600 italic">💡 This naturally changes sentence structure!</p>
                  </div>

                  {/* Strategy 3 */}
                  <div className="p-4 rounded-lg border bg-background space-y-2">
                    <p className="font-medium text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-700 flex items-center justify-center text-xs font-bold">3</span>
                      Active ↔ Passive Voice
                    </p>
                    <p className="text-xs text-muted-foreground">Switch between active and passive voice.</p>
                    <div className="text-xs p-2 bg-muted/50 rounded">
                      <span className="text-red-500">"Researchers collected data"</span> → <span className="text-green-600">"Data was collected by researchers"</span>
                    </div>
                    <p className="text-xs text-amber-600 italic">💡 Academic writing often uses passive voice.</p>
                  </div>

                  {/* Strategy 4 */}
                  <div className="p-4 rounded-lg border bg-background space-y-2">
                    <p className="font-medium text-sm flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-green-500/20 text-green-700 flex items-center justify-center text-xs font-bold">4</span>
                      Sentence Structure
                    </p>
                    <p className="text-xs text-muted-foreground">Reorder, combine, or split sentences.</p>
                    <div className="text-xs p-2 bg-muted/50 rounded">
                      <span className="text-red-500">"Because X happened, Y resulted."</span> → <span className="text-green-600">"Y was the result of X happening."</span>
                    </div>
                    <p className="text-xs text-amber-600 italic">💡 Start from a different point than the original.</p>
                  </div>
                </div>

                {/* MC Questions for Part 2 */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-green-500" />
                    Identify the Strategy
                  </h4>

                  <QuickCheckMC
                    questionNumber={3}
                    question="Which paraphrasing strategy was used here?\n\nOriginal: 'Researchers collected data from participants.'\nParaphrase: 'Data was gathered from participants by the researchers.'"
                    options={[
                      { label: "A", text: "Synonym replacement only" },
                      { label: "B", text: "Word form change" },
                      { label: "C", text: "Active to passive voice" },
                      { label: "D", text: "Sentence structure change" },
                    ]}
                    correctAnswer="C"
                    explanation="The sentence changed from ACTIVE voice ('Researchers collected') to PASSIVE voice ('Data was collected by researchers'). Also used synonym: collected → gathered."
                  />

                  <QuickCheckMC
                    questionNumber={4}
                    question="Which paraphrasing strategy was used here?\n\nOriginal: 'The technology significantly impacts education.'\nParaphrase: 'The significant impact of technology on education...'"
                    options={[
                      { label: "A", text: "Synonym replacement" },
                      { label: "B", text: "Word form change (verb → noun)" },
                      { label: "C", text: "Active to passive voice" },
                      { label: "D", text: "Combining sentences" },
                    ]}
                    correctAnswer="B"
                    explanation="'impacts' (verb) → 'impact' (noun), 'significantly' (adverb) → 'significant' (adjective). Word form changes naturally alter sentence structure!"
                  />

                  <QuickCheckMC
                    questionNumber={5}
                    question="Which is the BEST paraphrase of: 'Parents support the use of face recognition systems in elementary schools.'?"
                    options={[
                      { label: "A", text: "Parents support using face recognition in elementary schools." },
                      { label: "B", text: "Face recognition systems are supported by parents in elementary schools." },
                      { label: "C", text: "In primary education settings, facial identification technology receives parental approval." },
                      { label: "D", text: "Parents like face recognition technology in schools." },
                    ]}
                    correctAnswer="C"
                    explanation="Option C uses multiple strategies: synonyms (elementary→primary, face recognition→facial identification), word form changes (support→approval), AND restructured the sentence. Options A and B are patchwriting."
                  />
                </div>

                {/* Strategy Practice with Multi-Select */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-green-500" />
                    Strategy Practice
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Select the strategies you'll use, then write your paraphrase. The AI will verify if you applied them correctly.
                  </p>
                  <StrategyPracticeTask
                    taskId="w1h2-part2-strategy"
                    originalSentence="Researchers collected data from 380 participants using a questionnaire."
                    citation="Hong et al., 2022"
                    onComplete={handleTaskComplete}
                    studentId={studentId}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Part 3: Patchwriting Detection */}
            <CollapsibleSection
              title="Part 3: Patchwriting Detection"
              description="Learn to identify and avoid patchwriting (a form of plagiarism)"
              icon={<AlertCircle className="h-4 w-4 text-red-600" />}
              defaultOpen={false}
              className="border-2 border-red-500/30 bg-red-500/5"
            >
              <div className="space-y-4">
                {/* Patchwriting Explanation */}
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    What is Patchwriting?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    <strong>Patchwriting</strong> is a form of <span className="text-red-600 font-medium">plagiarism</span> where you only make 
                    minor word changes to the original text while keeping the same structure.
                  </p>
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-sm font-medium text-red-700 mb-2">❌ Even WITH a citation, patchwriting is still plagiarism!</p>
                    <p className="text-xs text-muted-foreground">You must change BOTH words AND structure significantly.</p>
                  </div>
                </div>

                {/* Side-by-side Examples */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5 space-y-2">
                    <p className="text-xs font-medium text-red-700">❌ PATCHWRITING (Too Close)</p>
                    <p className="text-sm text-muted-foreground italic">"Facial recognition is currently being introduced across many aspects of public life."</p>
                    <p className="text-xs text-red-600">Only 3 words changed, structure identical!</p>
                  </div>
                  <div className="p-4 rounded-lg border border-green-500/30 bg-green-500/5 space-y-2">
                    <p className="text-xs font-medium text-green-700">✅ ACCEPTABLE PARAPHRASE</p>
                    <p className="text-sm text-muted-foreground italic">"Across numerous sectors of society, facial identification systems are increasingly being implemented."</p>
                    <p className="text-xs text-green-600">Different structure, multiple word changes.</p>
                  </div>
                </div>

                {/* MC Questions for Part 3 */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-red-500" />
                    Spot the Patchwriting
                  </h4>

                  <QuickCheckMC
                    questionNumber={6}
                    question="Patchwriting is acceptable as long as you include a citation."
                    options={[
                      { label: "A", text: "True" },
                      { label: "B", text: "False" },
                    ]}
                    correctAnswer="B"
                    explanation="FALSE! Patchwriting is still plagiarism even with a citation. You must significantly change BOTH the words AND the structure."
                  />

                  <QuickCheckMC
                    questionNumber={7}
                    question="Is this an acceptable paraphrase or patchwriting?\n\nOriginal: 'Facial recognition technology is now being introduced across various aspects of public life.'\nAttempt: 'Facial recognition is currently being introduced across many aspects of public life.'"
                    options={[
                      { label: "A", text: "Acceptable paraphrase — words were changed" },
                      { label: "B", text: "Patchwriting — too close to the original" },
                      { label: "C", text: "Direct quote — needs quotation marks" },
                      { label: "D", text: "Summary — it's shorter" },
                    ]}
                    correctAnswer="B"
                    explanation="This is PATCHWRITING. Only 3 words changed (now→currently, various→many, technology removed), but the sentence structure is IDENTICAL."
                  />
                </div>

                {/* Writing Task for Part 3 */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <PenLine className="h-4 w-4 text-red-500" />
                    Writing Task: Paraphrase with Strategies
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Paraphrase ONE of the following sentences using at least 2 strategies. Include a proper APA citation.
                  </p>
                  <div className="p-3 rounded-lg bg-muted/50 border text-sm space-y-2">
                    <p>1. "Facial recognition technology is now being introduced across various aspects of public life." (Andrejevic & Selwyn, 2020)</p>
                    <p>2. "The research demonstrates that technology significantly impacts education." (Hong et al., 2022)</p>
                  </div>
                  <ConceptSelectTask
                    taskId="w1h2-paraphrase-practice"
                    concepts={PARAPHRASING_STRATEGIES}
                    contextText={`Choose ONE to paraphrase:\n1. "Facial recognition technology is now being introduced across various aspects of public life." (Andrejevic & Selwyn, 2020)\n2. "The research demonstrates that technology significantly impacts education." (Hong et al., 2022)`}
                    contextLabel="Original Sentences:"
                    selectionTitle="Step 1: Select the strategies you will use"
                    selectionDescription="Choose at least 2 strategies before writing your paraphrase."
                    writingTitle="Step 2: Write your paraphrase"
                    placeholder="Write your paraphrase using the strategies you selected. Don't forget the citation!"
                    minSelection={2}
                    aiPrompt={`You are an expert academic writing tutor assessing paraphrasing practice.

ORIGINAL SENTENCES:
{context}

STUDENT'S PARAPHRASE:
{response}

STRATEGIES THE STUDENT CLAIMS TO HAVE USED:
{concepts}

Provide feedback (4-6 sentences):
1. **Strategy Verification**: Did the student actually apply each claimed strategy? Be specific about what changes you observe.
2. **Patchwriting Check**: Is this acceptable or too close to the original?
3. **Citation Check**: Is the citation included and formatted correctly?
4. **Quick Tip**: One specific improvement suggestion.`}
                    onComplete={handleTaskComplete}
                    studentId={studentId}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Part 4: Citations with Paraphrasing */}
            <CollapsibleSection
              title="Part 4: Citation Integration"
              description="Learn to correctly cite your paraphrased content"
              icon={<FileText className="h-4 w-4 text-purple-600" />}
              defaultOpen={false}
              className="border-2 border-purple-500/30 bg-purple-500/5"
            >
              <div className="space-y-4">
                {/* Citation Types */}
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-purple-500" />
                    Two Ways to Cite
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border bg-purple-500/5 border-purple-500/30">
                      <p className="text-xs font-medium text-purple-700 mb-1">Author-Prominent (Narrative)</p>
                      <p className="text-sm text-muted-foreground italic">"Hong et al. (2022) argue that..."</p>
                      <p className="text-xs text-muted-foreground mt-1">Emphasizes WHO said it</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-purple-500/5 border-purple-500/30">
                      <p className="text-xs font-medium text-purple-700 mb-1">Information-Prominent (Parenthetical)</p>
                      <p className="text-sm text-muted-foreground italic">"...according to recent research (Hong et al., 2022)."</p>
                      <p className="text-xs text-muted-foreground mt-1">Emphasizes WHAT was found</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mt-3">
                    <p className="text-sm font-medium text-amber-700">💡 APA 7th Quick Rule:</p>
                    <p className="text-xs text-muted-foreground">For 3+ authors, use "et al." from the FIRST citation: Hong et al. (2022)</p>
                  </div>
                </div>

                {/* MC Questions for Part 4 */}
                <div className="space-y-3 pt-2">
                  <QuickCheckMC
                    questionNumber={8}
                    question="What is the correct APA 7th citation for this paraphrase?\n\n'Recent studies indicate that technological innovation influences parental attitudes toward school safety measures.'\n\nSource: Hong, Li, Kuo & An (2022)"
                    options={[
                      { label: "A", text: "...safety measures (Hong, Li, Kuo & An, 2022)." },
                      { label: "B", text: "...safety measures (Hong et al., 2022)." },
                      { label: "C", text: "...safety measures. (Hong et al., 2022)" },
                      { label: "D", text: "...safety measures [Hong et al., 2022]." },
                    ]}
                    correctAnswer="B"
                    explanation="For 3+ authors in APA 7th: use 'et al.' from the FIRST citation. The period goes AFTER the parentheses. No brackets in APA."
                  />

                  <QuickCheckMC
                    questionNumber={9}
                    question="Which version shows author-prominent citation?"
                    options={[
                      { label: "A", text: "Technology impacts education significantly (Hong et al., 2022)." },
                      { label: "B", text: "Hong et al. (2022) argue that technology impacts education significantly." },
                      { label: "C", text: "According to (Hong et al., 2022), technology impacts education." },
                      { label: "D", text: "Technology impacts education (2022)." },
                    ]}
                    correctAnswer="B"
                    explanation="Author-prominent (narrative) puts the author's name as part of the sentence: 'Hong et al. (2022) argue...' Option A is info-prominent."
                  />
                </div>

                {/* AI Writing Task for Part 4 */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Citation Practice
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Write TWO versions of a paraphrase for the sentence below — one using author-prominent citation, one using info-prominent citation.
                  </p>
                  <div className="p-3 rounded-lg bg-muted/50 border text-sm italic">
                    Original: "School authorities annually spend $2.7 billion on campus security products and services." (Doffman, 2018, as cited in Andrejevic & Selwyn, 2020)
                  </div>
                  <ConceptSelectTask
                    taskId="w1h2-part4-citation"
                    concepts={CITATION_CONCEPTS}
                    contextText={`"School authorities annually spend $2.7 billion on campus security products and services." (Doffman, 2018, as cited in Andrejevic & Selwyn, 2020)`}
                    contextLabel="Original:"
                    selectionTitle="Which citation styles will you demonstrate?"
                    selectionDescription="Select the citation types you'll use in your response."
                    writingTitle="Write both versions of your paraphrase"
                    placeholder="Author-Prominent Version:&#10;[e.g., According to Doffman (2018, as cited in Andrejevic & Selwyn, 2020), ...]&#10;&#10;Info-Prominent Version:&#10;[e.g., ...spending reaches billions annually (Doffman, 2018, as cited in Andrejevic & Selwyn, 2020).]"
                    minSelection={2}
                    aiPrompt={`You are an APA citation expert assessing a student's citation practice.

ORIGINAL SENTENCE:
{context}

STUDENT'S PARAPHRASE VERSIONS:
{response}

CITATION STYLES THE STUDENT CLAIMS TO DEMONSTRATE:
{concepts}

Provide focused feedback (4-5 sentences):
1. **Author-Prominent Version**: Is it formatted correctly? Is the author integrated into the sentence?
2. **Info-Prominent Version**: Is the citation at the end in parentheses? Is punctuation correct?
3. **Secondary Source**: Did they handle "as cited in" correctly?
4. **Paraphrasing Quality**: Are both versions acceptable paraphrases (not patchwriting)?
5. **Quick Fix**: One specific correction if needed.`}
                    onComplete={handleTaskComplete}
                    studentId={studentId}
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Part 5: Comprehensive Integrated Assessment */}
            <CollapsibleSection
              title="Part 5: Integrated Skills Assessment"
              description="Test ALL your paraphrasing skills with comprehensive paragraph-level tasks"
              icon={<Target className="h-4 w-4 text-accent" />}
              defaultOpen={false}
              className="border-2 border-accent/30 bg-gradient-to-r from-accent/10 to-transparent"
            >
              <div className="space-y-4">
                {/* Introduction */}
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <p className="text-sm font-medium text-accent-foreground flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Comprehensive Assessment
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    This section tests your ability to apply ALL paraphrasing techniques together. You'll work with longer passages, use multiple strategies, handle different citation types, and receive detailed AI feedback on your work.
                  </p>
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div className="p-2 rounded bg-background text-center">
                      <p className="text-xs font-medium text-green-600">Synonyms</p>
                    </div>
                    <div className="p-2 rounded bg-background text-center">
                      <p className="text-xs font-medium text-blue-600">Word Forms</p>
                    </div>
                    <div className="p-2 rounded bg-background text-center">
                      <p className="text-xs font-medium text-purple-600">Voice</p>
                    </div>
                    <div className="p-2 rounded bg-background text-center">
                      <p className="text-xs font-medium text-amber-600">Structure</p>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Coach (optional warm-up) */}
                <details className="group">
                  <summary className="cursor-pointer p-3 rounded-lg bg-muted/30 border hover:bg-muted/50 transition-colors">
                    <span className="text-sm font-medium flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      Need a warm-up? Try the Step-by-Step Coach first
                      <ChevronDown className="h-4 w-4 ml-auto group-open:rotate-180 transition-transform" />
                    </span>
                  </summary>
                  <div className="mt-3 p-3 rounded-lg border bg-background">
                    <p className="text-xs text-muted-foreground mb-3">
                      This guided coach walks you through each step: Read → Understand → Plan → Draft → Cite → Check
                    </p>
                    <ParaphraseCoach 
                      studentId={studentId} 
                      onComplete={(sentenceId) => handleTaskComplete(`paraphrase-${sentenceId}`)}
                    />
                  </div>
                </details>

                {/* Main Integrated Assessment */}
                <IntegratedParaphraseTask
                  studentId={studentId}
                  onComplete={() => handleTaskComplete("w1h2-integrated-complete")}
                />
              </div>
            </CollapsibleSection>
          </section>
        )}

        {/* Week 1 Hour 3: AI-Tutored Practice Session */}
        {weekNumber === 1 && hourNumber === 3 && (
          <Hour3PracticeSession
            weekNumber={weekNumber}
            studentId={studentId || "anonymous"}
            onComplete={() => handleTaskComplete("w1h3-practice-complete")}
          />
        )}

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
              defaultOpen={false}
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
                      Open Article
                    </a>
                  </Button>
                </div>

                {/* NOTE: All MC question sets should be wrapped in CollapsibleSection for better UX */}
                {/* Scanning Tasks - Collapsible */}
                <CollapsibleSection
                  title="Scanning Practice: Find Specific Information"
                  description="Scan the article page to find these specific details. Don't read everything—just locate the information!"
                  icon={<Target className="h-4 w-4 text-blue-500" />}
                  defaultOpen={false}
                  className="border border-blue-500/20 bg-blue-500/5"
                >
                  <div className="space-y-3">
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
                        { label: "A", text: "05 November 2019" },
                        { label: "B", text: "27 January 2020" },
                        { label: "C", text: "14 February 2020" },
                        { label: "D", text: "3 March 2020" },
                      ]}
                      correctAnswer="A"
                      explanation="The article shows 'Published online: 05 Nov 2019' in the publication information section on the Taylor & Francis website."
                    />
                  </div>
                </CollapsibleSection>

                {/* Skimming Tasks - Collapsible */}
                <CollapsibleSection
                  title="Skimming Practice: Understand the Big Picture"
                  description="Skim the article by reading headings, the abstract, and the first sentence of each section. Don't read in detail!"
                  icon={<Target className="h-4 w-4 text-green-500" />}
                  defaultOpen={false}
                  className="border border-green-500/20 bg-green-500/5"
                >
                  <div className="space-y-3">
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
                </CollapsibleSection>
              </div>
            </CollapsibleSection>

            {/* Part 3a: Outlining - Macro Level */}
            <CollapsibleSection
              title="Part 3a: Outlining – Macro Level"
              description="Learn to identify the overall structure of academic papers"
              icon={<FileText className="h-4 w-4 text-purple-600" />}
              defaultOpen={false}
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
                  description="Click each paragraph to read and add notes"
                  icon={<ScrollText className="h-4 w-4 text-purple-500" />}
                  defaultOpen={false}
                  className="border-purple-500/20"
                >
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Click on each paragraph to expand it and add your notes. Your notes are saved automatically.
                    </p>
                    
                    <ParagraphWithNotes
                      paragraphNumber={1}
                      paragraphKey="w1h1-p1"
                      content="Against this contentious background, then, we need to consider how these technologies are being applied to the specific context of education. While rarely foregrounded in debates about facial recognition in society, the school sector is one of the public settings where this technology is beginning to be taken up and implemented at scale. This is perhaps not surprising given, on the one hand, the role played by the classroom in the development of monitoring and disciplinary practices and, on the other, the increasing normalisation of surveillance in the name of protecting and securing young people."
                      studentId={studentId || undefined}
                    />

                    <ParagraphWithNotes
                      paragraphNumber={2}
                      paragraphKey="w1h1-p2"
                      content="One prominent educational application of facial recognition technology is campus security. This form of facial recognition is most prevalent in the US, where school shooting incidents have prompted school authorities to annually spend $2.7 billion on-campus security products and services (Doffman, 2018). Facial recognition systems have now been sold to thousands of US schools, with vendors 'pitching the technology as an all-seeing shield against school shootings' (Harwell, 2018, n.p). As well as purporting to identify unauthorised intruders, systems have been developed to make use of video object classification trained to detect gun-shaped objects, alongside more subtle forms of 'anomaly detection' such as students arriving at school in different-than-usual clothes, bags and other apparel (Harwell, 2018)."
                      studentId={studentId || undefined}
                    />

                    <ParagraphWithNotes
                      paragraphNumber={3}
                      paragraphKey="w1h1-p3"
                      content="Another application of facial recognition in schools is attendance monitoring – promising to put an end to the inevitable gaps and omissions that arise when human teachers are tasked with repeatedly conducting roll-calls of large student groups (Puthea et al., 2017). This application of facial recognition is proving popular in countries such as the UK and Australia where school shootings and unauthorised campus incursions are rare. For example, the Australian 'Loop-Learn' facial recognition roll-call system has been marketed amidst estimates of saving up to 2.5 hours of teacher time per week."
                      studentId={studentId || undefined}
                    />

                    <ParagraphWithNotes
                      paragraphNumber={4}
                      paragraphKey="w1h1-p4"
                      content="Beyond campus-based security and tracking physical bodies, facial recognition is also being used in a number of 'virtual learning' contexts. For example, facial recognition systems are now being developed as a means of ensuring the integrity of various aspects of online courses. This includes controlling access to online educational content (Montgomery & Marais, 2014), as well as using webcam-based facial recognition to authenticate online learners (Valera et al., 2015). Similarly, there is a growing interest in using facial recognition technology for so-called e-assessment security."
                      studentId={studentId || undefined}
                    />

                    <ParagraphWithNotes
                      paragraphNumber={5}
                      paragraphKey="w1h1-p5"
                      content="Finally, there is a growing interest in facial detection techniques as an indicator of student 'engagement' and learning. For example, research and development in this area have reported that detecting brief 'facial actions' can prove an accurate indicator of students' (non)engagement with online learning environments – highlighting episodes of boredom, confusion, delight, flow, frustration, and surprise (Dewan et al., 2019). Particularly insightful facial actions with regards to learning are reckoned to include brow-raising, eyelid tightening, and mouth dimpling."
                      studentId={studentId || undefined}
                    />

                    <ParagraphWithNotes
                      paragraphNumber={6}
                      paragraphKey="w1h1-p6"
                      content="These largely experimental developments have led some educationalists to enthusiastically anticipate facial learning detection being deployed on a mass scale. As Timms (2016, p. 712) reasons, it might soon be possible to gain a 'real-time' sense of which groups of students are in a 'productive state' and other instances 'where the overall activity is not productive'. The promise of customisation that characterises the development of automated learning systems encourages their incorporation into student learning interfaces."
                      studentId={studentId || undefined}
                    />
                  </div>
                </CollapsibleSection>

                {/* Writing Practice - placed above MC for easier reference to source text */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Writing Practice: Narrate the Excerpt Structure
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Write <strong>3 sentences</strong> that describe what the excerpt covers at the macro level. Focus on <em>structure and progression</em>, not detailed content.
                  </p>
                  <ConceptSelectTask
                    taskId="w1h1-macro-structure"
                    concepts={OUTLINING_CONCEPTS}
                    selectionTitle="Which outlining techniques will you demonstrate?"
                    selectionDescription="Select the techniques you used to analyze the excerpt's structure."
                    writingTitle="Describe the excerpt's structure (3 sentences)"
                    placeholder='Example: "The excerpt begins by... Then, it moves on to discuss... Finally, it explores..."'
                    minSelection={2}
                    aiPrompt={`You are an academic reading skills tutor assessing a student's macro-level outlining.

The student analyzed an excerpt about Facial Recognition Technology in Education (6 paragraphs covering: Introduction → Security → Attendance → Online Learning → Engagement Detection → Future).

STUDENT'S STRUCTURAL ANALYSIS:
{response}

OUTLINING TECHNIQUES THE STUDENT CLAIMS TO HAVE USED:
{concepts}

Provide focused feedback (4-5 sentences):
1. **Accuracy**: Does the student correctly identify the excerpt's structure and progression?
2. **Technique Application**: Did they demonstrate the outlining techniques they selected?
3. **Completeness**: Did they capture the logical flow from physical to invisible surveillance?
4. **Improvement**: One specific suggestion to strengthen their analysis.`}
                    onComplete={handleTaskComplete}
                    studentId={studentId}
                  />
                </div>

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
              </div>
            </CollapsibleSection>

            {/* Part 3b: Outlining - Micro Level */}
            <CollapsibleSection
              title="Part 3b: Outlining – Micro Level"
              description="Learn to identify key points within paragraphs"
              icon={<FileText className="h-4 w-4 text-indigo-600" />}
              defaultOpen={false}
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
                <MicroLevelPractice onComplete={handleTaskComplete} studentId={studentId || getStoredStudentId()} />
              </div>
            </CollapsibleSection>
          </section>
        )}


        {/* Key Concepts - hide for Week 1 Hour 1 & 2 (custom content) */}
        {/* Key Concepts - hide for Week 1 all hours (custom content) */}
        {!(weekNumber === 1 && (hourNumber === 1 || hourNumber === 2 || hourNumber === 3)) && hourData.keyConcepts && hourData.keyConcepts.length > 0 && (
          <CollapsibleSection
            title="Key Concepts"
            description="Essential terms and ideas for this hour"
            icon={<Lightbulb className="h-4 w-4 text-amber-500" />}
            defaultOpen={false}
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

        {/* Article Excerpts - hide for Week 1 all hours (custom content) */}
        {!(weekNumber === 1 && (hourNumber === 1 || hourNumber === 2 || hourNumber === 3)) && hourData.articles && hourData.articles.length > 0 && (
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

        {/* Objective Tasks - hide for Week 1 all hours (custom content) */}
        {!(weekNumber === 1 && (hourNumber === 1 || hourNumber === 2 || hourNumber === 3)) && objectiveTasks.length > 0 && (
          <CollapsibleSection
            title="Quick Check Tasks"
            description="Multiple choice, true/false, and fill-in-the-blank with instant feedback"
            icon={<BookOpen className="h-4 w-4 text-primary" />}
            defaultOpen={false}
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

        {/* Writing Tasks - hide for Week 1 all hours (custom content) */}
        {!(weekNumber === 1 && (hourNumber === 1 || hourNumber === 2 || hourNumber === 3)) && writingTasks.length > 0 && (
          <CollapsibleSection
            title="Writing Tasks"
            description="Practice academic writing with AI feedback"
            icon={<PenLine className="h-4 w-4 text-primary" />}
            defaultOpen={false}
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

        {/* Main Writing Task - hide for Week 1 all hours (custom content) */}
        {!(weekNumber === 1 && (hourNumber === 1 || hourNumber === 2 || hourNumber === 3)) && hourData.writingTask && (
          <CollapsibleSection
            title="Hour Writing Task"
            description="The main writing practice for this hour"
            icon={<PenLine className="h-4 w-4 text-amber-500" />}
            defaultOpen={false}
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
        <div className="bg-muted/30 rounded-lg p-4 border space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <p className="font-medium text-sm">Progress</p>
              <p className="text-xs text-muted-foreground">
                {completedTasks.size} / {totalTasks} tasks completed
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {isLoggedIn ? (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/my-progress">
                    <Target className="h-4 w-4 mr-1" />
                    View My Progress
                  </Link>
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={downloadReport}>
                  <Download className="h-4 w-4 mr-1" />
                  Download Report
                </Button>
              )}
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
          
          {/* Guest user prompt */}
          {!isLoggedIn && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <div className="flex items-start gap-3">
                <LogIn className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-blue-700">
                    <strong>Not logged in?</strong> Your progress is saved temporarily in this browser. 
                    To keep your progress across devices, register for a student ID.
                  </p>
                  <Button size="sm" variant="outline" asChild>
                    <Link to="/auth">
                      <LogIn className="h-4 w-4 mr-1" />
                      Register / Login
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}