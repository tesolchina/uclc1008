import { WeekData, WeekMeta } from "../types";

export const week2: WeekData = {
  id: 2,
  title: "Week 2",
  theme: "Summarising, Paraphrasing & Synthesising Skills",
  overview:
    "Continue exploring academic journal articles while beginning to practise summarising, paraphrasing, and synthesising.",
  inClassActivities: [
    "Module 1: Activities 3.1, 3.2, 3.3",
    "Module 1: Activities 4.1, 4.2",
    "Module 1: Part 5 (Referencing)",
    "Module 2: Activities 1.1, 1.2, 1.3",
  ],
  learningOutcomes: [
    "Recognise how ideas are organised within research articles.",
    "Write short summaries of sections of an article in your own words.",
    "Understand the requirements for the Pre-course Writing task.",
  ],
  resources: [
    {
      title: "Module 1: Components of academic journal articles (Part 2)",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Module 2: Summarising, paraphrasing & synthesising skills – introduction",
      type: "video",
      duration: "10 min",
    },
    {
      title: "Flipped video: AI Literacy (Authenticity)",
      type: "video",
      duration: "10 min",
      description: "How to use AI tools ethically when preparing your own writing.",
      url: "https://www.youtube.com/watch?v=6uhUqUG4-Vo",
    },
  ],
  practiceTasks: [
    "Draft or revise your Pre-course Writing task in your own words.",
    "Choose one short paragraph from an article and write a 1–2 sentence summary without copying phrases.",
    "Ask the AI tutor to check whether your paraphrase is too close to the original and suggest safer wording.",
  ],
  aiPromptHint:
    "You support students in planning their Pre-course Writing and in producing short, safe paraphrases from journal articles without writing the assignment for them.",
  skillsIntroduced: ["summarising", "paraphrasing", "ai-ethics"],
  skillsReinforced: ["journal-structure", "citation-recognition"],
  assignmentsDue: ["pre-course-writing"],
  assignmentsUpcoming: ["referencing-quiz"],
  lessons: [
    {
      id: 1,
      title: "Summarising Skills",
      examples: [
        "Original: 'Social media platforms have become integral to daily communication, with over 4 billion active users worldwide. Research indicates that excessive use can lead to decreased attention spans and reduced face-to-face interaction.' Summary: 'Social media is widely used globally but may negatively impact attention and social skills.'",
        "Article section summary: A 200-word introduction section can be summarised in 2-3 sentences capturing the research problem, importance, and objectives."
      ],
      notes: [
        "Summaries should be concise, capturing main ideas without unnecessary details.",
        "Use your own words to avoid plagiarism while maintaining the original meaning.",
        "Include key findings, methods, and implications from research articles.",
        "Summaries should be proportional - longer texts need more detailed summaries.",
        "Focus on the author's main arguments and supporting evidence."
      ],
      questions: [
        {
          question: "What is the maximum recommended length for a summary of a journal article introduction?",
          type: "multiple-choice",
          options: ["1 sentence", "2-3 sentences", "1 paragraph", "Full page"],
          answer: "2-3 sentences",
          explanation: "Summaries should be concise while capturing the essential information."
        },
        {
          question: "True or False: A good summary can include direct quotes from the original text.",
          type: "true-false",
          answer: "False",
          explanation: "Summaries should be in your own words to demonstrate understanding and avoid plagiarism."
        },
        {
          question: "Summarize this paragraph in 2-3 sentences: 'Climate change poses significant threats to global agriculture. Rising temperatures affect crop yields, while changing precipitation patterns disrupt planting schedules. Farmers must adapt through new technologies and resilient crop varieties to maintain food security.'",
          type: "essay",
          explanation: "Practice condensing information while retaining key points, a key skill for AWQ."
        },
        {
          question: "What should you include in a summary of a research article's results section?",
          type: "short-answer",
          answer: "Key findings, statistical significance, and main conclusions.",
          explanation: "Summaries should capture the most important outcomes."
        },
        {
          question: "True or False: Summaries should include every detail from the original text.",
          type: "true-false",
          answer: "False",
          explanation: "Summaries condense information, focusing on main points."
        },
        {
          question: "Which of the following is the best summary of this abstract excerpt: 'This study examines the impact of technology on student engagement. Results show increased participation but also potential distractions.'",
          type: "multiple-choice",
          options: ["Technology affects student engagement in complex ways.", "Technology only increases participation.", "Technology causes distractions.", "The study found no impact."],
          answer: "Technology affects student engagement in complex ways.",
          explanation: "Captures both positive and negative aspects."
        },
        {
          question: "Explain why summaries are important for academic writing.",
          type: "short-answer",
          answer: "They help readers quickly understand main ideas and demonstrate comprehension.",
          explanation: "Key skill for AWQ."
        },
        {
          question: "Summarize the main idea of this paragraph: 'Academic integrity is fundamental to higher education. It involves honest representation of work and proper citation of sources. Violations can result in serious consequences including expulsion.'",
          type: "essay",
          explanation: "Practice summarizing ethical concepts."
        },
        {
          question: "What is the difference between a summary and an abstract?",
          type: "multiple-choice",
          options: ["Summary is written by the author, abstract by readers", "Abstract is written by the author, summary by readers", "They are the same", "Abstract is longer than summary"],
          answer: "Abstract is written by the author, summary by readers",
          explanation: "Abstracts are author-provided, summaries are reader-created."
        },
        {
          question: "True or False: A summary can be longer than the original text.",
          type: "true-false",
          answer: "False",
          explanation: "Summaries are always shorter than the original."
        }
      ]
    },
    {
      id: 2,
      title: "Paraphrasing Techniques",
      examples: [
        "Original: 'The study found that students who participated in peer tutoring showed significant improvement in writing skills.' Paraphrase: 'Research revealed that learners involved in mutual teaching programs demonstrated notable gains in composition abilities.'",
        "Original: 'Digital literacy encompasses the ability to locate, evaluate, and use information effectively.' Paraphrase: 'Being digitally literate means having the skills to find, assess, and apply information efficiently.'"
      ],
      notes: [
        "Paraphrasing involves restating ideas in different words while preserving meaning.",
        "Change sentence structure, use synonyms, and reorganize information.",
        "Always cite the source even when paraphrasing.",
        "Avoid changing meaning or omitting important details.",
        "Paraphrasing demonstrates deep understanding of the material."
      ],
      questions: [
        {
          question: "Which of these is a good paraphrase of: 'The research methodology included both qualitative and quantitative approaches.'",
          type: "multiple-choice",
          options: [
            "The study used methods that were both qualitative and quantitative.",
            "The research included approaches that were qualitative as well as quantitative.",
            "The methodology research included both qualitative and quantitative approaches.",
            "Both A and B are acceptable paraphrases."
          ],
          answer: "Both A and B are acceptable paraphrases.",
          explanation: "Good paraphrases change wording and structure while keeping the original meaning."
        },
        {
          question: "Paraphrase this sentence: 'Artificial intelligence has revolutionized the field of education by providing personalized learning experiences.'",
          type: "short-answer",
          answer: "AI has transformed teaching by offering customized educational opportunities.",
          explanation: "Use synonyms and restructure while maintaining the core meaning."
        },
        {
          question: "Why is paraphrasing important in academic writing?",
          type: "essay",
          explanation: "Explain how paraphrasing shows understanding and avoids plagiarism, key for AWQ preparation."
        },
        {
          question: "Which of these is NOT a good paraphrasing technique?",
          type: "multiple-choice",
          options: ["Using synonyms", "Changing sentence structure", "Copying phrases directly", "Reorganizing information"],
          answer: "Copying phrases directly",
          explanation: "Direct copying is plagiarism."
        },
        {
          question: "Paraphrase: 'The experiment demonstrated clear evidence of learning improvement.'",
          type: "short-answer",
          answer: "The test showed obvious proof of better learning.",
          explanation: "Use different words and structure."
        },
        {
          question: "Why must you cite sources even when paraphrasing?",
          type: "short-answer",
          answer: "To give credit to original authors and allow verification.",
          explanation: "Maintains academic integrity."
        },
        {
          question: "True or False: Paraphrasing can change the original meaning if done incorrectly.",
          type: "true-false",
          answer: "True",
          explanation: "Poor paraphrasing can distort meaning."
        },
        {
          question: "Identify the best paraphrase of: 'Critical thinking skills are essential for academic success.'",
          type: "multiple-choice",
          options: ["Thinking critically is important for doing well in school.", "Critical thinking is necessary for academic achievement.", "Both A and B", "Neither is good"],
          answer: "Both A and B",
          explanation: "Both capture the meaning with different wording."
        },
        {
          question: "Explain the steps to paraphrase effectively.",
          type: "essay",
          explanation: "Outline the process for safe paraphrasing."
        },
        {
          question: "Paraphrase this complex sentence: 'Although online education provides flexibility, it often lacks the interpersonal interactions that traditional classrooms offer.'",
          type: "short-answer",
          answer: "While e-learning offers convenience, it usually misses the personal connections found in face-to-face classes.",
          explanation: "Maintain complex structure with different words."
        }
      ]
    },
    {
      id: 3,
      title: "Synthesising Information",
      examples: [
        "Synthesis: 'While Smith (2023) found that social media improves information access, Johnson (2024) showed it reduces attention spans. Together, these studies suggest that social media has both benefits and drawbacks for learning.'",
        "Multiple sources: Combining findings from three articles on online learning to argue that blended approaches are most effective."
      ],
      notes: [
        "Synthesis involves combining information from multiple sources to create new insights.",
        "Identify common themes and contrasting viewpoints across sources.",
        "Use citations to attribute ideas to specific authors.",
        "Create coherent arguments that integrate diverse perspectives.",
        "Synthesis demonstrates critical thinking and research skills."
      ],
      questions: [
        {
          question: "What is the main difference between paraphrasing and synthesizing?",
          type: "multiple-choice",
          options: [
            "Paraphrasing uses one source, synthesis uses multiple",
            "Synthesis is shorter than paraphrasing",
            "Paraphrasing requires citations, synthesis does not",
            "They are essentially the same skill"
          ],
          answer: "Paraphrasing uses one source, synthesis uses multiple",
          explanation: "Synthesis integrates information from multiple sources to create new understanding."
        },
        {
          question: "True or False: When synthesizing information, you should always agree with all sources.",
          type: "true-false",
          answer: "False",
          explanation: "Synthesis often involves comparing contrasting viewpoints and forming your own conclusions."
        },
        {
          question: "Synthesize information from these two statements: 'Online learning increases flexibility for students.' 'Online learning can reduce student motivation due to lack of social interaction.'",
          type: "essay",
          explanation: "Practice combining contrasting ideas into a balanced analysis, preparing for AWQ synthesis tasks."
        },
        {
          question: "What is the first step in synthesizing information from multiple sources?",
          type: "multiple-choice",
          options: ["Write the conclusion", "Identify common themes", "Choose favorite sources", "Count the sources"],
          answer: "Identify common themes",
          explanation: "Synthesis starts with finding connections."
        },
        {
          question: "True or False: Synthesis always requires agreeing with all sources.",
          type: "true-false",
          answer: "False",
          explanation: "Can include contrasting views."
        },
        {
          question: "Synthesize: Source A says 'Technology improves access to information.' Source B says 'Technology can spread misinformation.'",
          type: "short-answer",
          answer: "While technology enhances information access, it also risks spreading false information.",
          explanation: "Balance both perspectives."
        },
        {
          question: "Why is synthesis important for academic writing?",
          type: "short-answer",
          answer: "It shows deep understanding and creates new insights from multiple viewpoints.",
          explanation: "Key for AWQ."
        },
        {
          question: "Which of these demonstrates synthesis?",
          type: "multiple-choice",
          options: ["Quoting directly from one source", "Paraphrasing one author's idea", "Combining ideas from three sources to form a new argument", "Listing sources without connection"],
          answer: "Combining ideas from three sources to form a new argument",
          explanation: "Synthesis integrates multiple sources."
        },
        {
          question: "Explain how synthesis differs from summary.",
          type: "essay",
          explanation: "Summary condenses one source, synthesis combines multiple."
        },
        {
          question: "True or False: Synthesis can include your own analysis and conclusions.",
          type: "true-false",
          answer: "True",
          explanation: "Synthesis often leads to new interpretations."
        }
      ]
    }
  ]
};

export const week2Meta: WeekMeta = {
  dateRange: "20-24 Jan 2026",
  assignmentTagline: "Pre-course Writing due 23 Jan",
  assignmentIds: ["pre-course-writing"],
};
