import { Assignment } from "../types";

export const preCourseWriting: Assignment = {
  id: "pre-course-writing",
  title: "Pre-course Writing",
  weight: "2.5%",
  dueWeek: 2,
  type: "take-home",
  description:
    "This pre-course writing consists of two tasks: Task 1 (summary writing) and Task 2 (argumentation). Submissions made before the deadline will be awarded 2.5% (out of 15%) from Class Participation. This task is also used as a baseline to help your instructor understand your starting point in key academic writing skills.",
  requirements: [
    "Task 1: Write a summary of no more than 300 words on the excerpt in the appendix (no copying; no personal views)",
    "Task 2: Write an essay of no more than 300 words on the given topic and show your position (no extra sources)",
    "Do NOT search for additional online or offline sources (e.g., websites, magazines)",
    "Use APA in-text citations (7th edition) to acknowledge ideas from the article where needed",
    "Write in paragraph form: Introduction (background + thesis), Body paragraph(s) (topic sentences), Conclusion",
    "Type Task 1 and Task 2 in the same Word file",
    "Note: Details may change; always check Moodle (Individual Section) for the latest version",
    "Submissions made before the deadline will be awarded 2.5% (out of 15%) from Class Participation",
    "Submit to Moodle (Individual Section) by 23 Jan 2026 (Fri), 6pm (no late submission)",
    "AI-generated text or substantial copying may result in zero marks",
    "Re-submit to Moodle if you have changed your section (the previous submission will be erased)",
  ],
  skillsAssessed: ["summarising", "paraphrasing", "academic-tone"],
  resources: [
    { title: "Access the assignment prompt and submission link on Moodle" },
    { title: "Reading materials: Pre-course Writing Instructions (check Moodle Individual Section for updates)" },
    { title: "Review Module 2: Summarising, paraphrasing & synthesising skills before completing the task" },
  ],
  detailedInfo: {
    exactDueDate: "23 Jan 2026 (Fri), 6:00 PM",
    submissionMethod: "Moodle (Individual Section)",
    format: "Word document (.doc or .docx)",
    wordLimit: "300 words per task (600 words total)",
    gradingCriteria: [
      "Task 1 (Summary): Accuracy of summary, proper paraphrasing, no personal views included",
      "Task 2 (Essay): Clear position statement, logical reasoning, proper structure",
      "APA citation usage where required",
      "Originality (AI-generated text will result in zero marks)",
    ],
    sampleQuestions: [
      "Task 1: Summarise the excerpt about facial recognition technology in schools in no more than 300 words",
      "Task 2: Write an essay (max 300 words) on: 'Is it advisable for schools to adopt facial recognition technologies on campus? Why or why not?'",
    ],
    instructions: [
      "Task 1 (Summary Writing): Write a summary of no more than 300 words on the excerpt of an academic journal article. Do NOT directly copy sentences from the excerpt – write them in your own words. Do NOT include your own views in the summary.",
      "Task 2 (Argumentation Essay): Write an essay of no more than 300 words showing your position on the topic. Include your own views and knowledge. Citing examples or ideas from the journal article is optional. Do NOT search for additional online or offline sources.",
      "Use APA in-text citations (7th edition) to acknowledge ideas from the article in your summary and essay.",
      "Write in paragraph form with: Introduction (background and thesis), Body paragraph(s) (with topic sentences), Conclusion.",
      "Type both tasks in the same Word file and submit to Moodle (Individual Section) by 23 Jan 2026 (Fri), 6pm.",
      "Submissions made before the deadline will be awarded 2.5% (out of 15%) from Class Participation.",
      "No late submission is allowed.",
      "Re-submit to Moodle if you have changed your section, as the submission in the previous section will be erased automatically.",
    ],
    aiPolicy: [
      "If AI detection tools indicate that your writing consists of AI-generated text, you will be awarded zero marks.",
      "If you directly copy a significant portion of the source text, you will be awarded zero marks.",
    ],
    latePolicy: "No late submission is allowed.",
    requiredMaterials: [
      "Appendix excerpt from Andrejevic & Selwyn (2020) 'Facial recognition technology in schools: critical questions and concerns'",
    ],
  },
};

