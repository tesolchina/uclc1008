import { Assignment } from "./types";

export const courseAssignments: Assignment[] = [
  {
    id: "pre-course-writing",
    title: "Pre-course Writing",
    weight: "2.5% (Class Participation)",
    dueWeek: 2,
    type: "take-home",
    description: "This pre-course writing consists of two tasks: Task 1 (summary writing) and Task 2 (argumentation). Submissions made before the deadline will be awarded 2.5% (out of 15%) from Class Participation. This task is also used as a baseline to help your instructor understand your starting point in key academic writing skills.",
    requirements: [
      "Task 1: Write a summary of no more than 300 words on the excerpt in the appendix (no copying; no personal views)",
      "Task 2: Write an essay of no more than 300 words on the given topic and show your position (no extra sources)",
      "Do NOT search for additional online or offline sources (e.g., websites, magazines)",
      "Use APA in-text citations (7th edition) to acknowledge ideas from the article where needed",
      "Write in paragraph form: Introduction (background + thesis), Body paragraph(s) (topic sentences), Conclusion",
      "Type Task 1 and Task 2 in the same Word file",
      "Submissions made before the deadline will be awarded 2.5% (out of 15%) from Class Participation",
      "Submit to Moodle (Individual Section) by 23 Jan 2026 (Fri), 6pm (no late submission)",
      "AI-generated text or substantial copying may result in zero marks",
      "Re-submit to Moodle if you have changed your section (the previous submission will be erased)",
    ],
    skillsAssessed: ["summarising", "paraphrasing", "academic-tone"],
    resources: [
      { title: "Access the assignment prompt and submission link on Moodle" },
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
        "Originality (AI-generated text will result in zero marks)"
      ],
      sampleQuestions: [
        "Task 1: Summarise the excerpt about facial recognition technology in schools in no more than 300 words",
        "Task 2: Write an essay (max 300 words) on: 'Is it advisable for schools to adopt facial recognition technologies on campus? Why or why not?'"
      ],
      instructions: [
        "Task 1 (Summary Writing): Write a summary of no more than 300 words on the excerpt of an academic journal article. Do NOT directly copy sentences from the excerpt – write them in your own words. Do NOT include your own views in the summary.",
        "Task 2 (Argumentation Essay): Write an essay of no more than 300 words showing your position on the topic. Include your own views and knowledge. Citing examples or ideas from the journal article is optional. Do NOT search for additional online or offline sources.",
        "Use APA in-text citations (7th edition) to acknowledge ideas from the article in your summary and essay.",
        "Write in paragraph form with: Introduction (background and thesis), Body paragraph(s) (with topic sentences), Conclusion.",
        "Type both tasks in the same Word file and submit to Moodle (Individual Section) by 23 Jan 2026 (Fri), 6pm.",
        "Submissions made before the deadline will be awarded 2.5% (out of 15%) from Class Participation.",
        "No late submission is allowed.",
        "Re-submit to Moodle if you have changed your section, as the submission in the previous section will be erased automatically."
      ],
      aiPolicy: [
        "If AI detection tools indicate that your writing consists of AI-generated text, you will be awarded zero marks.",
        "If you directly copy a significant portion of the source text, you will be awarded zero marks."
      ],
      latePolicy: "No late submission is allowed.",
      requiredMaterials: [
        "Appendix excerpt from Andrejevic & Selwyn (2020) 'Facial recognition technology in schools: critical questions and concerns'"
      ]
    },
  },
  {
    id: "referencing-quiz",
    title: "Referencing Quiz",
    weight: "2.5%",
    dueWeek: 3,
    type: "online",
    description: "Watch two short videos on APA 7th citation style and complete the quiz. You have only ONE attempt.",
    requirements: [
      "Watch Video 1: Citing Journal Articles in APA 7th Style",
      "Watch Video 2: Citing Secondary Sources in APA 7th Style",
      "Complete the quiz on Moodle (one attempt only)",
      "Review both videos thoroughly before attempting",
    ],
    skillsAssessed: ["citation-recognition", "apa-referencing", "secondary-citations"],
    resources: [
      { title: "Video 1: Citing Journal Articles in APA 7th Style", url: "https://www.youtube.com/watch?v=JpT1YwNcV04" },
      { title: "Video 2: Citing Secondary Sources in APA 7th Style", url: "https://www.youtube.com/watch?v=qB6eFDNyz0E" },
    ],
    detailedInfo: {
      exactDueDate: "30 January 2026, 6:00 PM",
      submissionMethod: "Moodle Online Quiz",
      format: "Online multiple-choice/short answer quiz",
      timeLimit: "To be announced on Moodle",
      gradingCriteria: [
        "Correct identification of APA 7th citation elements",
        "Proper formatting of in-text citations",
        "Understanding of secondary citation usage",
        "Recognition of reference list formatting"
      ],
      instructions: [
        "Watch both flipped classroom videos before attempting the quiz",
        "You have ONLY ONE attempt at this quiz",
        "Complete the quiz on Moodle by the deadline",
        "NO LATE SUBMISSION ALLOWED"
      ],
      aiPolicy: [
        "This is an individual assessment - no collaboration allowed",
        "Use only the provided video resources for preparation"
      ],
      latePolicy: "NO LATE SUBMISSION ALLOWED. Quizzes cannot be submitted after the deadline."
    },
  },
  {
    id: "academic-writing-quiz",
    title: "Academic Writing Quiz (AWQ)",
    weight: "15%",
    dueWeek: 6,
    type: "in-class",
    duration: "45-50 minutes",
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
      exactDueDate: "Week of 23-27 February 2026 (In-class)",
      submissionMethod: "In-class written answer sheet",
      format: "Handwritten or typed answer sheet",
      wordLimit: "Maximum 300 words",
      timeLimit: "50 minutes",
      gradingCriteria: [
        "Summary Accuracy (20%): Coverage of main ideas, precision, avoidance of misinterpretation",
        "Synthesis (20%): Connection of main ideas and relationships among ideas",
        "Paraphrasing (20%): Originality of wording and preservation of meaning",
        "Academic Tone & Clarity (20%): Formality, clarity, flow of ideas and cohesion",
        "In-text Citations (20%): APA referencing style correctness"
      ],
      sampleQuestions: [
        "Your task is to summarise, paraphrase and synthesise the main claims or arguments from TWO excerpts on the adoption of Facial Recognition Technology (FRT) in schools in no more than 300 words.",
        "Do NOT include your own views in the summary.",
        "Do NOT directly copy sentences from the excerpts – you need to write them in your own words.",
        "Use APA in-text citations (7th edition) to acknowledge ideas from the articles."
      ],
      instructions: [
        "You must read the excerpts of TWO academic journal articles (Articles A and B) placed in the appendix.",
        "Write your summary in paragraph form with: Introduction (including background and thesis), Body paragraph(s), Conclusion.",
        "Use APA in-text citations in three styles: Author-prominent, Signal-phrase, or Information-prominent.",
        "Do NOT cite the abstract as its purpose is to contextualise the excerpt.",
        "End-of-text citations or a reference list is NOT required.",
        "You are NOT allowed to use any online or AI tools during the test.",
        "A glossary is provided for specialised terms - you are NOT required to include definitions in your writing."
      ],
      sampleResponses: {
        highScore: {
          text: "Facial recognition technology (FRT) is increasingly incorporated in schools, aiming to improve functions like security. This summary reports key arguments for and against the adoption of FRT in schools... The debate surrounding facial recognition in schools is fundamentally a conflict over its potential benefits brought to schools in the areas of safety versus its potential to infringe upon privacy and normalise surveillance (Andrejevic & Selwyn, 2020; Hong et al., 2022)...",
          score: "80/100 = A-",
          feedback: "Effective synthesis in topic sentence, accurate citations, precise summaries of both excerpts, rewording in student's own voice."
        },
        lowScore: {
          text: "Facial recognition technology is used more and more in schools all over the world. It helps with things like school security... Article A says that many parents support facial recognition technology... Article B says facial recognition is bad because there is no option for students to self-curate...",
          score: "61/100 = C+",
          feedback: "Vague thesis statement, missing synthesis between articles, unnecessary details included, frequent use of informal phrasing, incorrect citation formatting."
        }
      },
      aiPolicy: [
        "You are NOT allowed to use any online or AI tools (including online dictionaries, paraphrasing or translation apps) during the test.",
        "This is an individual in-class assessment - no external resources allowed."
      ],
      latePolicy: "In-class assessment - must be completed during the scheduled time. Make-up tests only with valid medical or official leave certificate within FIVE calendar days.",
      requiredMaterials: [
        "Pen or pencil",
        "Answer sheet (provided)",
        "Question paper with Article A and Article B excerpts"
      ]
    },
  },
  {
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
    skillsAssessed: ["argument-identification", "toulmin-model", "counterarguments", "summarising", "synthesising", "paraphrasing", "apa-referencing"],
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
        "Citations & References (10%): APA referencing style correctness"
      ],
      sampleQuestions: [
        "Is it advisable for schools to adopt facial recognition technologies (FRT) on campus?",
        "Write a three-paragraph draft: Introduction (context and thesis), First Body Paragraph (Toulmin model: claim, grounds, warrant), Second Body Paragraph (counterargument and response)"
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
        "Finish writing within 100 minutes."
      ],
      sampleResponses: {
        highScore: {
          text: "Although facial recognition technology (FRT) is becoming more common in schools worldwide, this paper argues that it is not advisable for schools to adopt FRT on campus due to possible violation of students' privacy... FRT intrudes on students' privacy since the 'informed consent' is not observed (Andrejevic & Selwyn, 2020)... Some opponents claim that even if facial recognition systems scan all students by default, an 'opt-out' mechanism still allows them to later remove their data... However, while 'opt-out' may allow data removal after scanning, the initial collection still violates privacy...",
          score: "81/100 = A-",
          feedback: "Clear thesis statement, accurate in-text citations, effective grounds supporting claim, logical warrant, well-developed counterargument and response."
        },
        lowScore: {
          text: "Facial recognition technology has been adopted by many schools all over the world. However, some parents do not support the FRT in schools due to the privacy issue. Parents think FRT harms their kids a lot... FRT violates students' privacy. It is argued that FRT does not harm their kids because it monitors them 24/7... Although kids are monitored all the time, it can't guarantee their safety.",
          score: "66/100 = B-",
          feedback: "Vague claim, informal tone ('think', 'kids'), ineffective warrant, unsupported counterargument and response, incorrect citation usage."
        }
      },
      aiPolicy: [
        "Bring necessary devices but disable writing-support apps.",
        "This is an individual in-class assessment - no external assistance allowed during the test."
      ],
      latePolicy: "In-class assessment - must be completed during the scheduled time. Make-up tests only with valid medical or official leave certificate within FIVE calendar days.",
      requiredMaterials: [
        "Writing materials",
        "Question paper with Article A and Article B excerpts"
      ]
    },
  },
  {
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
        "Balance of positive and improvement feedback"
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
        "Submit your evaluation form to your instructor."
      ],
      aiPolicy: [
        "This is an individual evaluation activity.",
        "Focus on providing constructive feedback based on the criteria."
      ],
      latePolicy: "In-class activity - must be completed during the scheduled class time."
    },
  },
  {
    id: "ace-final",
    title: "Argument Construction and Evaluation (Final)",
    weight: "20%",
    dueWeek: 13,
    type: "take-home",
    description: "Revise and extend your draft to approximately 800 words, incorporating feedback from teachers, AI tools, and peers.",
    requirements: [
      "Extend the draft to approximately 800 words",
      "Incorporate feedback from teachers, AI tools, and peers",
      "Strengthen your argument, counterargument, and rebuttal",
      "Follow a selected argumentation model clearly and persuasively",
      "Ensure proper citations and references",
      "Submit via Moodle by the deadline",
    ],
    skillsAssessed: ["toulmin-model", "counterarguments", "synthesising", "academic-tone", "apa-referencing", "ai-editing"],
    detailedInfo: {
      exactDueDate: "1 May 2026, 6:00 PM",
      submissionMethod: "Moodle submission",
      format: "Six-paragraph position paper",
      wordLimit: "Approximately 800 words (no more than 900 words)",
      gradingCriteria: [
        "Argument development and logical structure",
        "Incorporation of feedback from multiple sources",
        "Quality of evidence and reasoning",
        "Academic tone and writing clarity",
        "APA citation and referencing correctness"
      ],
      sampleQuestions: [
        "Revise the first draft of your position paper in response to: 'Is working from home a worthwhile mode of work for employees?'",
        "Write a six-paragraph position paper following the specified structure"
      ],
      instructions: [
        "Revise the first draft of your position paper in response to the topic: 'Is working from home a worthwhile mode of work for employees?'",
        "Write a six-paragraph position paper of no more than 900 words, following this structure:",
        "1. Introduction: Set up the context and present your overall thesis, including your stance and a preview of two claims.",
        "2. First Body Paragraph: Structure using Toulmin model's three essential elements: (a) clear claim, (b) evidence/data from journal articles (grounds), (c) elaboration/explanation (warrant).",
        "3. Second Body Paragraph: Focus exclusively on refuting the first claim: (a) counterargument, (b) response.",
        "4. Third Body Paragraph: Your second claim following same requirements as paragraph 2.",
        "5. Fourth Body Paragraph: Focus exclusively on refuting the second claim following same requirements as paragraph 3.",
        "6. Conclusion: Summarise your claims and restate your stance.",
        "Use evidence from at least 3 of the given journal articles to support your arguments.",
        "Include in-text citations whenever necessary, and an end-of-text reference list (APA style).",
        "Submit to Moodle by the deadline."
      ],
      aiPolicy: [
        "Ethical use of AI for learning (e.g., brainstorming, exploring information) is encouraged.",
        "Submitting AI-generated output as your own work violates academic integrity guidelines.",
        "If AI detection tools suggest high percentage of AI-generated text, you must submit detailed record of AI tool use.",
        "Instructor may request an in-person oral or written defence.",
        "Failure to attend mandatory defence may result in assignment failure."
      ],
      latePolicy: "Late submissions incur 1% penalty per day past deadline (weekends and holidays included). Example: 17% score - 2 days late = 15% final score. Valid reasons for late submission must be discussed with lecturer prior to due date.",
      requiredMaterials: [
        "Your ACE Draft with feedback",
        "Journal articles provided in 'Assignment Instructions-ACE' folder on Moodle"
      ]
    },
  },
  {
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
        "Inclusion of required elements (original/revised versions, chat history)"
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
        "Submit the report to Moodle by the deadline."
      ],
      aiPolicy: [
        "You must retain the chat history from AI tools and your paper revision records.",
        "These may be requested by your teacher if there is suspicion of directly copying AI-generated content.",
        "You may be required to attend an oral defence to verify authenticity of your work."
      ],
      latePolicy: "Same as ACE Final: 1% penalty per day past deadline. Submit together with ACE Final.",
      requiredMaterials: [
        "Your ACE Final paper draft",
        "AI chat history from HKBU GenAI Platform",
        "ACE Final Checklist"
      ]
    },
  },
  {
    id: "craa",
    title: "Critical Response to Academic Arguments (CRAA)",
    weight: "20%",
    dueWeek: 13,
    type: "in-class",
    description: "Listen to a short audio clip with background information and an argument, then prepare and deliver a verbal summary and rebuttal.",
    requirements: [
      "Listen carefully to the audio clip (background info + argument)",
      "Prepare a spoken response within the given time",
      "Summarise the argument you heard accurately",
      "Deliver a clear rebuttal to the argument",
      "Present verbally in the assessment venue",
    ],
    skillsAssessed: ["spoken-response", "summarising", "counterarguments", "critical-evaluation"],
    resources: [
      { title: "CRAA Practice Materials", url: "https://hkbuhk.sharepoint.com/sites/AllStudents_LC/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FAllStudents%5FLC%2FShared%20Documents%2FMoodle%2FEnglish%2FUCLC1008%20University%20English%20I%2FUE1%5F202526%2FUE1%5F2526S1%2FCritical%20Response%20to%20Academic%20Arguments&p=true&ga=1" },
    ],
    detailedInfo: {
      exactDueDate: "Week of 20-24 April 2026 (In-class)",
      submissionMethod: "In-class verbal presentation (recorded)",
      format: "Verbal critical response",
      timeLimit: "Total: 6 minutes (2 min listening + 2 min preparation + 2 min response)",
      gradingCriteria: [
        "Summary Accuracy (40%): Coverage of main ideas, precision, avoidance of misinterpretation",
        "Counterargument Quality (30%): Logic, evidence, persuasiveness",
        "Verbal Delivery (30%): Clarity, pronunciation, fluency"
      ],
      sampleQuestions: [
        "Topics will come from: AI actors, AI-generated art, AI-generated video courses, AI-powered mental health apps, 'Buy now, pay later' services, Drone applications, E-sports, Side hustles, Skills-based hiring practice, Virtual tourism",
        "Example topic: 'Is lab-grown meat worth promoting in the future?' with argument about customisation benefits"
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
        "Spend approximately 1 minute for summary and 1 minute for counterargument and conclusion."
      ],
      sampleResponses: {
        highScore: {
          text: "The extract discusses lab-grown meat, which is made by growing animal cells in labs, to reduce environmental impact... The speaker argues that lab-grown meat should be promoted because it can be customised... While lab-grown meat offers customisation benefits, it may not be as sustainable and healthy as claimed... Studies show current production requires significant energy... lab-grown meat generates 25-30% more carbon emissions than poultry farming...",
          score: "High scoring response",
          feedback: "Accurate summary, clear counterargument with specific evidence, logical reasoning, structured response."
        },
        lowScore: {
          text: "Lab-grown meat is a new food technology that grows animal cells in labs instead of farms... Personally, I think it's acceptable because it's natural... However, don't forget it's expensive... Although lab-grown meat is nice, experts say it might cause cancer... Another problem is that companies lie about how 'green' it is...",
          score: "Low scoring response",
          feedback: "Missing claim in summary, personal opinions included, vague and unsubstantiated counterarguments, weak reasoning."
        }
      },
      aiPolicy: [
        "This is an individual in-class assessment - no external assistance allowed.",
        "You may only use notes taken during the listening phase."
      ],
      latePolicy: "In-class assessment - must be completed during the scheduled time. Make-up tests only with valid medical or official leave certificate within FIVE calendar days.",
      requiredMaterials: [
        "Pen/pencil for note-taking",
        "Student ID card"
      ]
    },
  },
  {
    id: "reflective-portfolio",
    title: "Reflective Learning Portfolio",
    weight: "10%",
    dueWeek: 13,
    type: "take-home",
    description: "A 500-word reflective analysis of 2-3 learning episodes using AI tools throughout the course, comparing original work with AI-generated versions.",
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
        "Clarity and organisation of portfolio"
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
        "4. Compile and Submit: Attach all records of AI interactions along with your reflection."
      ],
      aiPolicy: [
        "Keep chat history and revision records.",
        "You may be required to attend an oral defence to verify authenticity.",
        "This portfolio requires you to critically engage with AI—not simply copy its outputs."
      ],
      latePolicy: "NO LATE SUBMISSION. Submissions after 1 May 2026, 6:00 PM will NOT be accepted.",
      requiredMaterials: [
        "AI Workshop 1 and 2 materials",
        "Personal log of AI interactions",
        "Original drafts and AI-generated versions"
      ]
    },
  },
];

export const getAssignmentById = (id: string) => courseAssignments.find((a) => a.id === id);
export const getAssignmentsByWeek = (weekId: number) => courseAssignments.filter((a) => a.dueWeek === weekId);
