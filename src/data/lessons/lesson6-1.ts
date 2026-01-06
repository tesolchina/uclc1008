import { Lesson } from "../types";

export const lesson6_1: Lesson = {
  id: 1,
  title: "The ACE Framework: Claim, Evidence, Warrant",
  examples: [],
  notes: [
    "ACE stands for Argument Construction and Evaluation. It is adapted from the Toulmin Model of argumentation.",
    "Claim: A clear, specific, and debatable statement that you want the audience to accept.",
    "Evidence: Credible data, facts, statistics, or expert opinions that support your claim.",
    "Warrant: The reasoning that connects the evidence to the claim. It explains *how* or *why* the data proves your point.",
    "Backing: Additional support for the warrant (e.g., a shared value or a more general principle)."
  ],
  questions: [
    {
      question: "Which of the following is a DEBATABLE claim suitable for academic writing?",
      type: "multiple-choice",
      options: [
        "Hong Kong is located in southern China.",
        "Facial recognition technology is used in some secondary schools.",
        "Universities should strictly regulate the use of AI tools in all writing assignments.",
        "Water boils at 100 degrees Celsius at sea level."
      ],
      answer: "Universities should strictly regulate the use of AI tools in all writing assignments.",
      explanation: "This is a position that reasonable people could disagree with, whereas the others are statements of fact or observation."
    }
  ]
};
