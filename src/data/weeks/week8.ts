import { WeekData, WeekMeta } from "../types";

export const week8: WeekData = {
  id: 8,
  title: "Week 8",
  theme: "Critical Response to Academic Arguments (1)",
  overview:
    "Begin Module 4 by learning how to respond critically to arguments. Receive feedback on previous work and prepare for the ACE Draft test.",
  inClassActivities: [
    "Feedback on ACE Draft Practice",
    "Test details for the upcoming ACE Draft",
    "Module 4: Part 1",
    "Feedback on Academic Writing Quiz (AWQ)",
  ],
  learningOutcomes: [
    "Identify main arguments and key points in academic texts or audio.",
    "Distinguish between summarising and critiquing.",
    "Prepare a basic critical response to a given argument.",
  ],
  resources: [
    {
      title: "Module 4: Critical response to academic arguments – introduction",
      type: "video",
      duration: "12 min",
    },
    {
      title: "Short article or transcript for critical response",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "Critical response planning sheet",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Write a short summary of the main argument in the sample text or audio.",
    "Use the planning sheet to note strengths and weaknesses in the argument.",
    "Ask the AI tutor to help you turn your notes into a clearer critical response outline.",
  ],
  aiPromptHint:
    "You help students move from basic summary to thoughtful critical response to academic arguments.",
  skillsIntroduced: ["critical-evaluation"],
  skillsReinforced: ["summarising", "argument-identification", "toulmin-model", "counterarguments"],
  assignmentsUpcoming: ["ace-draft"],
};

export const week8Meta: WeekMeta = {
  dateRange: "9-13 Mar 2026",
  assignmentTagline: "ACE Draft next week",
  assignmentIds: [],
};
