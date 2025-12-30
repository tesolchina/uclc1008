import { Assignment } from "../types";

export const aiReflection: Assignment = {
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
      "Inclusion of required elements (original/revised versions, chat history)",
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
      "Submit the report to Moodle by the deadline.",
    ],
    aiPolicy: [
      "You must retain the chat history from AI tools and your paper revision records.",
      "These may be requested by your teacher if there is suspicion of directly copying AI-generated content.",
      "You may be required to attend an oral defence to verify authenticity of your work.",
    ],
    latePolicy: "Same as ACE Final: 1% penalty per day past deadline. Submit together with ACE Final.",
    requiredMaterials: ["Your ACE Final paper draft", "AI chat history from HKBU GenAI Platform", "ACE Final Checklist"],
  },
};

