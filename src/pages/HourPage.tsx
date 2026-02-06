/**
 * @fileoverview HourPage - Main page component for hour-based curriculum content.
 * 
 * This page renders the curriculum content for a specific week/hour combination.
 * It includes:
 * - Learning objectives and goals
 * - Interactive tasks (MC questions, writing exercises)
 * - AI-powered feedback
 * - Progress tracking
 * 
 * @see /docs/architecture/README.md for system overview
 */

import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getHourData } from "@/data/hourContent";
import { useAuth } from "@/features/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Task components
import { 
  ObjectiveTask, 
  QuickCheckMC,
  HourQuickCheckMC,
  WritingTask, 
  ParaphraseCoach, 
  AskQuestionButton, 
  ParagraphWithNotes, 
  WritingPracticeWithHistory, 
  IntegratedParaphraseTask, 
  StrategyPracticeTask, 
  ConceptSelectTask 
} from "@/components/tasks";
import type { ConceptOption } from "@/components/tasks";

// Hour-specific components (extracted for modularity)
import { WritingTaskWithFeedback, MicroLevelPractice, Week3MoodleTasks } from "@/components/hours";

// Data imports (extracted to separate module)
import {
  PRACTICE_PARAGRAPHS,
  PARAPHRASING_STRATEGIES,
  AWQ_SKILLS,
  CITATION_CONCEPTS,
  OUTLINING_CONCEPTS,
  SKIMMING_SCANNING_CONCEPTS,
  getProgressKey,
} from "@/data/hours";

// Feature modules
import { StudentLoginReminder } from "@/components/StudentLoginReminder";
import { LectureOutline, useSectionProgress, generateSectionId } from "@/features/lecture-mode";
import type { AgendaSectionEnhanced } from "@/features/lecture-mode";
import { TeacherQuestionDashboard } from "@/components/teacher/TeacherQuestionDashboard";
import { Hour3PracticeSession } from "@/components/lessons/Hour3PracticeSession";
import { ClassroomDiscussionPage } from "@/features/classroom-discussion";
import { AWQWritingGame } from "@/components/awq-game";
import { OCRWritingReview } from "@/components/ocr-review";
import { AWQGuideGame, SampleAWQQuiz, HTMLGameWithAI, AWQWritingGame as NativeAWQGame } from "@/components/awq-guide";
import { Week4AdHocNotes } from "@/components/Week4AdHocNotes";

// UI components and icons
import { 
  ArrowLeft, ArrowRight, Clock, Target, BookOpen, PenLine, 
  CheckCircle2, Lightbulb, FileText, Sparkles, ExternalLink, 
  AlertCircle, Calendar, GraduationCap, ScrollText, ChevronDown, 
  Download, LogIn, Loader2, Trophy, Users, Camera 
} from "lucide-react";
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

// ============================================================================
// Constants
// ============================================================================

/** Week 1 Hour 1 has 10 MC questions + 2 writing tasks = 12 total tasks */
const WEEK1_HOUR1_TOTAL_TASKS = 12;

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Gets the student ID from localStorage for anonymous session tracking.
 * @returns Student ID string or undefined if not set
 */
/**
 * Gets the student ID from localStorage for anonymous session tracking.
 * @returns Student ID string or undefined if not set
 */
function getStoredStudentId(): string | undefined {
  try {
    return localStorage.getItem("ue1_student_id") || undefined;
  } catch {
    return undefined;
  }
}

// ============================================================================
// Main Component
// ============================================================================

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

        {/* Week 2: Adhoc Notes - Embedded Google Doc */}
        {weekNumber === 2 && (
          <Collapsible>
            <Card className="border-amber-500/30 bg-amber-500/5">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-amber-500/10 transition-colors pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ScrollText className="h-4 w-4 text-amber-600" />
                      <CardTitle className="text-base">Adhoc Notes</CardTitle>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <CardDescription>Additional notes and materials for this week</CardDescription>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-3">
                  <div className="aspect-[16/9] w-full rounded-lg overflow-hidden border">
                    <iframe
                      src="https://docs.google.com/document/d/182xbd3rh66VcnqXugXg3UKxF-ZdXQWtgWOR11LDmL8Y/preview"
                      width="100%"
                      height="100%"
                      className="border-0"
                      title="Week 2 Adhoc Notes"
                    />
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://docs.google.com/document/d/182xbd3rh66VcnqXugXg3UKxF-ZdXQWtgWOR11LDmL8Y/edit?tab=t.0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in Google Docs
                    </a>
                  </Button>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        )}

        {/* Learning Goals - moved to top (hidden for Week 3 which has custom layouts) */}
        {!(weekNumber === 3) && (
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
        )}

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
                    question="Which paraphrasing strategy was used here? Original: 'Researchers collected data from participants.' Paraphrase: 'Data was gathered from participants by the researchers.'"
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
                    question="Which paraphrasing strategy was used here? Original: 'The technology significantly impacts education.' Paraphrase: 'The significant impact of technology on education...'"
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
                    question="Is this an acceptable paraphrase or patchwriting? Original: 'Facial recognition technology is now being introduced across various aspects of public life.' Attempt: 'Facial recognition is currently being introduced across many aspects of public life.'"
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
            studentId={studentId} // Pass null if not logged in - component will show login prompt
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
                  <Link to="/course_info" className="flex items-center gap-2">
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
                    <HourQuickCheckMC
                      weekNumber={weekNumber}
                      hourNumber={hourNumber}
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

                    <HourQuickCheckMC
                      weekNumber={weekNumber}
                      hourNumber={hourNumber}
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

                    <HourQuickCheckMC
                      weekNumber={weekNumber}
                      hourNumber={hourNumber}
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

                    <HourQuickCheckMC
                      weekNumber={weekNumber}
                      hourNumber={hourNumber}
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
                    <HourQuickCheckMC
                      weekNumber={weekNumber}
                      hourNumber={hourNumber}
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

                    <HourQuickCheckMC
                      weekNumber={weekNumber}
                      hourNumber={hourNumber}
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

                    <HourQuickCheckMC
                      weekNumber={weekNumber}
                      hourNumber={hourNumber}
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


        {/* Key Concepts - hide for Weeks 1-3 (content integrated into Parts) */}
        {!((weekNumber >= 1 && weekNumber <= 3)) && hourData.keyConcepts && hourData.keyConcepts.length > 0 && (
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

        {/* Article Excerpts - hide for Weeks 1-3 (content integrated into Parts) */}
        {!((weekNumber >= 1 && weekNumber <= 3)) && hourData.articles && hourData.articles.length > 0 && (
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

        {/* Quick Check Tasks - hide for Weeks 1-3 (content integrated into Parts) */}
        {!((weekNumber >= 1 && weekNumber <= 3)) && objectiveTasks.length > 0 && (
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

        {/* Writing Tasks - hide for Weeks 1-3 (content integrated into Parts) */}
        {!((weekNumber >= 1 && weekNumber <= 3)) && writingTasks.length > 0 && (
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

        {/* Hour Writing Task - hide for Weeks 1-3 (content integrated into Parts) */}
        {!((weekNumber >= 1 && weekNumber <= 3)) && hourData.writingTask && (
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

        {/* Week 2 Hour 1: APA In-Text Citations */}
        {weekNumber === 2 && hourNumber === 1 && (
          <section className="space-y-6">
            {/* Part 1: Citation Basics with Integrated Practice */}
            <CollapsibleSection
              title="Part 1: Citation Basics - Author vs. Information Prominent"
              description="Learn the two main ways to cite sources and practice identifying them"
              icon={<BookOpen className="h-4 w-4 text-blue-600" />}
              defaultOpen={true}
              className="border-2 border-blue-500/30 bg-blue-500/5"
            >
              <div className="space-y-4">
                {/* What Are Citations & Why They Matter */}
                <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 space-y-4">
                  <h4 className="font-medium flex items-center gap-2 text-primary">
                    <Sparkles className="h-4 w-4" />
                    What Are Citations?
                  </h4>
                  <div className="space-y-3">
                    <p className="text-sm">
                      A <strong>citation</strong> is a reference to a source of information—a way of acknowledging where your ideas, evidence, or words come from. In academic writing, citations typically include the author's name and publication year.
                    </p>
                    <div className="p-3 rounded-lg bg-background/80 border">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Example:</p>
                      <p className="text-sm italic">"Facial recognition technology raises privacy concerns (Andrejevic & Selwyn, 2020)."</p>
                    </div>
                  </div>
                </div>

                {/* Why Citations Matter - Academic Socialization */}
                <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 space-y-4">
                  <h4 className="font-medium flex items-center gap-2 text-amber-700">
                    <Users className="h-4 w-4" />
                    Why Do We Cite? Joining the Scholarly Conversation
                  </h4>
                  <div className="space-y-3 text-sm">
                    <p>
                      Citations are more than just a formatting requirement—they're a <strong>defining feature of academic writing</strong> and a key part of your <strong>academic socialisation</strong>.
                    </p>
                    <div className="p-3 rounded-lg bg-background/80 border-l-4 border-amber-500">
                      <p className="text-sm italic text-muted-foreground">
                        "If I have seen further, it is by standing on the shoulders of giants."
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">— Isaac Newton (1675)</p>
                    </div>
                    <p>
                      Academic research is fundamentally <strong>social</strong>. Every scholar builds upon the work of those who came before. When you cite:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>You <strong>acknowledge</strong> the scholars whose ideas shaped your thinking</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>You <strong>join</strong> an ongoing conversation in your field</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-amber-600 mt-0.5">•</span>
                        <span>You allow <strong>future scholars</strong> to trace and build upon your work</span>
                      </li>
                    </ul>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-sm font-medium text-primary">
                        💡 Learning to cite is how you become "one of us"—a member of the academic community.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Practical Reminder */}
                <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                  <p className="text-sm flex items-start gap-2">
                    <Target className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Practical note:</strong> Mastering citations is essential for your <strong>AWQ</strong> and all future assignments. But beyond grades, it's a skill that marks you as a serious academic thinker.
                    </span>
                  </p>
                </div>

                {/* Concept Introduction - Two Ways to Cite */}
                <div className="p-4 rounded-lg bg-background/80 space-y-3 border-t-2 border-blue-500/30 pt-6 mt-2">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Two Ways to Cite
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Now that you understand <em>why</em> we cite, let's learn <em>how</em>. In academic writing, you can cite sources in two main ways depending on what you want to emphasize.
                  </p>
                </div>

                {/* Side-by-side comparison */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-blue-500/5 border-blue-500/30 space-y-2">
                    <p className="text-sm font-medium text-blue-700">📖 Information-Prominent (Parenthetical)</p>
                    <p className="text-sm text-muted-foreground italic">"FRT is increasingly common in schools (Hong et al., 2022)."</p>
                    <p className="text-xs text-blue-600">Focus on the INFORMATION; author in brackets at the end.</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-green-500/5 border-green-500/30 space-y-2">
                    <p className="text-sm font-medium text-green-700">👤 Author-Prominent (Narrative)</p>
                    <p className="text-sm text-muted-foreground italic">"Hong et al. (2022) found that FRT is increasingly common."</p>
                    <p className="text-xs text-green-600">Focus on WHO said it; author is part of the sentence.</p>
                  </div>
                </div>

                {/* Reading Passage */}
                <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Read & Analyze
                  </h4>
                  <div className="p-3 bg-background rounded-lg text-sm leading-relaxed">
                    <p className="mb-2">
                      "The use of facial recognition technology in educational settings has increased dramatically. <span className="bg-blue-200/50 px-1 rounded">According to Andrejevic and Selwyn (2020)</span>, schools are among the public spaces where this technology is being implemented at scale. <span className="bg-green-200/50 px-1 rounded">This trend is particularly notable in the US, where security concerns have driven widespread adoption (Doffman, 2018)</span>."
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      <span className="bg-blue-200/50 px-1 rounded">Blue</span> = Author-Prominent | <span className="bg-green-200/50 px-1 rounded">Green</span> = Info-Prominent
                    </p>
                  </div>
                </div>

                {/* MC Questions */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Quick Check
                  </h4>
                  
                  <QuickCheckMC
                    questionNumber={1}
                    question="Which citation style is this? 'Parental support for FRT was found to be high (Hong et al., 2022).'"
                    options={[
                      { label: "A", text: "Author-Prominent (Narrative)" },
                      { label: "B", text: "Information-Prominent (Parenthetical)" },
                      { label: "C", text: "Secondary Citation" },
                      { label: "D", text: "Direct Quote" },
                    ]}
                    correctAnswer="B"
                    explanation="The author appears in parentheses at the END of the sentence, making this Information-Prominent. The focus is on the finding, not who said it."
                  />

                  <QuickCheckMC
                    questionNumber={2}
                    question="Which citation style is this? 'Andrejevic and Selwyn (2020) argue that FRT raises ethical concerns.'"
                    options={[
                      { label: "A", text: "Author-Prominent (Narrative)" },
                      { label: "B", text: "Information-Prominent (Parenthetical)" },
                      { label: "C", text: "Secondary Citation" },
                      { label: "D", text: "Incorrect APA format" },
                    ]}
                    correctAnswer="A"
                    explanation="The authors' names are part of the sentence itself with year in brackets. This is Author-Prominent, emphasizing WHO is making the argument."
                  />
                </div>

                {/* Writing Task */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Writing Practice: Convert Citation Styles
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Convert this Info-Prominent citation to Author-Prominent. Keep the meaning the same but emphasize WHO said it:
                  </p>
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <strong>Original (Info-Prominent):</strong> "FRT is now commonly used for campus security (Doffman, 2018)."
                  </div>
                  <WritingPracticeWithHistory
                    taskKey="w2h1-citation-convert-1"
                    studentId={studentId || "anonymous"}
                    title="Writing Practice 1: Convert to Author-Prominent"
                    instructions="Rewrite this sentence using Author-Prominent citation. The author's name should be part of the sentence, with the year in parentheses."
                    placeholder="Doffman (2018) ..."
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Part 2: APA 7th Formatting Rules with Integrated Practice */}
            <CollapsibleSection
              title="Part 2: APA 7th Formatting Rules"
              description="Master 'and' vs '&' and 'et al.' with hands-on practice"
              icon={<FileText className="h-4 w-4 text-green-600" />}
              defaultOpen={false}
              className="border-2 border-green-500/30 bg-green-500/5"
            >
              <div className="space-y-4">
                {/* The & vs and Rule */}
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-green-500" />
                    The "&" vs "and" Rule
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border bg-green-500/5">
                      <p className="text-xs font-medium text-green-700 mb-1">Inside Parentheses: Use &</p>
                      <p className="text-sm text-muted-foreground italic">"...concerns about privacy (Andrejevic & Selwyn, 2020)."</p>
                    </div>
                    <div className="p-3 rounded-lg border bg-blue-500/5">
                      <p className="text-xs font-medium text-blue-700 mb-1">In the Sentence: Use 'and'</p>
                      <p className="text-sm text-muted-foreground italic">"Andrejevic and Selwyn (2020) argue..."</p>
                    </div>
                  </div>
                </div>

                {/* Et al. Rule */}
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-purple-500" />
                    The "et al." Rule (3+ Authors)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>et al.</strong> = Latin for "and others". Use for sources with 3 or more authors.
                  </p>
                  <div className="p-3 rounded-lg border bg-muted/30">
                    <ul className="text-sm space-y-1">
                      <li>✅ <span className="italic">"Hong et al. (2022) found..."</span></li>
                      <li>✅ <span className="italic">"...parental support (Hong et al., 2022)."</span></li>
                      <li>❌ <span className="italic line-through">"Hong, Li, Kuo, and An (2022)..."</span></li>
                    </ul>
                  </div>
                </div>

                {/* Spot the Errors - MC Task */}
                <div className="p-4 rounded-lg border bg-red-500/5 border-red-500/30 space-y-4">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    Spot the Errors
                  </h4>
                  <p className="text-xs text-muted-foreground">Read this passage carefully:</p>
                  <div className="p-3 bg-background rounded-lg text-sm leading-relaxed border">
                    "According to Andrejevic & Selwyn (2020), FRT raises concerns. Their research shows that schools are adopting this technology rapidly (Andrejevic and Selwyn, 2020). Hong, Li, Kuo, and An (2022) also found similar patterns."
                  </div>
                  
                  <QuickCheckMC
                    questionNumber={3}
                    question="How many APA 7th citation ERRORS are in the passage above?"
                    options={[
                      { label: "A", text: "1 error" },
                      { label: "B", text: "2 errors" },
                      { label: "C", text: "3 errors" },
                      { label: "D", text: "4 errors" },
                    ]}
                    correctAnswer="C"
                    explanation="There are 3 errors: (1) 'Andrejevic & Selwyn' in the sentence should use 'and' not '&', (2) '(Andrejevic and Selwyn, 2020)' in parentheses should use '&' not 'and', and (3) 'Hong, Li, Kuo, and An (2022)' should be 'Hong et al. (2022)' since there are 3+ authors."
                  />

                  <QuickCheckMC
                    questionNumber={4}
                    question="Which shows ALL three errors CORRECTLY fixed?"
                    options={[
                      { label: "A", text: "According to Andrejevic and Selwyn (2020)... (Andrejevic & Selwyn, 2020)... Hong et al. (2022)" },
                      { label: "B", text: "According to Andrejevic & Selwyn (2020)... (Andrejevic & Selwyn, 2020)... Hong et al. (2022)" },
                      { label: "C", text: "According to Andrejevic and Selwyn (2020)... (Andrejevic and Selwyn, 2020)... Hong et al. (2022)" },
                      { label: "D", text: "According to Andrejevic and Selwyn (2020)... (Andrejevic & Selwyn, 2020)... Hong, Li, Kuo, & An (2022)" },
                    ]}
                    correctAnswer="A"
                    explanation="Option A correctly applies all three rules: 'and' in sentences, '&' in parentheses, and 'et al.' for 3+ authors."
                  />
                </div>

                {/* Writing Task */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Writing Practice: Fix the Citations
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Rewrite this paragraph correcting ALL the APA 7th citation errors:
                  </p>
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <strong>Original (with errors):</strong> "According to Andrejevic & Selwyn (2020), FRT is concerning. Hong, Li, Kuo, and An (2022) support this view."
                  </div>
                  <WritingPracticeWithHistory
                    taskKey="w2h1-fix-citations"
                    studentId={studentId || "anonymous"}
                    title="Writing Practice 2: Fix the Citations"
                    instructions="Rewrite this paragraph with correct APA 7th formatting. Remember: 'and' in sentences, '&' in parentheses, and 'et al.' for 3+ authors."
                    placeholder="According to Andrejevic and Selwyn (2020), ..."
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Part 3: Secondary Citations with Integrated Practice */}
            <CollapsibleSection
              title="Part 3: Secondary Citations"
              description="Learn when and how to cite sources found within other sources"
              icon={<ScrollText className="h-4 w-4 text-purple-600" />}
              defaultOpen={false}
              className="border-2 border-purple-500/30 bg-purple-500/5"
            >
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-purple-500" />
                    What is a Secondary Citation?
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    A <strong>secondary citation</strong> is when you cite a source mentioned in another source 
                    that you haven't read directly.
                  </p>
                  <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <p className="text-sm font-medium text-purple-700 mb-2">Format:</p>
                    <p className="text-sm text-muted-foreground">
                      (Original Author, Year, as cited in Source You Read, Year)
                    </p>
                  </div>
                </div>

                {/* Reading Passage */}
                <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-500" />
                    Read & Analyze
                  </h4>
                  <div className="p-3 bg-background rounded-lg text-sm leading-relaxed">
                    <p>
                      "In the excerpt from Andrejevic and Selwyn (2020), they mention research by Puthea et al. (2017) about attendance monitoring. 
                      You haven't read Puthea's original paper, but you want to use this information."
                    </p>
                    <p className="mt-2 p-2 bg-purple-500/10 rounded">
                      <strong>Correct citation:</strong> Attendance monitoring promises efficiency gains (Puthea et al., 2017, as cited in Andrejevic & Selwyn, 2020).
                    </p>
                  </div>
                </div>

                {/* MC Question */}
                <QuickCheckMC
                  questionNumber={5}
                  question="You read Hong et al. (2022), and they mention a study by Doffman (2018). You haven't read Doffman's paper. How should you cite Doffman's statistic?"
                  options={[
                    { label: "A", text: "(Doffman, 2018)" },
                    { label: "B", text: "(Hong et al., 2022)" },
                    { label: "C", text: "(Doffman, 2018, as cited in Hong et al., 2022)" },
                    { label: "D", text: "(Hong et al., 2022, citing Doffman, 2018)" },
                  ]}
                  correctAnswer="C"
                  explanation="Use 'as cited in' to show you found Doffman's work through Hong et al. The original author comes first, then 'as cited in' the source you actually read."
                />

                {/* Writing Task */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Writing Practice: Secondary Citation
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Write a sentence using this information with a proper secondary citation:
                  </p>
                  <div className="p-3 rounded-lg bg-muted/50 text-sm space-y-2">
                    <p><strong>Information:</strong> "US schools spend $2.7 billion annually on campus security."</p>
                    <p><strong>Original source:</strong> Doffman (2018) - you haven't read this</p>
                    <p><strong>Found in:</strong> Andrejevic & Selwyn (2020) - the article you read</p>
                  </div>
                  <WritingPracticeWithHistory
                    taskKey="w2h1-secondary-citation"
                    studentId={studentId || "anonymous"}
                    title="Writing Practice 3: Write with Secondary Citation"
                    instructions="Write a complete sentence using this statistic with the proper secondary citation format. You can use either author-prominent or info-prominent style."
                    placeholder="According to Doffman (2018, as cited in ..."
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Part 4: Integrated Citation Practice */}
            <CollapsibleSection
              title="Part 4: Integrated Citation Practice"
              description="Apply all citation skills to a realistic academic paragraph"
              icon={<Trophy className="h-4 w-4 text-amber-600" />}
              defaultOpen={false}
              className="border-2 border-amber-500/30 bg-amber-500/5"
            >
              <div className="space-y-4">
                {/* Scenario */}
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Target className="h-4 w-4 text-amber-500" />
                    Your Task
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    You're writing about FRT in schools for your Pre-course Writing. Use the sources below to write a properly cited paragraph.
                  </p>
                </div>

                {/* Available Sources */}
                <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
                  <h4 className="font-medium text-sm">Available Sources:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-background rounded">
                      <p className="font-medium text-xs text-blue-600">Source 1 (2 authors, you read this):</p>
                      <p className="text-muted-foreground">Andrejevic & Selwyn (2020) - FRT is being implemented in schools for security and monitoring</p>
                    </div>
                    <div className="p-2 bg-background rounded">
                      <p className="font-medium text-xs text-green-600">Source 2 (4 authors, you read this):</p>
                      <p className="text-muted-foreground">Hong, Li, Kuo & An (2022) - Parents in China support FRT in elementary schools</p>
                    </div>
                    <div className="p-2 bg-background rounded">
                      <p className="font-medium text-xs text-purple-600">Source 3 (mentioned in Andrejevic & Selwyn, not read directly):</p>
                      <p className="text-muted-foreground">Doffman (2018) - US schools spend $2.7 billion on security annually</p>
                    </div>
                  </div>
                </div>

                {/* Quick Check */}
                <QuickCheckMC
                  questionNumber={6}
                  question="If you want to emphasize WHAT Hong et al. found (not who said it), which format should you use?"
                  options={[
                    { label: "A", text: "Hong et al. (2022) found that parents support FRT." },
                    { label: "B", text: "Parents support FRT in schools (Hong et al., 2022)." },
                    { label: "C", text: "According to Hong et al., parents support FRT (2022)." },
                    { label: "D", text: "Hong, Li, Kuo, and An (2022) report parental support." },
                  ]}
                  correctAnswer="B"
                  explanation="Info-Prominent (parenthetical) citation emphasizes the information, not the author. The author appears in parentheses at the end."
                />

                {/* Final Writing Task */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Integrated Writing Practice
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Write a short paragraph (3-4 sentences) discussing FRT in schools. Use ALL THREE sources with correct APA 7th citations. 
                    Include at least one author-prominent citation and one secondary citation.
                  </p>
                  <WritingPracticeWithHistory
                    taskKey="w2h1-integrated-paragraph"
                    studentId={studentId || "anonymous"}
                    title="Writing Practice 4: Write Your Paragraph"
                    instructions="Write a 3-4 sentence paragraph about FRT in schools using all three sources. Include: (1) at least one author-prominent citation, (2) at least one info-prominent citation, (3) the secondary citation for Doffman."
                    placeholder="Facial recognition technology is increasingly being adopted in educational settings..."
                    exampleFormat="Tips:&#10;• For 2 authors: Andrejevic and Selwyn (2020) OR (Andrejevic & Selwyn, 2020)&#10;• For 4 authors: Hong et al. (2022)&#10;• Secondary: (Doffman, 2018, as cited in Andrejevic & Selwyn, 2020)"
                  />
                </div>
              </div>
            </CollapsibleSection>
          </section>
        )}

        {/* Week 2 Hour 2: End-of-Text Citations / Reference List */}
        {weekNumber === 2 && hourNumber === 2 && (
          <section className="space-y-6">
            {/* Part 1: The Link Between In-Text and End-of-Text Citations */}
            <CollapsibleSection
              title="Part 1: From In-Text to Reference List"
              description="Understanding the connection between in-text citations and end-of-text references"
              icon={<BookOpen className="h-4 w-4 text-blue-600" />}
              defaultOpen={true}
              className="border-2 border-blue-500/30 bg-blue-500/5"
            >
              <div className="space-y-4">
                {/* Recap from Hour 1 */}
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Quick Recap: In-Text Citations (Hour 1)
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Last time, we learned about <strong>in-text citations</strong> — the brief references within 
                    your writing that show WHO said something and WHEN (author + year). But where can readers 
                    find the complete source details?
                  </p>
                </div>

                {/* Introduction to End-of-Text */}
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-green-600" />
                    Introducing: The Reference List
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    At the <strong>end of every academic article</strong>, you'll find a <strong>Reference List</strong> (also called "References" or "Works Cited"). 
                    This list contains <strong>complete information</strong> for every source cited in the text — enough for any reader to locate the original article.
                  </p>
                  <p className="text-sm font-medium text-green-700">
                    🔑 The Rule: Every in-text citation must have a matching entry in the Reference List — and vice versa!
                  </p>
                </div>

                {/* Visual: How to Match */}
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <h4 className="font-medium text-sm">🔍 How to Find the Match: Author's Last Name + Year</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/5 space-y-2">
                      <p className="text-xs font-medium text-blue-700">📝 In the Body Text:</p>
                      <p className="text-sm text-muted-foreground italic">
                        "...school shooting incidents have prompted school authorities to annually spend $2.7 billion on campus security products and services (<strong>Doffman, 2018</strong>)."
                      </p>
                    </div>
                    <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/5 space-y-2">
                      <p className="text-xs font-medium text-green-700">📚 In the Reference List:</p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Doffman</strong>, Z. (<strong>2018</strong>, November 18). Hundreds of U.S. schools now have AI-enabled camera systems scanning for guns. <em>Forbes</em>. https://forbes.com/...
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    ↑ Match by: <strong>Author's last name</strong> + <strong>Publication year</strong>
                  </p>
                </div>

                {/* Why This Matters */}
                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <p className="text-sm font-medium text-amber-700 mb-1">💡 Why Do We Need End-of-Text Citations?</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• <strong>Traceability:</strong> Readers can find and verify your sources</li>
                    <li>• <strong>Credibility:</strong> Shows your work is based on real research</li>
                    <li>• <strong>Academic Integrity:</strong> Gives proper credit to original authors</li>
                    <li>• <strong>DOI/URL:</strong> Often includes a direct link to access the article</li>
                  </ul>
                </div>

                {/* Interactive: Citation Hunt Game */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    🎯 Mini-Game: Citation Hunt
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Look at the article excerpt below. The text contains several in-text citations. For each citation, 
                    you should be able to find the matching reference in the Reference List at the end.
                  </p>
                  
                  {/* Article Excerpt */}
                  <div className="p-4 rounded-lg border bg-background space-y-3">
                    <p className="text-xs font-medium text-muted-foreground">📄 From: Andrejevic & Selwyn (2020)</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      "...school shooting incidents have prompted school authorities to annually spend $2.7 billion 
                      on campus security products and services (<strong className="text-blue-600">Doffman, 2018</strong>). 
                      Facial recognition systems have now been sold to thousands of US schools, with vendors 
                      'pitching the technology as an all-seeing shield against school shootings' 
                      (<strong className="text-blue-600">Harwell, 2018</strong>, n.p)."
                    </p>
                    <p className="text-xs text-blue-600">↑ Find these two citations in the Reference List below!</p>
                  </div>

                  {/* Sample Reference List */}
                  <div className="p-4 rounded-lg border bg-muted/30 space-y-2">
                    <p className="text-xs font-medium text-muted-foreground mb-2">📚 Reference List (partial):</p>
                    <div className="text-sm space-y-3 font-mono text-xs">
                      <p className="pl-4 -indent-4 text-muted-foreground">Apampa, K. M., Wills, G. B., & Sherrill-Mix, D. (2010). Approaches to security in e-assessment. <em>International Journal of Information Security</em>, 9(4), 263–277.</p>
                      <p className="pl-4 -indent-4 bg-green-500/10 p-1 rounded">Doffman, Z. (2018, November 18). Hundreds of U.S. schools now have AI-enabled camera systems scanning for guns. <em>Forbes</em>. https://forbes.com/sites/...</p>
                      <p className="pl-4 -indent-4 bg-green-500/10 p-1 rounded">Harwell, D. (2018, October 17). Unproven facial recognition companies target schools, promising an end to shootings. <em>The Washington Post</em>. https://washingtonpost.com/...</p>
                      <p className="pl-4 -indent-4 text-muted-foreground">Heiden, M., Widar, L., Wiitavaara, B., & Boman, E. (2020). Telework in academia: Associations with health and well-being among staff. <em>Higher Education</em>, <em>81</em>, 707–722. https://doi.org/10.1007/s10734-020-00569-4</p>
                    </div>
                  </div>
                </div>

                {/* MC Questions */}
                <QuickCheckMC
                  questionNumber={1}
                  question="In the passage above, 'Doffman, 2018' is cited. What type of source is this (based on the reference entry)?"
                  options={[
                    { label: "A", text: "A peer-reviewed journal article" },
                    { label: "B", text: "A book chapter" },
                    { label: "C", text: "A newspaper/online news article" },
                    { label: "D", text: "A government report" },
                  ]}
                  correctAnswer="C"
                  explanation="The reference shows it's from Forbes, a news website. Notice there's no volume/issue numbers — instead, there's a specific date (November 18) and a URL, which are typical for news articles."
                />

                <QuickCheckMC
                  questionNumber={2}
                  question="Why is 'n.p.' included after (Harwell, 2018) in the in-text citation?"
                  options={[
                    { label: "A", text: "It means 'no publication'" },
                    { label: "B", text: "It means 'no page number' — the online source has no page numbers" },
                    { label: "C", text: "It's the author's initials" },
                    { label: "D", text: "It's a formatting error" },
                  ]}
                  correctAnswer="B"
                  explanation="'n.p.' stands for 'no page' — used when citing online sources that don't have page numbers. For direct quotes, we normally include page numbers, but for online news articles, we use n.p. or paragraph numbers."
                />
              </div>
            </CollapsibleSection>

            {/* Part 2: Formatting Journal Article References */}
            <CollapsibleSection
              title="Part 2: Formatting Journal Article References"
              description="Master the APA 7th edition format for journal articles"
              icon={<PenLine className="h-4 w-4 text-green-600" />}
              defaultOpen={false}
              className="border-2 border-green-500/30 bg-green-500/5"
            >
              <div className="space-y-4">
                {/* The Formula */}
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-green-500" />
                    The APA 7th Edition Formula for Journal Articles
                  </h4>
                  <div className="p-3 rounded-lg bg-muted/50 font-mono text-sm">
                    <span className="text-blue-600">Author(s)</span> (<span className="text-purple-600">Year</span>). <span className="text-green-600">Article title</span>. <em className="text-amber-600">Journal Name</em>, <span className="text-red-600">Volume</span>(Issue), Pages. DOI
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                    <div className="p-2 rounded bg-blue-500/10 text-center">
                      <span className="font-medium text-blue-700">Author(s)</span>
                      <p className="text-muted-foreground">Last name, Initials.</p>
                    </div>
                    <div className="p-2 rounded bg-purple-500/10 text-center">
                      <span className="font-medium text-purple-700">Year</span>
                      <p className="text-muted-foreground">In parentheses</p>
                    </div>
                    <div className="p-2 rounded bg-green-500/10 text-center">
                      <span className="font-medium text-green-700">Title</span>
                      <p className="text-muted-foreground">Sentence case</p>
                    </div>
                    <div className="p-2 rounded bg-amber-500/10 text-center">
                      <span className="font-medium text-amber-700">Journal</span>
                      <p className="text-muted-foreground">Italicized</p>
                    </div>
                    <div className="p-2 rounded bg-red-500/10 text-center">
                      <span className="font-medium text-red-700">Volume(Issue)</span>
                      <p className="text-muted-foreground">Vol italicized</p>
                    </div>
                    <div className="p-2 rounded bg-gray-500/10 text-center">
                      <span className="font-medium text-gray-700">DOI</span>
                      <p className="text-muted-foreground">https://doi.org/...</p>
                    </div>
                  </div>
                </div>

                {/* Demo: Breaking Down a Reference */}
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    ✅ Demo: Let's Build the Reference for Our Course Article
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Using the Andrejevic & Selwyn (2020) article from the Pre-course Writing assignment:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">Authors</Badge>
                      <span className="text-muted-foreground">Mark Andrejevic & Neil Selwyn → <strong>Andrejevic, M., & Selwyn, N.</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">Year</Badge>
                      <span className="text-muted-foreground">2020 → <strong>(2020).</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">Title</Badge>
                      <span className="text-muted-foreground">Facial Recognition Technology in Schools: Critical Questions and Concerns → <strong>Facial recognition technology in schools: Critical questions and concerns.</strong> (sentence case)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">Journal</Badge>
                      <span className="text-muted-foreground">Learning, Media and Technology → <strong><em>Learning, Media and Technology</em>,</strong> (italicized)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">Vol/Pages</Badge>
                      <span className="text-muted-foreground">Volume 45, Issue 2, Pages 115-128 → <strong><em>45</em>(2), 115-128.</strong></span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Badge variant="outline" className="shrink-0">DOI</Badge>
                      <span className="text-muted-foreground break-all"><strong>https://doi.org/10.1080/17439884.2020.1686014</strong></span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-background border mt-2">
                    <p className="text-xs font-medium text-green-700 mb-1">✓ Complete Reference:</p>
                    <p className="text-sm">
                      Andrejevic, M., & Selwyn, N. (2020). Facial recognition technology in schools: Critical questions and concerns. <em>Learning, Media and Technology</em>, <em>45</em>(2), 115-128. https://doi.org/10.1080/17439884.2020.1686014
                    </p>
                  </div>
                </div>

                {/* Examples by Number of Authors */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Examples by Number of Authors</h4>
                  
                  {/* One Author */}
                  <div className="p-4 rounded-lg border bg-muted/30 space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Badge variant="outline">1 Author</Badge>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Arpaci, I. (2016). Understanding and predicting students' intention to use mobile cloud storage services. <em>Computers in Human Behaviour</em>, <em>58</em>(5), 150–157. https://doi.org/10.1016/j.chb.2015.12.067
                    </p>
                  </div>

                  {/* Two Authors */}
                  <div className="p-4 rounded-lg border bg-muted/30 space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Badge variant="outline">2 Authors</Badge>
                      <span className="text-xs text-muted-foreground">Use "&" between authors</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Aurigemma, S., <span className="text-green-600 font-medium">&</span> Mattson, T. (2017). Exploring the effect of uncertainty avoidance on taking voluntary protective security actions. <em>Computers & Security</em>, <em>73</em>(5), 219–234.
                    </p>
                  </div>

                  {/* Three+ Authors */}
                  <div className="p-4 rounded-lg border bg-muted/30 space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Badge variant="outline">3+ Authors</Badge>
                      <span className="text-xs text-muted-foreground">List ALL authors with "&" before the last</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Hong, J. C., Li, Y., <span className="text-green-600 font-medium">&</span> Kuo, S. Y. (2022). Supporting schools to use face recognition systems: A continuance intention perspective of elementary school parents in China. <em>Education and Information Technologies</em>, <em>27</em>, 12645–12665.
                    </p>
                  </div>
                </div>

                {/* Spot the Errors */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-medium text-sm">🔍 Spot the Errors</h4>
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm">
                    <strong>Reference with errors:</strong><br/>
                    Andrejevic, M. and Selwyn, N. (2020). Facial Recognition Technology In Schools: Critical Questions And Concerns. Learning, Media and Technology, 45:2, 115-128.
                  </div>
                  
                  <QuickCheckMC
                    questionNumber={3}
                    question="How many APA 7th formatting ERRORS are in the reference above?"
                    options={[
                      { label: "A", text: "1 error" },
                      { label: "B", text: "2 errors" },
                      { label: "C", text: "3 errors" },
                      { label: "D", text: "4 errors" },
                    ]}
                    correctAnswer="D"
                    explanation="4 errors: (1) 'and' should be '&', (2) title shouldn't have Title Case (only first word capitalized), (3) journal name not italicized, (4) volume format should be 45(2) not 45:2, and missing DOI."
                  />

                  <QuickCheckMC
                    questionNumber={4}
                    question="Which reference is correctly formatted in APA 7th edition?"
                    options={[
                      { label: "A", text: "Andrejevic, M. and Selwyn, N. (2020). Facial recognition technology in schools. Learning, Media and Technology, 45(2), 115-128." },
                      { label: "B", text: "Andrejevic, M., & Selwyn, N. (2020). Facial recognition technology in schools: Critical questions and concerns. Learning, Media and Technology, 45(2), 115-128." },
                      { label: "C", text: "Andrejevic, M., & Selwyn, N. (2020). Facial recognition technology in schools: Critical questions and concerns. *Learning, Media and Technology*, *45*(2), 115-128." },
                      { label: "D", text: "Andrejevic and Selwyn (2020). Facial Recognition Technology in Schools. Learning, Media and Technology." },
                    ]}
                    correctAnswer="C"
                    explanation="Option C is correct: uses '&' between authors, sentence case for article title, italicized journal name and volume (shown with asterisks), and proper volume(issue) format."
                  />
                </div>

                {/* Writing Practice with Demo First */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Practice: Fix the Reference
                  </h4>
                  
                  {/* Demo: How to fix */}
                  <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-sm space-y-2">
                    <p className="font-medium text-green-700">✅ Demo: Fixing a Reference</p>
                    <p className="text-muted-foreground"><strong>Incorrect:</strong> Smith, J and Jones, M (2019). The Effects Of Technology On Learning. Journal of Education. 15, 23-45</p>
                    <p className="text-muted-foreground"><strong>Fixed:</strong> Smith, J., <span className="text-green-600">&</span> Jones, M. (2019). The effects of technology on learning. <em>Journal of Education</em>, <em>15</em>, 23-45.</p>
                    <p className="text-xs text-green-600">Changes: Added period after initials, & instead of "and", sentence case title, italicized journal + volume, added period at end</p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Now you try! The reference below has multiple errors. Rewrite it correctly in APA 7th format:
                  </p>
                  <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/20 text-sm">
                    <strong>Incorrect:</strong> Heiden, M. and Widar, L. and Wiitavaara, B. and Boman, E. (2020). Telework in Academia: Associations With Health and Well-Being Among Staff. Higher Education. 81, 707-722
                  </div>
                  <WritingPracticeWithHistory
                    taskKey="w2h2-fix-reference-heiden"
                    studentId={studentId || "anonymous"}
                    title="Reference Correction Practice"
                    instructions="Rewrite this reference correctly. Check: (1) Use '&' before the last author and commas between others, (2) Sentence case for the title, (3) Italicize the journal name (*Higher Education*) and volume (*81*), (4) Use en-dash (–) for page range, (5) Add DOI link."
                    placeholder="Heiden, M., Widar, L., Wiitavaara, B., & Boman, E. (2020). Telework in academia..."
                    correctAnswer="Heiden, M., Widar, L., Wiitavaara, B., & Boman, E. (2020). Telework in academia: Associations with health and well-being among staff. *Higher Education*, *81*, 707–722. https://doi.org/10.1007/s10734-020-00569-4"
                  />
                </div>

                {/* Tool Link */}
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30 space-y-2">
                  <h4 className="font-medium flex items-center gap-2 text-sm">
                    🛠️ Helpful Tool: ZBib Bibliography Generator
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    In practice, you can use online tools to help generate APA references. <strong>ZBib</strong> is a free, 
                    easy-to-use bibliography generator that can format references automatically.
                  </p>
                  <a 
                    href="https://zbib.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open ZBib (zbib.org)
                  </a>
                  <p className="text-xs text-amber-600">
                    ⚠️ Always double-check AI/tool-generated references — they can have errors!
                  </p>
                </div>
              </div>
            </CollapsibleSection>

            {/* Part 3: Books, Book Chapters & Other Sources */}
            <CollapsibleSection
              title="Part 3: Books, Book Chapters & Other Sources"
              description="Learn to format references for books, chapters, and other academic sources"
              icon={<ScrollText className="h-4 w-4 text-purple-600" />}
              defaultOpen={false}
              className="border-2 border-purple-500/30 bg-purple-500/5"
            >
              <div className="space-y-4">
                {/* Introduction */}
                <div className="p-4 rounded-lg bg-background/80 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Journal articles are just ONE type of academic source. Academic writing also uses <strong>books</strong>, 
                    <strong> book chapters</strong>, and sometimes <strong>news articles</strong>. Each has a slightly different format.
                  </p>
                </div>

                {/* Book Format */}
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-purple-500" />
                    Format: A Book
                  </h4>
                  <div className="p-3 rounded-lg bg-background font-mono text-sm">
                    <span className="text-blue-600">Author.</span> (<span className="text-purple-600">Year</span>). <em className="text-green-600">Title of book</em>. <span className="text-amber-600">Publisher</span>.
                  </div>
                  <div className="p-3 rounded-lg border bg-background">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Example:</p>
                    <p className="text-sm">Altemeyer, B. (1988). <em>Enemies of freedom: Understanding right-wing authoritarianism</em>. Jossey-Bass.</p>
                  </div>
                  <p className="text-xs text-purple-600">📌 Notice: The <strong>book title</strong> is italicized (not the author or publisher)</p>
                </div>

                {/* Book Chapter Format */}
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <ScrollText className="h-4 w-4 text-purple-500" />
                    Format: A Chapter in an Edited Book
                  </h4>
                  <div className="p-3 rounded-lg bg-background font-mono text-sm">
                    <span className="text-blue-600">Chapter Author.</span> (<span className="text-purple-600">Year</span>). <span className="text-green-600">Chapter title</span>. In <span className="text-red-600">Editor(s) (Eds.)</span>, <em className="text-amber-600">Book title</em> (pp. pages). Publisher.
                  </div>
                  <div className="p-3 rounded-lg border bg-background">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Example:</p>
                    <p className="text-sm">D'Mello, S. (2017). Emotional learning analytics. In C. Lang, G. Siemens, A. Wise, & D. Gašević (Eds.), <em>Handbook of learning analytics</em> (pp. 115–127). SoLAR.</p>
                  </div>
                  <p className="text-xs text-purple-600">📌 Notice: The <strong>book title</strong> is italicized, NOT the chapter title. Include "In" + Editors + "(Eds.)" + page range.</p>
                </div>

                {/* Newspaper / Online News Article */}
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    📰 Format: Newspaper / Online News Article
                  </h4>
                  <div className="p-3 rounded-lg bg-background font-mono text-sm">
                    <span className="text-blue-600">Author.</span> (<span className="text-purple-600">Year, Month Day</span>). <span className="text-green-600">Article title</span>. <em className="text-amber-600">Newspaper Name</em>. URL
                  </div>
                  <div className="p-3 rounded-lg border bg-background">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Example (from the Andrejevic & Selwyn article's references):</p>
                    <p className="text-sm">Harwell, D. (2018, October 17). Unproven facial recognition companies target schools, promising an end to shootings. <em>The Washington Post</em>. https://washingtonpost.com/technology/...</p>
                  </div>
                  <p className="text-xs text-purple-600">📌 Notice: Include the <strong>full date</strong> (Year, Month Day), and the <strong>URL</strong> at the end. No page numbers for online articles.</p>
                </div>

                {/* Summary Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="border p-2 text-left">Source Type</th>
                        <th className="border p-2 text-left">What to Italicize</th>
                        <th className="border p-2 text-left">Special Elements</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-2">Journal Article</td>
                        <td className="border p-2">Journal name + Volume</td>
                        <td className="border p-2">Volume(Issue), Pages, DOI</td>
                      </tr>
                      <tr>
                        <td className="border p-2">Book</td>
                        <td className="border p-2">Book title</td>
                        <td className="border p-2">Publisher name</td>
                      </tr>
                      <tr>
                        <td className="border p-2">Book Chapter</td>
                        <td className="border p-2">Book title (NOT chapter)</td>
                        <td className="border p-2">"In" + Editors (Eds.), + (pp. X–X)</td>
                      </tr>
                      <tr>
                        <td className="border p-2">News Article</td>
                        <td className="border p-2">Newspaper name</td>
                        <td className="border p-2">Full date (Year, Month Day), URL</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* MC Questions */}
                <QuickCheckMC
                  questionNumber={5}
                  question="In a book CHAPTER reference, which title should be italicized?"
                  options={[
                    { label: "A", text: "The chapter title" },
                    { label: "B", text: "The book title" },
                    { label: "C", text: "Both titles" },
                    { label: "D", text: "Neither title" },
                  ]}
                  correctAnswer="B"
                  explanation="In a book chapter reference, only the BOOK title is italicized, not the chapter title. The chapter title uses regular sentence case."
                />

                <QuickCheckMC
                  questionNumber={6}
                  question="What is the main difference between a journal article reference and a news article reference?"
                  options={[
                    { label: "A", text: "News articles don't need author names" },
                    { label: "B", text: "News articles include the full date (Month Day) and URL instead of volume/issue/DOI" },
                    { label: "C", text: "News articles never use italics" },
                    { label: "D", text: "They are formatted exactly the same way" },
                  ]}
                  correctAnswer="B"
                  explanation="News articles include the complete date (Year, Month Day) and URL, whereas journal articles use volume(issue), page numbers, and DOI. Both italicize the publication name."
                />
              </div>
            </CollapsibleSection>

            {/* Part 4: Reference List & Integrated Practice */}
            <CollapsibleSection
              title="Part 4: Building a Reference List & Practice"
              description="Compile references and practice paraphrasing with proper citations"
              icon={<Trophy className="h-4 w-4 text-amber-600" />}
              defaultOpen={false}
              className="border-2 border-amber-500/30 bg-amber-500/5"
            >
              <div className="space-y-4">
                {/* Reference List Rules */}
                <div className="p-4 rounded-lg bg-background/80 space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    Building Your Reference List
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Arrange all works in <strong>alphabetical order</strong> by the first author's last name</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Use a <strong>hanging indentation</strong> (first line flush left, subsequent lines indented)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">✓</span>
                      <span>Every in-text citation must have a matching reference entry</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500">⚠</span>
                      <span>For <strong>secondary citations</strong>: only include the source you actually read</span>
                    </li>
                  </ul>
                </div>

                {/* Example Reference List */}
                <div className="p-4 rounded-lg border bg-muted/30 space-y-2">
                  <h4 className="font-medium text-sm mb-2">Example Reference List (Alphabetical Order)</h4>
                  <div className="text-sm space-y-3 font-mono text-xs">
                    <p className="pl-4 -indent-4">Altemeyer, B. (1988). <em>Enemies of freedom: Understanding right-wing authoritarianism</em>. Jossey-Bass.</p>
                    <p className="pl-4 -indent-4">Andrejevic, M., & Selwyn, N. (2020). Facial recognition technology in schools: Critical questions and concerns. <em>Learning, Media and Technology</em>, 45(2), 115-128.</p>
                    <p className="pl-4 -indent-4">Hong, J. C., Li, Y., & Kuo, S. Y. (2022). Supporting schools to use face recognition systems: A continuance intention perspective. <em>Education and Information Technologies</em>, 27, 12645–12665.</p>
                  </div>
                </div>

                {/* MC Question */}
                <QuickCheckMC
                  questionNumber={7}
                  question="In what order should references appear in your Reference List?"
                  options={[
                    { label: "A", text: "In the order they appear in your paper" },
                    { label: "B", text: "Alphabetically by the first author's last name" },
                    { label: "C", text: "Chronologically by publication year" },
                    { label: "D", text: "By importance of the source" },
                  ]}
                  correctAnswer="B"
                  explanation="In APA style, references must be arranged alphabetically by the first author's last name, regardless of the order they appear in your paper."
                />

                {/* Integrated Practice: Paraphrasing + Citations */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Target className="h-4 w-4 text-amber-500" />
                    Integrated Practice: Paraphrase with Proper Citation
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Now practice paraphrasing while maintaining proper citation format. Remember what you learned in Hour 1!
                  </p>
                  
                  {/* Demo first */}
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 space-y-3">
                    <p className="font-medium text-green-700 text-sm">✅ Demo: Paraphrasing with Citation</p>
                    <div className="text-sm space-y-2">
                      <p className="text-muted-foreground"><strong>Original:</strong> "Facial recognition systems have now been sold to thousands of US schools" (Andrejevic & Selwyn, 2020, p. 116).</p>
                      <p className="text-muted-foreground"><strong>Paraphrased (Author-Prominent):</strong> According to Andrejevic and Selwyn (2020), facial recognition technology has been purchased by thousands of American educational institutions.</p>
                      <p className="text-muted-foreground"><strong>Paraphrased (Information-Prominent):</strong> Thousands of schools across the United States have acquired facial recognition systems (Andrejevic & Selwyn, 2020).</p>
                    </div>
                    <p className="text-xs text-green-600">📌 Notice: The facts are preserved, but the words and structure are changed. The citation is included in the correct format.</p>
                  </div>

                  {/* Now student tries */}
                  <div className="p-3 rounded-lg bg-muted/50 text-sm">
                    <strong>Your Turn - Original:</strong> "One prominent educational application of facial recognition technology is campus security. This form of facial recognition is most prevalent in the US, where school shooting incidents have prompted school authorities to annually spend $2.7 billion on campus security products and services." (Andrejevic & Selwyn, 2020, p. 117)
                  </div>
                  
                  <WritingPracticeWithHistory
                    taskKey="w2h2-paraphrase-citation"
                    studentId={studentId || "anonymous"}
                    title="Paraphrase with Citation"
                    instructions="Paraphrase this passage using strategies from Hour 1 (synonym substitution, sentence restructuring). Include the proper in-text citation. Keep the key facts (especially the $2.7 billion figure)."
                    placeholder="According to Andrejevic and Selwyn (2020), the primary educational use of facial recognition technology is..."
                  />
                </div>

                {/* Final Challenge: Write Reference Entry */}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    Challenge: Build a Reference from Scratch
                  </h4>
                  
                  {/* Demo first */}
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 space-y-3">
                    <p className="font-medium text-green-700 text-sm">✅ Demo: Building a Reference Entry</p>
                    <div className="text-sm space-y-2">
                      <p className="text-muted-foreground"><strong>Given information:</strong></p>
                      <ul className="text-xs text-muted-foreground ml-4 space-y-1">
                        <li>• Authors: John Smith, Mary Johnson</li>
                        <li>• Year: 2021</li>
                        <li>• Title: The Impact of Technology on Student Learning</li>
                        <li>• Journal: Educational Research Quarterly</li>
                        <li>• Volume: 44, Issue: 3, Pages: 123-145</li>
                      </ul>
                      <p className="text-muted-foreground"><strong>Formatted Reference:</strong></p>
                      <p className="text-sm pl-4 -indent-4">Smith, J., & Johnson, M. (2021). The impact of technology on student learning. <em>Educational Research Quarterly</em>, <em>44</em>(3), 123-145.</p>
                    </div>
                    <p className="text-xs text-green-600">📌 Steps: (1) Last name, Initial. for each author, (2) Year in parentheses, (3) Title in sentence case, (4) Journal italicized, (5) Volume(Issue) with volume italicized, (6) Pages</p>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Now you try! Based on this information, write the complete end-of-text reference entry in APA 7th format:
                  </p>
                  <div className="p-3 rounded-lg bg-muted/50 text-sm space-y-1">
                    <p><strong>Authors:</strong> Marina Heiden, Linda Widar, Birgitta Wiitavaara, Erik Boman</p>
                    <p><strong>Year:</strong> 2020</p>
                    <p><strong>Article Title:</strong> Telework in academia: Associations with health and well-being among staff</p>
                    <p><strong>Journal:</strong> Higher Education</p>
                    <p><strong>Volume:</strong> 81</p>
                    <p><strong>Pages:</strong> 707-722</p>
                    <p><strong>DOI:</strong> https://doi.org/10.1007/s10734-020-00569-4</p>
                  </div>
                  
                  <WritingPracticeWithHistory
                    taskKey="w2h2-write-reference"
                    studentId={studentId || "anonymous"}
                    title="Write Reference Entry"
                    instructions="Format this as a complete APA 7th reference entry. Checklist: (1) Author format: Last, I., (2) Use & before the last author, (3) Year in parentheses, (4) Sentence case for title, (5) Italicize journal name + volume, (6) Include DOI."
                    placeholder="Heiden, M., Widar, L., Wiitavaara, B., & Boman, E. (2020). Telework in academia..."
                  />
                </div>
              </div>
            </CollapsibleSection>
          </section>
        )}

        {/* Week 2 Hour 3: Classroom Discussion Module */}
        {weekNumber === 2 && hourNumber === 3 && (
          <ClassroomDiscussionPage
            weekNumber={weekNumber}
            studentId={studentId || "anonymous"}
            onComplete={() => handleTaskComplete("w2h3-practice-complete")}
          />
        )}

        {/* Week 4 Hour 1: AI Agent Demo with Chat History and Links */}
        {weekNumber === 4 && hourNumber === 1 && hourData.integratedSections && (
          <section className="space-y-6">
            {hourData.integratedSections.map((section, sectionIndex) => (
              <CollapsibleSection
                key={section.id}
                title={section.title}
                description={section.subsections[0]?.content?.substring(0, 100) + "..."}
                icon={sectionIndex === 0 ? <Lightbulb className="h-4 w-4 text-amber-600" /> : 
                      sectionIndex === 1 ? <BookOpen className="h-4 w-4 text-blue-600" /> :
                      sectionIndex === 2 ? <FileText className="h-4 w-4 text-purple-600" /> :
                      <Sparkles className="h-4 w-4 text-green-600" />}
                defaultOpen={sectionIndex === 0}
                className={sectionIndex === 0 ? "border-2 border-amber-500/30 bg-amber-500/5" :
                          sectionIndex === 1 ? "border-2 border-blue-500/30 bg-blue-500/5" :
                          sectionIndex === 2 ? "border-2 border-purple-500/30 bg-purple-500/5" :
                          "border-2 border-green-500/30 bg-green-500/5"}
              >
                <div className="space-y-4">
                  {/* Subsection Content */}
                  {section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex} className="space-y-2">
                      <h4 className="font-medium text-sm">{subsection.title}</h4>
                      <div className="text-sm text-muted-foreground prose prose-sm max-w-none prose-a:text-primary prose-a:underline">
                        <ReactMarkdown
                          components={{
                            a: ({ href, children }) => (
                              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                {children}
                              </a>
                            )
                          }}
                        >
                          {subsection.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}

                  {/* External Link */}
                  {section.externalLink && (
                    <Button variant="outline" size="sm" asChild className="mt-2">
                      <a
                        href={section.externalLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        {section.externalLink.label}
                      </a>
                    </Button>
                  )}

                  {/* Chat History Display */}
                  {section.chatHistory && section.chatHistory.length > 0 && (
                    <div className="space-y-3 pt-4 border-t">
                      <h4 className="font-medium text-sm flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Conversation Highlights
                      </h4>
                      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        {section.chatHistory.map((msg, msgIndex) => (
                          <div 
                            key={msgIndex} 
                            className={`rounded-lg p-3 ${
                              msg.role === 'teacher' 
                                ? 'bg-primary/10 border-l-4 border-primary' 
                                : msg.role === 'student-john'
                                ? 'bg-blue-500/10 border-l-4 border-blue-500 ml-4'
                                : msg.role === 'student-karen'
                                ? 'bg-pink-500/10 border-l-4 border-pink-500 ml-4'
                                : 'bg-muted'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-semibold ${
                                msg.role === 'teacher' ? 'text-primary' :
                                msg.role === 'student-john' ? 'text-blue-600' :
                                msg.role === 'student-karen' ? 'text-pink-600' :
                                'text-muted-foreground'
                              }`}>
                                {msg.role === 'teacher' ? '👨‍🏫 Dr. Wang' :
                                 msg.role === 'student-john' ? '🧑‍🎓 John' :
                                 msg.role === 'student-karen' ? '👩‍🎓 Karen' : 'System'}
                              </span>
                              {msg.action && (
                                <span className="text-xs text-muted-foreground italic">{msg.action}</span>
                              )}
                            </div>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Iframe Embed */}
                  {section.iframeEmbed && (
                    <div className="space-y-3 pt-4 border-t">
                      <div 
                        className="w-full rounded-lg overflow-hidden border bg-white"
                        style={{ height: section.iframeEmbed.height || 500 }}
                      >
                        <iframe
                          src={section.iframeEmbed.url}
                          width="100%"
                          height="100%"
                          className="border-0"
                          title={section.iframeEmbed.title}
                          allow="autoplay; encrypted-media"
                          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                        />
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={section.iframeEmbed.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Open in new tab
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CollapsibleSection>
            ))}

            {/* Key Takeaway */}
            <Alert className="border-primary/30 bg-primary/5">
              <Sparkles className="h-4 w-4 text-primary" />
              <AlertTitle>Key Takeaway</AlertTitle>
              <AlertDescription>
                AI agents work best with clear context. The demo shows how to organize materials (context.md, extractFilterRef.md) 
                to help agents assist with AWQ preparation systematically.
              </AlertDescription>
            </Alert>
            
            {/* Ad Hoc Notes */}
            <Week4AdHocNotes />
          </section>
        )}

        {/* Week 4 Hour 2-3: On-Paper AWQ Practice Session */}
        {weekNumber === 4 && (hourNumber === 2 || hourNumber === 3) && (
          <section className="space-y-6">
            {/* Session Overview */}
            <Alert className="border-primary/30 bg-primary/5">
              <PenLine className="h-4 w-4 text-primary" />
              <AlertTitle>Hour 2-3: On-Paper Practice Session</AlertTitle>
              <AlertDescription>
                This session focuses on <strong>handwritten AWQ practice</strong>. Work through the practice materials on paper, 
                then use the OCR tool to get AI feedback on your writing.
              </AlertDescription>
            </Alert>

            {/* Important Resources Cards */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Mock Exam Link */}
              <Card className="border-2 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-amber-600" />
                    <CardTitle className="text-base">Mock Exam Materials</CardTitle>
                  </div>
                  <CardDescription>Practice AWQ questions and sample papers</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" asChild className="w-full gap-2">
                    <a
                      href="https://docs.google.com/document/d/182xbd3rh66VcnqXugXg3UKxF-ZdXQWtgWOR11LDmL8Y/edit?tab=t.9f0pigmhimul#heading=h.wz3hyvmzh01i"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open Mock Exam
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Consultation Schedule Link */}
              <Card className="border-2 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base">One-on-One Consultations</CardTitle>
                  </div>
                  <CardDescription>Schedule for individual meetings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" asChild className="w-full gap-2">
                    <a
                      href="https://docs.google.com/document/d/182xbd3rh66VcnqXugXg3UKxF-ZdXQWtgWOR11LDmL8Y/edit?tab=t.hwe8ax9t84nn"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Schedule
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Embedded Week 4 Notes */}
            <Card className="border-2 border-green-500/30 bg-green-500/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">Week 4 Notes</CardTitle>
                </div>
                <CardDescription>Reference materials and instructions for on-paper practice</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border bg-white">
                  <iframe
                    src="https://docs.google.com/document/d/182xbd3rh66VcnqXugXg3UKxF-ZdXQWtgWOR11LDmL8Y/preview?tab=t.gilua5f2n8gd"
                    width="100%"
                    height="100%"
                    className="border-0"
                    title="Week 4 Notes"
                    allow="autoplay"
                  />
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a
                    href="https://docs.google.com/document/d/182xbd3rh66VcnqXugXg3UKxF-ZdXQWtgWOR11LDmL8Y/edit?tab=t.gilua5f2n8gd"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open in Google Docs
                  </a>
                </Button>
              </CardContent>
            </Card>

            {/* OCR Tool Section */}
            <Card className="border-2 border-purple-500/30 bg-purple-500/5">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-purple-600" />
                  <CardTitle className="text-lg">Submit Your Handwritten Work</CardTitle>
                  <Badge variant="outline" className="text-xs">Beta</Badge>
                </div>
                <CardDescription>
                  After completing your on-paper practice, use the OCR tool to get AI feedback
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Warning about OCR */}
                <Alert className="border-amber-500/30 bg-amber-500/10">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertTitle className="text-amber-700">OCR Tool Disclaimer</AlertTitle>
                  <AlertDescription className="text-amber-600 space-y-2">
                    <p>The OCR (text extraction) feature is in <strong>Beta</strong> and may not work properly with all handwriting styles.</p>
                    <p><strong>Fallback option:</strong> If OCR doesn't work, you can simply type your text manually in the tool.</p>
                  </AlertDescription>
                </Alert>

                {/* Two options */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-background space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Camera className="h-4 w-4 text-purple-600" />
                      Option 1: Use OCR Tool
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Upload a photo of your handwritten work. The AI will attempt to extract the text for feedback.
                    </p>
                    <Button asChild className="w-full">
                      <Link to="/ocr-tool">
                        <Camera className="h-4 w-4 mr-2" />
                        Open OCR Tool
                      </Link>
                    </Button>
                  </div>

                  <div className="p-4 rounded-lg border bg-background space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <PenLine className="h-4 w-4 text-blue-600" />
                      Option 2: Type Manually
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      If OCR doesn't work well with your handwriting, type your text directly in the OCR tool's text editor.
                    </p>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/ocr-tool">
                        <PenLine className="h-4 w-4 mr-2" />
                        Type Your Text
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Week 3 Hour 2 & 3: Moodle Forum Tasks */}
        {weekNumber === 3 && (hourNumber === 2 || hourNumber === 3) && (
          <Week3MoodleTasks />
        )}

        {/* Week 3 Hour 1: Summarising Skills (Moodle Tasks) */}
        {weekNumber === 3 && hourNumber === 1 && (
          <section className="space-y-6">
            {/* Simplified Learning Goals */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Learning Goals</CardTitle>
                </div>
                <CardDescription>Focus on writing effective summaries</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Distinguish claims from evidence — keep claims, skip data
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Maintain neutrality — no personal opinions in summaries
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    Write concise summaries in your own words
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Moodle Task Instructions - Google Doc Embed */}
            <Card className="border-2 border-blue-500/30 bg-blue-500/5">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg">Summarising Tasks</CardTitle>
                </div>
                <CardDescription>Complete the summarising exercises below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Embedded Google Doc */}
                <div className="aspect-[4/3] w-full rounded-lg overflow-hidden border bg-white">
                  <iframe
                    src="https://docs.google.com/document/d/182xbd3rh66VcnqXugXg3UKxF-ZdXQWtgWOR11LDmL8Y/preview"
                    width="100%"
                    height="100%"
                    className="border-0"
                    title="Week 3 Hour 1 - Summarising Tasks"
                    allow="autoplay"
                  />
                </div>
                
                {/* Open in new tab button */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://docs.google.com/document/d/182xbd3rh66VcnqXugXg3UKxF-ZdXQWtgWOR11LDmL8Y/edit?usp=sharing"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in Google Docs
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Key Reminder */}
            <Alert className="border-amber-500/30 bg-amber-500/5">
              <Lightbulb className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-700">Remember</AlertTitle>
              <AlertDescription className="text-amber-600">
                <strong>Claims = KEEP</strong> (what the author argues) | <strong>Data = SKIP</strong> (numbers, methodology, specific examples)
              </AlertDescription>
            </Alert>
          </section>
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