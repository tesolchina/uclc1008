import { WeekData, WeekMeta } from "../types";

export const week5: WeekData = {
  id: 5,
  title: "Week 5",
  theme: "Academic Writing Quiz (AWQ) Preparation",
  overview:
    "Consolidate your skills in analyzing journal article excerpts and structuring a synthetic summary in preparation for the Academic Writing Quiz.",
  inClassActivities: [
    "AWQ Study Guide Part 1: How to Read and Select Main Ideas",
    "AWQ Study Guide Part 2: How to Structure Your Summary",
    "Practice: Analyzing Article A and Article B excerpts",
    "Writing Drill: Drafting a thesis statement and body paragraph synthesis",
  ],
  learningOutcomes: [
    "Predict an author's stance from article titles and abstracts.",
    "Identify key findings and arguments while omitting detailed evidence/methods for a summary.",
    "Structure a 300-word summary with an introduction, synthesized body paragraph, and conclusion.",
    "Use appropriate academic expressions for contrasting views (e.g., 'Conversely', 'challenged by').",
  ],
  resources: [
    {
      title: "Study Guide to Academic Writing Quiz (AWQ)",
      type: "reading",
      duration: "30 min",
    },
    {
      title: "Sample Academic Writing Quiz (Question & Answer)",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Analyze the title and abstract of Article A and B in the Study Guide.",
    "Write a practice introduction paragraph including background and a thesis statement for the AWQ topic.",
    "Use the AI tutor to evaluate your synthesized topic sentence for Paragraph 2.",
  ],
  aiPromptHint:
    "You help students practice for the AWQ by reviewing their analysis of article excerpts and checking their summary structure (Introduction, Body Synthesis, Conclusion).",
  skillsIntroduced: ["synthesis-structure", "stance-prediction"],
  skillsReinforced: ["summarising", "paraphrasing", "apa-referencing", "topic-sentences"],
  assignmentsUpcoming: ["academic-writing-quiz"],
  lessons: [
    {
      id: 1,
      title: "Analyzing Journal Excerpts for AWQ",
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
    },
    {
      id: 2,
      title: "Structuring the Synthetic Summary",
      notes: [
        "Paragraph 1 (Intro): Contextualize the background (e.g., expansion of FRT) and provide a Thesis Statement that previews the common/contrasting arguments.",
        "Paragraph 2 (Body): Use a Topic Sentence to introduce a shared theme (e.g., moral debate). Synthesize by grouping similar arguments from different authors.",
        "Body Paragraph Detail: Focus on Claims and Explanations. Use contrastive connectives (e.g., 'Conversely', 'However') when authors disagree.",
        "Paragraph 3 (Conclusion): Recap the key findings or arguments from both excerpts without introducing new information.",
        "Word Limit: The summary must be no more than 300 words. Be concise and prioritize high-level arguments."
      ],
      questions: [
        {
          question: "In the Body Paragraph (Paragraph 2), what is the best way to synthesize multiple authors?",
          type: "multiple-choice",
          options: [
            "Summarize Article A completely, then summarize Article B completely",
            "Group similar arguments from different authors under a shared theme or aspect",
            "Only mention the author you agree with",
            "Write one sentence for every paragraph in the original articles"
          ],
          answer: "Group similar arguments from different authors under a shared theme or aspect",
          explanation: "Synthesis involves finding connections and grouping ideas together to show the 'big picture' of the debate."
        },
        {
          question: "True or False: You should include your own personal opinion on FRT in the AWQ summary.",
          type: "true-false",
          answer: "False",
          explanation: "The AWQ is an objective summary task; you must report the authors' views, not your own."
        }
      ]
    }
  ]
};

export const week5Meta: WeekMeta = {
  dateRange: "9-13 Feb 2026",
  assignmentTagline: "Final AWQ Prep - Review Study Guide and Sample Quiz",
  assignmentIds: [],
};
