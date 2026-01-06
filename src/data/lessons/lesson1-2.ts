import { Lesson } from "../types";

export const lesson1_2: Lesson = {
  id: 2,
  title: "Analyzing Titles and Abstracts",
  examples: [
    {
      title: "Title Analysis: Hong et al. (2022)",
      text: "Subject Matter: Face recognition systems; Context: Elementary school parents in China; Stance: Support ('Supporting')."
    }
  ],
  notes: [
    "A title identifies Subject Matter (broad topic), Context (specific focus), and Purpose/Stance (e.g., support, promote, reject, doubt).",
    "An abstract is a self-contained summary. Empirical abstracts include: Background, Purpose, Methods, Results, and Implications.",
    "Conceptual abstracts focus on: Theoretical problem/gap, Author's argument/interpretation, and Analytical approach.",
    "Signaling phrases like 'Significant differences were observed' (Results) or 'This research implies' (Implications) help navigate abstracts."
  ],
  questions: [
    {
      question: "In the title 'Facial recognition technology in schools: Critical questions and concerns', what is the author's stance?",
      type: "multiple-choice",
      options: ["Support", "Promote", "Doubt", "Discuss"],
      answer: "Doubt",
      explanation: "Words like 'critical questions' and 'concerns' signal a stance of doubt or challenge."
    }
  ]
};
