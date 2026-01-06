import { Lesson } from "../types";

export const lesson4_2: Lesson = {
  id: 2,
  title: "AI Workshop: Precision and Ethics",
  examples: [],
  notes: [
    "Uses of GenAI: Brainstorming outlines, improving grammar/style, clarifying technical terms.",
    "Limitations: AI can 'hallucinate' facts or citations, may have biased training data.",
    "Ethical Rules: Ensure core content is original. Significant rewording and restructuring is required for AI output.",
    "Human Judgement: You must critically review and modify every output. AI is a tool, not an author.",
    "Verification: Always verify referenced sources to ensure authenticity."
  ],
  questions: [
    {
      question: "What is the primary principle for avoiding plagiarism when using Gen-AI tools?",
      type: "multiple-choice",
      options: [
        "Always use the very first response AI gives",
        "Originality: The more effort you put into drafting, the less likely plagiarism occurs",
        "Never tell anyone you used AI",
        "AI outputs are common knowledge and don't need citation"
      ],
      answer: "Originality: The more effort you put into drafting, the less likely plagiarism occurs",
      explanation: "In UE1, AI is a partner, but the final work must reflect your own critical thinking and drafting effort."
    }
  ]
};
