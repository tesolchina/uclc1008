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
};

export type WeekData = {
  id: number;
  title: string;
  theme: string;
  overview: string;
  inClassActivities: string[];
  learningOutcomes: string[];
  resources: LessonResource[];
  practiceTasks: string[];
  aiPromptHint: string;
  skillsIntroduced: string[];
  skillsReinforced: string[];
  assignmentsDue?: string[];
  assignmentsUpcoming?: string[];
};

export type WeekMeta = {
  dateRange?: string;
  assignmentTagline?: string;
  assignmentIds?: string[];
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
    description: "An initial writing task to assess your current academic writing skills before the course begins.",
    requirements: [
      "Complete the writing task following the given prompt",
      "Use your own words without AI assistance",
      "Submit via Moodle by the deadline",
    ],
    skillsAssessed: ["summarising", "paraphrasing", "academic-tone"],
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
      "Review both videos thoroughly before attempting",
    ],
    skillsAssessed: ["citation-recognition", "apa-referencing", "secondary-citations"],
    resources: [
      { title: "Video 1: Citing Journal Articles in APA 7th Style", url: "https://www.youtube.com/watch?v=JpT1YwNcV04" },
      { title: "Video 2: Citing Secondary Sources in APA 7th Style", url: "https://www.youtube.com/watch?v=qB6eFDNyz0E" },
    ],
  },
  {
    id: "academic-writing-quiz",
    title: "Academic Writing Quiz (AWQ)",
    weight: "15%",
    dueWeek: 6,
    type: "in-class",
    duration: "45-50 minutes",
    description: "Analyse academic texts to summarise, synthesise, and paraphrase key information with proper citations and academic tone.",
    requirements: [
      "Summarise key information from provided academic texts",
      "Synthesise ideas from multiple sources",
      "Paraphrase accurately while maintaining meaning",
      "Use appropriate academic tone throughout",
      "Include proper in-text citations and references",
    ],
    skillsAssessed: ["summarising", "paraphrasing", "synthesising", "academic-tone", "apa-referencing"],
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
  },
  {
    id: "reflective-portfolio",
    title: "Reflective Learning Portfolio",
    weight: "10%",
    dueWeek: 14,
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
    assignmentIds: ["ace-final", "ai-reflection", "craa"],
  },
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
    assignmentsDue: ["craa", "ace-final", "ai-reflection"],
    assignmentsUpcoming: ["reflective-portfolio"],
  },
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
