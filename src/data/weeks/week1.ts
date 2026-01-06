import { WeekData, WeekMeta } from "../types";
import { lesson1_1, lesson1_2, lesson1_3 } from "../lessons";

export const week1: WeekData = {
  id: 1,
  title: "Week 1",
  theme: "Introduction to Academic Journal Articles",
  overview:
    "This week introduces you to the basic structure of academic journal articles (empirical vs. conceptual) and the fundamental skills for reading them effectively.",
  inClassActivities: [
    "Course Introduction (0.5 hr)",
    "Module 1: Part 1 - Introduction to Academic Journal Articles",
    "Module 1: Part 2 - How to Read and Select Main Ideas (Activities 2.1, 2.2)",
    "Flipped Classroom Videos: Citations and Reference Lists",
  ],
  learningOutcomes: [
    "Differentiate between empirical and conceptual journal articles.",
    "Analyze journal article titles and abstracts for subject, context, and stance.",
    "Locate and analyze topic sentences and concluding sentences in academic texts.",
    "Understand the rhetorical functions and basic rules of in-text citations (APA 7th).",
  ],
  resources: [
    {
      title: "Module 1: Components of Academic Journal Articles (Parts 1-4)",
      type: "reading",
      duration: "45 min",
    },
    {
      title: "Flipped video 1: Citing Journal Articles in APA 7th Style",
      type: "video",
      duration: "12 min",
      url: "https://www.youtube.com/watch?v=JpT1YwNcV04",
    },
    {
      title: "Flipped video 2: Citing Secondary Sources in APA 7th Style",
      type: "video",
      duration: "10 min",
      url: "https://www.youtube.com/watch?v=qB6eFDNyz0E",
    },
  ],
  practiceTasks: [
    "Read the first section of a provided journal article and label its main components (abstract, introduction, etc.).",
    "Analyze a given title and abstract using the step-by-step guide in Module 1.",
    "Practice secondary citations using the exercises in Part 4 of Module 1.",
  ],
  aiPromptHint:
    "You help first-year students understand the structure of academic journal articles, specifically the differences between empirical and conceptual papers, and how to analyze titles and abstracts.",
  skillsIntroduced: ["journal-structure", "citation-recognition", "secondary-citations"],
  skillsReinforced: [],
  assignmentsUpcoming: ["pre-course-writing", "referencing-quiz"],
  lessons: [lesson1_1, lesson1_2, lesson1_3],
};

export const week1Meta: WeekMeta = {
  dateRange: "12-16 Jan 2026",
  assignmentTagline: "Classes begin on 12 Jan - No assessments due this week",
  assignmentIds: [],
};
