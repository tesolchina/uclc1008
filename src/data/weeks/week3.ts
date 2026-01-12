import { WeekData, WeekMeta } from "../types";
import { lesson3_1, lesson3_2 } from "../lessons";

export const week3: WeekData = {
  id: 3,
  title: "Week 3",
  theme: "Paraphrasing & Summarizing Skills",
  overview:
    "Master the essential skills of paraphrasing and summarizing academic texts. Learn to reword ideas while preserving meaning, and condense complex arguments into clear, concise summaries—both crucial for the AWQ.",
  inClassActivities: [
    "Distinguishing Paraphrasing vs Summarizing",
    "5 Paraphrasing Strategies: Synonyms, Word Forms, Voice, Structure, Combining",
    "Avoiding Patchwriting: Identifying and fixing inadequate paraphrasing",
    "Summarizing from Abstracts: Locating thesis statements",
    "The Slasher Method: Keeping claims, skipping data",
  ],
  learningOutcomes: [
    "Distinguish between paraphrasing (rewording while keeping meaning) and summarizing (condensing to essential ideas).",
    "Apply 5 paraphrasing strategies: synonyms, word forms, active/passive voice, sentence structure, and combining sentences.",
    "Identify and avoid patchwriting by using multiple paraphrasing strategies together.",
    "Summarize thesis statements from abstracts by locating purpose statements and key findings.",
    "Apply the 'Slasher Method': keep claims and explanations, skip detailed evidence and data.",
    "Always include in-text citations when paraphrasing or summarizing to avoid plagiarism.",
  ],
  resources: [
    {
      title: "Lecture 5: Paraphrasing & Summarizing",
      type: "reading",
      duration: "45 min",
    },
    {
      title: "Lecture 6: Summarizing Skills",
      type: "reading",
      duration: "45 min",
    },
    {
      title: "Summary Writing Guide",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "AWQ Grading Rubric - Paraphrasing Criteria",
      type: "reading",
      duration: "10 min",
    },
  ],
  practiceTasks: [
    "Compare an original quote with its paraphrase and summary versions. What strategies were used?",
    "Paraphrase a sentence using at least 3 different strategies (synonyms, structure change, voice change).",
    "Summarize an article abstract in one sentence, focusing on the purpose statement.",
    "Identify which sentences in a paragraph are claims (keep) vs evidence/data (skip for summary).",
    "Find and correct a patchwriting example by applying multiple paraphrasing strategies.",
  ],
  aiPromptHint:
    "You help students distinguish between paraphrasing and summarizing, identify patchwriting issues, and apply the 5 paraphrasing strategies. Focus on the AWQ rubric criteria for paraphrasing (20%).",
  skillsIntroduced: ["paraphrasing-strategies", "summarizing", "patchwriting-avoidance", "thesis-extraction"],
  skillsReinforced: ["in-text-citations", "academic-reading"],
  assignmentsDue: [],
  assignmentsUpcoming: ["academic-writing-quiz"],
  lessons: [lesson3_1, lesson3_2],
};

export const week3Meta: WeekMeta = {
  dateRange: "26-30 Jan 2026",
  assignmentTagline: "Building toward AWQ (15%) in Week 5",
  assignmentIds: [],
};
