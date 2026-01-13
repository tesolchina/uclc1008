import { Assignment } from "../types";

export const academicWritingQuiz: Assignment = {
  id: "academic-writing-quiz",
  title: "Academic Writing Quiz (AWQ)",
  weight: "15%",
  dueWeek: 6,
  type: "in-class",
  duration: "60 minutes",
  description: "Analyse academic texts to summarise, synthesise, and paraphrase key information with proper citations and academic tone.",
  requirements: [
    "Summarise key information from provided academic texts",
    "Synthesise ideas from multiple sources",
    "Paraphrase accurately while maintaining meaning",
    "Use appropriate academic tone throughout",
    "Include proper in-text citations and references",
  ],
  skillsAssessed: ["summarising", "paraphrasing", "synthesising", "academic-tone", "apa-referencing"],
  detailedInfo: {
    exactDueDate: "Week 6 (23-27 February 2026) - Exact date TBA",
    submissionMethod: "In-class written answer sheet",
    format: "Handwritten or typed answer sheet",
    wordLimit: "Maximum 300 words",
    timeLimit: "60 minutes",
    gradingCriteria: [
      "Summary Accuracy (20%): Coverage of main ideas, precision, avoidance of misinterpretation",
      "Synthesis (20%): Connection of main ideas and relationships among ideas",
      "Paraphrasing (20%): Originality of wording and preservation of meaning",
      "Academic Tone & Clarity (20%): Formality, clarity, flow of ideas and cohesion",
      "In-text Citations (20%): APA referencing style correctness",
    ],
    sampleQuestions: [
      "Your task is to summarise, paraphrase and synthesise the main claims or arguments from TWO excerpts on the adoption of Facial Recognition Technology (FRT) in schools in no more than 300 words.",
      "Do NOT include your own views in the summary.",
      "Do NOT directly copy sentences from the excerpts – you need to write them in your own words.",
      "Use APA in-text citations (7th edition) to acknowledge ideas from the articles.",
    ],
    instructions: [
      "You must read the excerpts of TWO academic journal articles (Articles A and B) placed in the appendix.",
      "Write your summary in paragraph form with: Introduction (including background and thesis), Body paragraph(s), Conclusion.",
      "Use APA in-text citations in three styles: Author-prominent, Signal-phrase, or Information-prominent.",
      "Do NOT cite the abstract as its purpose is to contextualise the excerpt.",
      "End-of-text citations or a reference list is NOT required.",
      "You are NOT allowed to use any online or AI tools during the test.",
      "A glossary is provided for specialised terms - you are NOT required to include definitions in your writing.",
    ],
    sampleResponses: {
      highScore: {
        text: "Facial recognition technology (FRT) is increasingly incorporated in schools, aiming to improve functions like security. This summary reports key arguments for and against the adoption of FRT in schools... The debate surrounding facial recognition in schools is fundamentally a conflict over its potential benefits brought to schools in the areas of safety versus its potential to infringe upon privacy and normalise surveillance (Andrejevic & Selwyn, 2020; Hong et al., 2022)...",
        score: "80/100 = A-",
        feedback:
          "Effective synthesis in topic sentence, accurate citations, precise summaries of both excerpts, rewording in student's own voice.",
      },
      lowScore: {
        text: "Facial recognition technology is used more and more in schools all over the world. It helps with things like school security... Article A says that many parents support facial recognition technology... Article B says facial recognition is bad because there is no option for students to self-curate...",
        score: "61/100 = C+",
        feedback:
          "Vague thesis statement, missing synthesis between articles, unnecessary details included, frequent use of informal phrasing, incorrect citation formatting.",
      },
    },
    aiPolicy: [
      "You are NOT allowed to use any online or AI tools (including online dictionaries, paraphrasing or translation apps) during the test.",
      "This is an individual in-class assessment - no external resources allowed.",
    ],
    latePolicy:
      "In-class assessment - must be completed during the scheduled time. Make-up tests only with valid medical or official leave certificate within FIVE calendar days.",
    requiredMaterials: ["Pen or pencil", "Answer sheet (provided)", "Question paper with Article A and Article B excerpts"],
  },
};

