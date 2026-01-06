import { Lesson } from "../types";

export const lesson3_2: Lesson = {
  id: 2,
  title: "APA 7th Reference List",
  examples: [],
  notes: [
    "The reference list provides full details: Who, When, What, Where.",
    "Journal Article: Author last name, initials. (Year). Title. Journal, Vol(Issue), Pages. https://doi.org...",
    "Reference lists must be in alphabetical order by first author's last name.",
    "Use a hanging indent (0.5 inch / 1.27cm) for all lines after the first in each entry.",
    "If using a secondary source, only include the source you actually read in your reference list."
  ],
  questions: [
    {
      question: "Which of the following is the correct format for an APA journal article title in a reference list?",
      type: "multiple-choice",
      options: [
        "Everything in Title Case (Capitalize All Words)",
        "sentence case (only capitalize first word and proper nouns)",
        "ALL CAPS",
        "Italicized words"
      ],
      answer: "sentence case (only capitalize first word and proper nouns)",
      explanation: "APA style uses sentence case for article titles and book titles in the reference list."
    }
  ]
};
