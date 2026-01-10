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
  type: "in-class" | "take-home" | "online" | "participation";
  duration?: string;
  description: string;
  requirements: string[];
  skillsAssessed: string[];
  resources?: { title: string; url?: string }[];
  detailedInfo?: {
    exactDueDate: string;
    dueDate?: string;
    submissionMethod: string;
    format?: string;
    wordLimit?: string;
    timeLimit?: string;
    gradingCriteria: string[];
    sampleQuestions?: string[];
    instructions?: string[];
    sampleResponses?: {
      highScore: { text: string; score: string; feedback: string };
      lowScore: { text: string; score: string; feedback: string };
    };
    aiPolicy?: string[];
    latePolicy?: string;
    requiredMaterials?: string[];
  };
};

export type LessonExample = {
  title: string;
  text: string;
};

export type Lesson = {
  id: number;
  title: string;
  examples: (string | LessonExample)[];
  notes: string[];
  questions: {
    question: string;
    type: "multiple-choice" | "short-answer" | "essay" | "true-false";
    options?: string[];
    answer?: string;
    explanation?: string;
  }[];
};

export type ClassRundownItem = {
  time: string;
  title: string;
  description: string;
  activities: string[];
  assignmentLink?: string;
};

// NEW: Numbered text for paragraph/sentence analysis
export type NumberedParagraph = {
  paragraphNumber: number;
  sentences: {
    sentenceNumber: number;
    text: string;
    isTopicSentence?: boolean;
    isCitation?: boolean;
    isMainPoint?: boolean;
    isSupportingDetail?: boolean;
  }[];
};

// NEW: Slide content for teaching
export type SlideContent = {
  emoji?: string;
  heading: string;
  subheading?: string;
  points?: string[];
  numberedText?: NumberedParagraph[];
  examples?: { title: string; text: string }[];
  tip?: string;
  imagePrompt?: string;
  imageUrl?: string;
};

// NEW: Task types for units
export type UnitTask = {
  id: string;
  type: "mc" | "short-answer" | "fill-blank" | "sentence" | "paragraph" | "highlight";
  question: string;
  context?: string;
  options?: string[];
  correctAnswer?: string | number | string[];
  hints?: string[];
  wordLimit?: number;
  explanation?: string;
  targetParagraph?: number;
  targetSentences?: number[];
};

// NEW: Learning unit structure
export type LearningUnit = {
  id: string;
  title: string;
  subtitle?: string;
  duration: string;
  objectives: string[];
  slides: SlideContent[];
  tasks: UnitTask[];
  moduleRef?: string;
};

// NEW: Class hour structure
export type ClassHour = {
  hour: number;
  title: string;
  theme: string;
  units: LearningUnit[];
  assignmentLink?: string;
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
  classRundown?: ClassRundownItem[];
  // NEW: Unit-based structure
  classHours?: ClassHour[];
  moduleId?: 1 | 2;
  moduleParts?: string[];
  targetAssessment?: string;
};

export type WeekMeta = {
  dateRange?: string;
  assignmentTagline?: string;
  assignmentIds?: string[];
};
