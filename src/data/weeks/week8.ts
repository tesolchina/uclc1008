import { WeekData, WeekMeta } from "../types";

export const week8: WeekData = {
  id: 8,
  title: "Week 8",
  theme: "Advanced ACE (Argumentation Construction and Evaluation)",
  overview:
    "Deepen your understanding of argumentation by exploring advanced techniques in constructing and evaluating arguments. Focus on evidence integration, logical fallacies, and sophisticated argumentation strategies to prepare for the ACE assessment.",
  inClassActivities: [
    "Advanced Argumentation Workshop",
    "Evidence Integration Practice",
    "Logical Fallacies Identification",
    "Peer Review of Argument Structures",
  ],
  learningOutcomes: [
    "Construct complex arguments using multiple lines of evidence.",
    "Identify and analyze logical fallacies in academic discourse.",
    "Integrate diverse sources of evidence effectively in argumentation.",
    "Evaluate the strength of arguments based on evidence quality and logical structure.",
  ],
  resources: [
    {
      title: "Advanced Argumentation Techniques",
      type: "video",
      duration: "15 min",
    },
    {
      title: "Common Logical Fallacies in Academic Writing",
      type: "reading",
      duration: "25 min",
    },
    {
      title: "Evidence Integration Strategies",
      type: "practice",
      duration: "20 min",
    },
  ],
  practiceTasks: [
    "Analyze sample arguments for logical fallacies.",
    "Practice integrating multiple sources of evidence in your writing.",
    "Construct counterarguments to weak claims.",
    "Use the Toulmin model to structure complex arguments.",
  ],
  aiPromptHint:
    "You help students master advanced argumentation techniques, evidence integration, and fallacy identification for ACE preparation.",
  skillsIntroduced: ["advanced-argumentation", "fallacy-identification"],
  skillsReinforced: ["evidence-integration", "argument-evaluation", "toulmin-model"],
  assignmentsUpcoming: ["ace-draft"],
  lessons: [
    {
      id: 1,
      title: "Building Complex Arguments",
      examples: [
        "A student argues that social media has both positive and negative impacts on mental health, supporting the claim with studies on connectivity benefits, surveys on anxiety rates, and expert opinions on digital wellness.",
        "An environmental policy proposal uses economic data, scientific research on climate change, and historical precedents to argue for renewable energy subsidies.",
        "A debate on education reform integrates teacher testimonials, student performance statistics, and philosophical arguments about learning theory."
      ],
      notes: [
        "Use the Toulmin model to structure arguments: claim, grounds (evidence), warrant (connection), backing (support for warrant), qualifier (limitations), and rebuttal (counterarguments). For example, claim: 'Online learning is as effective as traditional classroom learning.' Grounds: Recent studies show similar test scores.",
        "Incorporate multiple types of evidence: statistical data, expert testimony, personal anecdotes, and logical reasoning. Example: When arguing for stricter gun control, combine crime statistics with survivor stories and constitutional interpretations.",
        "Develop qualified claims rather than absolute statements. Instead of 'Social media is harmful,' say 'Social media can be harmful for adolescents when used excessively.' This shows nuanced thinking.",
        "Address counterarguments proactively. A strong argument anticipates objections and refutes them. Example: 'While critics argue that raising the minimum wage will increase unemployment, evidence from recent implementations shows minimal negative impact.'",
        "Use transitional phrases to connect ideas: 'Furthermore,' 'In contrast,' 'Building on this evidence,' 'However, critics contend.' These create logical flow in your argumentation.",
        "Ensure evidence is relevant, credible, and sufficient. Ask: Does this evidence directly support my claim? Is the source trustworthy? Do I have enough evidence to convince a skeptical reader?"
      ],
      questions: [
        {
          question: "Which element of the Toulmin model connects the evidence to the claim?",
          type: "multiple-choice",
          options: ["Grounds", "Warrant", "Backing", "Qualifier"],
          answer: "Warrant",
          explanation: "The warrant explains how the grounds (evidence) support the claim, providing the logical connection between them."
        },
        {
          question: "What is a qualified claim?",
          type: "short-answer",
          answer: "A claim that includes limitations or conditions rather than making absolute statements",
          explanation: "Qualified claims show nuanced thinking by acknowledging exceptions or conditions, making arguments more credible and defensible."
        },
        {
          question: "Why should arguments address counterarguments?",
          type: "multiple-choice",
          options: ["To make the argument longer", "To show awareness of opposing views and strengthen credibility", "To confuse readers", "To avoid using evidence"],
          answer: "To show awareness of opposing views and strengthen credibility",
          explanation: "Addressing counterarguments demonstrates thorough analysis and makes your argument more persuasive by showing you've considered alternative perspectives."
        },
        {
          question: "Which of the following is NOT a type of evidence?",
          type: "multiple-choice",
          options: ["Statistical data", "Expert testimony", "Personal opinion", "Logical reasoning"],
          answer: "Personal opinion",
          explanation: "While personal opinions can be part of arguments, they are not considered evidence unless supported by facts or expertise. The others are standard types of evidence."
        },
        {
          question: "What does 'sufficient evidence' mean in argumentation?",
          type: "short-answer",
          answer: "Having enough evidence to convincingly support the claim without overwhelming the reader",
          explanation: "Sufficient evidence means providing adequate support for your claim while maintaining balance and relevance."
        },
        {
          question: "Identify the logical fallacy: 'We should ban all video games because some teenagers become violent after playing them.'",
          type: "multiple-choice",
          options: ["Ad hominem", "Slippery slope", "Post hoc ergo propter hoc", "False cause"],
          answer: "False cause",
          explanation: "This assumes correlation implies causation - just because violence follows gaming doesn't mean gaming causes violence."
        },
        {
          question: "How can transitional phrases improve argumentation?",
          type: "multiple-choice",
          options: ["They make writing longer", "They create logical flow and show relationships between ideas", "They replace evidence", "They confuse readers"],
          answer: "They create logical flow and show relationships between ideas",
          explanation: "Transitional phrases help readers follow the logical progression of your argument and understand how ideas connect."
        },
        {
          question: "What makes evidence credible?",
          type: "multiple-choice",
          options: ["It agrees with your opinion", "It comes from a trustworthy, unbiased source with expertise", "It's the most recent information", "It's emotionally compelling"],
          answer: "It comes from a trustworthy, unbiased source with expertise",
          explanation: "Credible evidence comes from reliable sources that are knowledgeable and objective, not just sources that support your viewpoint."
        },
        {
          question: "Why is it important to use multiple types of evidence?",
          type: "short-answer",
          answer: "To provide comprehensive support and appeal to different types of reasoning",
          explanation: "Different readers are persuaded by different types of evidence, so using a variety strengthens your argument's overall persuasiveness."
        },
        {
          question: "What is the purpose of a rebuttal in the Toulmin model?",
          type: "multiple-choice",
          options: ["To state the main claim", "To provide evidence", "To address potential counterarguments", "To qualify the claim"],
          answer: "To address potential counterarguments",
          explanation: "The rebuttal anticipates and addresses objections to the argument, making it more robust."
        }
      ]
    },
    {
      id: 2,
      title: "Evidence Integration Strategies",
      examples: [
        "A research paper on climate change seamlessly integrates IPCC reports, local temperature data, economic impact studies, and indigenous community perspectives to build a comprehensive argument.",
        "An essay on educational inequality combines statistical data on achievement gaps, teacher interviews, policy analysis, and student narratives to create a multifaceted argument.",
        "A policy brief on healthcare reform integrates cost-benefit analyses, patient outcome studies, expert recommendations, and ethical considerations."
      ],
      notes: [
        "Use signal phrases to introduce sources: 'According to Smith (2023),' or 'Research by Johnson et al. indicates.' This gives credit and shows credibility. Example: 'As environmental scientist Jane Goodall states, \"Climate change is the most serious threat facing humanity.\"'",
        "Synthesize evidence from multiple sources rather than presenting them separately. Example: Combine statistics from three different studies to show a trend, then explain what the trend means for your argument.",
        "Balance quantitative and qualitative evidence. Statistics provide measurable data, while qualitative evidence (quotes, case studies) provides depth and human context. Example: Use crime rate statistics alongside victim impact statements.",
        "Explain the relevance of evidence to your claim. Don't assume readers will make the connection. Example: 'This 15% increase in renewable energy adoption demonstrates that economic incentives can accelerate the transition to sustainable energy sources.'",
        "Use evidence to support warrants, not just claims. Example: If your warrant is 'Economic incentives change behavior,' support it with evidence from behavioral economics studies.",
        "Cite sources properly and consistently. In academic writing, proper citation shows respect for intellectual property and allows readers to verify your evidence."
      ],
      questions: [
        {
          question: "What is the purpose of signal phrases in evidence integration?",
          type: "multiple-choice",
          options: ["To make writing longer", "To introduce sources and establish credibility", "To replace citations", "To confuse readers"],
          answer: "To introduce sources and establish credibility",
          explanation: "Signal phrases help readers understand where information comes from and demonstrate that you're using credible sources."
        },
        {
          question: "What does it mean to synthesize evidence?",
          type: "short-answer",
          answer: "To combine information from multiple sources to create new insights or stronger arguments",
          explanation: "Synthesis goes beyond summarizing individual sources by showing how they relate to and support each other."
        },
        {
          question: "Why should arguments include both quantitative and qualitative evidence?",
          type: "multiple-choice",
          options: ["To make the argument longer", "To provide measurable data and human context", "To confuse readers", "To avoid using statistics"],
          answer: "To provide measurable data and human context",
          explanation: "Quantitative evidence gives measurable facts, while qualitative evidence provides depth, stories, and real-world context."
        },
        {
          question: "What should you do if evidence seems irrelevant to readers?",
          type: "multiple-choice",
          options: ["Remove it", "Explain its relevance to your claim", "Ignore it", "Use it anyway"],
          answer: "Explain its relevance to your claim",
          explanation: "Always explain how evidence supports your argument so readers can follow your reasoning."
        },
        {
          question: "How can evidence support warrants in arguments?",
          type: "short-answer",
          answer: "By providing justification for why the evidence supports the claim",
          explanation: "Evidence should not only support the claim but also explain the logical connection (warrant) between evidence and claim."
        },
        {
          question: "Identify the logical fallacy: 'Dr. Smith says vaccines are safe, but she's paid by pharmaceutical companies, so her opinion doesn't count.'",
          type: "multiple-choice",
          options: ["Ad hominem", "Appeal to authority", "False dilemma", "Straw man"],
          answer: "Ad hominem",
          explanation: "This attacks the person making the argument rather than addressing the argument itself."
        },
        {
          question: "What is the benefit of proper citation?",
          type: "multiple-choice",
          options: ["It makes writing look more academic", "It allows readers to verify sources and shows respect for intellectual property", "It replaces evidence", "It confuses readers"],
          answer: "It allows readers to verify sources and shows respect for intellectual property",
          explanation: "Citations enable academic integrity by giving credit and allowing others to check your sources."
        },
        {
          question: "How should you handle conflicting evidence from different sources?",
          type: "multiple-choice",
          options: ["Ignore the conflicting evidence", "Acknowledge it and explain why your interpretation is valid", "Only use sources that agree", "Dismiss all sources"],
          answer: "Acknowledge it and explain why your interpretation is valid",
          explanation: "Strong arguments address conflicting evidence and explain why the overall weight of evidence supports your position."
        },
        {
          question: "What type of evidence provides human context and depth?",
          type: "multiple-choice",
          options: ["Quantitative", "Qualitative", "Statistical", "Numerical"],
          answer: "Qualitative",
          explanation: "Qualitative evidence includes quotes, case studies, interviews, and narratives that provide rich, contextual information."
        },
        {
          question: "Why is it important to explain the relevance of evidence?",
          type: "short-answer",
          answer: "To ensure readers understand how the evidence supports your argument",
          explanation: "Readers may not automatically see connections, so explicit explanations strengthen your argumentation."
        }
      ]
    },
    {
      id: 3,
      title: "Identifying Logical Fallacies",
      examples: [
        "A politician claims, 'My opponent wants to raise taxes, which will destroy the economy and lead to widespread poverty.' This is a slippery slope fallacy.",
        "A student writes, 'Shakespeare was a genius because he wrote Romeo and Juliet, and everyone knows geniuses write great plays.' This is circular reasoning.",
        "A debate opponent says, 'You can't trust environmentalists because they're all tree-huggers who don't understand economics.' This is ad hominem."
      ],
      notes: [
        "Ad hominem fallacy: Attacks the person instead of their argument. Example: 'You can't believe climate scientists because they receive government funding.' Address the science, not the funding.",
        "Slippery slope fallacy: Claims one action will lead to extreme consequences without evidence. Example: 'If we allow same-sex marriage, next we'll allow marriage to animals.' Show actual causal links.",
        "False cause (post hoc ergo propter hoc): Assumes correlation means causation. Example: 'Crime rates fell after the new police chief took office, so the chief reduced crime.' Consider other factors.",
        "Appeal to emotion: Uses emotional manipulation instead of evidence. Example: 'Think of the children!' when arguing for a policy. Support with facts and reasoning.",
        "Straw man fallacy: Misrepresents opponent's argument to make it easier to attack. Example: 'Environmentalists want to ban all cars.' Address actual positions.",
        "Hasty generalization: Draws broad conclusions from insufficient evidence. Example: 'I met two rude French people, so all French people are rude.' Need representative samples."
      ],
      questions: [
        {
          question: "What is an ad hominem fallacy?",
          type: "multiple-choice",
          options: ["Attacking the argument instead of the person", "Attacking the person instead of the argument", "Using emotional appeals", "Making broad generalizations"],
          answer: "Attacking the person instead of the argument",
          explanation: "Ad hominem literally means 'to the person' and involves attacking someone's character or circumstances rather than addressing their actual argument."
        },
        {
          question: "Identify the fallacy: 'If we teach evolution in schools, students will start questioning religion, leading to moral decay and the collapse of society.'",
          type: "multiple-choice",
          options: ["Ad hominem", "Slippery slope", "False cause", "Straw man"],
          answer: "Slippery slope",
          explanation: "This assumes one action (teaching evolution) will inevitably lead to extreme, unsupported consequences without showing causal links."
        },
        {
          question: "What is the false cause fallacy?",
          type: "short-answer",
          answer: "Assuming that because one event follows another, the first caused the second",
          explanation: "Post hoc ergo propter hoc means 'after this, therefore because of this' - correlation does not imply causation."
        },
        {
          question: "Which fallacy involves misrepresenting an opponent's argument?",
          type: "multiple-choice",
          options: ["Ad hominem", "Straw man", "Slippery slope", "Appeal to emotion"],
          answer: "Straw man",
          explanation: "A straw man argument creates a weaker version of the opponent's position that's easier to attack than the actual argument."
        },
        {
          question: "What is an appeal to emotion fallacy?",
          type: "multiple-choice",
          options: ["Using facts to persuade", "Using emotional manipulation instead of evidence", "Attacking character", "Making broad claims"],
          answer: "Using emotional manipulation instead of evidence",
          explanation: "This fallacy relies on stirring emotions rather than providing logical evidence or reasoned arguments."
        },
        {
          question: "Identify the fallacy: 'All politicians are corrupt because I read about three corrupt politicians in the news.'",
          type: "multiple-choice",
          options: ["Hasty generalization", "Ad hominem", "False cause", "Straw man"],
          answer: "Hasty generalization",
          explanation: "This draws a broad conclusion about all politicians based on a very small, unrepresentative sample."
        },
        {
          question: "Why are logical fallacies problematic in academic arguments?",
          type: "multiple-choice",
          options: ["They make arguments shorter", "They weaken the credibility and logical strength of arguments", "They provide more evidence", "They help persuade readers"],
          answer: "They weaken the credibility and logical strength of arguments",
          explanation: "Fallacies undermine the logical foundation of arguments and can make writers appear unreasonable or biased."
        },
        {
          question: "What should you do when you identify a fallacy in someone else's argument?",
          type: "multiple-choice",
          options: ["Ignore it", "Point it out and explain why it's a fallacy, then address the actual argument", "Use the same fallacy in response", "Change the subject"],
          answer: "Point it out and explain why it's a fallacy, then address the actual argument",
          explanation: "Constructive criticism involves identifying the problem and then engaging with the substantive issues."
        },
        {
          question: "Which fallacy assumes correlation means causation?",
          type: "multiple-choice",
          options: ["Ad hominem", "Slippery slope", "False cause", "Straw man"],
          answer: "False cause",
          explanation: "False cause (or post hoc ergo propter hoc) incorrectly assumes that because one thing follows another, it must have caused it."
        },
        {
          question: "How can avoiding fallacies strengthen your arguments?",
          type: "short-answer",
          answer: "By ensuring logical consistency and maintaining credibility with readers",
          explanation: "Arguments free of fallacies are more persuasive because they rely on sound reasoning rather than flawed logic."
        }
      ]
    }
  ]
};

export const week8Meta: WeekMeta = {
  dateRange: "9-13 Mar 2026",
  assignmentTagline: "ACE Draft next week",
  assignmentIds: [],
};
