import { WeekData, WeekMeta } from "../types";

export const week13: WeekData = {
  id: 13,
  title: "Week 13",
  theme: "Critical Response to Academic Arguments (CRAA) Test",
  overview:
    "Complete the in-class CRAA test and finalise all outstanding submissions.",
  inClassActivities: [
    "In-class Critical Response to Academic Arguments (CRAA) Test (20%)",
    "Venue: To be confirmed",
  ],
  learningOutcomes: [
    "Synthesise skills from the whole semester in a summative critical response task.",
    "Manage time and stress during a formal assessment.",
    "Reflect on overall learning and progress in UCLC1008.",
  ],
  resources: [
    {
      title: "CRAA test preparation guide",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "Reflective Learning Portfolio rubric (10%)",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Final submission checklist",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Complete a timed practice response using a previous sample prompt.",
    "Finish and proofread your Reflective Learning Portfolio before the deadline.",
    "Ask the AI tutor to help you check your final argument for structure and citation accuracy.",
  ],
  aiPromptHint:
    "You support students in final exam preparation and help them review their work for clarity, coherence, and proper referencing.",
  skillsIntroduced: [],
  skillsReinforced: ["spoken-response", "summarising", "counterarguments", "critical-evaluation", "ai-reflection", "toulmin-model"],
  assignmentsDue: ["craa", "ace-final", "ai-reflection"],
  assignmentsUpcoming: ["reflective-portfolio"],
};

export const week13Meta: WeekMeta = {
  dateRange: "20-24 Apr 2026",
  assignmentTagline: "CRAA (20%) + ACE Final (20%) + AI Reflection (5%) due",
  assignmentIds: ["craa", "ace-final", "ai-reflection"],
};
