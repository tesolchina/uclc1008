import { WeekData, WeekMeta } from "../types";

export const week6: WeekData = {
  id: 6,
  title: "Week 6",
  theme: "Argumentation Model & Academic Writing Quiz",
  overview:
    "Apply the argumentation model in your own writing and complete the in-class Academic Writing Quiz.",
  inClassActivities: [
    "In-class Academic Writing Quiz (15%) [45-50 minutes]",
  ],
  learningOutcomes: [
    "Plan a short written response using an argumentation model.",
    "Use appropriate academic tone and citations in timed writing.",
    "Understand what to expect from the Academic Writing Quiz.",
  ],
  resources: [
    {
      title: "Module 3: Argumentation model – planning your own argument",
      type: "video",
      duration: "10 min",
    },
    {
      title: "Academic Writing Quiz sample questions",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Timed-writing planning template",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Plan a short argumentative paragraph using the model and the planning template.",
    "Write a 15–20 minute timed response to a sample question.",
    "Share your response with the AI tutor and ask for feedback on clarity, tone, and citation use only.",
  ],
  aiPromptHint:
    "You help students plan and rehearse short argument-based writing so they feel more confident in the Academic Writing Quiz.",
  skillsIntroduced: ["academic-tone"],
  skillsReinforced: ["summarising", "paraphrasing", "synthesising", "apa-referencing", "argument-identification"],
  assignmentsDue: ["academic-writing-quiz"],
  assignmentsUpcoming: ["ace-draft"],
};

export const week6Meta: WeekMeta = {
  dateRange: "23-27 Feb 2026",
  assignmentTagline: "Academic Writing Quiz (15%) this week",
  assignmentIds: ["academic-writing-quiz"],
};
