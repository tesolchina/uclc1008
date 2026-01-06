import { WeekData, WeekMeta } from "../types";
import { lesson6_1, lesson6_2 } from "../lessons";

export const week6: WeekData = {
  id: 6,
  title: "Week 6",
  theme: "Academic Writing Quiz (AWQ) & Intro to Argumentation",
  overview:
    "Complete the in-class Academic Writing Quiz (15%) and begin exploring how academic arguments are constructed using the ACE framework.",
  inClassActivities: [
    "In-class Academic Writing Quiz (15%) [50 minutes]",
    "Introduction to Module 3: Argument Construction and Evaluation (ACE)",
    "The Toulmin Model: Claims, Evidence, and Warrants",
  ],
  learningOutcomes: [
    "Successfully complete a timed synthetic summary under exam conditions.",
    "Identify the three core parts of an argument: Claim, Evidence, and Warrant.",
    "Distinguish between debatable claims and statements of fact.",
  ],
  resources: [
    {
      title: "Module 3: Argumentation Model (Introduction)",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Video: Understanding Claims, Evidence, and Warrants",
      type: "video",
      duration: "12 min",
      url: "https://www.youtube.com/watch?v=17XvT8V8nSg",
    },
  ],
  practiceTasks: [
    "Reflect on your AWQ performance: which skills (paraphrasing, synthesis, tone) were most challenging?",
    "Identify one debatable claim from a provided news article or short text.",
    "Match evidence to a specific claim in the ACE introductory worksheet.",
  ],
  aiPromptHint:
    "You help students transition from summary (AWQ) to argument construction (ACE) by helping them brainstorm debatable claims on given topics.",
  skillsIntroduced: ["argument-identification", "claims-vs-facts", "toulmin-model"],
  skillsReinforced: ["academic-tone", "apa-referencing"],
  assignmentsDue: ["academic-writing-quiz"],
  assignmentsUpcoming: ["ace-draft"],
  lessons: [lesson6_1, lesson6_2],
};

export const week6Meta: WeekMeta = {
  dateRange: "23-27 Feb 2026",
  assignmentTagline: "Academic Writing Quiz (15%) in-class this week",
  assignmentIds: ["academic-writing-quiz"],
};
