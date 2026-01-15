import { Assignment } from "../types";

export const referencingQuiz: Assignment = {
  id: "referencing-quiz",
  title: "Referencing Quiz",
  weight: "2.5%",
  dueWeek: 3,
  type: "online",
  description: "Watch two short videos on APA 7th citation style and complete the quiz. You have only ONE attempt.",
  requirements: [
    "Watch Video 1: Citing Journal Articles in APA 7th Style",
    "Watch Video 2: Citing Secondary Sources in APA 7th Style",
    "Complete the quiz on Moodle (one attempt only)",
    "Review both videos thoroughly before attempting",
  ],
  skillsAssessed: ["citation-recognition", "apa-referencing", "secondary-citations"],
  resources: [
    { title: "Video 1: Citing Journal Articles in APA 7th Style (link coming soon)", url: "#" },
    { title: "Video 2: Citing Secondary Sources in APA 7th Style (link coming soon)", url: "#" },
  ],
  detailedInfo: {
    exactDueDate: "30 January 2026, 6:00 PM",
    submissionMethod: "Moodle Online Quiz",
    format: "Online multiple-choice/short answer quiz",
    timeLimit: "To be announced on Moodle",
    gradingCriteria: [
      "Correct identification of APA 7th citation elements",
      "Proper formatting of in-text citations",
      "Understanding of secondary citation usage",
      "Recognition of reference list formatting",
    ],
    instructions: [
      "Watch both flipped classroom videos before attempting the quiz",
      "You have ONLY ONE attempt at this quiz",
      "Complete the quiz on Moodle by the deadline",
      "NO LATE SUBMISSION ALLOWED",
    ],
    aiPolicy: [
      "This is an individual assessment - no collaboration allowed",
      "Use only the provided video resources for preparation",
    ],
    latePolicy: "NO LATE SUBMISSION ALLOWED. Quizzes cannot be submitted after the deadline.",
  },
};

