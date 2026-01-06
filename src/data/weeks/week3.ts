import { WeekData, WeekMeta } from "../types";

export const week3: WeekData = {
  id: 3,
  title: "Week 3",
  theme: "Summarising & Paraphrasing Skills (continued)",
  overview:
    "Deepen your summarising and paraphrasing skills in preparation for the Referencing Quiz.",
  inClassActivities: [
    "Module 1: Activity 5.1",
    "Module 2: Activities 1.1, 1.2, 1.3 (continued)",
  ],
  learningOutcomes: [
    "Summarise short academic passages accurately and concisely.",
    "Paraphrase ideas while maintaining original meaning and citation information.",
    "Recognise common referencing formats that may appear in the quiz.",
  ],
  resources: [
    {
      title: "Module 2: Summarising, paraphrasing & synthesising skills – practice set",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "Referencing patterns in sample texts",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Referencing Quiz preparation checklist",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Complete a short set of paraphrasing exercises using provided extracts.",
    "Write one-paragraph summaries for two short sections of an article and add correct in-text citations.",
    "Use the AI tutor to check whether your citation style and paraphrasing are suitable for the quiz.",
  ],
  aiPromptHint:
    "You help students practise summarising and paraphrasing with correct in-text citations so they feel prepared for the Referencing Quiz.",
  skillsIntroduced: ["apa-referencing"],
  skillsReinforced: ["summarising", "paraphrasing", "citation-recognition", "secondary-citations"],
  assignmentsDue: ["referencing-quiz"],
};

export const week3Meta: WeekMeta = {
  dateRange: "27-31 Jan 2026",
  assignmentTagline: "Referencing Quiz due 30 Jan",
  assignmentIds: ["referencing-quiz"],
};
