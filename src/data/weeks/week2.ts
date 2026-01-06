import { WeekData, WeekMeta } from "../types";

export const week2: WeekData = {
  id: 2,
  title: "Week 2",
  theme: "Summarising, Paraphrasing & Synthesising Skills",
  overview:
    "Continue exploring academic journal articles while beginning to practise summarising, paraphrasing, and synthesising.",
  inClassActivities: [
    "Module 1: Activities 3.1, 3.2, 3.3",
    "Module 1: Activities 4.1, 4.2",
    "Module 1: Part 5 (Referencing)",
    "Module 2: Activities 1.1, 1.2, 1.3",
  ],
  learningOutcomes: [
    "Recognise how ideas are organised within research articles.",
    "Write short summaries of sections of an article in your own words.",
    "Understand the requirements for the Pre-course Writing task.",
  ],
  resources: [
    {
      title: "Module 1: Components of academic journal articles (Part 2)",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Module 2: Summarising, paraphrasing & synthesising skills – introduction",
      type: "video",
      duration: "10 min",
    },
    {
      title: "Flipped video: AI Literacy (Authenticity)",
      type: "video",
      duration: "10 min",
      description: "How to use AI tools ethically when preparing your own writing.",
      url: "https://www.youtube.com/watch?v=6uhUqUG4-Vo",
    },
  ],
  practiceTasks: [
    "Draft or revise your Pre-course Writing task in your own words.",
    "Choose one short paragraph from an article and write a 1–2 sentence summary without copying phrases.",
    "Ask the AI tutor to check whether your paraphrase is too close to the original and suggest safer wording.",
  ],
  aiPromptHint:
    "You support students in planning their Pre-course Writing and in producing short, safe paraphrases from journal articles without writing the assignment for them.",
  skillsIntroduced: ["summarising", "paraphrasing", "ai-ethics"],
  skillsReinforced: ["journal-structure", "citation-recognition"],
  assignmentsDue: ["pre-course-writing"],
  assignmentsUpcoming: ["referencing-quiz"],
};

export const week2Meta: WeekMeta = {
  dateRange: "20-24 Jan 2026",
  assignmentTagline: "Pre-course Writing due 23 Jan",
  assignmentIds: ["pre-course-writing"],
};
