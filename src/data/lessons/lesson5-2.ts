import { Lesson } from "../types";

export const lesson5_2: Lesson = {
  id: 2,
  title: "Structuring the Synthetic Summary",
  examples: [],
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
};
