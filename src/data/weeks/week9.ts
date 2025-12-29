import { WeekData, WeekMeta } from "../types";

export const week9: WeekData = {
  id: 9,
  title: "Week 9",
  theme: "Critical Response & ACE Draft Test",
  overview:
    "Continue Module 4 and complete the in-class Argument Construction and Evaluation (Draft) test.",
  inClassActivities: [
    "In-class Argument Construction and Evaluation (Draft) Test (15%) [100 minutes]",
    "Module 4: Part 2 (Activity 2.1)",
    "Reminder: Bring necessary devices and disable writing-support apps for the test",
  ],
  learningOutcomes: [
    "Apply an argumentation model to the draft of a longer written assignment.",
    "Integrate summary and critique of source ideas in your own argument.",
    "Understand the requirements of the in-class draft assignment.",
  ],
  resources: [
    {
      title: "Assignment brief: Argument Construction and Evaluation (Draft)",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Model outline for the draft assignment",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Draft planning template (claims, counterarguments, rebuttals)",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Use the planning template to map out your draft argument before the in-class task.",
    "Write a practice paragraph that combines source summary with your own evaluation.",
    "Ask the AI tutor to comment on whether your paragraph clearly follows an argumentation model.",
  ],
  aiPromptHint:
    "You guide students in planning and testing out ideas for the Argument Construction and Evaluation draft without generating full answers.",
  skillsIntroduced: [],
  skillsReinforced: ["toulmin-model", "counterarguments", "summarising", "synthesising", "paraphrasing", "apa-referencing", "critical-evaluation"],
  assignmentsDue: ["ace-draft"],
  assignmentsUpcoming: ["peer-evaluation", "ace-final", "ai-reflection"],
};

export const week9Meta: WeekMeta = {
  dateRange: "16-20 Mar 2026",
  assignmentTagline: "ACE Draft (15%) this week",
  assignmentIds: ["ace-draft"],
};
