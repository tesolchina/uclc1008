export type LessonResource = {
  title: string;
  type: "video" | "reading" | "practice" | "project" | "quiz" | "listening";
  duration?: string;
  description?: string;
};

export type WeekData = {
  id: number;
  title: string;
  theme: string;
  overview: string;
  learningOutcomes: string[];
  resources: LessonResource[];
  practiceTasks: string[];
  aiPromptHint: string;
};

export type WeekMeta = {
  dateRange: string;
  assignmentTagline?: string;
};

export const weekMeta: Record<number, WeekMeta> = {
  1: { dateRange: "12-16 Jan 2026" },
  2: {
    dateRange: "19-23 Jan 2026",
    assignmentTagline: "Pre-course Writing (2.5%) due this week",
  },
  3: {
    dateRange: "26-30 Jan 2026",
    assignmentTagline: "Referencing Quiz (2.5%) this week",
  },
  4: { dateRange: "2-6 Feb 2026" },
  5: { dateRange: "9-13 Feb 2026" },
  6: {
    dateRange: "23-27 Feb 2026",
    assignmentTagline: "Academic Writing Quiz (15%) in class",
  },
  7: { dateRange: "2-6 Mar 2026" },
  8: { dateRange: "9-13 Mar 2026" },
  9: {
    dateRange: "16-20 Mar 2026",
    assignmentTagline: "Argument Construction & Evaluation Draft (15%)",
  },
  10: { dateRange: "23-27 Mar 2026" },
  11: { dateRange: "30 Mar-3 Apr 2026" },
  12: {
    dateRange: "13-17 Apr 2026",
    assignmentTagline: "Peer Evaluation on Draft (5%)",
  },
  13: {
    dateRange: "20-24 Apr 2026",
    assignmentTagline: "Critical Response (20%) & final submissions",
  },
};

export const getWeekMetaById = (id: number): WeekMeta | undefined => weekMeta[id];

export const weeks: WeekData[] = [
  {
    id: 1,
    title: "Week 1",
    theme: "Course introduction & journal articles (1)",
    overview:
      "Settle into the course, understand how UCLC1008 works, and take a first look at academic journal articles.",
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
        title: "Flipped video: in-text citations & reference list",
        type: "video",
        duration: "8 min",
      },
      {
        title: "Flipped video: secondary citations",
        type: "video",
        duration: "6 min",
      },
    ],
    practiceTasks: [
      "Skim the course information sheet and highlight key dates and assessments.",
      "Watch the flipped videos and pause to write down at least three questions about journal article structure.",
      "Ask the AI tutor to explain any journal article sections or citation points you are unsure about.",
    ],
    aiPromptHint:
      "You help first-year students understand the UCLC1008 course structure and the basic components of academic journal articles and citations.",
  },
  {
    id: 2,
    title: "Week 2",
    theme: "Journal articles (2) & first paraphrasing steps",
    overview:
      "Continue exploring academic journal articles while beginning to practise summarising, paraphrasing, and synthesising.",
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
        title: "Flipped video: AI literacy (authenticity)",
        type: "video",
        duration: "10 min",
        description: "How to use AI tools ethically when preparing your own writing.",
      },
    ],
    practiceTasks: [
      "Draft or revise your Pre-course Writing task in your own words.",
      "Choose one short paragraph from an article and write a 1–2 sentence summary without copying phrases.",
      "Ask the AI tutor to check whether your paraphrase is too close to the original and suggest safer wording.",
    ],
    aiPromptHint:
      "You support students in planning their Pre-course Writing and in producing short, safe paraphrases from journal articles without writing the assignment for them.",
  },
  {
    id: 3,
    title: "Week 3",
    theme: "Summarising & paraphrasing for referencing quiz",
    overview:
      "Deepen your summarising and paraphrasing skills in preparation for the Referencing Quiz.",
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
  },
  {
    id: 4,
    title: "Week 4",
    theme: "Advanced paraphrasing & AI tools workshop (1)",
    overview:
      "Consolidate paraphrasing and synthesising while exploring AI tools for precise, ethical academic reading and writing.",
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
  },
  {
    id: 5,
    title: "Week 5",
    theme: "Argumentation model (1)",
    overview:
      "Move into Module 3 and learn how academic arguments are structured using an argumentation model.",
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
  },
  {
    id: 6,
    title: "Week 6",
    theme: "Argumentation model (2) & Academic Writing Quiz",
    overview:
      "Apply the argumentation model in your own writing and get ready for the in-class Academic Writing Quiz.",
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
  },
  {
    id: 7,
    title: "Week 7",
    theme: "Developing stronger arguments",
    overview:
      "Strengthen your use of the argumentation model by adding counterarguments and rebuttals.",
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
  },
  {
    id: 8,
    title: "Week 8",
    theme: "Critical response to academic arguments (1)",
    overview:
      "Begin Module 4 by learning how to respond critically to arguments in academic texts and talks.",
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
  },
  {
    id: 9,
    title: "Week 9",
    theme: "Critical response & draft argument assignment",
    overview:
      "Continue Module 4 and prepare for the in-class Argument Construction and Evaluation (Draft).",
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
  },
  {
    id: 10,
    title: "Week 10",
    theme: "Critical response & AI tools workshop (2)",
    overview:
      "Use AI tools to refine structured arguments ethically in preparation for your final written work.",
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
  },
  {
    id: 11,
    title: "Week 11",
    theme: "Extending critical response & preparing for peer evaluation",
    overview:
      "Consolidate your critical response skills and get ready to give and receive peer feedback on your draft.",
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
  },
  {
    id: 12,
    title: "Week 12",
    theme: "Peer evaluation, consultations & spoken critical response",
    overview:
      "Engage in peer evaluation and consultations while continuing to practise spoken and written critical response.",
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
      "Practise giving a 1–2 minute spoken response to the sample audio clip.",
      "Ask the AI tutor to help you prepare questions for your consultation so you can use the time well.",
    ],
    aiPromptHint:
      "You help students turn peer feedback and consultations into concrete revisions and clearer spoken critical responses.",
  },
  {
    id: 13,
    title: "Week 13",
    theme: "Final critical response, portfolio & next steps",
    overview:
      "Bring together your skills for the in-class Critical Response task, final written assignment, and Reflective Learning Portfolio.",
    learningOutcomes: [
      "Plan and deliver a clear critical response to an argument in audio form.",
      "Finalise the Argument Construction and Evaluation (Final) with appropriate use of AI.",
      "Reflect on your learning journey in the Reflective Learning Portfolio.",
    ],
    resources: [
      {
        title: "Assessment brief: Critical Response to Academic Arguments (20%)",
        type: "reading",
        duration: "15 min",
      },
      {
        title: "Assessment brief: Argument Construction and Evaluation (Final) & AI reflection",
        type: "reading",
        duration: "15 min",
      },
      {
        title: "Reflective Learning Portfolio guidelines (10%)",
        type: "reading",
        duration: "15 min",
      },
    ],
    practiceTasks: [
      "Practise planning a spoken critical response to a new short audio or text argument.",
      "Review a draft of your final written assignment and note where AI supported your revisions.",
      "Draft your Reflective Learning Portfolio entry and ask the AI tutor to help you express your ideas more clearly, without changing your meaning.",
    ],
    aiPromptHint:
      "You support students in preparing for their final critical response, polishing their written assignment, and writing an honest, thoughtful Reflective Learning Portfolio.",
  },
];

export const getWeekById = (id: number) => weeks.find((w) => w.id === id);
