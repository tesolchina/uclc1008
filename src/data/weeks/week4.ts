import { WeekData, WeekMeta } from "../types";
import { lesson4_1, lesson4_2 } from "../lessons";

// ============================================================
// NOTE: Week 4+ content is subject to revision based on learning progress
// Last updated: 2026-01-13
// ============================================================

export const week4: WeekData = {
  id: 4,
  title: "Week 4",
  theme: "Synthesizing Skills & AWQ Structure",
  overview:
    "Learn to synthesize information from multiple sources by identifying relationships between ideas. Master the 3-paragraph AWQ structure and practice connecting sources through comparison, contrast, and elaboration.",
  inClassActivities: [
    "Listing vs Synthesis: Why synthesis matters (Student A vs Student B comparison)",
    "Three Synthesis Relationships: Agreement, Contrast, Elaboration",
    "Using Connectives and Transitions for synthesis",
    "AWQ 3-Paragraph Structure: Introduction, Body, Conclusion",
    "Writing Thesis Statements that preview both sources",
    "Sample AWQ Analysis: What makes an A-grade response?",
  ],
  learningOutcomes: [
    "Distinguish between listing (source-by-source) and true synthesis (idea-by-idea integration).",
    "Identify three types of relationships between sources: agreement, contrast, and elaboration.",
    "Use appropriate connectives to signal relationships (e.g., 'However,' 'Similarly,' 'Furthermore').",
    "Write a thesis statement that previews the main ideas from both excerpts.",
    "Structure an AWQ response with: Introduction (background + thesis), Body (synthesized summary), Conclusion (implications).",
    "Apply the AWQ grading rubric to evaluate sample responses and identify strengths/weaknesses.",
  ],
  resources: [
    {
      title: "Lecture 7: Synthesizing Skills",
      type: "reading",
      duration: "45 min",
    },
    {
      title: "Sample AWQ: Student A (80%) vs Student B (61%)",
      type: "reading",
      duration: "30 min",
    },
    {
      title: "AWQ Grading Rubric - All 5 Criteria",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Summary Writing Guide - Part 2: Structure",
      type: "reading",
      duration: "15 min",
    },
  ],
  practiceTasks: [
    "Compare Passage 1 (listing) with Passage 2 (synthesis). Why is Passage 2 better?",
    "Identify the relationship between Hong et al. (2022) and Andrejevic & Selwyn (2020): agreement, contrast, or elaboration?",
    "Write a thesis statement that previews the main arguments from both FRT articles.",
    "Analyze Student A's response: identify the thesis, topic sentences, and synthesis techniques used.",
    "Transform a listing paragraph into a synthesized paragraph using appropriate connectives.",
    "Write a complete 200-word AWQ response following the 3-paragraph structure.",
  ],
  aiPromptHint:
    "You help students synthesize ideas from multiple sources by identifying relationships (agreement, contrast, elaboration). Focus on the AWQ synthesis criterion (20%) and the difference between listing and true synthesis.",
  skillsIntroduced: ["synthesizing", "thesis-writing", "awq-structure", "connectives"],
  skillsReinforced: ["paraphrasing", "summarizing", "in-text-citations"],
  assignmentsDue: [],
  assignmentsUpcoming: ["academic-writing-quiz"],
  lessons: [lesson4_1, lesson4_2],
};

export const week4Meta: WeekMeta = {
  dateRange: "2-6 Feb 2026",
  assignmentTagline: "Final preparation for AWQ (15%) next week",
  assignmentIds: [],
};
