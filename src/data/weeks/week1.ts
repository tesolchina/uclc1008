import { WeekData, WeekMeta } from "../types";

export const week1: WeekData = {
  id: 1,
  title: "Week 1",
  theme: "Introduction to Academic Journal Articles",
  overview:
    "This week introduces you to the basic structure of academic journal articles and the course requirements. You will learn how to identify key components of academic texts and understand different citation styles.",
  inClassActivities: [
    "Course orientation and syllabus overview",
    "Module 1: Activities 1.1, 1.2, 2.1",
    "Introduction to academic journal article structure",
  ],
  learningOutcomes: [
    "Understand the course structure and assessment requirements.",
    "Identify the main components of an academic journal article.",
    "Distinguish between empirical and conceptual articles.",
    "Recognise in-text citations and reference list formats.",
  ],
  resources: [
    {
      title: "Module 1: Components of academic journal articles (Part 1)",
      type: "reading",
      duration: "20 min",
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
    "Explore the course Moodle page and identify where each assessment is located.",
    "Read the first section of a provided journal article and label its main components (abstract, introduction, etc.).",
    "Open the AI tutor and ask a simple question about what makes a source 'academic'.",
  ],
  aiPromptHint:
    "You help first-year students understand the UCLC1008 course structure and the basic components of academic journal articles and citations.",
  skillsIntroduced: ["journal-structure", "citation-recognition", "secondary-citations"],
  skillsReinforced: [],
  assignmentsUpcoming: ["pre-course-writing", "referencing-quiz"],
};

export const week1Meta: WeekMeta = {
  dateRange: "13-17 Jan 2026",
  assignmentTagline: "No assessments due – course orientation week",
  assignmentIds: [],
};
