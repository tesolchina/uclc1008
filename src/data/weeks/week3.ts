import { WeekData, WeekMeta } from "../types";

export const week3: WeekData = {
  id: 3,
  title: "Week 3",
  theme: "Summarising Skills & Referencing",
  overview:
    "Learn how to condense academic articles while maintaining correct APA 7th edition referencing.",
  inClassActivities: [
    "Module 2: Part 2 - Summarising Skills (Activities 2.1, 2.2)",
    "Module 1: Part 4 - End-of-text Citations & Reference List (Activity 5.3)",
    "Referencing Quiz Preparation",
  ],
  learningOutcomes: [
    "Summarize academic passages accurately and concisely.",
    "Follow steps for summarizing: read thoroughly, identify key points, eliminate extraneous info, use own words.",
    "Format end-of-text citations for journals, books, and book chapters (APA 7th).",
    "Complete the Referencing Quiz assessment.",
  ],
  resources: [
    {
      title: "Module 2: Summarising Skills (Part 2)",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "Module 1: End-of-text References (Part 4)",
      type: "reading",
      duration: "15 min",
    },
  ],
  practiceTasks: [
    "Complete Activity 2.2: Summarising Arguments from an Article in Module 2.",
    "Compile a mini reference list of 3 sources in correct APA 7th format.",
    "Practice using hanging indents in your reference list draft.",
  ],
  aiPromptHint:
    "You help students evaluate their summaries for accuracy and neutrality, ensuring they haven't added personal bias or missed key research findings.",
  skillsIntroduced: ["summarising", "end-of-text-referencing", "hanging-indents"],
  skillsReinforced: ["paraphrasing", "citation-recognition"],
  assignmentsDue: ["referencing-quiz"],
  assignmentsUpcoming: [],
  lessons: [
    {
      id: 1,
      title: "The Art of Summarising",
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
    },
    {
      id: 2,
      title: "APA 7th Reference List",
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
    }
  ]
};

export const week3Meta: WeekMeta = {
  dateRange: "26-30 Jan 2026",
  assignmentTagline: "Referencing Quiz (2.5%) due 30 Jan, 6pm",
  assignmentIds: ["referencing-quiz"],
};
