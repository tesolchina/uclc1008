import { WeekData, WeekMeta } from "../types";

export const week2: WeekData = {
  id: 2,
  title: "Week 2",
  theme: "Summarising, Paraphrasing & Synthesising Skills",
  overview:
    "Explore the fundamental skills of academic writing: expressing ideas in your own words while maintaining integrity.",
  inClassActivities: [
    "Module 1: Part 2 - Step 3 (Section Headings) & Step 4 (Topic Sentences)",
    "Module 2: Part 1 - Paraphrasing Skills (Activities 1.1-1.3)",
    "Flipped Classroom Video: AI Literacy (Authenticity)",
  ],
  learningOutcomes: [
    "Identify and analyze topic sentences and concluding sentences in academic texts.",
    "Apply paraphrasing strategies (synonyms, word forms, voice, patterns).",
    "Understand how to use AI tools ethically for academic writing.",
    "Complete the Pre-course Writing assessment.",
  ],
  resources: [
    {
      title: "Module 2: Paraphrasing, Summarising & Synthesising Skills (Part 1)",
      type: "reading",
      duration: "30 min",
    },
    {
      title: "Flipped video: AI Literacy (Authenticity)",
      type: "video",
      duration: "10 min",
      url: "https://www.youtube.com/watch?v=6uhUqUG4-Vo",
    },
  ],
  practiceTasks: [
    "Complete Activity 1.3: Practising Paraphrasing Strategies in Module 2.",
    "Draft your Pre-course Writing task focusing on original wording.",
    "Use Gen-AI to brainstorm ideas but ensure final drafting is independent.",
  ],
  aiPromptHint:
    "You help students practice paraphrasing by evaluating their drafts against original texts to ensure they are not too close (avoiding 'patchwriting').",
  skillsIntroduced: ["paraphrasing", "topic-sentences", "ai-authenticity"],
  skillsReinforced: ["journal-structure", "citation-recognition"],
  assignmentsDue: ["pre-course-writing"],
  assignmentsUpcoming: ["referencing-quiz"],
  lessons: [
    {
      id: 1,
      title: "Reading Signposts: Topic and Concluding Sentences",
      notes: [
        "Academic papers are built on arguments. Topic sentences and concluding sentences are 'signposts' guiding you through the logic.",
        "A Purpose Statement expresses the central argument and is usually found at the end of the Introduction.",
        "A Topic Sentence contains the main idea of a single body paragraph. It should connect back to the purpose statement.",
        "When reading: Distinguish between authors' claims (supporting their stance) and opponents' claims (counterarguments).",
        "Distinguish evidence/data from claims. Data supports the claim but doesn't speak for the stance on its own."
      ],
      questions: [
        {
          question: "Where is a purpose statement usually located in an academic article?",
          type: "multiple-choice",
          options: [
            "In the Abstract",
            "Towards the end of the Introduction",
            "In the Methodology section",
            "At the very beginning of the Reference List"
          ],
          answer: "Towards the end of the Introduction",
          explanation: "The purpose statement sets up the central argument that the rest of the paper will support."
        }
      ]
    },
    {
      id: 2,
      title: "Effective Paraphrasing",
      notes: [
        "Paraphrasing means expressing a borrowed idea using different words while preserving the original meaning.",
        "Strategies include: 1) Using synonyms, 2) Changing word forms (e.g., verb to noun), 3) Changing voice (active to passive), 4) Changing sentence patterns.",
        "Avoid 'patchwriting' – making minor changes that stay too close to the original structure.",
        "Always use proper in-text citations even when you have paraphrased in your own words.",
        "Gen-AI principles: The more effort you put into drafting, the less likely plagiarism will occur. AI is a tool, not an author."
      ],
      questions: [
        {
          question: "Which of the following is NOT a valid paraphrasing strategy?",
          type: "multiple-choice",
          options: [
            "Using synonyms for key vocabulary",
            "Changing the word form (e.g., from 'analyze' to 'analysis')",
            "Copying the sentence and changing only the last word",
            "Changing the sentence from active to passive voice"
          ],
          answer: "Copying the sentence and changing only the last word",
          explanation: "Making only minor changes is considered patchwriting and can still lead to plagiarism."
        }
      ]
    }
  ]
};

export const week2Meta: WeekMeta = {
  dateRange: "19-23 Jan 2026",
  assignmentTagline: "Pre-course Writing (2.5%) due 23 Jan, 6pm",
  assignmentIds: ["pre-course-writing"],
};
