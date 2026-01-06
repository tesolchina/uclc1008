import { Assignment } from "../types";

export const reflectivePortfolio: Assignment = {
  id: "reflective-portfolio",
  title: "Reflective Learning Portfolio",
  weight: "10%",
  dueWeek: 13,
  type: "take-home",
  description:
    "A 500-word reflective analysis of 2-3 learning episodes using AI tools throughout the course, comparing original work with AI-generated versions.",
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
      "Clarity and organisation of portfolio",
    ],
    instructions: [
      "Submit a 500-word reflective report evaluating AI suggestions in two or more of these skill areas:",
      "1. Reading (refer to AI workshop 1, Part 4 or Workshop 2, Part 2)",
      "2. Summarising & Synthesising (refer to AI Workshop 1, Parts 1 & 2)",
      "3. Argumentation (refer to Workshop 2, Part 2)",
      "Steps to follow:",
      "1. Select an AI tool: Use one of the available tools on the HKBU GenAI Platform.",
      "2. Choose 2 to 3 Focus Areas: Pick from the skills listed above.",
      "3. Record, Analyse, and Reflect: Keep a log of AI outputs, compare with your own work, and explain your decisions.",
      "4. Compile and Submit: Attach all records of AI interactions along with your reflection.",
    ],
    aiPolicy: [
      "Keep chat history and revision records.",
      "You may be required to attend an oral defence to verify authenticity.",
      "This portfolio requires you to critically engage with AI—not simply copy its outputs.",
    ],
    latePolicy: "NO LATE SUBMISSION. Submissions after 1 May 2026, 6:00 PM will NOT be accepted.",
    requiredMaterials: ["AI Workshop 1 and 2 materials", "Personal log of AI interactions", "Original drafts and AI-generated versions"],
  },
};

