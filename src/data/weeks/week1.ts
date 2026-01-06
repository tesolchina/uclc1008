import { WeekData, WeekMeta } from "../types";

export const week1: WeekData = {
  id: 1,
  title: "Week 1",
  theme: "Introduction to Academic Journal Articles",
  overview:
    "This week introduces you to the basic structure of academic journal articles (empirical vs. conceptual) and the fundamental skills for reading them effectively.",
  inClassActivities: [
    "Course Introduction (0.5 hr)",
    "Module 1: Part 1 - Introduction to Academic Journal Articles",
    "Module 1: Part 2 - How to Read and Select Main Ideas (Activities 2.1, 2.2)",
    "Flipped Classroom Videos: Citations and Reference Lists",
  ],
  learningOutcomes: [
    "Differentiate between empirical and conceptual journal articles.",
    "Analyze journal article titles and abstracts for subject, context, and stance.",
    "Locate and analyze topic sentences and concluding sentences in academic texts.",
    "Understand the rhetorical functions and basic rules of in-text citations (APA 7th).",
  ],
  resources: [
    {
      title: "Module 1: Components of Academic Journal Articles (Parts 1-4)",
      type: "reading",
      duration: "45 min",
    },
    {
      title: "Flipped video 1: Citing Journal Articles in APA 7th Style",
      type: "video",
      duration: "12 min",
      url: "https://www.youtube.com/watch?v=JpT1YwNcV04",
    },
    {
      title: "Flipped video 2: Citing Secondary Sources in APA 7th Style",
      type: "video",
      duration: "10 min",
      url: "https://www.youtube.com/watch?v=qB6eFDNyz0E",
    },
  ],
  practiceTasks: [
    "Read the first section of a provided journal article and label its main components (abstract, introduction, etc.).",
    "Analyze a given title and abstract using the step-by-step guide in Module 1.",
    "Practice secondary citations using the exercises in Part 4 of Module 1.",
  ],
  aiPromptHint:
    "You help first-year students understand the structure of academic journal articles, specifically the differences between empirical and conceptual papers, and how to analyze titles and abstracts.",
  skillsIntroduced: ["journal-structure", "citation-recognition", "secondary-citations"],
  skillsReinforced: [],
  assignmentsUpcoming: ["pre-course-writing", "referencing-quiz"],
  lessons: [
    {
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
    },
    {
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
    },
    {
      id: 3,
      title: "Citations and Academic Integrity",
      examples: [
        {
          title: "Author-Prominent Citation",
          text: "Wang and Teo (2020) argued that information quality..."
        },
        {
          title: "Information-Prominent Citation",
          text: "Moreover, perceived value was found to significantly affect users’ intentions (Li et al., 2018; Wang, 2014)."
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
    }
  ]
};

export const week1Meta: WeekMeta = {
  dateRange: "12-16 Jan 2026",
  assignmentTagline: "Classes begin on 12 Jan - No assessments due this week",
  assignmentIds: [],
};
