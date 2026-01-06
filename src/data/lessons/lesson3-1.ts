import { Lesson } from "../types";

export const lesson3_1: Lesson = {
  id: 1,
  title: "The Art of Summarising",
  examples: [],
  notes: [
    "Summarising means condensing a larger piece of writing into a shorter version while capturing main ideas.",
    "Steps: 1) Read thoroughly, 2) Identify key points, 3) Eliminate extraneous info, 4) Use your own words, 5) Maintain original tone.",
    "When summarising an article, focus on sections like Abstract, Intro, and Conclusion.",
    "Summaries must be objective – do not add your own views or interpretation.",
    "Proportionality: Devote more space to central claims than to supporting examples."
  ],
  questions: [
    {
      question: "A good summary should be roughly what length compared to the original?",
      type: "multiple-choice",
      options: [
        "Exactly the same length",
        "Significantly shorter (e.g., 1/3 or 1/4)",
        "Slightly longer for clarity",
        "It doesn't matter"
      ],
      answer: "Significantly shorter (e.g., 1/3 or 1/4)",
      explanation: "Summaries focus on main points and omit detail, naturally leading to a shorter text."
    }
  ]
};
