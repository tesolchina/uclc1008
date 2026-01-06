import { WeekData, WeekMeta } from "../types";
import { lesson5_1, lesson5_2 } from "../lessons";

export const week5: WeekData = {
  id: 5,
  title: "Week 5",
  theme: "Academic Writing Quiz (AWQ) Preparation",
  overview:
    "Consolidate your skills in analyzing journal article excerpts and structuring a synthetic summary in preparation for the Academic Writing Quiz.",
  inClassActivities: [
    "AWQ Study Guide Part 1: How to Read and Select Main Ideas",
    "AWQ Study Guide Part 2: How to Structure Your Summary",
    "Practice: Analyzing Article A and Article B excerpts",
    "Writing Drill: Drafting a thesis statement and body paragraph synthesis",
  ],
  learningOutcomes: [
    "Predict an author's stance from article titles and abstracts.",
    "Identify key findings and arguments while omitting detailed evidence/methods for a summary.",
    "Structure a 300-word summary with an introduction, synthesized body paragraph, and conclusion.",
    "Use appropriate academic expressions for contrasting views (e.g., 'Conversely', 'challenged by').",
  ],
  resources: [
    {
      title: "Study Guide to Academic Writing Quiz (AWQ)",
      type: "reading",
      duration: "30 min",
    },
    {
      title: "Sample Academic Writing Quiz (Question & Answer)",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Analyze the title and abstract of Article A and B in the Study Guide.",
    "Write a practice introduction paragraph including background and a thesis statement for the AWQ topic.",
    "Use the AI tutor to evaluate your synthesized topic sentence for Paragraph 2.",
  ],
  aiPromptHint:
    "You help students practice for the AWQ by reviewing their analysis of article excerpts and checking their summary structure (Introduction, Body Synthesis, Conclusion).",
  skillsIntroduced: ["synthesis-structure", "stance-prediction"],
  skillsReinforced: ["summarising", "paraphrasing", "apa-referencing", "topic-sentences"],
  assignmentsUpcoming: ["academic-writing-quiz"],
  lessons: [lesson5_1, lesson5_2],
};

export const week5Meta: WeekMeta = {
  dateRange: "9-13 Feb 2026",
  assignmentTagline: "Final AWQ Prep - Review Study Guide and Sample Quiz",
  assignmentIds: [],
};
