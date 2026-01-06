import { Assignment } from "../types";

export const peerEvaluation: Assignment = {
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
      "Balance of positive and improvement feedback",
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
      "Submit your evaluation form to your instructor.",
    ],
    aiPolicy: ["This is an individual evaluation activity.", "Focus on providing constructive feedback based on the criteria."],
    latePolicy: "In-class activity - must be completed during the scheduled class time.",
  },
};

