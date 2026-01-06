import { Assignment } from "../types";

export const aceDraft: Assignment = {
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
  skillsAssessed: [
    "argument-identification",
    "toulmin-model",
    "counterarguments",
    "summarising",
    "synthesising",
    "paraphrasing",
    "apa-referencing",
  ],
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
      "Citations & References (10%): APA referencing style correctness",
    ],
    sampleQuestions: [
      "Is it advisable for schools to adopt facial recognition technologies (FRT) on campus?",
      "Write a three-paragraph draft: Introduction (context and thesis), First Body Paragraph (Toulmin model: claim, grounds, warrant), Second Body Paragraph (counterargument and response)",
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
      "Finish writing within 100 minutes.",
    ],
    sampleResponses: {
      highScore: {
        text: "Although facial recognition technology (FRT) is becoming more common in schools worldwide, this paper argues that it is not advisable for schools to adopt FRT on campus due to possible violation of students' privacy... FRT intrudes on students' privacy since the 'informed consent' is not observed (Andrejevic & Selwyn, 2020)... Some opponents claim that even if facial recognition systems scan all students by default, an 'opt-out' mechanism still allows them to later remove their data... However, while 'opt-out' may allow data removal after scanning, the initial collection still violates privacy...",
        score: "81/100 = A-",
        feedback:
          "Clear thesis statement, accurate in-text citations, effective grounds supporting claim, logical warrant, well-developed counterargument and response.",
      },
      lowScore: {
        text: "Facial recognition technology has been adopted by many schools all over the world. However, some parents do not support the FRT in schools due to the privacy issue. Parents think FRT harms their kids a lot... FRT violates students' privacy. It is argued that FRT does not harm their kids because it monitors them 24/7... Although kids are monitored all the time, it can't guarantee their safety.",
        score: "66/100 = B-",
        feedback:
          "Vague claim, informal tone ('think', 'kids'), ineffective warrant, unsupported counterargument and response, incorrect citation usage.",
      },
    },
    aiPolicy: [
      "Bring necessary devices but disable writing-support apps.",
      "This is an individual in-class assessment - no external assistance allowed during the test.",
    ],
    latePolicy:
      "In-class assessment - must be completed during the scheduled time. Make-up tests only with valid medical or official leave certificate within FIVE calendar days.",
    requiredMaterials: ["Writing materials", "Question paper with Article A and Article B excerpts"],
  },
};

