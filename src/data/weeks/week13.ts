import { WeekData, WeekMeta } from "../types";

export const week13: WeekData = {
  id: 13,
  title: "Week 13",
  theme: "Critical Response to Academic Arguments (CRAA) Test",
  overview:
    "Complete the in-class CRAA test and finalise all outstanding submissions.",
  inClassActivities: [
    "In-class Critical Response to Academic Arguments (CRAA) Test (20%)",
    "Venue: To be confirmed",
  ],
  learningOutcomes: [
    "Synthesise skills from the whole semester in a summative critical response task.",
    "Manage time and stress during a formal assessment.",
    "Reflect on overall learning and progress in UCLC1008.",
  ],
  resources: [
    {
      title: "CRAA test preparation guide",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "Reflective Learning Portfolio rubric (10%)",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Final submission checklist",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Complete a timed practice response using a previous sample prompt.",
    "Finish and proofread your Reflective Learning Portfolio before the deadline.",
    "Ask the AI tutor to help you check your final argument for structure and citation accuracy.",
  ],
  aiPromptHint:
    "You support students in final exam preparation and help them review their work for clarity, coherence, and proper referencing.",
  skillsIntroduced: [],
  skillsReinforced: ["spoken-response", "summarising", "counterarguments", "critical-evaluation", "ai-reflection", "toulmin-model"],
  assignmentsDue: ["craa", "ace-final", "ai-reflection"],
  assignmentsUpcoming: ["reflective-portfolio"],
  lessons: [
    {
      id: 1,
      title: "Final Review of CRAA Skills",
      examples: [
        "Review the Toulmin model by analyzing a sample argument: identify the claim, grounds, warrant, backing, and qualifier in an article about online education's effectiveness.",
        "Practice identifying rhetorical strategies in a debate article on climate change policy, noting appeals to ethos, pathos, and logos.",
        "Evaluate a counterargument in a text about social media regulation, assessing whether it effectively addresses the main claim."
      ],
      notes: [
        "Recall the key components of CRAA: critical reading involves analyzing author's purpose, audience, and evidence; argumentation requires constructing claims supported by grounds and warrants. For example, in reviewing 'The Benefits of Bilingual Education,' check if the author provides empirical studies (grounds) to support their claim that bilingualism improves cognitive skills.",
        "Review logical fallacies: ad hominem (attacking the person), false dichotomy (presenting only two options), hasty generalization (concluding from insufficient evidence). Example: 'All politicians are corrupt' is a hasty generalization based on a few cases.",
        "Practice synthesizing multiple sources: combine information from three articles on AI in education to form a balanced argument, acknowledging both advantages and ethical concerns.",
        "Examine argument structure: ensure your responses include a clear thesis, supporting evidence, counterarguments, and rebuttals. For instance, when arguing for renewable energy, include economic counterarguments and rebut with long-term cost savings data.",
        "Reflect on credibility assessment: evaluate sources by author expertise, publication date, and methodology. A 2024 peer-reviewed study on mental health carries more weight than a 2010 blog post.",
        "Time management in CRAA: allocate time for reading (20%), planning (20%), writing (40%), and reviewing (20%) during practice sessions."
      ],
      questions: [
        {
          question: "What are the five key elements of Toulmin's model of argumentation?",
          type: "short-answer",
          answer: "Claim, grounds, warrant, backing, and qualifier.",
          explanation: "These elements form the foundation of constructing strong academic arguments."
        },
        {
          question: "True or False: A strong academic argument should always include counterarguments.",
          type: "true-false",
          answer: "True",
          explanation: "Including counterarguments demonstrates critical thinking and strengthens the overall argument."
        },
        {
          question: "Identify the logical fallacy: 'We must ban all social media because teenagers are becoming addicted.'",
          type: "multiple-choice",
          options: ["Ad hominem", "False dichotomy", "Hasty generalization", "Appeal to emotion"],
          answer: "Hasty generalization",
          explanation: "This conclusion is drawn from insufficient evidence and ignores nuanced research."
        },
        {
          question: "How should you evaluate the credibility of an academic source?",
          type: "short-answer",
          answer: "Check author expertise, publication venue, recency, methodology, and potential biases.",
          explanation: "These factors determine the reliability and relevance of the source for CRAA."
        },
        {
          question: "What is the difference between grounds and warrant in an argument?",
          type: "short-answer",
          answer: "Grounds are the evidence supporting the claim, while warrant explains how the grounds support the claim.",
          explanation: "Understanding this distinction helps in constructing coherent arguments."
        },
        {
          question: "Why is it important to consider alternative perspectives in CRAA?",
          type: "short-answer",
          answer: "It prevents bias, reveals argument limitations, and leads to more balanced analysis.",
          explanation: "Critical reading requires examining multiple viewpoints for comprehensive understanding."
        },
        {
          question: "Explain how rhetorical strategies can strengthen or weaken an academic argument.",
          type: "essay",
          answer: "Rhetorical strategies like ethos (credibility), pathos (emotion), and logos (logic) can make arguments persuasive, but over-reliance on pathos without logos weakens academic credibility.",
          explanation: "Effective CRAA balances rhetorical appeals with strong evidence."
        },
        {
          question: "What should you do if you encounter conflicting evidence in sources?",
          type: "short-answer",
          answer: "Evaluate the quality and relevance of each source, acknowledge the conflict, and explain why one perspective is more convincing based on evidence.",
          explanation: "This demonstrates critical evaluation skills in CRAA."
        },
        {
          question: "True or False: All peer-reviewed articles are equally credible.",
          type: "true-false",
          answer: "False",
          explanation: "Credibility depends on methodology, recency, and relevance, not just peer review status."
        },
        {
          question: "How can you ensure your CRAA response demonstrates course synthesis?",
          type: "short-answer",
          answer: "Connect skills from different modules (AWQ, ACE, CRAA) and show how they integrate, such as using paraphrasing from AWQ in argumentation from ACE.",
          explanation: "Synthesis shows comprehensive understanding of the course content."
        }
      ]
    },
    {
      id: 2,
      title: "CRAA Assessment Practice",
      examples: [
        "Practice responding to a prompt: 'Critically evaluate the argument that artificial intelligence will replace human teachers in education.' Structure your response with claim, evidence, and counterarguments.",
        "Timed practice: Analyze a 500-word article on climate change policy in 30 minutes, identifying key claims and evaluating evidence quality.",
        "Peer review simulation: Exchange practice responses and provide feedback on argument strength, evidence use, and counterargument inclusion."
      ],
      notes: [
        "Practice time management: Spend 15-20 minutes reading and annotating the text, 10 minutes planning your response, 20-25 minutes writing, and 5 minutes reviewing. Example: In a practice session, time yourself responding to a social media regulation argument.",
        "Focus on clear thesis statements: Your thesis should be specific and arguable. For instance, 'While social media has negative effects on mental health, complete bans are ineffective; instead, regulation should focus on age-appropriate content.'",
        "Incorporate multiple sources: Use at least 2-3 sources in your response, comparing and contrasting their perspectives. Example: When discussing online learning, cite studies showing both benefits and drawbacks.",
        "Develop strong counterarguments: Anticipate objections and provide rebuttals. In arguing for renewable energy, address job loss concerns by citing green job creation statistics.",
        "Use academic language and proper citation: Practice paraphrasing and quoting sources correctly. Example: Instead of 'Smith says AI is bad,' write 'Smith (2023) argues that AI implementation raises ethical concerns.'",
        "Review common pitfalls: Avoid summary-only responses; ensure analysis and evaluation. Practice distinguishing between description and critical analysis."
      ],
      questions: [
        {
          question: "How much time should you allocate to planning in a 45-minute CRAA assessment?",
          type: "multiple-choice",
          options: ["5 minutes", "10-15 minutes", "20-25 minutes", "30 minutes"],
          answer: "10-15 minutes",
          explanation: "Planning ensures a structured, well-organized response."
        },
        {
          question: "True or False: In CRAA, you must agree with the source material's main argument.",
          type: "true-false",
          answer: "False",
          explanation: "CRAA requires critical evaluation, which may include disagreeing with or qualifying the argument."
        },
        {
          question: "What is the minimum number of sources you should reference in a CRAA response?",
          type: "multiple-choice",
          options: ["1", "2-3", "4-5", "As many as possible"],
          answer: "2-3",
          explanation: "Multiple sources allow for comparison and demonstrate comprehensive analysis."
        },
        {
          question: "How should you structure your CRAA response introduction?",
          type: "short-answer",
          answer: "Introduce the topic, summarize the main argument briefly, and state your thesis.",
          explanation: "A clear introduction sets up your critical analysis."
        },
        {
          question: "What makes a counterargument effective in CRAA?",
          type: "short-answer",
          answer: "It addresses a legitimate objection and is followed by a rebuttal with evidence.",
          explanation: "Effective counterarguments strengthen rather than weaken your position."
        },
        {
          question: "True or False: Using complex vocabulary always improves a CRAA response.",
          type: "true-false",
          answer: "False",
          explanation: "Clarity and precision are more important than unnecessarily complex language."
        },
        {
          question: "How can you practice CRAA under timed conditions?",
          type: "short-answer",
          answer: "Use sample prompts, set a timer for 45 minutes, and write full responses without stopping.",
          explanation: "Regular timed practice builds assessment readiness."
        },
        {
          question: "What should you do if you finish early in the CRAA assessment?",
          type: "short-answer",
          answer: "Review your response for clarity, grammar, and additional evidence you could add.",
          explanation: "Early completion allows time for improvement."
        },
        {
          question: "Identify a common mistake in CRAA responses: writing a summary instead of analysis.",
          type: "true-false",
          answer: "True",
          explanation: "CRAA requires evaluation and critical thinking, not just restating the source."
        },
        {
          question: "How does peer review help prepare for CRAA?",
          type: "short-answer",
          answer: "It provides feedback on argument strength, clarity, and areas for improvement.",
          explanation: "Peer review simulates the evaluation process and identifies weaknesses."
        }
      ]
    },
    {
      id: 3,
      title: "Course Synthesis and Reflection",
      examples: [
        "Synthesize AWQ paraphrasing skills with ACE argumentation: 'In the ACE draft, I paraphrased sources effectively to support my claims, demonstrating integration of Week 1-5 skills.'",
        "Reflect on CRAA development: 'Throughout the course, my ability to identify logical fallacies improved from Week 6-9 practice to Week 10-13 advanced analysis.'",
        "Connect modules: 'The Toulmin model from ACE provided the foundation for my CRAA responses, showing how course skills build progressively.'"
      ],
      notes: [
        "Synthesize course content: Connect skills across modules. For example, link AWQ's paraphrasing to ACE's evidence integration and CRAA's source evaluation.",
        "Reflect on personal growth: Identify specific improvements. Example: 'I progressed from basic summaries in Week 1 to complex arguments with counterarguments in Week 12.'",
        "Evaluate learning outcomes: Assess achievement of course goals. Did you master critical reading, argumentation, and academic writing?",
        "Identify key concepts: Core ideas like Toulmin's model, rhetorical strategies, and logical fallacies should be clearly understood and applied.",
        "Consider future application: How will course skills transfer to other academic work? Example: CRAA skills will help in analyzing research articles for future assignments.",
        "Address challenges: Reflect on difficulties overcome. Example: 'Initially struggling with counterarguments, I improved through peer feedback and practice.'"
      ],
      questions: [
        {
          question: "How do AWQ skills integrate with CRAA preparation?",
          type: "short-answer",
          answer: "AWQ paraphrasing and citation skills are essential for properly integrating sources in CRAA responses.",
          explanation: "Synthesis shows how foundational skills support advanced tasks."
        },
        {
          question: "True or False: Course synthesis means memorizing all content from every week.",
          type: "true-false",
          answer: "False",
          explanation: "Synthesis involves connecting and applying key concepts across modules, not rote memorization."
        },
        {
          question: "What is the most important skill developed in UCLC1008?",
          type: "multiple-choice",
          options: ["Paraphrasing", "Critical thinking and argumentation", "Grammar", "Time management"],
          answer: "Critical thinking and argumentation",
          explanation: "These skills form the core of academic success and transfer to all disciplines."
        },
        {
          question: "How has your understanding of academic arguments evolved throughout the course?",
          type: "essay",
          answer: "Initially focused on basic structure, I now understand complex elements like counterarguments, rhetorical strategies, and evidence evaluation.",
          explanation: "Reflection demonstrates growth and synthesis of learning."
        },
        {
          question: "Why is reflection important for course synthesis?",
          type: "short-answer",
          answer: "Reflection helps identify learning progress, areas for improvement, and connections between concepts.",
          explanation: "It promotes metacognition and deeper understanding."
        },
        {
          question: "True or False: Skills from early modules are no longer relevant by Week 13.",
          type: "true-false",
          answer: "False",
          explanation: "All skills build progressively; early modules provide foundation for advanced work."
        },
        {
          question: "How can you demonstrate course synthesis in your CRAA response?",
          type: "short-answer",
          answer: "By integrating skills from multiple modules, such as using AWQ citation methods in ACE-structured arguments.",
          explanation: "Synthesis shows comprehensive understanding of the course."
        },
        {
          question: "What role does the Toulmin model play in course synthesis?",
          type: "short-answer",
          answer: "It provides a framework that connects argumentation skills from ACE to CRAA assessment practice.",
          explanation: "The model unifies key concepts across the semester."
        },
        {
          question: "How has peer feedback contributed to your learning?",
          type: "short-answer",
          answer: "Peer feedback helped identify weaknesses in arguments and improved critical evaluation skills.",
          explanation: "It fosters collaborative learning and self-improvement."
        },
        {
          question: "What is one way to apply UCLC1008 skills beyond this course?",
          type: "short-answer",
          answer: "Use critical reading and argumentation skills to analyze sources for research papers in other subjects.",
          explanation: "Transferable skills enhance academic performance across disciplines."
        }
      ]
    }
  ]
};

export const week13Meta: WeekMeta = {
  dateRange: "20-24 Apr 2026",
  assignmentTagline: "CRAA (20%) + ACE Final (20%) + AI Reflection (5%) due",
  assignmentIds: ["craa", "ace-final", "ai-reflection"],
};
