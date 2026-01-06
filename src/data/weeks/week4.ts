import { WeekData, WeekMeta } from "../types";

export const week4: WeekData = {
  id: 4,
  title: "Week 4",
  theme: "Synthesising Skills & AI Workshop 1",
  overview:
    "Master the skill of combining multiple sources and explore the ethical boundaries of AI in academic work.",
  inClassActivities: [
    "Module 2: Part 3 - Synthesising Skills (Activities 3.1, 3.2)",
    "AI Workshop 1: Precision in Reading & Writing and Ethical Considerations",
  ],
  learningOutcomes: [
    "Identify common themes, contradictions, and connections between multiple sources.",
    "Combine information from more than one source into a short synthetic paragraph.",
    "Apply effective prompts for using Gen-AI as a learning partner.",
    "Critically evaluate Gen-AI capabilities and limitations.",
  ],
  resources: [
    {
      title: "Module 2: Synthesising Skills (Part 3)",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "AI Workshop: Uses and Limitations of GenAI",
      type: "reading",
      duration: "15 min",
    },
  ],
  practiceTasks: [
    "Write a 150-word synthesis of two sources with opposing views on remote work.",
    "Experiment with 'Phased Reading Prompts' in AI Workshop 1.",
    "Document one instance where Gen-AI provided incorrect or biased information.",
  ],
  aiPromptHint:
    "You help students synthesize ideas by identifying relationships like 'consensus,' 'contrast,' or 'elaboration' between two or more academic texts.",
  skillsIntroduced: ["synthesising", "ai-literacy", "critical-prompting"],
  skillsReinforced: ["summarising", "paraphrasing", "apa-referencing"],
  assignmentsDue: [],
  assignmentsUpcoming: ["academic-writing-quiz"],
  lessons: [
    {
      id: 1,
      title: "Synthesising Multiple Sources",
      notes: [
        "Synthesising means combining ideas from multiple sources to create a new, broader understanding.",
        "Unlike summary (one source), synthesis shows how different works relate to each other.",
        "Key relationships: 1) Consensus (agreement), 2) Contrast (disagreement), 3) Hierarchy (one idea supports another).",
        "Use reporting verbs to show relationships: 'While Author A claims X, Author B argues Y.'",
        "Synthesis creates value beyond individual sources by showing patterns or gaps in knowledge."
      ],
      questions: [
        {
          question: "Which of these is a key difference between summary and synthesis?",
          type: "multiple-choice",
          options: [
            "Summary is always longer than synthesis",
            "Synthesis combines ideas from multiple sources; summary focuses on one",
            "Summary uses citations, synthesis does not",
            "There is no difference"
          ],
          answer: "Synthesis combines ideas from multiple sources; summary focuses on one",
          explanation: "Synthesis is the higher-level skill of finding connections between different authors."
        }
      ]
    },
    {
      id: 2,
      title: "AI Workshop: Precision and Ethics",
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
    }
  ]
};

export const week4Meta: WeekMeta = {
  dateRange: "2-6 Feb 2026",
  assignmentTagline: "AI Workshop 1 - Academic Writing Quiz upcoming",
  assignmentIds: [],
};
