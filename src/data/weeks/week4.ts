import { WeekData, WeekMeta } from "../types";
import { lesson4_1, lesson4_2 } from "../lessons";

export const week4: WeekData = {
  id: 4,
  title: "Week 4",
  theme: "Synthesising Skills & AI Workshop 1",
  overview:
    "Master the skill of combining multiple sources and explore the ethical boundaries of AI in academic work.",
  inClassActivities: [
    "Module 2: Part 3 - Synthesising Skills (Activities 3.1, 3.2)",
    "AI Workshop 1: Precision in Reading & Writing and Ethical Considerations",
  ],
  learningOutcomes: [
    "Identify common themes, contradictions, and connections between multiple sources.",
    "Combine information from more than one source into a short synthetic paragraph.",
    "Apply effective prompts for using Gen-AI as a learning partner.",
    "Critically evaluate Gen-AI capabilities and limitations.",
  ],
  resources: [
    {
      title: "Module 2: Synthesising Skills (Part 3)",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "AI Workshop: Uses and Limitations of GenAI",
      type: "reading",
      duration: "15 min",
    },
  ],
  practiceTasks: [
    "Write a 150-word synthesis of two sources with opposing views on remote work.",
    "Experiment with 'Phased Reading Prompts' in AI Workshop 1.",
    "Document one instance where Gen-AI provided incorrect or biased information.",
  ],
  aiPromptHint:
    "You help students synthesize ideas by identifying relationships like 'consensus,' 'contrast,' or 'elaboration' between two or more academic texts.",
  skillsIntroduced: ["synthesising", "ai-literacy", "critical-prompting"],
  skillsReinforced: ["summarising", "paraphrasing", "apa-referencing"],
  assignmentsDue: [],
  assignmentsUpcoming: ["academic-writing-quiz"],
  lessons: [lesson4_1, lesson4_2],
};

export const week4Meta: WeekMeta = {
  dateRange: "2-6 Feb 2026",
  assignmentTagline: "AI Workshop 1 - Academic Writing Quiz upcoming",
  assignmentIds: [],
};
