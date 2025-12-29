import { Skill } from "./types";

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

export const getSkillById = (id: string) => courseSkills.find((skill) => skill.id === id);
