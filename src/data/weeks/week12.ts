import { WeekData, WeekMeta } from "../types";

export const week12: WeekData = {
  id: 12,
  title: "Week 12",
  theme: "Peer Evaluation & Consultations",
  overview:
    "Engage in peer evaluation and consultations while continuing to practise spoken and written critical response.",
  inClassActivities: [
    "In-class Peer Evaluation on Argument Construction and Evaluation (Draft) (5%)",
    "Consultations",
    "Module 4: Parts 3.5, 4, and 5.1",
  ],
  learningOutcomes: [
    "Use peer feedback to revise your draft more effectively.",
    "Prepare a short spoken critical response to an argument.",
    "Plan questions to ask in individual or small-group consultations.",
  ],
  resources: [
    {
      title: "Guidelines for in-class peer evaluation (5%)",
      type: "reading",
      duration: "10 min",
    },
    {
      title: "Consultation planning sheet",
      type: "practice",
    },
    {
      title: "Sample audio clip for critical response",
      type: "listening",
      duration: "5 min",
    },
  ],
  practiceTasks: [
    "Revise one section of your draft based on peer comments.",
    "Prepare and record a brief spoken critical response to a short audio or text extract.",
    "Ask the AI tutor for suggestions on structuring your final argument more clearly.",
  ],
  aiPromptHint:
    "You help students refine their drafts through peer feedback and prepare confident spoken responses to academic arguments.",
  skillsIntroduced: ["spoken-response"],
  skillsReinforced: ["peer-feedback", "critical-evaluation", "counterarguments", "summarising"],
  assignmentsDue: ["peer-evaluation"],
  assignmentsUpcoming: ["ace-final", "ai-reflection", "craa", "reflective-portfolio"],
};

export const week12Meta: WeekMeta = {
  dateRange: "13-17 Apr 2026",
  assignmentTagline: "Peer Evaluation (5%) this week",
  assignmentIds: ["peer-evaluation"],
};
