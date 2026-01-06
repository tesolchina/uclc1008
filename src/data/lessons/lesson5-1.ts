import { Lesson } from "../types";

export const lesson5_1: Lesson = {
  id: 1,
  title: "Analyzing Journal Excerpts for AWQ",
  examples: [],
  notes: [
    "Step 1: Analyze the Title. Identify Subject Matter, Context, and Predict Stance (Support, Promote, Reject, Doubt, Challenge).",
    "Step 2: Study the Abstract. Relate background to context; locate the Purpose Statement for stance; skip methods; focus on key findings/arguments.",
    "Step 3: Examine Headings. Connect headings to the paper's context and stance to see how the argument is structured.",
    "Step 4: Identify TS and Concluding Sentences. Relate these to key arguments and distinguish between author's claims and opponent's claims.",
    "Critical Skill: Omit detailed data/evidence. In the AWQ summary, focus on the claims and explanations, not the specific statistics."
  ],
  questions: [
    {
      question: "Which component should you usually SKIP when reading an empirical paper for the purpose of the AWQ summary?",
      type: "multiple-choice",
      options: [
        "Purpose Statement",
        "Methodological Details",
        "Key Findings",
        "Implications"
      ],
      answer: "Methodological Details",
      explanation: "The AWQ summary focuses on claims and arguments; detailed methods (like sample size or statistical tests) are usually too specific for a 300-word summary."
    },
    {
      question: "What is the primary goal of analyzing the 'Stance' in a title?",
      type: "multiple-choice",
      options: [
        "To count how many authors wrote the paper",
        "To understand the author's position (e.g., support or doubt) on the topic",
        "To find the page number of the conclusion",
        "To check if the paper uses APA style"
      ],
      answer: "To understand the author's position (e.g., support or doubt) on the topic",
      explanation: "The stance tells you whether the author endorses, promotes, or challenges the specific idea or technology."
    }
  ]
};
