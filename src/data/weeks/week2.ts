import { WeekData, WeekMeta } from "../types";
import { lesson2_1, lesson2_2 } from "../lessons";

export const week2: WeekData = {
  id: 2,
  title: "Week 2",
  theme: "Summarising, Paraphrasing & Synthesising Skills",
  overview:
    "Explore the fundamental skills of academic writing: expressing ideas in your own words while maintaining integrity.",
  inClassActivities: [
    "Module 1: Part 2 - Step 3 (Section Headings) & Step 4 (Topic Sentences)",
    "Module 2: Part 1 - Paraphrasing Skills (Activities 1.1-1.3)",
    "Flipped Classroom Video: AI Literacy (Authenticity)",
  ],
  learningOutcomes: [
    "Identify and analyze topic sentences and concluding sentences in academic texts.",
    "Apply paraphrasing strategies (synonyms, word forms, voice, patterns).",
    "Understand how to use AI tools ethically for academic writing.",
    "Complete the Pre-course Writing assessment.",
  ],
  resources: [
    {
      title: "Module 2: Paraphrasing, Summarising & Synthesising Skills (Part 1)",
      type: "reading",
      duration: "30 min",
    },
    {
      title: "Flipped video: AI Literacy (Authenticity)",
      type: "video",
      duration: "10 min",
      url: "https://www.youtube.com/watch?v=6uhUqUG4-Vo",
    },
  ],
  practiceTasks: [
    "Complete Activity 1.3: Practising Paraphrasing Strategies in Module 2.",
    "Draft your Pre-course Writing task focusing on original wording.",
    "Use Gen-AI to brainstorm ideas but ensure final drafting is independent.",
  ],
  aiPromptHint:
    "You help students practice paraphrasing by evaluating their drafts against original texts to ensure they are not too close (avoiding 'patchwriting').",
  skillsIntroduced: ["paraphrasing", "topic-sentences", "ai-authenticity"],
  skillsReinforced: ["journal-structure", "citation-recognition"],
  assignmentsUpcoming: ["referencing-quiz"],
  lessons: [lesson2_1, lesson2_2],
};

export const week2Meta: WeekMeta = {
  dateRange: "19-23 Jan 2026",
  assignmentTagline: "Focus on paraphrasing and summarising skills",
  assignmentIds: [],
};
