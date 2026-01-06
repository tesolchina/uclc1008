import { Lesson } from "../types";

export const lesson1_3: Lesson = {
  id: 3,
  title: "Citations and Academic Integrity",
  examples: [
    {
      title: "Author-Prominent Citation",
      text: "Wang and Teo (2020) argued that information quality..."
    },
    {
      title: "Information-Prominent Citation",
      text: "Moreover, perceived value was found to significantly affect users' intentions (Li et al., 2018; Wang, 2014)."
    }
  ],
  notes: [
    "In-text citations acknowledge sources in the body (who and when). The reference list provides full details at the end (who, when, what, where).",
    "APA 7th edition is required. Basic rules: Last name and year; Use 'and' for two authors in narrative, '&' in parenthetical.",
    "Author-prominent citations highlight authority; Information-prominent citations prioritize evidence.",
    "Secondary citations: cite a source found within another work only if the original is inaccessible. Format: (Primary Author, Year, as cited in Secondary Author, Year).",
    "Plagiarism includes directly copying ideas/words without acknowledgement, translating without citation, and using Gen-AI output without acknowledgement."
  ],
  questions: [
    {
      question: "What is the correct parenthetical citation for two authors in APA 7th style?",
      type: "multiple-choice",
      options: [
        "Singh and Sinha (2020)",
        "(Singh and Sinha, 2020)",
        "(Singh & Sinha, 2020)",
        "Singh & Sinha (2020)"
      ],
      answer: "(Singh & Sinha, 2020)",
      explanation: "In parentheses, use the ampersand (&) between authors."
    },
    {
      question: "When citing three or more authors, what is the correct format for the first citation?",
      type: "multiple-choice",
      options: [
        "Moon, Smith, and Jones (2020)",
        "Moon et al. (2020)",
        "(Moon, Smith, Jones, 2020)",
        "Moon and others (2020)"
      ],
      answer: "Moon et al. (2020)",
      explanation: "In APA 7th, use 'et al.' for three or more authors from the first citation."
    }
  ]
};
