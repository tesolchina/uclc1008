export type LessonResource = {
  title: string;
  type: "video" | "reading" | "practice" | "project" | "quiz" | "listening";
  duration?: string;
  description?: string;
  url?: string;
};

export type Skill = {
  id: string;
  name: string;
  description: string;
  category: "reading" | "writing" | "critical-thinking" | "ai-literacy" | "speaking";
};

export type Assignment = {
  id: string;
  title: string;
  weight: string;
  dueWeek: number;
  type: "in-class" | "take-home" | "online";
  duration?: string;
  description: string;
  requirements: string[];
  skillsAssessed: string[];
  resources?: { title: string; url?: string }[];
  // NEW: More detailed assignment information
  detailedInfo?: {
    exactDueDate: string;
    submissionMethod: string;
    format: string;
    wordLimit?: string;
    timeLimit?: string;
    gradingCriteria: string[];
    sampleQuestions?: string[];
    instructions: string[];
    sampleResponses?: {
      highScore: { text: string; score: string; feedback: string };
      lowScore: { text: string; score: string; feedback: string };
    };
    aiPolicy: string[];
    latePolicy: string;
    requiredMaterials?: string[];
  };
};

// All skills taught in the course
export const courseSkills: Skill[] = [
  // Reading Skills
  {
    id: "journal-structure",
    name: "Journal Article Structure",
    description: "Identify and understand the main components of academic journal articles (abstract, introduction, methods, results, discussion).",
    category: "reading",
  },
  {
    id: "citation-recognition",
    name: "Citation Recognition",
    description: "Recognise in-text citations and reference list formats, particularly APA 7th style.",
    category: "reading",
  },
  {
    id: "secondary-citations",
    name: "Secondary Citations",
    description: "Understand and use secondary citations correctly when the original source is not available.",
    category: "reading",
  },
  // Writing Skills
  {
    id: "summarising",
    name: "Summarising",
    description: "Condense academic texts into concise summaries while maintaining key ideas and proper attribution.",
    category: "writing",
  },
  {
    id: "paraphrasing",
    name: "Paraphrasing",
    description: "Restate ideas from sources in your own words while preserving meaning and avoiding plagiarism.",
    category: "writing",
  },
  {
    id: "synthesising",
    name: "Synthesising",
    description: "Combine information from multiple sources to create coherent, integrated arguments.",
    category: "writing",
  },
  {
    id: "academic-tone",
    name: "Academic Tone",
    description: "Write using appropriate formal register, hedging language, and objective voice.",
    category: "writing",
  },
  {
    id: "apa-referencing",
    name: "APA Referencing",
    description: "Apply APA 7th edition citation style for in-text citations and reference lists.",
    category: "writing",
  },
  // Critical Thinking Skills
  {
    id: "argument-identification",
    name: "Argument Identification",
    description: "Identify claims, reasons, and evidence in academic arguments.",
    category: "critical-thinking",
  },
  {
    id: "toulmin-model",
    name: "Toulmin Argumentation Model",
    description: "Apply the Toulmin model (claim, grounds, warrant, backing, qualifier, rebuttal) to analyse and construct arguments.",
    category: "critical-thinking",
  },
  {
    id: "counterarguments",
    name: "Counterarguments & Rebuttals",
    description: "Develop relevant counterarguments and effective rebuttals to strengthen your position.",
    category: "critical-thinking",
  },
  {
    id: "critical-evaluation",
    name: "Critical Evaluation",
    description: "Assess the strengths and weaknesses of academic arguments objectively.",
    category: "critical-thinking",
  },
  {
    id: "peer-feedback",
    name: "Peer Feedback",
    description: "Give and receive constructive feedback on academic writing using clear criteria.",
    category: "critical-thinking",
  },
  // AI Literacy Skills
  {
    id: "ai-ethics",
    name: "AI Ethics & Authenticity",
    description: "Understand ethical considerations when using AI tools in academic work.",
    category: "ai-literacy",
  },
  {
    id: "ai-editing",
    name: "AI-Assisted Editing",
    description: "Use AI tools appropriately for checking clarity, grammar, and structure while maintaining authorship.",
    category: "ai-literacy",
  },
  {
    id: "ai-reflection",
    name: "AI Use Reflection",
    description: "Critically reflect on and document how AI tools influenced your writing process.",
    category: "ai-literacy",
  },
  // Speaking Skills
  {
    id: "spoken-response",
    name: "Spoken Critical Response",
    description: "Deliver a verbal summary and rebuttal of an academic argument clearly and persuasively.",
    category: "speaking",
  },
];

// All assignments in the course
export const courseAssignments: Assignment[] = [
  {
    id: "pre-course-writing",
    title: "Pre-course Writing",
    weight: "2.5%",
    dueWeek: 2,
    type: "take-home",
    description: "This is a baseline assessment designed to evaluate your current academic writing abilities before formal instruction begins.",
    requirements: [
      "Read the writing prompt carefully",
      "Complete both Task 1 (summary) and Task 2 (essay)",
      "Write entirely in your own words - do not use AI writing tools",
      "Submit via Moodle by the deadline"
    ],
    skillsAssessed: ["summarising", "paraphrasing", "academic-tone"],
    resources: [
      { title: "Access the assignment prompt and submission link on Moodle" },
    ],
    detailedInfo: {
      exactDueDate: "23 January 2026, 6:00 PM",
      submissionMethod: "Moodle (Individual Section)",
      format: "Word document (.doc or .docx)",
      wordLimit: "300 words per task (600 words total)",
      gradingCriteria: [
        "Task 1 (Summary): Accuracy of summary, proper paraphrasing, no personal views included",
        "Task 2 (Essay): Clear position statement, logical reasoning, proper structure",
        "APA citation usage where required",
        "Originality (AI-generated text will result in zero marks)"
      ],
      sampleQuestions: [
        "Task 1: Summarise the excerpt about facial recognition technology in schools in no more than 300 words",
        "Task 2: Write an essay (max 300 words) on: 'Is it advisable for schools to adopt facial recognition technologies on campus? Why or why not?'"
      ],
      instructions: [
        "Task 1 (Summary Writing): Write a summary of no more than 300 words on the excerpt of an academic journal article. Do NOT directly copy sentences from the excerpt – write them in your own words. Do NOT include your own views in the summary.",
        "Task 2 (Argumentation Essay): Write an essay of no more than 300 words showing your position on the topic. Include your own views and knowledge. Citing examples or ideas from the journal article is optional. Do NOT search for additional online or offline sources.",
        "Use APA in-text citations (7th edition) to acknowledge ideas from the article in your summary and essay.",
        "Write in paragraph form with: Introduction (background and thesis), Body paragraph(s) (with topic sentences), Conclusion.",
        "Type both tasks in the same Word file and submit to Moodle.",
        "NO LATE SUBMISSION ALLOWED"
      ],
      aiPolicy: [
        "If AI detection tools indicate that your writing consists of AI-generated text, you will be awarded zero marks.",
        "If you directly copy a significant portion of the source text, you will be awarded zero marks."
      ],
      latePolicy: "NO LATE SUBMISSION ALLOWED. Submissions after 23 January 2026, 6:00 PM will receive zero marks.",
      requiredMaterials: [
        "Appendix excerpt from Andrejevic & Selwyn (2020) 'Facial recognition technology in schools: critical questions and concerns'"
      ]
    }
  },
  {
    id: "referencing-quiz",
    title: "Referencing Quiz",
    weight: "2.5%",
    dueWeek: 3,
    type: "online",
    description: "Watch two short videos on APA 7th citation style and complete the quiz. You have only ONE attempt.",
    requirements: [
      "Watch Video 1: Citing Journal Articles in APA 7th Style",
      "Watch Video 2: Citing Secondary Sources in APA 7th Style",
      "Complete the quiz on Moodle (one attempt only)",
    ],
    skillsAssessed: ["citation-recognition", "apa-referencing", "secondary-citations"],
    resources: [
      { title: "Video 1: Citing Journal Articles in APA 7th Style", url: "https://www.youtube.com/watch?v=JpT1YwNcV04" },
      { title: "Video 2: Citing Secondary Sources in APA 7th Style", url: "https://www.youtube.com/watch?v=qB6eFDNyz0E" },
    ],
    detailedInfo: {
      exactDueDate: "30 January 2026, 6:00 PM",
      submissionMethod: "Moodle Online Quiz",
      format: "Online multiple-choice/short answer quiz",
      timeLimit: "To be announced on Moodle",
      gradingCriteria: [
        "Correct identification of APA 7th citation elements",
        "Proper formatting of in-text citations",
        "Understanding of secondary citation usage",
        "Recognition of reference list formatting"
      ],
      instructions: [
        "Watch both flipped classroom videos before attempting the quiz",
        "You have ONLY ONE attempt at this quiz",
        "Complete the quiz on Moodle by the deadline",
        "NO LATE SUBMISSION ALLOWED"
      ],
      aiPolicy: [
        "This is an individual assessment - no collaboration allowed",
        "Use only the provided video resources for preparation"
      ],
      latePolicy: "NO LATE SUBMISSION ALLOWED. Quizzes cannot be submitted after the deadline."
    }
  },
  {
    id: "academic-writing-quiz",
    title: "Academic Writing Quiz (AWQ)",
    weight: "15%",
    dueWeek: 6,
    type: "in-class",
    duration: "50 minutes",
    description: "Analyse academic texts to summarise, synthesise, and paraphrase key information with proper citations and academic tone.",
    requirements: [
      "Summarise key information from provided academic texts",
      "Synthesise ideas from multiple sources",
      "Paraphrase accurately while maintaining meaning",
      "Use appropriate academic tone throughout",
      "Include proper in-text citations and references",
    ],
    skillsAssessed: ["summarising", "paraphrasing", "synthesising", "academic-tone", "apa-referencing"],
    detailedInfo: {
      exactDueDate: "Week of 23-27 February 2026 (In-class)",
      submissionMethod: "In-class written answer sheet",
      format: "Handwritten or typed answer sheet",
      wordLimit: "Maximum 300 words",
      timeLimit: "50 minutes",
      gradingCriteria: [
        "Summary Accuracy (20%): Coverage of main ideas, precision, avoidance of misinterpretation",
        "Synthesis (20%): Connection of main ideas and relationships among ideas",
        "Paraphrasing (20%): Originality of wording and preservation of meaning",
        "Academic Tone & Clarity (20%): Formality, clarity, flow of ideas and cohesion",
        "In-text Citations (20%): APA referencing style correctness"
      ],
      sampleQuestions: [
        "Your task is to summarise, paraphrase and synthesise the main claims or arguments from TWO excerpts on the adoption of Facial Recognition Technology (FRT) in schools in no more than 300 words.",
        "Do NOT include your own views in the summary.",
        "Do NOT directly copy sentences from the excerpts – you need to write them in your own words.",
        "Use APA in-text citations (7th edition) to acknowledge ideas from the articles."
      ],
      instructions: [
        "You must read the excerpts of TWO academic journal articles (Articles A and B) placed in the appendix.",
        "Write your summary in paragraph form with: Introduction (including background and thesis), Body paragraph(s), Conclusion.",
        "Use APA in-text citations in three styles: Author-prominent, Signal-phrase, or Information-prominent.",
        "Do NOT cite the abstract as its purpose is to contextualise the excerpt.",
        "End-of-text citations or a reference list is NOT required.",
        "You are NOT allowed to use any online or AI tools during the test.",
        "A glossary is provided for specialised terms - you are NOT required to include definitions in your writing."
      ],
      sampleResponses: {
        highScore: {
          text: "Facial recognition technology (FRT) is increasingly incorporated in schools, aiming to improve functions like security. This summary reports key arguments for and against the adoption of FRT in schools... The debate surrounding facial recognition in schools is fundamentally a conflict over its potential benefits brought to schools in the areas of safety versus its potential to infringe upon privacy and normalise surveillance (Andrejevic & Selwyn, 2020; Hong et al., 2022)...",
          score: "80/100 = A-",
          feedback: "Effective synthesis in topic sentence, accurate citations, precise summaries of both excerpts, rewording in student's own voice."
        },
        lowScore: {
          text: "Facial recognition technology is used more and more in schools all over the world. It helps with things like school security... Article A says that many parents support facial recognition technology... Article B says facial recognition is bad because there is no option for students to self-curate...",
          score: "61/100 = C+",
          feedback: "Vague thesis statement, missing synthesis between articles, unnecessary details included, frequent use of informal phrasing, incorrect citation formatting."
        }
      },
      aiPolicy: [
        "You are NOT allowed to use any online or AI tools (including online dictionaries, paraphrasing or translation apps) during the test.",
        "This is an individual in-class assessment - no external resources allowed."
      ],
      latePolicy: "In-class assessment - must be completed during the scheduled time. Make-up tests only with valid medical or official leave certificate within FIVE calendar days.",
      requiredMaterials: [
        "Pen or pencil",
        "Answer sheet (provided)",
        "Question paper with Article A and Article B excerpts"
      ]
    }
  },
  {
    id: "ace-draft",
    title: "Argument Construction and Evaluation (Draft)",
    weight: "15%",
    dueWeek: 9,
    type: "in-class",
    duration: "100 minutes",
    description: "Write a 400-500 word draft using an argumentation model to construct a detailed argument, counterargument, and rebuttal on a selected topic.",
    requirements: [
      "Write 400-500 words following a specific argumentation model (e.g., Toulmin)",
      "Construct a clear main claim with supporting reasons and evidence",
      "Include a relevant counterargument",
      "Provide an effective rebuttal",
      "Select, summarise, synthesise, and paraphrase ideas from provided academic articles",
      "Bring necessary devices and disable writing-support apps",
    ],
    skillsAssessed: ["argument-identification", "toulmin-model", "counterarguments", "summarising", "synthesising", "paraphrasing", "apa-referencing"],
    detailedInfo: {
      exactDueDate: "Week of 16-20 March 2026 (In-class)",
      submissionMethod: "In-class submission",
      format: "Three-paragraph position paper draft",
      wordLimit: "No strict word limit (typically 400-500 words)",
      timeLimit: "100 minutes",
      gradingCriteria: [
        "Critical Thinking & Use of Grounds (30%): Quality of rebuttal (counterargument + response) and effectiveness of grounds",
        "Argument Structure (30%): Argumentation model adherence & logical interconnectedness of components",
        "Academic Tone & Clarity (30%): Formal tone, sentence clarity, logical structure, transitions",
        "Citations & References (10%): APA referencing style correctness"
      ],
      sampleQuestions: [
        "Is it advisable for schools to adopt facial recognition technologies (FRT) on campus?",
        "Write a three-paragraph draft: Introduction (context and thesis), First Body Paragraph (Toulmin model: claim, grounds, warrant), Second Body Paragraph (counterargument and response)"
      ],
      instructions: [
        "Complete the first draft of the position paper in response to the given topic.",
        "Write a three-paragraph draft following this structure:",
        "1. Introduction: Set up the context and present your overall thesis.",
        "2. First Body Paragraph: Structure it using the Toulmin model's three essential elements:",
        "   - A clear claim",
        "   - Evidence/data from the provided excerpts (grounds)",
        "   - An elaboration/explanation (warrant)",
        "3. Second Body Paragraph: Focus exclusively on refuting an opposing viewpoint:",
        "   - A counterargument",
        "   - A response",
        "Make use of the given excerpts to provide evidence supporting your writing.",
        "Include in-text citations whenever necessary.",
        "Finish writing within 100 minutes."
      ],
      sampleResponses: {
        highScore: {
          text: "Although facial recognition technology (FRT) is becoming more common in schools worldwide, this paper argues that it is not advisable for schools to adopt FRT on campus due to possible violation of students' privacy... FRT intrudes on students' privacy since the 'informed consent' is not observed (Andrejevic & Selwyn, 2020)... Some opponents claim that even if facial recognition systems scan all students by default, an 'opt-out' mechanism still allows them to later remove their data... However, while 'opt-out' may allow data removal after scanning, the initial collection still violates privacy...",
          score: "81/100 = A-",
          feedback: "Clear thesis statement, accurate in-text citations, effective grounds supporting claim, logical warrant, well-developed counterargument and response."
        },
        lowScore: {
          text: "Facial recognition technology has been adopted by many schools all over the world. However, some parents do not support the FRT in schools due to the privacy issue. Parents think FRT harms their kids a lot... FRT violates students' privacy. It is argued that FRT does not harm their kids because it monitors them 24/7... Although kids are monitored all the time, it can't guarantee their safety.",
          score: "66/100 = B-",
          feedback: "Vague claim, informal tone ('think', 'kids'), ineffective warrant, unsupported counterargument and response, incorrect citation usage."
        }
      },
      aiPolicy: [
        "Bring necessary devices but disable writing-support apps.",
        "This is an individual in-class assessment - no external assistance allowed during the test."
      ],
      latePolicy: "In-class assessment - must be completed during the scheduled time. Make-up tests only with valid medical or official leave certificate within FIVE calendar days.",
      requiredMaterials: [
        "Writing materials",
        "Question paper with Article A and Article B excerpts"
      ]
    }
  },
  {
    id: "peer-evaluation",
    title: "Peer Evaluation on ACE Draft",
    weight: "5%",
    dueWeek: 12,
    type: "in-class",
    description: "Evaluate a peer's ACE Draft using provided criteria and give constructive feedback.",
    requirements: [
      "Read your assigned peer's draft carefully",
      "Apply the peer evaluation criteria systematically",
      "Provide specific, constructive feedback",
      "Identify strengths and areas for improvement",
      "Link feedback to the argumentation model",
    ],
    skillsAssessed: ["peer-feedback", "critical-evaluation", "toulmin-model"],
    detailedInfo: {
      exactDueDate: "Week of 13-17 April 2026 (In-class)",
      submissionMethod: "In-class evaluation form",
      format: "Structured peer evaluation form",
      timeLimit: "During class time",
      gradingCriteria: [
        "Quality of feedback: Specificity, constructiveness, relevance",
        "Application of evaluation criteria",
        "Identification of argumentation model components",
        "Balance of positive and improvement feedback"
      ],
      instructions: [
        "You will be assigned a peer's ACE Draft to evaluate.",
        "Use the provided peer evaluation criteria to assess the draft.",
        "Provide specific, constructive feedback on:",
        "1. Thesis statement clarity",
        "2. Claim, grounds, and warrant in the first body paragraph",
        "3. Counterargument and response in the second body paragraph",
        "4. Overall argument structure and logic",
        "5. Academic tone and citation usage",
        "Complete the evaluation during class time.",
        "Submit your evaluation form to your instructor."
      ],
      aiPolicy: [
        "This is an individual evaluation activity.",
        "Focus on providing constructive feedback based on the criteria."
      ],
      latePolicy: "In-class activity - must be completed during the scheduled class time."
    }
  },
  {
    id: "ace-final",
    title: "Argument Construction and Evaluation (Final)",
    weight: "20%",
    dueWeek: 13,
    type: "take-home",
    description: "Revise and extend your draft to approximately 800 words, incorporating feedback from teachers, AI tools, and peers.",
    requirements: [
      "Extend the draft to approximately 800 words",
      "Incorporate feedback from teachers, AI tools, and peers",
      "Strengthen your argument, counterargument, and rebuttal",
      "Follow a selected argumentation model clearly and persuasively",
      "Ensure proper citations and references",
      "Submit via Moodle by the deadline",
    ],
    skillsAssessed: ["toulmin-model", "counterarguments", "synthesising", "academic-tone", "apa-referencing", "ai-editing"],
    detailedInfo: {
      exactDueDate: "1 May 2026, 6:00 PM",
      submissionMethod: "Moodle submission",
      format: "Six-paragraph position paper",
      wordLimit: "Approximately 800 words (no more than 900 words)",
      gradingCriteria: [
        "Argument development and logical structure",
        "Incorporation of feedback from multiple sources",
        "Quality of evidence and reasoning",
        "Academic tone and writing clarity",
        "APA citation and referencing correctness"
      ],
      sampleQuestions: [
        "Revise the first draft of your position paper in response to: 'Is working from home a worthwhile mode of work for employees?'",
        "Write a six-paragraph position paper following the specified structure"
      ],
      instructions: [
        "Revise the first draft of your position paper in response to the topic: 'Is working from home a worthwhile mode of work for employees?'",
        "Write a six-paragraph position paper of no more than 900 words, following this structure:",
        "1. Introduction: Set up the context and present your overall thesis, including your stance and a preview of two claims.",
        "2. First Body Paragraph: Structure using Toulmin model's three essential elements: (a) clear claim, (b) evidence/data from journal articles (grounds), (c) elaboration/explanation (warrant).",
        "3. Second Body Paragraph: Focus exclusively on refuting the first claim: (a) counterargument, (b) response.",
        "4. Third Body Paragraph: Your second claim following same requirements as paragraph 2.",
        "5. Fourth Body Paragraph: Focus exclusively on refuting the second claim following same requirements as paragraph 3.",
        "6. Conclusion: Summarise your claims and restate your stance.",
        "Use evidence from at least 3 of the given journal articles to support your arguments.",
        "Include in-text citations whenever necessary, and an end-of-text reference list (APA style).",
        "Submit to Moodle by the deadline."
      ],
      aiPolicy: [
        "Ethical use of AI for learning (e.g., brainstorming, exploring information) is encouraged.",
        "Submitting AI-generated output as your own work violates academic integrity guidelines.",
        "If AI detection tools suggest high percentage of AI-generated text, you must submit detailed record of AI tool use.",
        "Instructor may request an in-person oral or written defence.",
        "Failure to attend mandatory defence may result in assignment failure."
      ],
      latePolicy: "Late submissions incur 1% penalty per day past deadline (weekends and holidays included). Example: 17% score - 2 days late = 15% final score. Valid reasons for late submission must be discussed with lecturer prior to due date.",
      requiredMaterials: [
        "Your ACE Draft with feedback",
        "Journal articles provided in 'Assignment Instructions-ACE' folder on Moodle"
      ]
    }
  },
  {
    id: "ai-reflection",
    title: "Reflection on AI Use in ACE (Final)",
    weight: "5%",
    dueWeek: 13,
    type: "take-home",
    description: "Reflect on working with AI and critique AI-generated material, justifying changes made in your final paper.",
    requirements: [
      "Describe how you used AI tools during the writing process",
      "Critique AI-generated suggestions you received",
      "Justify which suggestions you accepted or rejected",
      "Explain how AI use influenced your final paper",
      "Submit together with ACE Final",
    ],
    skillsAssessed: ["ai-reflection", "ai-ethics", "ai-editing"],
    detailedInfo: {
      exactDueDate: "1 May 2026, 6:00 PM",
      submissionMethod: "Moodle submission (together with ACE Final)",
      format: "250-300 word reflective report",
      wordLimit: "250-300 words",
      gradingCriteria: [
        "Depth of reflection on AI tool use",
        "Critical evaluation of AI-generated feedback",
        "Justification for accepting/rejecting AI suggestions",
        "Clarity and coherence of reflection",
        "Inclusion of required elements (original/revised versions, chat history)"
      ],
      instructions: [
        "Write a 250-300-word reflective report evaluating your experience working with AI and critiquing AI-generated feedback.",
        "Justify the changes made (or not made) to your ACE final paper based on AI suggestions.",
        "Steps to follow:",
        "1. Select an AI tool: Use one of the available tools on the HKBU GenAI Platform.",
        "2. Input Prompts: Refer to '1.3 Academic writing: AI prompts for refining the draft' for suggested prompts.",
        "3. Evaluate Critically: Assess each output or feedback using the ACE Final Checklist. Do not accept AI suggestions blindly.",
        "4. In the report, you should:",
        "   a. Justify why you accepted or rejected 2-3 AI suggestions.",
        "   b. Include original and revised versions of the sections where AI was used.",
        "   c. Attach the full chat history as an appendix (at the end of the report).",
        "Submit the report to Moodle by the deadline."
      ],
      aiPolicy: [
        "You must retain the chat history from AI tools and your paper revision records.",
        "These may be requested by your teacher if there is suspicion of directly copying AI-generated content.",
        "You may be required to attend an oral defence to verify authenticity of your work."
      ],
      latePolicy: "Same as ACE Final: 1% penalty per day past deadline. Submit together with ACE Final.",
      requiredMaterials: [
        "Your ACE Final paper draft",
        "AI chat history from HKBU GenAI Platform",
        "ACE Final Checklist"
      ]
    }
  },
  {
    id: "craa",
    title: "Critical Response to Academic Arguments (CRAA)",
    weight: "20%",
    dueWeek: 13,
    type: "in-class",
    description: "Listen to a short audio clip with background information and an argument, then prepare and deliver a verbal summary and rebuttal.",
    requirements: [
      "Listen carefully to the audio clip (background info + argument)",
      "Prepare a spoken response within the given time",
      "Summarise the argument you heard accurately",
      "Deliver a clear rebuttal to the argument",
      "Present verbally in the assessment venue",
    ],
    skillsAssessed: ["spoken-response", "summarising", "counterarguments", "critical-evaluation"],
    resources: [
      { title: "CRAA Practice Materials", url: "https://hkbuhk.sharepoint.com/sites/AllStudents_LC/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FAllStudents%5FLC%2FShared%20Documents%2FMoodle%2FEnglish%2FUCLC1008%20University%20English%20I%2FUE1%5F202526%2FUE1%5F2526S1%2FCritical%20Response%20to%20Academic%20Arguments&p=true&ga=1" },
    ],
    detailedInfo: {
      exactDueDate: "Week of 20-24 April 2026 (In-class)",
      submissionMethod: "In-class verbal presentation (recorded)",
      format: "Verbal critical response",
      timeLimit: "Total: 6 minutes (2 min listening + 2 min preparation + 2 min response)",
      gradingCriteria: [
        "Summary Accuracy (40%): Coverage of main ideas, precision, avoidance of misinterpretation",
        "Counterargument Quality (30%): Logic, evidence, persuasiveness",
        "Verbal Delivery (30%): Clarity, pronunciation, fluency"
      ],
      sampleQuestions: [
        "Topics will come from: AI actors, AI-generated art, AI-generated video courses, AI-powered mental health apps, 'Buy now, pay later' services, Drone applications, E-sports, Side hustles, Skills-based hiring practice, Virtual tourism",
        "Example topic: 'Is lab-grown meat worth promoting in the future?' with argument about customisation benefits"
      ],
      instructions: [
        "This assessment consists of three parts:",
        "1. Listening (2 minutes):",
        "   - Listen to an audio clip with background information followed by one argument.",
        "   - You may take notes while listening.",
        "   - The clip will only be played once.",
        "2. Preparation (2 minutes):",
        "   - Organise your notes and summary.",
        "   - Develop your counterargument with evidence and explanations to challenge the argument.",
        "3. Critical Response (2 minutes):",
        "   - Orally present your summary of the argument (claim, evidence, explanation).",
        "   - Clearly state your counterargument with supporting evidence and explanations.",
        "   - Conclude by reiterating your main points.",
        "Your response will be recorded for assessment.",
        "State your Name, Student ID Number, and Section Number before starting.",
        "Spend approximately 1 minute for summary and 1 minute for counterargument and conclusion."
      ],
      sampleResponses: {
        highScore: {
          text: "The extract discusses lab-grown meat, which is made by growing animal cells in labs, to reduce environmental impact... The speaker argues that lab-grown meat should be promoted because it can be customised... While lab-grown meat offers customisation benefits, it may not be as sustainable and healthy as claimed... Studies show current production requires significant energy... lab-grown meat generates 25-30% more carbon emissions than poultry farming...",
          score: "High scoring response",
          feedback: "Accurate summary, clear counterargument with specific evidence, logical reasoning, structured response."
        },
        lowScore: {
          text: "Lab-grown meat is a new food technology that grows animal cells in labs instead of farms... Personally, I think it's acceptable because it's natural... However, don't forget it's expensive... Although lab-grown meat is nice, experts say it might cause cancer... Another problem is that companies lie about how 'green' it is...",
          score: "Low scoring response",
          feedback: "Missing claim in summary, personal opinions included, vague and unsubstantiated counterarguments, weak reasoning."
        }
      },
      aiPolicy: [
        "This is an individual in-class assessment - no external assistance allowed.",
        "You may only use notes taken during the listening phase."
      ],
      latePolicy: "In-class assessment - must be completed during the scheduled time. Make-up tests only with valid medical or official leave certificate within FIVE calendar days.",
      requiredMaterials: [
        "Pen/pencil for note-taking",
        "Student ID card"
      ]
    }
  },
  {
    id: "reflective-portfolio",
    title: "Reflective Learning Portfolio",
    weight: "10%",
    dueWeek: 13,  // CORRECTED: Changed from 14 to 13
    type: "take-home",
    description: "A 500-word reflective analysis of 2-3 learning episodes using AI tools throughout the course, comparing original work with AI-generated versions.",
    requirements: [
      "Write approximately 500 words",
      "Reflect on 2-3 learning episodes involving AI tools",
      "Compare your original work with AI-generated versions",
      "Explain your rationale for adopting or rejecting AI suggestions",
      "Include a comprehensive record of AI interactions (dialogues, drafts, revisions, final versions)",
      "Submit via Moodle by deadline (NO LATE submissions accepted)",
    ],
    skillsAssessed: ["ai-reflection", "ai-ethics", "critical-evaluation"],
    detailedInfo: {
      exactDueDate: "1 May 2026, 6:00 PM",
      submissionMethod: "Moodle submission",
      format: "500-word reflective report with appendix",
      wordLimit: "500 words",
      gradingCriteria: [
        "Depth and quality of reflection on AI tool use",
        "Critical comparison of original work with AI-generated versions",
        "Justification for adoption/rejection of AI suggestions",
        "Comprehensiveness of AI interaction records",
        "Clarity and organisation of portfolio"
      ],
      instructions: [
        "Submit a 500-word reflective report evaluating AI suggestions in two or more of these skill areas:",
        "1. Reading (refer to AI workshop 1, Part 4 or Workshop 2, Part 2)",
        "2. Summarising & Synthesising (refer to AI Workshop 1, Parts 1 & 2)",
        "3. Argumentation (refer to Workshop 2, Part 2)",
        "Steps to follow:",
        "1. Select an AI tool: Use one of the available tools on the HKBU GenAI Platform.",
        "2. Choose 2 to 3 Focus Areas: Pick from the skills listed above.",
        "3. Input Prompts: Refer to suggested prompts in relevant workshop handouts.",
        "4. Evaluate Critically: Assess AI-generated output based on your learning needs.",
        "5. In the report:",
        "   a. For Reading: Reflect on how AI sharpened/weakened your reading skills.",
        "   b. For Summarising/Paraphrasing & Argumentation: Compare original work with AI versions, justify acceptance/rejection of suggestions.",
        "   c. Include both original and revised versions where AI was used.",
        "   d. Attach full chat history as appendix.",
        "Submit to Moodle by deadline."
      ],
      aiPolicy: [
        "Use AI tools as learning partners for reflection and improvement.",
        "Document all AI interactions thoroughly.",
        "The portfolio must show your critical evaluation of AI suggestions."
      ],
      latePolicy: "NO LATE SUBMISSION ACCEPTED. Submissions after deadline will receive zero marks.",
      requiredMaterials: [
        "AI chat histories from throughout the course",
        "Original drafts and AI-suggested revisions",
        "Workshop handouts for AI prompts"
      ]
    }
  },
];

export const weekMeta: Record<number, WeekMeta> = {
  1: { dateRange: "12-16 Jan 2026" },
  2: {
    dateRange: "19-23 Jan 2026",
    assignmentTagline: "Pre-course Writing (2.5%)",
    assignmentIds: ["pre-course-writing"],
  },
  3: {
    dateRange: "26-30 Jan 2026",
    assignmentTagline: "Referencing Quiz (2.5%)",
    assignmentIds: ["referencing-quiz"],
  },
  4: { dateRange: "2-6 Feb 2026" },
  5: { dateRange: "9-13 Feb 2026" },
  6: {
    dateRange: "23-27 Feb 2026",
    assignmentTagline: "Academic Writing Quiz (15%)",
    assignmentIds: ["academic-writing-quiz"],
  },
  7: { dateRange: "2-6 Mar 2026" },
  8: { dateRange: "9-13 Mar 2026" },
  9: {
    dateRange: "16-20 Mar 2026",
    assignmentTagline: "ACE Draft (15%)",
    assignmentIds: ["ace-draft"],
  },
  10: { dateRange: "23-27 Mar 2026" },
  11: { dateRange: "30 Mar-3 Apr 2026" },
  12: {
    dateRange: "13-17 Apr 2026",
    assignmentTagline: "Peer Evaluation (5%)",
    assignmentIds: ["peer-evaluation"],
  },
  13: {
    dateRange: "20-24 Apr 2026",
    assignmentTagline: "Final Assessments",
    assignmentIds: ["ace-final", "ai-reflection", "craa", "reflective-portfolio"], // ADDED reflective-portfolio here
  },
  // NO Week 14 - Course ends at Week 13
};

export const getWeekMetaById = (id: number): WeekMeta | undefined => weekMeta[id];
export const getAssignmentById = (id: string): Assignment | undefined => 
  courseAssignments.find((a) => a.id === id);

export const weeks: WeekData[] = [
  {
    id: 1,
    title: "Week 1",
    theme: "Course Introduction",
    overview:
      "Settle into the course, understand how UCLC1008 works, and take a first look at academic journal articles.",
    inClassActivities: [
      "Course Introduction",
      "Module 1: Activities 1.1, 1.2, 1.3",
      "Module 1: Activities 2.1, 2.2",
    ],
    learningOutcomes: [
      "Describe the overall aims and assessment structure of UCLC1008.",
      "Identify the main components of an academic journal article (e.g. abstract, introduction, methods).",
      "Notice how in-text citations and reference lists are used in sample texts.",
    ],
    resources: [
      {
        title: "Course introduction & expectations",
        type: "reading",
        duration: "10 min",
        description: "Overview of the course, assessments, and how this self-access hub supports your learning.",
      },
      {
        title: "Module 1: Components of academic journal articles (Part 1)",
        type: "video",
        duration: "12 min",
      },
      {
        title: "Flipped video: Citing Journal Articles in APA 7th Style",
        type: "video",
        duration: "8 min",
        url: "https://www.youtube.com/watch?v=JpT1YwNcV04",
      },
      {
        title: "Flipped video: Citing Secondary Sources in APA 7th Style",
        type: "video",
        duration: "6 min",
        url: "https://www.youtube.com/watch?v=qB6eFDNyz0E",
      },
    ],
    practiceTasks: [
      "Skim the course information sheet and highlight key dates and assessments.",
      "Watch the flipped videos and pause to write down at least three questions about journal article structure.",
      "Ask the AI tutor to explain any journal article sections or citation points you are unsure about.",
    ],
    aiPromptHint:
      "You help first-year students understand the UCLC1008 course structure and the basic components of academic journal articles and citations.",
    skillsIntroduced: ["journal-structure", "citation-recognition", "secondary-citations"],
    skillsReinforced: [],
    assignmentsUpcoming: ["pre-course-writing", "referencing-quiz"],
  },
  {
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
  },
  {
    id: 3,
    title: "Week 3",
    theme: "Summarising & Paraphrasing Skills (continued)",
    overview:
      "Deepen your summarising and paraphrasing skills in preparation for the Referencing Quiz.",
    inClassActivities: [
      "Module 1: Activity 5.1",
      "Module 2: Activities 1.1, 1.2, 1.3 (continued)",
    ],
    learningOutcomes: [
      "Summarise short academic passages accurately and concisely.",
      "Paraphrase ideas while maintaining original meaning and citation information.",
      "Recognise common referencing formats that may appear in the quiz.",
    ],
    resources: [
      {
        title: "Module 2: Summarising, paraphrasing & synthesising skills – practice set",
        type: "reading",
        duration: "20 min",
      },
      {
        title: "Referencing patterns in sample texts",
        type: "reading",
        duration: "15 min",
      },
      {
        title: "Referencing Quiz preparation checklist",
        type: "practice",
      },
    ],
    practiceTasks: [
      "Complete a short set of paraphrasing exercises using provided extracts.",
      "Write one-paragraph summaries for two short sections of an article and add correct in-text citations.",
      "Use the AI tutor to check whether your citation style and paraphrasing are suitable for the quiz.",
    ],
    aiPromptHint:
      "You help students practise summarising and paraphrasing with correct in-text citations so they feel prepared for the Referencing Quiz.",
    skillsIntroduced: ["apa-referencing"],
    skillsReinforced: ["summarising", "paraphrasing", "citation-recognition", "secondary-citations"],
    assignmentsDue: ["referencing-quiz"],
  },
  {
    id: 4,
    title: "Week 4",
    theme: "Summarising Skills & AI Workshop 1",
    overview:
      "Consolidate paraphrasing and synthesising while exploring AI tools for precise, ethical academic reading and writing.",
    inClassActivities: [
      "Module 2: Summarising skills",
      "AI Workshop 1: AI Tools for Academic English – Precision in Reading & Writing and Ethical Considerations (1-hour)",
    ],
    learningOutcomes: [
      "Combine information from more than one source into a short synthetic paragraph.",
      "Explain the risks and benefits of using AI tools in academic work.",
      "Apply AI literacy principles when checking your own drafts.",
    ],
    resources: [
      {
        title: "Module 2: Summarising, paraphrasing & synthesising – integration tasks",
        type: "reading",
        duration: "20 min",
      },
      {
        title: "AI Workshop 1: AI tools for academic English (precision & ethics)",
        type: "video",
        duration: "60 min",
      },
      {
        title: "AI use reflection notes",
        type: "practice",
      },
    ],
    practiceTasks: [
      "Write a short synthetic paragraph that combines ideas from two short readings.",
      "Try using an AI tool to check clarity and grammar, then record how you changed the text.",
      "Ask the AI tutor to help you explain why your final version is still your own work.",
    ],
    aiPromptHint:
      "You help students use AI tools as careful reading and editing partners while maintaining academic integrity.",
    skillsIntroduced: ["synthesising", "ai-editing"],
    skillsReinforced: ["summarising", "paraphrasing", "ai-ethics"],
    assignmentsUpcoming: ["academic-writing-quiz"],
  },
  {
    id: 5,
    title: "Week 5",
    theme: "Argumentation Model",
    overview:
      "Move into Module 3 and learn how academic arguments are structured using an argumentation model.",
    inClassActivities: [
      "Module 3: Introduction and activities",
    ],
    learningOutcomes: [
      "Identify claims, reasons, and evidence in academic arguments.",
      "Describe a basic argumentation model (e.g. Toulmin).",
      "Label parts of an argument in short sample texts.",
    ],
    resources: [
      {
        title: "Module 3: Argumentation model – overview",
        type: "video",
        duration: "12 min",
      },
      {
        title: "Sample academic argument (short article/extract)",
        type: "reading",
        duration: "20 min",
      },
      {
        title: "Argument structure worksheet",
        type: "practice",
      },
    ],
    practiceTasks: [
      "Use the worksheet to label claims, reasons, and evidence in a sample argument.",
      "Draw a simple diagram of the argumentation model for one reading.",
      "Ask the AI tutor to check whether you have correctly identified each part of the model.",
    ],
    aiPromptHint:
      "You specialise in helping students recognise and label the parts of academic arguments using a standard argumentation model.",
    skillsIntroduced: ["argument-identification", "toulmin-model"],
    skillsReinforced: ["summarising", "synthesising"],
    assignmentsUpcoming: ["academic-writing-quiz"],
  },
  {
    id: 6,
    title: "Week 6",
    theme: "Argumentation Model & Academic Writing Quiz",
    overview:
      "Apply the argumentation model in your own writing and complete the in-class Academic Writing Quiz.",
    inClassActivities: [
      "In-class Academic Writing Quiz (15%) [45-50 minutes]",
    ],
    learningOutcomes: [
      "Plan a short written response using an argumentation model.",
      "Use appropriate academic tone and citations in timed writing.",
      "Understand what to expect from the Academic Writing Quiz.",
    ],
    resources: [
      {
        title: "Module 3: Argumentation model – planning your own argument",
        type: "video",
        duration: "10 min",
      },
      {
        title: "Academic Writing Quiz sample questions",
        type: "reading",
        duration: "15 min",
      },
      {
        title: "Timed-writing planning template",
        type: "practice",
      },
    ],
    practiceTasks: [
      "Plan a short argumentative paragraph using the model and the planning template.",
      "Write a 15–20 minute timed response to a sample question.",
      "Share your response with the AI tutor and ask for feedback on clarity, tone, and citation use only.",
    ],
    aiPromptHint:
      "You help students plan and rehearse short argument-based writing so they feel more confident in the Academic Writing Quiz.",
    skillsIntroduced: ["academic-tone"],
    skillsReinforced: ["summarising", "paraphrasing", "synthesising", "apa-referencing", "argument-identification"],
    assignmentsDue: ["academic-writing-quiz"],
    assignmentsUpcoming: ["ace-draft"],
  },
  {
    id: 7,
    title: "Week 7",
    theme: "Developing Stronger Arguments",
    overview:
      "Strengthen your use of the argumentation model by adding counterarguments and rebuttals, and prepare for the ACE Draft.",
    inClassActivities: [
      "Module 3: Activities on warrants, counterarguments, and rebuttals (2.3, 2.4, 2.6, 2.8)",
      "Review of Sample ACE Draft and Study Guide",
      "Test arrangement briefing for ACE Draft",
    ],
    learningOutcomes: [
      "Write a clear main claim supported by reasons and evidence.",
      "Include a relevant counterargument and rebuttal in a short written piece.",
      "Evaluate the strength of your own argument.",
    ],
    resources: [
      {
        title: "Module 3: Building counterarguments and rebuttals",
        type: "reading",
        duration: "20 min",
      },
      {
        title: "Model argument with counterargument and rebuttal",
        type: "reading",
        duration: "15 min",
      },
      {
        title: "Argument self-evaluation checklist",
        type: "practice",
      },
    ],
    practiceTasks: [
      "Draft a short argument that includes a counterargument and rebuttal.",
      "Use the checklist to evaluate the strength and clarity of your argument.",
      "Ask the AI tutor where your argument could be more convincing or better supported.",
    ],
    aiPromptHint:
      "You coach students to construct balanced arguments that acknowledge counterarguments and respond to them effectively.",
    skillsIntroduced: ["counterarguments"],
    skillsReinforced: ["toulmin-model", "argument-identification", "synthesising"],
    assignmentsUpcoming: ["ace-draft"],
  },
  {
    id: 8,
    title: "Week 8",
    theme: "Critical Response to Academic Arguments (1)",
    overview:
      "Begin Module 4 by learning how to respond critically to arguments. Receive feedback on previous work and prepare for the ACE Draft test.",
    inClassActivities: [
      "Feedback on ACE Draft Practice",
      "Test details for the upcoming ACE Draft",
      "Module 4: Part 1",
      "Feedback on Academic Writing Quiz (AWQ)",
    ],
    learningOutcomes: [
      "Identify main arguments and key points in academic texts or audio.",
      "Distinguish between summarising and critiquing.",
      "Prepare a basic critical response to a given argument.",
    ],
    resources: [
      {
        title: "Module 4: Critical response to academic arguments – introduction",
        type: "video",
        duration: "12 min",
      },
      {
        title: "Short article or transcript for critical response",
        type: "reading",
        duration: "20 min",
      },
      {
        title: "Critical response planning sheet",
        type: "practice",
      },
    ],
    practiceTasks: [
      "Write a short summary of the main argument in the sample text or audio.",
      "Use the planning sheet to note strengths and weaknesses in the argument.",
      "Ask the AI tutor to help you turn your notes into a clearer critical response outline.",
    ],
    aiPromptHint:
      "You help students move from basic summary to thoughtful critical response to academic arguments.",
    skillsIntroduced: ["critical-evaluation"],
    skillsReinforced: ["summarising", "argument-identification", "toulmin-model", "counterarguments"],
    assignmentsUpcoming: ["ace-draft"],
  },
  {
    id: 9,
    title: "Week 9",
    theme: "Critical Response & ACE Draft Test",
    overview:
      "Continue Module 4 and complete the in-class Argument Construction and Evaluation (Draft) test.",
    inClassActivities: [
      "In-class Argument Construction and Evaluation (Draft) Test (15%) [100 minutes]",
      "Module 4: Part 2 (Activity 2.1)",
      "Reminder: Bring necessary devices and disable writing-support apps for the test",
    ],
    learningOutcomes: [
      "Apply an argumentation model to the draft of a longer written assignment.",
      "Integrate summary and critique of source ideas in your own argument.",
      "Understand the requirements of the in-class draft assignment.",
    ],
    resources: [
      {
        title: "Assignment brief: Argument Construction and Evaluation (Draft)",
        type: "reading",
        duration: "15 min",
      },
      {
        title: "Model outline for the draft assignment",
        type: "reading",
        duration: "15 min",
      },
      {
        title: "Draft planning template (claims, counterarguments, rebuttals)",
        type: "practice",
      },
    ],
    practiceTasks: [
      "Use the planning template to map out your draft argument before the in-class task.",
      "Write a practice paragraph that combines source summary with your own evaluation.",
      "Ask the AI tutor to comment on whether your paragraph clearly follows an argumentation model.",
    ],
    aiPromptHint:
      "You guide students in planning and testing out ideas for the Argument Construction and Evaluation draft without generating full answers.",
    skillsIntroduced: [],
    skillsReinforced: ["toulmin-model", "counterarguments", "summarising", "synthesising", "paraphrasing", "apa-referencing", "critical-evaluation"],
    assignmentsDue: ["ace-draft"],
    assignmentsUpcoming: ["peer-evaluation", "ace-final", "ai-reflection"],
  },
  {
    id: 10,
    title: "Week 10",
    theme: "Critical Response & AI Workshop 2",
    overview:
      "Use AI tools to refine structured arguments ethically in preparation for your final written work.",
    inClassActivities: [
      "Module 4: Part 2 (Activities 2.2-2.5)",
      "AI Workshop 2: AI Tools for Structured Argumentation and Ethical Considerations (1-hour)",
    ],
    learningOutcomes: [
      "Use AI tools to check structure and clarity of your argument.",
      "Record how AI suggestions influence your revisions.",
      "Reflect on ethical boundaries when using AI for argument writing.",
    ],
    resources: [
      {
        title: "AI Workshop 2: AI tools for structured argumentation",
        type: "video",
        duration: "60 min",
      },
      {
        title: "Sample AI–student interaction transcripts",
        type: "reading",
        duration: "15 min",
      },
      {
        title: "AI reflection log template",
        type: "practice",
      },
    ],
    practiceTasks: [
      "Work on a revised version of your argument using AI suggestions for structure and clarity.",
      "Complete the reflection log, noting which AI suggestions you accepted or rejected.",
      "Ask the AI tutor to help you phrase a short reflection on how AI supported your learning.",
    ],
    aiPromptHint:
      "You help students refine structured arguments with AI support and articulate thoughtful reflections on their AI use.",
    skillsIntroduced: ["ai-reflection"],
    skillsReinforced: ["ai-editing", "ai-ethics", "toulmin-model", "counterarguments"],
    assignmentsUpcoming: ["peer-evaluation", "ace-final", "ai-reflection"],
  },
  {
    id: 11,
    title: "Week 11",
    theme: "Critical Response & Preparing for Peer Evaluation",
    overview:
      "Consolidate your critical response skills and get ready to give and receive peer feedback on your draft.",
    inClassActivities: [
      "Briefing on forthcoming assignments",
      "Module 4: Part 3",
      "Reminder: Week 12 – In-class Peer Evaluation on Argument Construction and Evaluation (Draft) (5%)",
    ],
    learningOutcomes: [
      "Identify strengths and areas for improvement in a peer's argumentative draft.",
      "Give constructive, specific feedback linked to the argumentation model.",
      "Revise your own work based on peer and teacher comments.",
    ],
    resources: [
      {
        title: "Peer evaluation criteria for Argument Construction and Evaluation (Draft)",
        type: "reading",
        duration: "10 min",
      },
      {
        title: "Sample peer feedback comments",
        type: "reading",
        duration: "15 min",
      },
      {
        title: "Revision planning worksheet",
        type: "practice",
      },
    ],
    practiceTasks: [
      "Practise annotating a sample paragraph using the peer evaluation criteria.",
      "Write three concrete suggestions you could give a peer to strengthen their argument.",
      "Ask the AI tutor to help you rephrase feedback comments more clearly and politely.",
    ],
    aiPromptHint:
      "You support students in giving and receiving constructive peer feedback focused on argument quality.",
    skillsIntroduced: ["peer-feedback"],
    skillsReinforced: ["critical-evaluation", "toulmin-model", "counterarguments"],
    assignmentsUpcoming: ["peer-evaluation", "ace-final", "ai-reflection", "craa", "reflective-portfolio"],
  },
  {
    id: 12,
    title: "Week 12",
    theme: "Peer Evaluation & Consultations",
    overview:
      "Engage in peer evaluation and consultations while continuing to practise spoken and written critical response.",
    inClassActivities: [
      "In-class Peer Evaluation on Argument Construction and Evaluation (Draft) (5%)",
      "Consultations",
      "Module 4: Parts 3.5, 4, and 5.1",
    ],
    learningOutcomes: [
      "Use peer feedback to revise your draft more effectively.",
      "Prepare a short spoken critical response to an argument.",
      "Plan questions to ask in individual or small-group consultations.",
    ],
    resources: [
      {
        title: "Guidelines for in-class peer evaluation (5%)",
        type: "reading",
        duration: "10 min",
      },
      {
        title: "Consultation planning sheet",
        type: "practice",
      },
      {
        title: "Sample audio clip for critical response",
        type: "listening",
        duration: "5 min",
      },
    ],
    practiceTasks: [
      "Revise one section of your draft based on peer comments.",
      "Prepare and record a brief spoken critical response to a short audio or text extract.",
      "Ask the AI tutor for suggestions on structuring your final argument more clearly.",
    ],
    aiPromptHint:
      "You help students refine their drafts through peer feedback and prepare confident spoken responses to academic arguments.",
    skillsIntroduced: ["spoken-response"],
    skillsReinforced: ["peer-feedback", "critical-evaluation", "counterarguments", "summarising"],
    assignmentsDue: ["peer-evaluation"],
    assignmentsUpcoming: ["ace-final", "ai-reflection", "craa", "reflective-portfolio"],
  },
  {
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
    assignmentsDue: ["craa", "ace-final", "ai-reflection", "reflective-portfolio"], // ADDED reflective-portfolio here
    assignmentsUpcoming: [],
  },
  // NO Week 14 - Course ends at Week 13
];

export const getWeekById = (id: number) => weeks.find((week) => week.id === id);
export const getSkillById = (id: string) => courseSkills.find((skill) => skill.id === id);
export const getAssignmentsByWeek = (weekId: number) => courseAssignments.filter((a) => a.dueWeek === weekId);
export const getSkillsForWeek = (weekId: number) => {
  const week = getWeekById(weekId);
  if (!week) return { introduced: [], reinforced: [] };
  return {
    introduced: week.skillsIntroduced.map(getSkillById).filter(Boolean) as Skill[],
    reinforced: week.skillsReinforced.map(getSkillById).filter(Boolean) as Skill[],
  };
};
