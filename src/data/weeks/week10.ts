import { WeekData, WeekMeta } from "../types";

export const week10: WeekData = {
  id: 10,
  title: "Week 10",
  theme: "Critical Response & AI Workshop 2",
  overview:
    "Use AI tools to refine structured arguments ethically in preparation for your final written work.",
  inClassActivities: [
    "Module 4: Part 2 (Activities 2.2-2.5)",
    "AI Workshop 2: AI Tools for Structured Argumentation and Ethical Considerations (1-hour)",
  ],
  learningOutcomes: [
    "Use AI tools to check structure and clarity of your argument.",
    "Record how AI suggestions influence your revisions.",
    "Reflect on ethical boundaries when using AI for argument writing.",
  ],
  resources: [
    {
      title: "AI Workshop 2: AI tools for structured argumentation",
      type: "video",
      duration: "60 min",
    },
    {
      title: "Sample AI–student interaction transcripts",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "AI reflection log template",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Work on a revised version of your argument using AI suggestions for structure and clarity.",
    "Complete the reflection log, noting which AI suggestions you accepted or rejected.",
    "Ask the AI tutor to help you phrase a short reflection on how AI supported your learning.",
  ],
  aiPromptHint:
    "You help students refine structured arguments with AI support and articulate thoughtful reflections on their AI use.",
  skillsIntroduced: ["ai-reflection"],
  skillsReinforced: ["ai-editing", "ai-ethics", "toulmin-model", "counterarguments"],
  assignmentsUpcoming: ["peer-evaluation", "ace-final", "ai-reflection"],
};

export const week10Meta: WeekMeta = {
  dateRange: "23-27 Mar 2026",
  assignmentTagline: "AI Workshop 2 – refine your arguments",
  assignmentIds: [],
};
