import { WeekData, WeekMeta, ClassRundownItem } from "../types";
import { lesson1_1, lesson1_2, lesson1_3 } from "../lessons";

export const week1: WeekData = {
  id: 1,
  title: "Week 1",
  theme: "Components of Academic Journal Articles",
  overview:
    "This week introduces the structure and components of academic journal articles. You'll learn to distinguish between empirical and conceptual papers, master the art of skimming and scanning, and understand the IMRaD structure that organizes empirical research.",
  inClassActivities: [
    "Course Introduction & Module 1 Overview",
    "Academic Reading: Skimming & Scanning techniques",
    "Structure of Empirical Research Papers (IMRaD)",
    "Analyzing Article A (Hong et al., 2022) - an empirical study",
    "Pre-course Writing preparation",
  ],
  learningOutcomes: [
    "Understand the structure of academic journal articles and identify key components (Abstract, Introduction, Methods, Results, Discussion).",
    "Differentiate between empirical research papers (data-driven, IMRaD structure) and conceptual papers (argument-driven).",
    "Apply skimming (reading quickly for overview) and scanning (finding specific information) strategies to academic texts.",
    "Analyze article titles to predict Subject Matter, Context, and Author Stance.",
    "Locate the gist and purpose statement in an abstract.",
  ],
  resources: [
    {
      title: "Module 1: Components of Academic Journal Articles (Parts 1-4)",
      type: "reading",
      duration: "45 min",
    },
    {
      title: "Article A: Hong et al. (2022) - Supporting FRT in Elementary Schools",
      type: "reading",
      duration: "30 min",
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
    "Skim Article A and summarize its gist in one sentence. Where can you find the gist?",
    "Identify whether Article A is empirical or conceptual. How did you know?",
    "List the main sections in Article A and map them to the IMRaD structure.",
    "Scan Article A to find: (1) sample size, (2) data collection instrument, (3) a statistically significant result.",
  ],
  aiPromptHint:
    "You help first-year students understand the structure of academic journal articles, specifically the IMRaD structure for empirical papers and how to skim/scan effectively. Focus on Hong et al. (2022) as the main example.",
  skillsIntroduced: ["skimming", "scanning", "imrad-structure", "title-analysis", "abstract-reading"],
  skillsReinforced: [],
  assignmentsDue: [],
  assignmentsUpcoming: ["pre-course-writing", "referencing-quiz"],
  lessons: [lesson1_1, lesson1_2, lesson1_3],
  classRundown: [
    {
      time: "Hour 1",
      title: "Course Introduction & Academic Reading Foundations",
      description: "Introduction to UE1 course structure and the fundamentals of reading academic journal articles",
      activities: [
        "Course overview: learning outcomes, 8 assessments, and schedule",
        "Key assessments preview: AWQ (15%), ACE (15% + 20%), CRAA (20%)",
        "Introduction to academic journal articles vs. non-academic sources",
        "Skimming and Scanning: Watch video and discuss techniques",
        "Practice skimming Article A (Hong et al., 2022)"
      ]
    },
    {
      time: "Hour 2",
      title: "Structure of Empirical Research Papers (IMRaD)",
      description: "Deep dive into the IMRaD structure and how to navigate empirical articles efficiently",
      activities: [
        "IMRaD explained: Introduction, Methods, Results, and Discussion",
        "Activity 1.2: Scanning practice with Article A",
        "Find sample size (380 participants), data collection instrument (5-point Likert scale)",
        "Locate statistically significant results (p<.001)",
        "Identify limitations and future research suggestions",
        "Preview: Pre-course Writing due 23 Jan - summary & argumentation tasks"
      ],
      assignmentLink: "/week/1/assignment/pre-course-writing"
    }
  ]
};

export const week1Meta: WeekMeta = {
  dateRange: "12-16 Jan 2026",
  assignmentTagline: "Pre-course Writing (2.5%) due 23 Jan, 6pm",
  assignmentIds: ["pre-course-writing"],
};
