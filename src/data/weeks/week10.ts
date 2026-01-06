import { WeekData, WeekMeta } from "../types";

export const week10: WeekData = {
  id: 10,
  title: "Week 10",
  theme: "Introduction to CRAA (Critical Reading and Academic Argumentation)",
  overview:
    "This week introduces Critical Reading and Academic Argumentation (CRAA), combining analytical reading skills with structured argumentative writing. You will learn to critically evaluate texts and build well-supported academic arguments.",
  inClassActivities: [
    "Introduction to CRAA framework",
    "Critical reading strategies workshop",
    "Academic argumentation techniques",
  ],
  learningOutcomes: [
    "Understand the principles of Critical Reading and Academic Argumentation (CRAA).",
    "Apply critical reading strategies to evaluate academic texts.",
    "Build structured academic arguments using evidence and reasoning.",
    "Identify and address counterarguments in argumentative writing.",
  ],
  resources: [
    {
      title: "CRAA Framework Overview",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Critical Reading Strategies",
      type: "video",
      duration: "20 min",
    },
    {
      title: "Building Academic Arguments",
      type: "practice",
      duration: "30 min",
    },
  ],
  practiceTasks: [
    "Read a sample academic text and identify the main claim, supporting evidence, and potential counterarguments.",
    "Practice annotating a short article using critical reading techniques.",
    "Write a short argumentative paragraph using the Toulmin model structure.",
  ],
  aiPromptHint:
    "You help students understand CRAA principles, practice critical reading strategies, and develop structured academic arguments.",
  skillsIntroduced: ["critical-reading", "academic-argumentation"],
  skillsReinforced: ["toulmin-model", "counterarguments", "evidence-evaluation"],
  assignmentsUpcoming: ["peer-evaluation", "ace-final", "ai-reflection"],
  lessons: [
    {
      id: 1,
      title: "Understanding CRAA: Critical Reading and Academic Argumentation",
      examples: [
        "In a journal article about climate change, critically reading involves identifying the author's main claim (e.g., 'Human activities are the primary cause of global warming') and evaluating the evidence supporting it, such as statistical data from ice core samples and temperature records.",
        "When building an academic argument for an essay, students might claim that 'Social media has both positive and negative impacts on mental health,' then support this with counterarguments addressing potential biases in studies and alternative explanations.",
        "A CRAA analysis of a political speech could involve examining the speaker's use of rhetorical devices, assessing the credibility of cited sources, and constructing a counterargument based on opposing viewpoints from reliable data."
      ],
      notes: [
        "CRAA stands for Critical Reading and Academic Argumentation, a framework that combines analytical reading skills with structured argumentative writing. For example, when reading an article on education reform, you would identify the author's thesis, evaluate supporting evidence, and consider alternative perspectives.",
        "Critical reading involves questioning the text: Who is the author and what are their credentials? What is the main argument? What evidence supports it? Are there biases or assumptions? For instance, in reading 'The Impact of Online Learning on Student Performance,' you might note if the study only surveyed urban students, limiting generalizability.",
        "Academic argumentation requires clear claims supported by evidence and reasoning. Using the Toulmin model, a claim like 'Mandatory recycling programs reduce waste' needs grounds (data from cities with such programs), warrants (explanation of how programs work), and qualifiers (acknowledging that success depends on enforcement).",
        "Effective CRAA integrates reading and writing: read critically to identify strong arguments, then use those insights to build your own. For example, after analyzing how an author structures counterarguments in a debate article, apply similar techniques in your essay to address opposing views.",
        "Ethical considerations in CRAA include avoiding straw man arguments (misrepresenting opponents' views) and ensuring sources are credible. For instance, when arguing against a policy, cite actual expert opinions rather than anecdotal evidence.",
        "Practice CRAA by annotating texts: highlight claims, underline evidence, and note questions or counterarguments. This builds skills for both understanding complex texts and constructing well-supported arguments."
      ],
      questions: [
        {
          question: "What does CRAA stand for and what are its two main components?",
          type: "short-answer",
          answer: "Critical Reading and Academic Argumentation",
          explanation: "CRAA combines analytical reading skills with structured argumentative writing techniques."
        },
        {
          question: "When critically reading a text, what are three key questions you should ask about the author's argument?",
          type: "short-answer",
          answer: "What is the main claim? What evidence supports it? Are there any biases or assumptions?",
          explanation: "These questions help evaluate the strength and credibility of the argument."
        },
        {
          question: "True or False: Academic argumentation only requires stating your opinion without supporting evidence.",
          type: "true-false",
          answer: "False",
          explanation: "Academic arguments must be supported by credible evidence, reasoning, and consideration of counterarguments."
        },
        {
          question: "What is a 'straw man' argument and why should it be avoided in CRAA?",
          type: "short-answer",
          answer: "A straw man argument misrepresents an opponent's position to make it easier to attack; it should be avoided because it weakens your credibility and doesn't engage with actual arguments.",
          explanation: "Ethical argumentation requires accurately representing opposing views."
        },
        {
          question: "How does the Toulmin model help in building academic arguments?",
          type: "multiple-choice",
          options: [
            "It provides a structure with claims, grounds, warrants, and qualifiers",
            "It focuses only on emotional appeals",
            "It eliminates the need for evidence",
            "It only works for scientific arguments"
          ],
          answer: "It provides a structure with claims, grounds, warrants, and qualifiers",
          explanation: "The Toulmin model ensures arguments are logically structured and well-supported."
        },
        {
          question: "Why is it important to consider counterarguments in academic writing?",
          type: "short-answer",
          answer: "Considering counterarguments strengthens your position by showing awareness of complexity and addressing potential weaknesses.",
          explanation: "This demonstrates critical thinking and makes your argument more persuasive."
        },
        {
          question: "What should you look for when evaluating the credibility of a source for CRAA?",
          type: "multiple-choice",
          options: [
            "Author's credentials and publication date only",
            "Author's expertise, source reputation, evidence quality, and potential biases",
            "Only the number of citations it has",
            "Whether it agrees with your viewpoint"
          ],
          answer: "Author's expertise, source reputation, evidence quality, and potential biases",
          explanation: "Credible sources require comprehensive evaluation beyond surface factors."
        },
        {
          question: "How can critical reading skills improve your argumentative writing?",
          type: "short-answer",
          answer: "Critical reading helps you identify strong argument structures, recognize effective evidence, and understand how to address counterarguments in your own writing.",
          explanation: "Reading critically provides models and strategies for effective argumentation."
        },
        {
          question: "What is the difference between a claim and evidence in an academic argument?",
          type: "short-answer",
          answer: "A claim is the main assertion or position you are arguing for, while evidence is the facts, data, or reasoning that supports the claim.",
          explanation: "Claims need evidence to be convincing and academically valid."
        },
        {
          question: "Why should you annotate texts when preparing for CRAA assignments?",
          type: "multiple-choice",
          options: [
            "It helps memorize the content",
            "It allows you to identify claims, evidence, and potential counterarguments systematically",
            "It makes the text look more organized",
            "It replaces the need for reading the full text"
          ],
          answer: "It allows you to identify claims, evidence, and potential counterarguments systematically",
          explanation: "Annotation is a key strategy for developing critical reading and argumentation skills."
        }
      ]
    },
    {
      id: 2,
      title: "Critical Reading Strategies for Academic Texts",
      examples: [
        "When reading an article on artificial intelligence ethics, identify the author's position (e.g., 'AI development should be regulated'), then evaluate if the evidence (case studies of AI failures) sufficiently supports the claim or if alternative explanations exist.",
        "In analyzing a research paper on social inequality, question the methodology: Does the sample size adequately represent the population? Are the statistical methods appropriate? This helps assess the validity of conclusions.",
        "Reading a political analysis piece critically involves checking for logical fallacies, such as false dilemmas (presenting only two extreme options when more exist) or appeals to emotion rather than evidence."
      ],
      notes: [
        "Critical reading involves active engagement: preview the text (read abstract, introduction, conclusion), identify the thesis, and evaluate the argument structure. For example, in 'The Future of Work in the Digital Age,' first identify if the thesis is that technology will eliminate jobs or create new opportunities.",
        "Evaluate evidence quality: Is it relevant, sufficient, and credible? For instance, in an article citing survey data, check if the survey questions were biased or if the sample was representative of the target population.",
        "Identify assumptions and biases: Authors may assume certain premises are true without justification. For example, an article claiming 'Millennials are entitled' might assume generational differences are innate rather than learned.",
        "Look for logical fallacies: Ad hominem attacks (attacking the person instead of ideas), false cause (correlation mistaken for causation), or hasty generalizations (conclusions based on insufficient evidence).",
        "Consider context and purpose: Why was this written? For whom? A corporate-funded study on environmental regulations might have different motivations than an academic research paper.",
        "Synthesize information: Connect ideas across texts. For example, compare how different authors approach the same topic, noting agreements, contradictions, and gaps in the literature."
      ],
      questions: [
        {
          question: "What are the three main steps in critically reading an academic text?",
          type: "short-answer",
          answer: "Preview the text, identify the main argument, evaluate the evidence and reasoning",
          explanation: "This systematic approach ensures thorough analysis of academic content."
        },
        {
          question: "Why is it important to evaluate the credibility of sources when reading critically?",
          type: "short-answer",
          answer: "Credible sources provide reliable evidence; evaluating them prevents basing arguments on flawed or biased information.",
          explanation: "Source credibility is fundamental to building strong academic arguments."
        },
        {
          question: "What is a logical fallacy, and why should you identify them in academic texts?",
          type: "short-answer",
          answer: "A logical fallacy is an error in reasoning that weakens an argument; identifying them helps assess the validity of claims and avoid similar errors in your writing.",
          explanation: "Recognizing fallacies improves both reading comprehension and argumentative skills."
        },
        {
          question: "How can identifying an author's assumptions improve your critical reading?",
          type: "multiple-choice",
          options: [
            "It helps you agree with everything they say",
            "It allows you to evaluate whether premises are justified and consider alternative viewpoints",
            "It focuses only on the conclusion",
            "It ignores the evidence presented"
          ],
          answer: "It allows you to evaluate whether premises are justified and consider alternative viewpoints",
          explanation: "Understanding assumptions reveals the foundation of arguments and potential weaknesses."
        },
        {
          question: "True or False: All academic texts are completely objective and free from bias.",
          type: "true-false",
          answer: "False",
          explanation: "All authors have perspectives and potential biases; critical reading involves identifying these influences."
        },
        {
          question: "What should you consider when evaluating the relevance of evidence in an academic text?",
          type: "short-answer",
          answer: "Whether the evidence directly supports the claim, is recent enough for the topic, and comes from appropriate sources",
          explanation: "Relevant evidence strengthens arguments while irrelevant evidence weakens them."
        },
        {
          question: "How does considering the context of a text affect your critical reading?",
          type: "short-answer",
          answer: "Understanding the author's purpose, audience, and circumstances helps interpret the argument more accurately and identify potential influences.",
          explanation: "Context provides crucial background for evaluating arguments."
        },
        {
          question: "What is the difference between correlation and causation, and why is this distinction important in critical reading?",
          type: "short-answer",
          answer: "Correlation shows relationships between variables, but causation proves one causes the other; the distinction prevents accepting false conclusions from coincidental associations.",
          explanation: "This logical distinction is crucial for evaluating research claims."
        },
        {
          question: "How can synthesizing information from multiple sources improve your critical reading skills?",
          type: "multiple-choice",
          options: [
            "It allows you to find sources that agree with your preconceptions",
            "It helps identify patterns, contradictions, and gaps in the literature",
            "It reduces the need to read multiple texts",
            "It focuses only on the most recent source"
          ],
          answer: "It helps identify patterns, contradictions, and gaps in the literature",
          explanation: "Synthesis develops higher-order thinking skills essential for academic argumentation."
        },
        {
          question: "What role does questioning play in critical reading?",
          type: "short-answer",
          answer: "Questioning helps uncover assumptions, evaluate evidence, and consider alternative interpretations, leading to deeper understanding.",
          explanation: "Active questioning transforms passive reading into critical analysis."
        }
      ]
    },
    {
      id: 3,
      title: "Building Strong Academic Arguments",
      examples: [
        "In arguing that 'Universal basic income could reduce poverty,' support with evidence from pilot programs (grounds), explain how UBI provides financial security (warrant), and acknowledge it might reduce work incentives (qualifier) while addressing this counterargument.",
        "When arguing against 'Social media should be banned for minors,' anticipate counterarguments like parental responsibility, then refute with evidence showing platform design exploits psychological vulnerabilities despite parental efforts.",
        "A balanced argument on 'Online education is as effective as traditional classroom learning' would present studies showing similar outcomes (evidence), explain how technology enables personalized learning (reasoning), and qualify that effectiveness depends on student motivation and access to technology."
      ],
      notes: [
        "Structure arguments using the Toulmin model: Claim (main assertion), Grounds (evidence), Warrant (connection between claim and grounds), Backing (additional support for warrant), Qualifier (limitations), and Rebuttal (counterarguments). For example, claim: 'Exercise improves mental health.' Grounds: Studies showing reduced depression rates. Warrant: Physical activity releases endorphins that affect mood.",
        "Use credible evidence: Academic sources, peer-reviewed studies, statistical data, expert testimony. For instance, cite specific research like 'Johnson et al. (2023) found that...' rather than general statements.",
        "Address counterarguments: Anticipate objections and respond to them. This shows critical thinking and strengthens your position. For example, if arguing for renewable energy, address the counterargument about high initial costs by discussing long-term savings and environmental benefits.",
        "Ensure clarity and coherence: Use topic sentences, transitions, and logical flow. For example, start with your claim, present evidence, address counterarguments, then conclude with implications.",
        "Maintain academic tone: Use formal language, avoid contractions and slang, cite sources properly. For instance, write 'The research indicates' rather than 'The study shows.'",
        "Revise for strength: Check if evidence sufficiently supports claims, if reasoning is sound, and if counterarguments are adequately addressed. Consider having others review your argument for clarity and persuasiveness."
      ],
      questions: [
        {
          question: "What are the six elements of the Toulmin model for building arguments?",
          type: "short-answer",
          answer: "Claim, Grounds, Warrant, Backing, Qualifier, Rebuttal",
          explanation: "The Toulmin model provides a comprehensive framework for constructing well-supported arguments."
        },
        {
          question: "Why is it important to address counterarguments in academic writing?",
          type: "short-answer",
          answer: "Addressing counterarguments demonstrates critical thinking, shows awareness of complexity, and strengthens your position by preemptively responding to objections.",
          explanation: "This approach makes arguments more persuasive and academically rigorous."
        },
        {
          question: "What types of evidence are most credible for academic arguments?",
          type: "multiple-choice",
          options: [
            "Personal opinions and anecdotes",
            "Peer-reviewed research, statistical data, and expert testimony",
            "Social media posts and blogs",
            "Only the most recent news articles"
          ],
          answer: "Peer-reviewed research, statistical data, and expert testimony",
          explanation: "Credible evidence is verifiable, authoritative, and relevant to the claim."
        },
        {
          question: "How does a qualifier improve an academic argument?",
          type: "short-answer",
          answer: "A qualifier acknowledges limitations or conditions, making the argument more nuanced and realistic rather than absolute.",
          explanation: "Qualifiers demonstrate intellectual honesty and prevent overgeneralization."
        },
        {
          question: "True or False: Academic arguments should avoid emotional appeals and focus only on facts.",
          type: "true-false",
          answer: "False",
          explanation: "While emotional appeals should not replace evidence, they can be effective when combined with logical reasoning, especially in persuasive contexts."
        },
        {
          question: "What is the purpose of backing in the Toulmin model?",
          type: "short-answer",
          answer: "Backing provides additional support for the warrant, explaining why the connection between grounds and claim is valid.",
          explanation: "Backing strengthens the logical foundation of the argument."
        },
        {
          question: "How can transitions improve the coherence of an academic argument?",
          type: "multiple-choice",
          options: [
            "They make the writing longer",
            "They help readers follow the logical flow and connections between ideas",
            "They replace the need for evidence",
            "They focus only on conclusions"
          ],
          answer: "They help readers follow the logical flow and connections between ideas",
          explanation: "Effective transitions create clear pathways through complex arguments."
        },
        {
          question: "Why should academic writing maintain a formal tone?",
          type: "short-answer",
          answer: "Formal tone establishes credibility, ensures clarity for diverse audiences, and adheres to academic conventions.",
          explanation: "Academic writing serves scholarly purposes that require precision and professionalism."
        },
        {
          question: "What should you check during the revision process for an academic argument?",
          type: "short-answer",
          answer: "Whether claims are clear, evidence is sufficient and relevant, reasoning is sound, counterarguments are addressed, and the overall structure is logical.",
          explanation: "Revision ensures arguments meet academic standards of rigor and persuasiveness."
        },
        {
          question: "How does anticipating counterarguments strengthen your academic writing?",
          type: "multiple-choice",
          options: [
            "It makes your argument longer without adding value",
            "It demonstrates critical thinking and shows you've considered multiple perspectives",
            "It focuses only on agreeing with opponents",
            "It eliminates the need for evidence"
          ],
          answer: "It demonstrates critical thinking and shows you've considered multiple perspectives",
          explanation: "Addressing counterarguments shows intellectual depth and makes arguments more robust."
        }
      ]
    }
  ]
};

export const week10Meta: WeekMeta = {
  dateRange: "23-27 Mar 2026",
  assignmentTagline: "AI Workshop 2 – refine your arguments",
  assignmentIds: [],
};
