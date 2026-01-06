import { WeekData, WeekMeta } from "../types";

export const week5: WeekData = {
  id: 5,
  title: "Week 5",
  theme: "Argumentation Model",
  overview:
    "Move into Module 3 and learn how academic arguments are structured using an argumentation model.",
  inClassActivities: [
    "Module 3: Introduction and activities",
  ],
  learningOutcomes: [
    "Identify claims, reasons, and evidence in academic arguments.",
    "Describe a basic argumentation model (e.g. Toulmin).",
    "Label parts of an argument in short sample texts.",
  ],
  resources: [
    {
      title: "Module 3: Argumentation model – overview",
      type: "video",
      duration: "12 min",
    },
    {
      title: "Sample academic argument (short article/extract)",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "Argument structure worksheet",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Use the worksheet to label claims, reasons, and evidence in a sample argument.",
    "Draw a simple diagram of the argumentation model for one reading.",
    "Ask the AI tutor to check whether you have correctly identified each part of the model.",
  ],
  aiPromptHint:
    "You specialise in helping students recognise and label the parts of academic arguments using a standard argumentation model.",
  skillsIntroduced: ["argument-identification", "toulmin-model"],
  skillsReinforced: ["summarising", "synthesising"],
  assignmentsUpcoming: ["academic-writing-quiz"],
};

export const week5Meta: WeekMeta = {
  dateRange: "10-14 Feb 2026",
  assignmentTagline: "Academic Writing Quiz next week",
  assignmentIds: [],
};
