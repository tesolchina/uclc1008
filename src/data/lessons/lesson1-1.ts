import { Lesson } from "../types";

export const lesson1_1: Lesson = {
  id: 1,
  title: "Empirical vs. Conceptual Articles",
  examples: [
    {
      title: "Empirical Article Example",
      text: "Hong et al. (2022) - 'Supporting schools to use face recognition systems: a continuance intention perspective of elementary school parents in China'. This study reports original research with data collection (380 valid responses) and analysis (SEM modeling)."
    },
    {
      title: "Conceptual Article Example",
      text: "Andrejevic and Selwyn (2020) - 'Facial recognition technology in schools: critical questions and concerns'. This paper develops an argument-driven critique of monitoring and surveillance without conducting new empirical research."
    }
  ],
  notes: [
    "Academic journal articles are peer-reviewed scholarly publications. There are two broad types: empirical and conceptual.",
    "Empirical articles report on original research and data collection, typically following the IMRaD format (Introduction, Methods, Results, Discussion).",
    "Conceptual articles advance an argument, propose a new theory, or critique existing ideas through logic and synthesis of literature.",
    "Shared features include Title, Abstract, Introduction (context), Conclusion (summary), and Reference List.",
    "Primary evidence: Empirical uses data/statistics; Conceptual uses logic/reasoning."
  ],
  questions: [
    {
      question: "Which feature is typical of an empirical article but NOT a conceptual article?",
      type: "multiple-choice",
      options: [
        "A Reference List",
        "A structured Methods section describing data collection",
        "A Conclusion summarizing main points",
        "An Introduction providing background"
      ],
      answer: "A structured Methods section describing data collection",
      explanation: "Empirical articles report on original research and must describe their methods."
    },
    {
      question: "What is the primary evidence used in conceptual articles?",
      type: "multiple-choice",
      options: [
        "Statistics and measurements",
        "Logic, reasoning, and synthesis of existing literature",
        "Original survey data",
        "Laboratory experiment results"
      ],
      answer: "Logic, reasoning, and synthesis of existing literature",
      explanation: "Conceptual articles focus on discussion of ideas and arguments rather than data analysis."
    }
  ]
};
