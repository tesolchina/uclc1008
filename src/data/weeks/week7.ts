import { WeekData, WeekMeta } from "../types";

export const week7: WeekData = {
  id: 7,
  title: "Week 7",
  theme: "Developing Stronger Arguments",
  overview:
    "Strengthen your use of the argumentation model by adding counterarguments and rebuttals, and prepare for the ACE Draft.",
  inClassActivities: [
    "Module 3: Activities on warrants, counterarguments, and rebuttals (2.3, 2.4, 2.6, 2.8)",
    "Review of Sample ACE Draft and Study Guide",
    "Test arrangement briefing for ACE Draft",
  ],
  learningOutcomes: [
    "Write a clear main claim supported by reasons and evidence.",
    "Include a relevant counterargument and rebuttal in a short written piece.",
    "Evaluate the strength of your own argument.",
  ],
  resources: [
    {
      title: "Module 3: Building counterarguments and rebuttals",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "Model argument with counterargument and rebuttal",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Argument self-evaluation checklist",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Draft a short argument that includes a counterargument and rebuttal.",
    "Use the checklist to evaluate the strength and clarity of your argument.",
    "Ask the AI tutor where your argument could be more convincing or better supported.",
  ],
  aiPromptHint:
    "You coach students to construct balanced arguments that acknowledge counterarguments and respond to them effectively.",
  skillsIntroduced: ["counterarguments"],
  skillsReinforced: ["toulmin-model", "argument-identification", "synthesising"],
  assignmentsUpcoming: ["ace-draft"],
};

export const week7Meta: WeekMeta = {
  dateRange: "2-6 Mar 2026",
  assignmentTagline: "Prepare for ACE Draft",
  assignmentIds: [],
};
