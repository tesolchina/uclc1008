import { WeekData, WeekMeta } from "../types";

export const week4: WeekData = {
  id: 4,
  title: "Week 4",
  theme: "Summarising Skills & AI Workshop 1",
  overview:
    "Consolidate paraphrasing and synthesising while exploring AI tools for precise, ethical academic reading and writing.",
  inClassActivities: [
    "Module 2: Summarising skills",
    "AI Workshop 1: AI Tools for Academic English – Precision in Reading & Writing and Ethical Considerations (1-hour)",
  ],
  learningOutcomes: [
    "Combine information from more than one source into a short synthetic paragraph.",
    "Explain the risks and benefits of using AI tools in academic work.",
    "Apply AI literacy principles when checking your own drafts.",
  ],
  resources: [
    {
      title: "Module 2: Summarising, paraphrasing & synthesising – integration tasks",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "AI Workshop 1: AI tools for academic English (precision & ethics)",
      type: "video",
      duration: "60 min",
    },
    {
      title: "AI use reflection notes",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Write a short synthetic paragraph that combines ideas from two short readings.",
    "Try using an AI tool to check clarity and grammar, then record how you changed the text.",
    "Ask the AI tutor to help you explain why your final version is still your own work.",
  ],
  aiPromptHint:
    "You help students use AI tools as careful reading and editing partners while maintaining academic integrity.",
  skillsIntroduced: ["synthesising", "ai-editing"],
  skillsReinforced: ["summarising", "paraphrasing", "ai-ethics"],
  assignmentsUpcoming: ["academic-writing-quiz"],
};

export const week4Meta: WeekMeta = {
  dateRange: "3-7 Feb 2026",
  assignmentTagline: "Prepare for Academic Writing Quiz",
  assignmentIds: [],
};
