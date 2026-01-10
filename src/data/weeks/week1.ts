import { WeekData, WeekMeta, ClassRundownItem } from "../types";
import { lesson1_1, lesson1_2, lesson1_3 } from "../lessons";

export const week1: WeekData = {
  id: 1,
  title: "Week 1",
  theme: "Introduction to Academic Journal Articles",
  overview:
    "This week introduces you to the basic structure of academic journal articles (empirical vs. conceptual) and the fundamental skills for reading them effectively.",
  inClassActivities: [
    "Pre-course Writing Test (1 hr)",
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
  assignmentsDue: ["pre-course-writing"],
  assignmentsUpcoming: ["referencing-quiz"],
  lessons: [lesson1_1, lesson1_2, lesson1_3],
  classRundown: [
    {
      time: "Hour 1",
      title: "Pre-course Writing Test",
      description: "Introduction to Task 1 (Summary) and Task 2 (Essay) - Complete in class",
      activities: [
        "Read the article excerpt from Andrejevic & Selwyn (2020) on facial recognition in schools",
        "Complete Task 1: Write a 300-word summary of the article (no personal views)",
        "Complete Task 2: Write a 300-word argumentative essay on whether schools should adopt facial recognition",
        "Use APA in-text citations (7th edition) where needed"
      ],
      assignmentLink: "/week/1/assignment/pre-course-writing"
    },
    {
      time: "Hour 2",
      title: "Course Introduction & Module 1 Overview",
      description: "Overview of UE1 course structure, expectations, and introduction to academic journal articles",
      activities: [
        "Course overview: learning outcomes, assessments, and schedule",
        "Introduction to academic journal articles (empirical vs. conceptual)",
        "Understanding article structure: abstract, introduction, methods, results, discussion",
        "Preview of flipped classroom videos on APA citations"
      ]
    }
  ]
};

export const week1Meta: WeekMeta = {
  dateRange: "12-16 Jan 2026",
  assignmentTagline: "Pre-course Writing (2.5%) due 23 Jan, 6pm",
  assignmentIds: ["pre-course-writing"],
};
