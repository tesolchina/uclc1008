import { WeekData, WeekMeta } from "../types";

export const week11: WeekData = {
  id: 11,
  title: "Week 11",
  theme: "Critical Response & Preparing for Peer Evaluation",
  overview:
    "Consolidate your critical response skills and get ready to give and receive peer feedback on your draft.",
  inClassActivities: [
    "Briefing on forthcoming assignments",
    "Module 4: Part 3",
    "Reminder: Week 12 – In-class Peer Evaluation on Argument Construction and Evaluation (Draft) (5%)",
  ],
  learningOutcomes: [
    "Identify strengths and areas for improvement in a peer's argumentative draft.",
    "Give constructive, specific feedback linked to the argumentation model.",
    "Revise your own work based on peer and teacher comments.",
  ],
  resources: [
    {
      title: "Peer evaluation criteria for Argument Construction and Evaluation (Draft)",
      type: "reading",
      duration: "10 min",
    },
    {
      title: "Sample peer feedback comments",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Revision planning worksheet",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Practise annotating a sample paragraph using the peer evaluation criteria.",
    "Write three concrete suggestions you could give a peer to strengthen their argument.",
    "Ask the AI tutor to help you rephrase feedback comments more clearly and politely.",
  ],
  aiPromptHint:
    "You support students in giving and receiving constructive peer feedback focused on argument quality.",
  skillsIntroduced: ["peer-feedback"],
  skillsReinforced: ["critical-evaluation", "toulmin-model", "counterarguments"],
  assignmentsUpcoming: ["peer-evaluation", "ace-final", "ai-reflection", "craa", "reflective-portfolio"],
};

export const week11Meta: WeekMeta = {
  dateRange: "30 Mar - 3 Apr 2026",
  assignmentTagline: "Peer Evaluation next week",
  assignmentIds: [],
};
