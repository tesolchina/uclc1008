import { Assignment } from "../types";

export const craa: Assignment = {
  id: "craa",
  title: "Critical Response to Academic Arguments (CRAA)",
  weight: "20%",
  dueWeek: 13,
  type: "in-class",
  description:
    "Listen to a short audio clip with background information and an argument, then prepare and deliver a verbal summary and rebuttal.",
  requirements: [
    "Listen carefully to the audio clip (background info + argument)",
    "Prepare a spoken response within the given time",
    "Summarise the argument you heard accurately",
    "Deliver a clear rebuttal to the argument",
    "Present verbally in the assessment venue",
  ],
  skillsAssessed: ["spoken-response", "summarising", "counterarguments", "critical-evaluation"],
  resources: [
    {
      title: "CRAA Practice Materials",
      url: "https://hkbuhk.sharepoint.com/sites/AllStudents_LC/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FAllStudents%5FLC%2FShared%20Documents%2FMoodle%2FEnglish%2FUCLC1008%20University%20English%20I%2FUE1%5F202526%2FUE1%5F2526S1%2FCritical%20Response%20to%20Academic%20Arguments&p=true&ga=1",
    },
  ],
  detailedInfo: {
    exactDueDate: "Week of 20-24 April 2026 (In-class)",
    submissionMethod: "In-class verbal presentation (recorded)",
    format: "Verbal critical response",
    timeLimit: "Total: 6 minutes (2 min listening + 2 min preparation + 2 min response)",
    gradingCriteria: [
      "Summary Accuracy (40%): Coverage of main ideas, precision, avoidance of misinterpretation",
      "Counterargument Quality (30%): Logic, evidence, persuasiveness",
      "Verbal Delivery (30%): Clarity, pronunciation, fluency",
    ],
    sampleQuestions: [
      "Topics will come from: AI actors, AI-generated art, AI-generated video courses, AI-powered mental health apps, 'Buy now, pay later' services, Drone applications, E-sports, Side hustles, Skills-based hiring practice, Virtual tourism",
      "Example topic: 'Is lab-grown meat worth promoting in the future?' with argument about customisation benefits",
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
      "Spend approximately 1 minute for summary and 1 minute for counterargument and conclusion.",
    ],
    sampleResponses: {
      highScore: {
        text: "The extract discusses lab-grown meat, which is made by growing animal cells in labs, to reduce environmental impact... The speaker argues that lab-grown meat should be promoted because it can be customised... While lab-grown meat offers customisation benefits, it may not be as sustainable and healthy as claimed... Studies show current production requires significant energy... lab-grown meat generates 25-30% more carbon emissions than poultry farming...",
        score: "High scoring response",
        feedback: "Accurate summary, clear counterargument with specific evidence, logical reasoning, structured response.",
      },
      lowScore: {
        text: "Lab-grown meat is a new food technology that grows animal cells in labs instead of farms... Personally, I think it's acceptable because it's natural... However, don't forget it's expensive... Although lab-grown meat is nice, experts say it might cause cancer... Another problem is that companies lie about how 'green' it is...",
        score: "Low scoring response",
        feedback: "Missing claim in summary, personal opinions included, vague and unsubstantiated counterarguments, weak reasoning.",
      },
    },
    aiPolicy: [
      "This is an individual in-class assessment - no external assistance allowed.",
      "You may only use notes taken during the listening phase.",
    ],
    latePolicy:
      "In-class assessment - must be completed during the scheduled time. Make-up tests only with valid medical or official leave certificate within FIVE calendar days.",
    requiredMaterials: ["Pen/pencil for note-taking", "Student ID card"],
  },
};

