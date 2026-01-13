import { WeekData, WeekMeta } from "../types";
import { lesson2_1, lesson2_2 } from "../lessons";

// ============================================================
// NOTE: Week 2 content is subject to revision based on learning progress
// Last updated: 2026-01-13
// ============================================================

export const week2: WeekData = {
  id: 2,
  title: "Week 2",
  theme: "APA Citation Skills: In-Text & Reference List",
  overview:
    "This week focuses on mastering APA 7th edition citation skills. Hour 1 covers in-text citations with varied sentence patterns for use in summary writing. Hour 2 introduces end-of-text citations (reference list entries). Hour 3 consolidates skills through practice, feedback, and reflection.",
  inClassActivities: [
    "Structure of Conceptual Research Papers",
    "Analyzing Article B (Andrejevic & Selwyn, 2020) - a conceptual study",
    "Finding the Thesis & Central Argument",
    "Identifying supporting reasons and evidence",
    "Preview of In-text & End-of-text Citations (APA 7th)",
  ],
  learningOutcomes: [
    "Understand the structure of conceptual research papers (argument-driven, not IMRaD).",
    "Locate the thesis statement (purpose/central message) typically at the end of the Introduction.",
    "Identify the central argument and supporting reasons in a conceptual paper.",
    "Distinguish between section structures: how headings reveal argument flow.",
    "Recognize word clues that signal thesis statements: 'This article contends...', 'we seek to problematise...'",
  ],
  resources: [
    {
      title: "Article B: Andrejevic & Selwyn (2020) - FRT in Schools: Critical Questions",
      type: "reading",
      duration: "40 min",
    },
    {
      title: "Module 1: Part 3 - Reading Conceptual Papers",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "In-text citations in minutes (Video)",
      type: "video",
      duration: "8 min",
      url: "https://www.youtube.com/watch?v=JpT1YwNcV04",
    },
  ],
  practiceTasks: [
    "Is Article B an empirical or conceptual research paper? Explain with reasons.",
    "Find the sentence(s) containing the purpose and central idea. Which words give you the clue?",
    "Where does the thesis typically appear in a conceptual paper?",
    "Identify TWO reasons supporting the thesis that FRT should not be implemented in schools.",
    "Compare the body paragraph structures - what pattern do you notice?",
  ],
  aiPromptHint:
    "You help students analyze conceptual research papers, focusing on Andrejevic & Selwyn (2020). Help them identify thesis statements, central arguments, and the argument-driven structure that differs from empirical papers.",
  skillsIntroduced: ["thesis-identification", "conceptual-paper-structure", "argument-mapping", "purpose-statement"],
  skillsReinforced: ["skimming", "scanning", "title-analysis"],
  assignmentsUpcoming: ["referencing-quiz", "academic-writing-quiz"],
  lessons: [lesson2_1, lesson2_2],
  classRundown: [
    {
      time: "Hour 1",
      title: "Structure of Conceptual Research Papers",
      description: "Understanding how conceptual papers differ from empirical papers and locating the thesis",
      activities: [
        "Recap: Empirical (IMRaD) vs. Conceptual (argument-driven) structures",
        "Skim Article B: Is it empirical or conceptual? Explain with reasons",
        "Find the PURPOSE statement: What words give you the clue?",
        "'This article contends...', 'we seek to problematise...' - thesis signals",
        "The thesis appears at the END of the Introduction",
        "Compare: Article A (empirical, supports FRT) vs Article B (conceptual, challenges FRT)"
      ]
    },
    {
      time: "Hour 2",
      title: "Analyzing Arguments & Supporting Reasons",
      description: "Deep dive into how conceptual papers build arguments through reasoning and evidence",
      activities: [
        "Find the CENTRAL ARGUMENT: 'schools should not be places where...'",
        "Identify TWO supporting reasons from 'Challenging the take-up of FRT in schools'",
        "Reason 1: Facially focused schooling is dehumanizing",
        "Reason 2: Students' gender and race will be foregrounded",
        "Body paragraph structure: Point + Evidence/Explanation pattern",
        "Preview: APA 7th citations - In-text and End-of-text"
      ]
    }
  ]
};

export const week2Meta: WeekMeta = {
  dateRange: "19-23 Jan 2026",
  assignmentTagline: "Preparing for AWQ (15%) in Week 5",
  assignmentIds: [],
};
