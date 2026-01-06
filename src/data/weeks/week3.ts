import { WeekData, WeekMeta } from "../types";
import { lesson3_1, lesson3_2 } from "../lessons";

export const week3: WeekData = {
  id: 3,
  title: "Week 3",
  theme: "Summarising Skills & Referencing",
  overview:
    "Learn how to condense academic articles while maintaining correct APA 7th edition referencing.",
  inClassActivities: [
    "Module 2: Part 2 - Summarising Skills (Activities 2.1, 2.2)",
    "Module 1: Part 4 - End-of-text Citations & Reference List (Activity 5.3)",
    "Referencing Quiz Preparation",
  ],
  learningOutcomes: [
    "Summarize academic passages accurately and concisely.",
    "Follow steps for summarizing: read thoroughly, identify key points, eliminate extraneous info, use own words.",
    "Format end-of-text citations for journals, books, and book chapters (APA 7th).",
    "Complete the Referencing Quiz assessment.",
  ],
  resources: [
    {
      title: "Module 2: Summarising Skills (Part 2)",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "Module 1: End-of-text References (Part 4)",
      type: "reading",
      duration: "15 min",
    },
  ],
  practiceTasks: [
    "Complete Activity 2.2: Summarising Arguments from an Article in Module 2.",
    "Compile a mini reference list of 3 sources in correct APA 7th format.",
    "Practice using hanging indents in your reference list draft.",
  ],
  aiPromptHint:
    "You help students evaluate their summaries for accuracy and neutrality, ensuring they haven't added personal bias or missed key research findings.",
  skillsIntroduced: ["summarising", "end-of-text-referencing", "hanging-indents"],
  skillsReinforced: ["paraphrasing", "citation-recognition"],
  assignmentsDue: ["referencing-quiz"],
  assignmentsUpcoming: [],
  lessons: [lesson3_1, lesson3_2],
};

export const week3Meta: WeekMeta = {
  dateRange: "26-30 Jan 2026",
  assignmentTagline: "Referencing Quiz (2.5%) due 30 Jan, 6pm",
  assignmentIds: ["referencing-quiz"],
};
