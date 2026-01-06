import { WeekData, WeekMeta } from "../types";

export const week6: WeekData = {
  id: 6,
  title: "Week 6",
  theme: "Academic Writing Quiz (AWQ) & Intro to Argumentation",
  overview:
    "Complete the in-class Academic Writing Quiz (15%) and begin exploring how academic arguments are constructed using the ACE framework.",
  inClassActivities: [
    "In-class Academic Writing Quiz (15%) [50 minutes]",
    "Introduction to Module 3: Argument Construction and Evaluation (ACE)",
    "The Toulmin Model: Claims, Evidence, and Warrants",
  ],
  learningOutcomes: [
    "Successfully complete a timed synthetic summary under exam conditions.",
    "Identify the three core parts of an argument: Claim, Evidence, and Warrant.",
    "Distinguish between debatable claims and statements of fact.",
  ],
  resources: [
    {
      title: "Module 3: Argumentation Model (Introduction)",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Video: Understanding Claims, Evidence, and Warrants",
      type: "video",
      duration: "12 min",
      url: "https://www.youtube.com/watch?v=17XvT8V8nSg",
    },
  ],
  practiceTasks: [
    "Reflect on your AWQ performance: which skills (paraphrasing, synthesis, tone) were most challenging?",
    "Identify one debatable claim from a provided news article or short text.",
    "Match evidence to a specific claim in the ACE introductory worksheet.",
  ],
  aiPromptHint:
    "You help students transition from summary (AWQ) to argument construction (ACE) by helping them brainstorm debatable claims on given topics.",
  skillsIntroduced: ["argument-identification", "claims-vs-facts", "toulmin-model"],
  skillsReinforced: ["academic-tone", "apa-referencing"],
  assignmentsDue: ["academic-writing-quiz"],
  assignmentsUpcoming: ["ace-draft"],
  lessons: [
    {
      id: 1,
      title: "The ACE Framework: Claim, Evidence, Warrant",
      notes: [
        "ACE stands for Argument Construction and Evaluation. It is adapted from the Toulmin Model of argumentation.",
        "Claim: A clear, specific, and debatable statement that you want the audience to accept.",
        "Evidence: Credible data, facts, statistics, or expert opinions that support your claim.",
        "Warrant: The reasoning that connects the evidence to the claim. It explains *how* or *why* the data proves your point.",
        "Backing: Additional support for the warrant (e.g., a shared value or a more general principle)."
      ],
      questions: [
        {
          question: "Which of the following is a DEBATABLE claim suitable for academic writing?",
          type: "multiple-choice",
          options: [
            "Hong Kong is located in southern China.",
            "Facial recognition technology is used in some secondary schools.",
            "Universities should strictly regulate the use of AI tools in all writing assignments.",
            "Water boils at 100 degrees Celsius at sea level."
          ],
          answer: "Universities should strictly regulate the use of AI tools in all writing assignments.",
          explanation: "This is a position that reasonable people could disagree with, whereas the others are statements of fact or observation."
        }
      ]
    },
    {
      id: 2,
      title: "AWQ Post-Assessment Reflection",
      notes: [
        "Common AWQ pitfalls: 1) Patchwriting (staying too close to the original), 2) Informal tone (e.g., using 'I think' or 'bad'), 3) Missing synthesis (summarizing articles separately instead of together).",
        "Accuracy (20%): Did you misinterpret any of the authors' findings?",
        "Synthesis (20%): Did your topic sentence connect ideas from both Article A and Article B?",
        "Paraphrasing (20%): Did you use your own words while maintaining the original meaning?",
        "Tone (20%): Was your language formal and objective?",
        "Citations (20%): Did you use correct APA 7th formats (e.g., Moon et al., 2020)?"
      ],
      questions: [
        {
          question: "Which citation format is an 'Author-Prominent' style?",
          type: "multiple-choice",
          options: [
            "(Wang & Teo, 2020)",
            "Wang and Teo (2020) argued that...",
            "Perceived value is a determinant of intention (2020).",
            "According to the literature (Wang & Teo)..."
          ],
          answer: "Wang and Teo (2020) argued that...",
          explanation: "Author-prominent citations make the author the subject of the sentence to emphasize their authority or voice."
        }
      ]
    }
  ]
};

export const week6Meta: WeekMeta = {
  dateRange: "23-27 Feb 2026",
  assignmentTagline: "Academic Writing Quiz (15%) in-class this week",
  assignmentIds: ["academic-writing-quiz"],
};
