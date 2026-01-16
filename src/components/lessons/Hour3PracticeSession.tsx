import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { QuickCheckMC } from "@/components/tasks/objective/QuickCheckMC";
import { StrategyPracticeTask } from "@/components/tasks/open-ended/StrategyPracticeTask";
import { WritingPracticeWithHistory } from "@/components/tasks/WritingPracticeWithHistory";
import { AiTutorRating } from "./AiTutorRating";
import { 
  BookOpen, 
  Search, 
  PenLine, 
  Target, 
  CheckCircle2,
  Sparkles 
} from "lucide-react";

interface Hour3PracticeSessionProps {
  weekNumber: number;
  studentId: string;
  onComplete?: () => void;
}

// Skill summaries for Week 1
const SKILL_SUMMARIES = {
  skimming: {
    title: "What You Learned: Skimming",
    icon: BookOpen,
    points: [
      "Reading quickly for main ideas and overall structure",
      "Focusing on headings, first/last sentences, and keywords",
      "Understanding IMRaD structure (Introduction, Methods, Results, Discussion)"
    ]
  },
  scanning: {
    title: "What You Learned: Scanning",
    icon: Search,
    points: [
      "Searching for specific information quickly",
      "Looking for keywords, names, dates, or statistics",
      "Using text features (bold, italics, headings) to locate data"
    ]
  },
  paraphrasing: {
    title: "What You Learned: Paraphrasing",
    icon: PenLine,
    points: [
      "4 strategies: synonyms, word forms, voice change, sentence restructuring",
      "Avoiding patchwriting (copying with minor changes)",
      "Always include proper APA citations when paraphrasing"
    ]
  },
  integrated: {
    title: "Putting It All Together",
    icon: Target,
    points: [
      "Skim to understand overall structure and main ideas",
      "Scan to find specific evidence and quotes",
      "Paraphrase key points with proper citations"
    ]
  }
};

// Practice questions for each skill - using correct format for QuickCheckMC
const SKIMMING_QUESTIONS = [
  {
    id: "w1h3-skim1",
    question: "When skimming an academic article, what should you focus on FIRST?",
    options: [
      { label: "A", text: "Reading every word carefully" },
      { label: "B", text: "Headings, abstract, and topic sentences" },
      { label: "C", text: "The reference list" },
      { label: "D", text: "The author's biography" }
    ],
    correctAnswer: "B",
    explanation: "When skimming, start with structural elements like headings, the abstract, and topic sentences to quickly grasp the main ideas."
  },
  {
    id: "w1h3-skim2",
    question: "In IMRaD structure, which section typically presents the main findings?",
    options: [
      { label: "A", text: "Introduction" },
      { label: "B", text: "Methods" },
      { label: "C", text: "Results" },
      { label: "D", text: "Discussion" }
    ],
    correctAnswer: "C",
    explanation: "The Results section presents the main findings of the research. The Discussion interprets these findings."
  }
];

const SCANNING_QUESTIONS = [
  {
    id: "w1h3-scan1",
    question: "What is the PRIMARY purpose of scanning a text?",
    options: [
      { label: "A", text: "Understanding the author's argument" },
      { label: "B", text: "Finding specific information quickly" },
      { label: "C", text: "Appreciating the writing style" },
      { label: "D", text: "Memorizing key terms" }
    ],
    correctAnswer: "B",
    explanation: "Scanning is specifically used to locate particular information such as names, dates, or statistics without reading the entire text."
  },
  {
    id: "w1h3-scan2",
    question: "Which technique is MOST useful when scanning for a specific statistic?",
    options: [
      { label: "A", text: "Reading each paragraph carefully" },
      { label: "B", text: "Looking for numbers, percentages, or charts" },
      { label: "C", text: "Starting from the conclusion" },
      { label: "D", text: "Reading the abstract only" }
    ],
    correctAnswer: "B",
    explanation: "When scanning for statistics, look for numerical indicators like numbers, percentages, or data visualizations."
  }
];

const PARAPHRASING_QUESTIONS = [
  {
    id: "w1h3-para1",
    question: "Which of the following is an example of patchwriting?",
    options: [
      { label: "A", text: "Completely rewriting the idea in your own words" },
      { label: "B", text: "Copying phrases and changing a few words" },
      { label: "C", text: "Using a direct quote with quotation marks" },
      { label: "D", text: "Summarizing multiple paragraphs together" }
    ],
    correctAnswer: "B",
    explanation: "Patchwriting is copying source text and making only minor word substitutions. It's a form of plagiarism."
  },
  {
    id: "w1h3-para2",
    question: "What MUST be included when paraphrasing someone else's ideas?",
    options: [
      { label: "A", text: "Quotation marks" },
      { label: "B", text: "The exact original wording" },
      { label: "C", text: "A citation to the source" },
      { label: "D", text: "The author's email address" }
    ],
    correctAnswer: "C",
    explanation: "Even when you rewrite ideas in your own words, you must cite the source to give proper credit."
  }
];

// Practice paragraph for paraphrasing
const PRACTICE_PARAGRAPH = {
  id: "w1h3-practice-para",
  text: "Facial recognition technology is beginning to be implemented at scale in schools. This is perhaps not surprising given the role played by the classroom in the development of monitoring practices and the increasing normalisation of surveillance in the name of protecting young people.",
  citation: "(Andrejevic & Selwyn, 2020)"
};

export function Hour3PracticeSession({ weekNumber, studentId, onComplete }: Hour3PracticeSessionProps) {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState("skimming");
  const [showRating, setShowRating] = useState(false);

  // Calculate progress
  const totalTasks = 8;
  const progress = (completedTasks.size / totalTasks) * 100;

  useEffect(() => {
    if (completedTasks.size >= totalTasks - 1) {
      setShowRating(true);
    }
  }, [completedTasks.size]);

  const handleTaskComplete = (taskId: string) => {
    setCompletedTasks(prev => new Set([...prev, taskId]));
  };

  const renderSkillSummary = (skillKey: keyof typeof SKILL_SUMMARIES) => {
    const skill = SKILL_SUMMARIES[skillKey];
    const Icon = skill.icon;
    return (
      <Card className="mb-4 bg-muted/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Icon className="h-4 w-4 text-primary" />
            {skill.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="text-sm space-y-1 text-muted-foreground">
            {skill.points.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Week {weekNumber} Practice Session
              </CardTitle>
              <CardDescription>
                Consolidate your skills from Hours 1 & 2 with AI-guided practice
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {completedTasks.size} / {totalTasks} completed
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      {/* Tabbed Practice Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skimming" className="text-xs">
            <BookOpen className="h-3.5 w-3.5 mr-1" />
            Skimming
          </TabsTrigger>
          <TabsTrigger value="scanning" className="text-xs">
            <Search className="h-3.5 w-3.5 mr-1" />
            Scanning
          </TabsTrigger>
          <TabsTrigger value="paraphrasing" className="text-xs">
            <PenLine className="h-3.5 w-3.5 mr-1" />
            Paraphrasing
          </TabsTrigger>
          <TabsTrigger value="integrated" className="text-xs">
            <Target className="h-3.5 w-3.5 mr-1" />
            All Skills
          </TabsTrigger>
        </TabsList>

        {/* Skimming Tab */}
        <TabsContent value="skimming" className="space-y-4 mt-4">
          {renderSkillSummary("skimming")}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Practice: Skimming Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {SKIMMING_QUESTIONS.map((q, idx) => (
                <QuickCheckMC
                  key={q.id}
                  questionNumber={idx + 1}
                  questionId={q.id}
                  question={q.question}
                  options={q.options}
                  correctAnswer={q.correctAnswer}
                  explanation={q.explanation}
                  weekNumber={weekNumber}
                  hourNumber={3}
                  enableAiFeedback={true}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scanning Tab */}
        <TabsContent value="scanning" className="space-y-4 mt-4">
          {renderSkillSummary("scanning")}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Practice: Scanning Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {SCANNING_QUESTIONS.map((q, idx) => (
                <QuickCheckMC
                  key={q.id}
                  questionNumber={idx + 1}
                  questionId={q.id}
                  question={q.question}
                  options={q.options}
                  correctAnswer={q.correctAnswer}
                  explanation={q.explanation}
                  weekNumber={weekNumber}
                  hourNumber={3}
                  enableAiFeedback={true}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paraphrasing Tab */}
        <TabsContent value="paraphrasing" className="space-y-4 mt-4">
          {renderSkillSummary("paraphrasing")}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Quick Check: Paraphrasing Concepts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {PARAPHRASING_QUESTIONS.map((q, idx) => (
                <QuickCheckMC
                  key={q.id}
                  questionNumber={idx + 1}
                  questionId={q.id}
                  question={q.question}
                  options={q.options}
                  correctAnswer={q.correctAnswer}
                  explanation={q.explanation}
                  weekNumber={weekNumber}
                  hourNumber={3}
                  enableAiFeedback={true}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Practice: Paraphrase with AI Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <StrategyPracticeTask
                taskId={PRACTICE_PARAGRAPH.id}
                originalSentence={PRACTICE_PARAGRAPH.text}
                citation={PRACTICE_PARAGRAPH.citation}
                studentId={studentId}
                onComplete={() => handleTaskComplete(PRACTICE_PARAGRAPH.id)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrated Tab */}
        <TabsContent value="integrated" className="space-y-4 mt-4">
          {renderSkillSummary("integrated")}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Reflection & Goal Setting</CardTitle>
            </CardHeader>
            <CardContent>
              <WritingPracticeWithHistory
                taskKey={`w${weekNumber}h3-reflection`}
                title="Reflect on Your Learning"
                instructions="Reflect on your learning this week: 1) What skill did you find most challenging? 2) What improved from Hour 1 to Hour 3? 3) What will you focus on in Week 2?"
                placeholder="Write your reflection here..."
                studentId={studentId}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* AI Tutor Rating */}
      {showRating && (
        <AiTutorRating
          weekNumber={weekNumber}
          studentId={studentId}
          completedTasks={Array.from(completedTasks)}
          totalTasks={totalTasks}
        />
      )}
    </div>
  );
}

export default Hour3PracticeSession;
