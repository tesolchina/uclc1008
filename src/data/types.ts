export type LessonResource = {
  title: string;
  type: "video" | "reading" | "practice" | "project" | "quiz" | "listening";
  duration?: string;
  description?: string;
  url?: string;
};

export type Skill = {
  id: string;
  name: string;
  description: string;
  category: "reading" | "writing" | "critical-thinking" | "ai-literacy" | "speaking";
};

export type Assignment = {
  id: string;
  title: string;
  weight: string;
  dueWeek: number;
  type: "in-class" | "take-home" | "online";
  duration?: string;
  description: string;
  requirements: string[];
  skillsAssessed: string[];
  resources?: { title: string; url?: string }[];
  detailedInfo?: {
    exactDueDate: string;
    dueDate: string;
    submissionMethod: string;
    format: string;
    wordLimit?: string;
    timeLimit?: string;
    gradingCriteria: string[];
    sampleQuestions?: string[];
    instructions: string[];
    sampleResponses?: {
      highScore: { text: string; score: string; feedback: string };
      lowScore: { text: string; score: string; feedback: string };
    };
    aiPolicy: string[];
    latePolicy: string;
    requiredMaterials?: string[];
  };
};

export type Lesson = {
  id: number;
  title: string;
  examples: string[];
  notes: string[];
  questions: {
    question: string;
    type: "multiple-choice" | "short-answer" | "essay" | "true-false";
    options?: string[];
    answer?: string;
    explanation?: string;
  }[];
};

export type WeekData = {
  id: number;
  title: string;
  theme: string;
  overview: string;
  inClassActivities: string[];
  learningOutcomes: string[];
  resources: LessonResource[];
  practiceTasks: string[];
  aiPromptHint: string;
  skillsIntroduced: string[];
  skillsReinforced: string[];
  assignmentsDue?: string[];
  assignmentsUpcoming?: string[];
  lessons: Lesson[];
};

export type WeekMeta = {
  dateRange?: string;
  assignmentTagline?: string;
  assignmentIds?: string[];
};
