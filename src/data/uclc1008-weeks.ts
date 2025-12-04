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

export const weeks: WeekData[] = [
  {
    id: 1,
    title: "Week 1",
    theme: "Getting started with university English",
    overview:
      "Orient yourself to the expectations of university-level English and learn how to plan your independent study.",
    learningOutcomes: [
      "Identify key features of successful university communication.",
      "Set realistic language-learning goals for this semester.",
      "Navigate this self-access hub and plan your weekly routine.",
    ],
    resources: [
      {
        title: "Welcome to UCLC 1008 & using the hub effectively",
        type: "video",
        duration: "8 min",
      },
      {
        title: "What is academic English?",
        type: "reading",
        duration: "15 min",
      },
      {
        title: "Goal-setting worksheet",
        type: "practice",
        duration: "20 min",
      },
    ],
    practiceTasks: [
      "Write a short learning goal for this course using the SMART framework.",
      "List three strengths and three areas to improve in your English.",
      "Ask the AI tutor to help you turn your goals into an action plan.",
    ],
    aiPromptHint: "You are a supportive academic skills coach helping first-year students plan their English learning.",
  },
  {
    id: 2,
    title: "Week 2",
    theme: "Listening for gist and detail",
    overview: "Develop strategies to follow lectures and extract key information efficiently.",
    learningOutcomes: [
      "Differentiate listening for main ideas and listening for detail.",
      "Use note-taking symbols and abbreviations.",
      "Summarise a short academic talk in your own words.",
    ],
    resources: [
      { title: "Lecture strategies: before, during, after", type: "video", duration: "10 min" },
      { title: "Model lecture: student wellbeing", type: "listening", duration: "7 min" },
      { title: "Note-taking template", type: "practice" },
    ],
    practiceTasks: [
      "Listen to the model lecture once for gist and write one-sentence summary.",
      "Listen again and complete the note-taking template.",
      "Ask the AI tutor to check and improve your summary.",
    ],
    aiPromptHint: "You help students improve their academic listening and note-taking skills.",
  },
  {
    id: 3,
    title: "Week 3",
    theme: "Academic vocabulary for reading",
    overview: "Build a toolkit for understanding and recording high-frequency academic vocabulary.",
    learningOutcomes: [
      "Recognise common academic word families.",
      "Use context clues to guess meaning.",
      "Record new vocabulary in an organised way.",
    ],
    resources: [
      { title: "The Academic Word List explained", type: "reading", duration: "15 min" },
      { title: "Reading: student transition to university", type: "reading", duration: "20 min" },
      { title: "Vocabulary notebook template", type: "practice" },
    ],
    practiceTasks: [
      "Underline unfamiliar words in the reading and group them by word family.",
      "Complete the vocabulary notebook for at least 8 new words.",
      "Ask the AI tutor to quiz you on these words in example sentences.",
    ],
    aiPromptHint: "You help students notice, understand, and recycle academic vocabulary from short readings.",
  },
  {
    id: 4,
    title: "Week 4",
    theme: "Reading critically",
    overview: "Move from understanding what a text says to evaluating how and why it says it.",
    learningOutcomes: [
      "Identify main claims and supporting evidence in a short article.",
      "Distinguish fact, opinion, and example.",
      "Ask critical questions about a writer's position.",
    ],
    resources: [
      { title: "Critical reading questions", type: "video", duration: "9 min" },
      { title: "Reading: social media and study", type: "reading", duration: "20 min" },
      { title: "Critical reading checklist", type: "practice" },
    ],
    practiceTasks: [
      "Use the checklist to annotate the article.",
      "Write three critical questions you would ask the writer.",
      "Ask the AI tutor whether your questions are strong and how to improve them.",
    ],
    aiPromptHint: "You guide students to ask better questions about academic texts and avoid accepting ideas uncritically.",
  },
  {
    id: 5,
    title: "Week 5",
    theme: "Paragraph structure",
    overview: "Practise writing clear, well-organised academic paragraphs.",
    learningOutcomes: [
      "Identify topic sentences, supporting details, and concluding sentences.",
      "Write unified paragraphs on familiar university topics.",
      "Use basic cohesive devices accurately.",
    ],
    resources: [
      { title: "Model paragraph: student motivation", type: "reading", duration: "10 min" },
      { title: "Paragraph structure mini-lecture", type: "video", duration: "8 min" },
      { title: "Paragraph planner", type: "practice" },
    ],
    practiceTasks: [
      "Highlight each part of the model paragraph.",
      "Plan and draft your own paragraph using the planner.",
      "Paste your paragraph into the AI tutor and ask for feedback on clarity and organisation.",
    ],
    aiPromptHint: "You help students plan and refine short academic paragraphs without rewriting everything for them.",
  },
  {
    id: 6,
    title: "Week 6",
    theme: "Coherence and cohesion",
    overview: "Link ideas smoothly so that readers can follow your argument.",
    learningOutcomes: [
      "Use linking phrases accurately to show relationships between ideas.",
      "Avoid overusing basic connectors like 'and' or 'but'.",
      "Check paragraphs for clear progression of ideas.",
    ],
    resources: [
      { title: "Linking phrases reference sheet", type: "reading" },
      { title: "Cohesion in student writing", type: "video", duration: "7 min" },
      { title: "Cohesion editing exercise", type: "practice" },
    ],
    practiceTasks: [
      "Rewrite a short paragraph using more precise linking phrases.",
      "Ask the AI tutor to highlight any unclear connections between ideas.",
      "Create three of your own example sentences with new connectors.",
    ],
    aiPromptHint: "You specialise in helping students use cohesive devices naturally in academic English.",
  },
  {
    id: 7,
    title: "Week 7",
    theme: "Presentation skills",
    overview: "Prepare and deliver short, focused academic presentations.",
    learningOutcomes: [
      "Structure a short presentation with a clear beginning, middle, and end.",
      "Use signposting language to guide your audience.",
      "Speak with understandable pace and emphasis.",
    ],
    resources: [
      { title: "Presentation signposting language", type: "reading" },
      { title: "Student presentation sample", type: "video", duration: "6 min" },
      { title: "Slide planning template", type: "practice" },
    ],
    practiceTasks: [
      "Draft a short presentation outline on a course-related topic.",
      "Ask the AI tutor to suggest clearer transitions between your points.",
      "Practise aloud and time yourself, then note areas to improve.",
    ],
    aiPromptHint: "You help students design and rehearse short, effective academic presentations.",
  },
  {
    id: 8,
    title: "Week 8",
    theme: "Discussion and tutorial skills",
    overview: "Participate more confidently in tutorials and group discussions.",
    learningOutcomes: [
      "Use phrases for agreeing, disagreeing, and building on ideas.",
      "Ask follow-up questions to keep a discussion going.",
      "Respond politely when you do not understand.",
    ],
    resources: [
      { title: "Useful discussion phrases", type: "reading" },
      { title: "Tutorial extract: group project", type: "listening", duration: "6 min" },
      { title: "Role-play cards", type: "practice" },
    ],
    practiceTasks: [
      "Write 6–8 discussion phrases you want to start using.",
      "Ask the AI tutor to help you reformulate any that sound unnatural.",
      "Practise mini-dialogues using your new phrases.",
    ],
    aiPromptHint: "You coach students to sound polite, natural, and confident in university discussions.",
  },
  {
    id: 9,
    title: "Week 9",
    theme: "Referencing and avoiding plagiarism",
    overview: "Use sources ethically and acknowledge them correctly.",
    learningOutcomes: [
      "Explain what plagiarism is in your own words.",
      "Paraphrase short sections of a text accurately.",
      "Use basic in-text citation patterns correctly.",
    ],
    resources: [
      { title: "What counts as plagiarism?", type: "reading", duration: "15 min" },
      { title: "Paraphrasing mini-lecture", type: "video", duration: "9 min" },
      { title: "Citation pattern examples", type: "reading" },
    ],
    practiceTasks: [
      "Paraphrase two short extracts and compare them with the originals.",
      "Ask the AI tutor whether your paraphrases are too close to the source and how to improve them.",
      "Write three sample in-text citations using different reporting verbs.",
    ],
    aiPromptHint: "You help students paraphrase and reference sources responsibly without generating full assignments.",
  },
  {
    id: 10,
    title: "Week 10",
    theme: "Listening and note-taking for exams",
    overview: "Transfer your listening strategies to more exam-like contexts.",
    learningOutcomes: [
      "Predict content from exam-style questions.",
      "Listen selectively for key information under time pressure.",
      "Check and tidy your notes after listening.",
    ],
    resources: [
      { title: "Exam listening strategies", type: "video", duration: "8 min" },
      { title: "Practice lecture: study skills", type: "listening", duration: "10 min" },
      { title: "Exam-style note-taking sheet", type: "practice" },
    ],
    practiceTasks: [
      "Listen once for gist and predict the structure of the talk.",
      "Listen again and complete the note-taking sheet.",
      "Ask the AI tutor for feedback on how to make your notes clearer and more compact.",
    ],
    aiPromptHint: "You help students refine their listening and note-taking strategies for exam conditions.",
  },
  {
    id: 11,
    title: "Week 11",
    theme: "Short exam-style writing",
    overview: "Practise planning and writing under time pressure.",
    learningOutcomes: [
      "Plan short exam answers quickly and logically.",
      "Use clear paragraphing even in timed conditions.",
      "Check for common grammar and vocabulary errors.",
    ],
    resources: [
      { title: "Planning exam answers in 5 minutes", type: "video", duration: "6 min" },
      { title: "Sample exam question and answer", type: "reading" },
      { title: "Timed writing checklist", type: "practice" },
    ],
    practiceTasks: [
      "Write a short response to the sample question within 20 minutes.",
      "Paste your answer into the AI tutor and ask for language-focused feedback only.",
      "Rewrite one paragraph based on the feedback.",
    ],
    aiPromptHint: "You support students in improving short exam-style writing without giving them full model answers.",
  },
  {
    id: 12,
    title: "Week 12",
    theme: "Review and integration",
    overview: "Bring together skills from earlier weeks and identify remaining gaps.",
    learningOutcomes: [
      "Review your progress across the four skills.",
      "Identify at least three priority areas for final revision.",
      "Create a realistic revision plan for the last weeks.",
    ],
    resources: [
      { title: "Self-assessment checklist", type: "practice" },
      { title: "Review quiz: key concepts", type: "quiz", duration: "12 min" },
      { title: "Revision planner", type: "practice" },
    ],
    practiceTasks: [
      "Complete the self-assessment checklist honestly.",
      "Ask the AI tutor to help you design a revision plan based on your priorities.",
      "Schedule at least three short study sessions in your calendar.",
    ],
    aiPromptHint: "You help students review their learning and turn it into a concrete revision plan.",
  },
  {
    id: 13,
    title: "Week 13",
    theme: "Reflection and next steps",
    overview: "Reflect on your development and plan how to continue beyond this course.",
    learningOutcomes: [
      "Describe how your English has developed this semester.",
      "Identify strategies that worked best for you.",
      "Set next-step goals for English in your degree programme.",
    ],
    resources: [
      { title: "End-of-course reflection prompts", type: "reading" },
      { title: "Student reflection samples", type: "reading" },
      { title: "Goal-setting template: beyond UCLC 1008", type: "practice" },
    ],
    practiceTasks: [
      "Write a short reflection on your progress using the prompts.",
      "Share key parts with the AI tutor and ask for help expressing them more clearly.",
      "Set two concrete language goals for next semester.",
    ],
    aiPromptHint: "You support students in reflecting on their learning and expressing future goals in clear English.",
  },
];

export const getWeekById = (id: number) => weeks.find((w) => w.id === id);
