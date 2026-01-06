import { WeekData, WeekMeta } from "../types";

export const week6: WeekData = {
  id: 6,
  title: "Week 6",
  theme: "Argumentation Model & Academic Writing Quiz",
  overview:
    "Apply the argumentation model in your own writing and complete the in-class Academic Writing Quiz.",
  inClassActivities: [
    "In-class Academic Writing Quiz (15%) [45-50 minutes]",
  ],
  learningOutcomes: [
    "Plan a short written response using an argumentation model.",
    "Use appropriate academic tone and citations in timed writing.",
    "Understand what to expect from the Academic Writing Quiz.",
  ],
  resources: [
    {
      title: "Module 3: Argumentation model – planning your own argument",
      type: "video",
      duration: "10 min",
    },
    {
      title: "Academic Writing Quiz sample questions",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Timed-writing planning template",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Plan a short argumentative paragraph using the model and the planning template.",
    "Write a 15–20 minute timed response to a sample question.",
    "Share your response with the AI tutor and ask for feedback on clarity, tone, and citation use only.",
  ],
  aiPromptHint:
    "You help students plan and rehearse short argument-based writing so they feel more confident in the Academic Writing Quiz.",
  skillsIntroduced: ["academic-tone"],
  skillsReinforced: ["summarising", "paraphrasing", "synthesising", "apa-referencing", "argument-identification"],
  assignmentsDue: ["academic-writing-quiz"],
  assignmentsUpcoming: ["ace-draft"],
  lessons: [
    {
      id: 1,
      title: "Understanding the ACE Framework",
      examples: [
        "Claim: 'Social media has a negative impact on teenagers' mental health.' Evidence: Recent studies show increased anxiety rates among heavy users. Warrant: Correlation between usage and mental health issues indicates causation.",
        "Claim: 'Online learning is as effective as traditional classroom learning.' Evidence: Test scores from hybrid programs show no significant difference. Warrant: Similar academic outcomes suggest equivalent effectiveness.",
        "Claim: 'Climate change is primarily caused by human activities.' Evidence: Ice core data shows CO2 levels rising with industrialization. Warrant: Historical patterns link human activity to environmental changes."
      ],
      notes: [
        "ACE stands for Argumentation Construction and Evaluation - a framework for building and analyzing arguments. It consists of three main components: Claim (the main argument), Evidence (supporting facts/data), and Warrant (explanation connecting evidence to claim). For example, in the argument 'Schools should require uniforms because they reduce bullying,' the claim is about uniforms reducing bullying, evidence would be studies showing lower bullying in uniform schools, and the warrant explains how uniforms create equality.",
        "A strong claim is clear, specific, and debatable. It should be a statement that can be supported with evidence, not just an opinion. Example: Weak claim - 'Education is important.' Strong claim - 'Universities should prioritize critical thinking skills over memorization in STEM courses.'",
        "Evidence must be relevant, credible, and sufficient. Types include: statistical data, expert testimony, research studies, historical facts, and personal observations. For example, when arguing that 'Exercise improves mental health,' evidence could include a meta-analysis of 50 studies showing 30% reduction in depression symptoms among regular exercisers.",
        "The warrant acts as a bridge between evidence and claim, explaining why the evidence supports the claim. It addresses potential counterarguments and strengthens the logical connection. Example: Claim - 'Cities should invest in bike infrastructure.' Evidence - 'Amsterdam has 60% of trips by bike and low traffic accidents.' Warrant - 'Safe bike lanes encourage cycling, reducing car dependency and accidents.'",
        "Arguments can have qualifiers that limit their scope, such as 'in most cases' or 'under certain conditions.' This makes arguments more reasonable and defensible. For example, 'Social media can improve communication skills in most teenagers, though excessive use may have negative effects.'",
        "Counterarguments should be anticipated and addressed to strengthen your position. This shows critical thinking and awareness of complexity. Example: When claiming 'Remote work increases productivity,' address the counterclaim about isolation by providing evidence of communication tools that maintain team collaboration."
      ],
      questions: [
        {
          question: "What are the three main components of the ACE framework?",
          type: "multiple-choice",
          options: ["Claim, Evidence, Warrant", "Claim, Evidence, Conclusion", "Thesis, Support, Analysis", "Argument, Data, Logic"],
          answer: "Claim, Evidence, Warrant",
          explanation: "ACE stands for Argumentation Construction and Evaluation, consisting of Claim, Evidence, and Warrant."
        },
        {
          question: "True or False: A strong claim should be vague and general to appeal to everyone.",
          type: "true-false",
          answer: "False",
          explanation: "Strong claims are clear, specific, and debatable, allowing for focused argumentation."
        },
        {
          question: "Which type of evidence is generally considered most reliable in academic arguments?",
          type: "multiple-choice",
          options: ["Personal anecdotes", "Peer-reviewed research studies", "Social media posts", "Popular opinion polls"],
          answer: "Peer-reviewed research studies",
          explanation: "Peer-reviewed studies undergo rigorous evaluation and are considered the gold standard in academic contexts."
        },
        {
          question: "What is the role of the warrant in an argument?",
          type: "short-answer",
          answer: "The warrant explains how the evidence supports the claim and connects them logically.",
          explanation: "The warrant provides the reasoning that links evidence to claim, making the argument persuasive."
        },
        {
          question: "Why should arguments include qualifiers?",
          type: "short-answer",
          answer: "Qualifiers make arguments more reasonable by acknowledging limitations and conditions.",
          explanation: "Qualifiers like 'in most cases' or 'under certain conditions' show nuance and prevent overgeneralization."
        },
        {
          question: "Identify the claim in this argument: 'Schools should teach coding because technology jobs are growing rapidly, and early coding education prepares students for future careers.'",
          type: "short-answer",
          answer: "Schools should teach coding",
          explanation: "The claim is the main position being argued for."
        },
        {
          question: "True or False: Counterarguments should be ignored to keep your argument focused.",
          type: "true-false",
          answer: "False",
          explanation: "Addressing counterarguments strengthens your position by showing critical thinking and awareness of complexity."
        },
        {
          question: "What makes evidence 'sufficient' in an argument?",
          type: "multiple-choice",
          options: ["It comes from many different sources", "It directly and convincingly supports the claim", "It is the most recent information available", "It agrees with popular opinion"],
          answer: "It directly and convincingly supports the claim",
          explanation: "Sufficient evidence provides strong, direct support for the claim being made."
        },
        {
          question: "How can you evaluate if a warrant is strong?",
          type: "short-answer",
          answer: "Check if it logically connects evidence to claim and addresses potential counterarguments.",
          explanation: "A strong warrant provides clear reasoning and anticipates objections."
        },
        {
          question: "Which of the following is an example of a qualifier in an argument?",
          type: "multiple-choice",
          options: ["In most cases", "Therefore", "However", "According to"],
          answer: "In most cases",
          explanation: "Qualifiers like 'in most cases' limit the scope of claims to make them more defensible."
        }
      ]
    },
    {
      id: 2,
      title: "Building Strong Arguments",
      examples: [
        "Claim: 'University students should have mental health days off.' Evidence: Studies show 30% of students experience mental health issues. Warrant: Academic success requires mental well-being; time off prevents burnout.",
        "Claim: 'Social media platforms should verify user ages more strictly.' Evidence: 70% of minors report cyberbullying experiences. Warrant: Age verification would reduce exposure to harmful content and interactions.",
        "Claim: 'Cities should prioritize public transportation over new highways.' Evidence: Public transit cities have 20% lower congestion and pollution. Warrant: Efficient public systems reduce car dependency and environmental impact."
      ],
      notes: [
        "Start with a clear, focused claim that answers the question 'What am I trying to prove?' Example: Instead of 'Education is good,' use 'Mandatory financial literacy courses should be required in high school curricula.'",
        "Gather evidence from multiple credible sources: academic journals, government reports, expert testimony, and statistical data. For example, when arguing for environmental policies, combine IPCC reports with local pollution data and economic impact studies.",
        "Use the warrant to explain the 'so what?' - why your evidence matters and how it supports your claim. Example: Claim - 'Companies should offer flexible work hours.' Evidence - 'Productivity increased 15% in flexible companies.' Warrant - 'Flexibility reduces stress and improves focus, leading to better work output.'",
        "Structure arguments logically: introduction (hook + claim), body (evidence + warrants + counterarguments), conclusion (restated claim + implications). Example: Start with a statistic, state your claim, provide 2-3 pieces of evidence with explanations, address one counterargument, end with broader significance.",
        "Incorporate backing to support your warrants - additional evidence that proves your reasoning is sound. For example, if warranting that 'early education prevents crime,' back it with longitudinal studies showing correlation between education levels and criminal behavior.",
        "Use transitions and signposting to guide readers: 'This evidence shows...', 'However, critics argue...', 'Therefore, we can conclude...'. This creates coherence and helps readers follow your reasoning."
      ],
      questions: [
        {
          question: "What should be the first step when constructing an argument?",
          type: "multiple-choice",
          options: ["Gather all possible evidence", "State a clear, focused claim", "Write the conclusion", "Find counterarguments"],
          answer: "State a clear, focused claim",
          explanation: "A clear claim provides direction for the entire argument and answers what you're trying to prove."
        },
        {
          question: "True or False: Using only one source of evidence is sufficient for a strong argument.",
          type: "true-false",
          answer: "False",
          explanation: "Multiple credible sources provide stronger support and demonstrate thorough research."
        },
        {
          question: "What is 'backing' in argumentation?",
          type: "short-answer",
          answer: "Additional evidence that supports the warrant and proves your reasoning is sound.",
          explanation: "Backing strengthens warrants by providing further justification for your logical connections."
        },
        {
          question: "Why are transitions important in argumentative writing?",
          type: "short-answer",
          answer: "Transitions guide readers through your reasoning and create coherence.",
          explanation: "Good transitions help readers follow the logical flow of your argument."
        },
        {
          question: "Identify a potential counterargument for the claim: 'Schools should eliminate homework.'",
          type: "short-answer",
          answer: "Homework helps reinforce learning and develop study habits.",
          explanation: "Counterarguments should address the opposing viewpoint to strengthen your position."
        },
        {
          question: "What makes a claim 'focused' rather than vague?",
          type: "multiple-choice",
          options: ["It uses complex vocabulary", "It is specific and narrow in scope", "It includes many examples", "It is very long and detailed"],
          answer: "It is specific and narrow in scope",
          explanation: "Focused claims are precise and can be adequately supported within the given constraints."
        },
        {
          question: "True or False: Arguments should avoid addressing counterarguments to maintain focus.",
          type: "true-false",
          answer: "False",
          explanation: "Addressing counterarguments shows critical thinking and strengthens your position."
        },
        {
          question: "Which of the following is the best way to organize an argumentative essay?",
          type: "multiple-choice",
          options: ["Claim, evidence, warrant, conclusion", "Evidence, claim, warrant, counterarguments", "Introduction, body, conclusion with logical flow", "Random order to keep readers engaged"],
          answer: "Introduction, body, conclusion with logical flow",
          explanation: "Clear structure helps readers follow and understand your argument."
        },
        {
          question: "How can you ensure your evidence is credible?",
          type: "short-answer",
          answer: "Use sources from experts, peer-reviewed journals, government agencies, and cross-reference information.",
          explanation: "Credible evidence comes from reliable, authoritative sources that can be verified."
        },
        {
          question: "What should a conclusion in an argumentative essay include?",
          type: "multiple-choice",
          options: ["New evidence", "Restated claim and broader implications", "Personal opinions", "Unrelated topics"],
          answer: "Restated claim and broader implications",
          explanation: "Conclusions reinforce the main argument and show its significance."
        }
      ]
    },
    {
      id: 3,
      title: "Evaluating Arguments and Evidence",
      examples: [
        "Evaluating claim: 'Video games cause violence.' Weak evidence: Anecdotal stories. Strong evaluation: Examine meta-analyses showing no causal link, consider confounding variables like socioeconomic factors.",
        "Evaluating claim: 'Organic food is healthier.' Evidence analysis: Compare nutritional studies, check for bias in organic industry funding, assess sample sizes and methodology.",
        "Evaluating claim: 'Social media improves social connections.' Critical analysis: Review studies on both positive (global connections) and negative (isolation) effects, evaluate research design and generalizability."
      ],
      notes: [
        "Evaluate claims by checking if they are clear, specific, and falsifiable. Ask: Can this claim be proven false? Is it too broad or absolute? Example: 'All students learn better online' is weak because it's absolute; 'Most university students perform equally well in online vs in-person courses' is stronger and testable.",
        "Assess evidence credibility by examining: source authority (expertise, reputation), recency (current vs outdated), objectivity (potential bias), and methodology (research design quality). For example, a study funded by tobacco companies on smoking health effects would have credibility issues.",
        "Check for logical fallacies that weaken arguments: ad hominem (attacking person instead of argument), false dichotomy (presenting only two options when more exist), appeal to emotion (manipulating feelings instead of logic), hasty generalization (concluding from insufficient evidence).",
        "Analyze warrant strength by testing the connection between evidence and claim. Ask: Does the evidence logically support the conclusion? Are there alternative explanations? Example: Evidence of rising temperatures during industrialization warrants human-caused climate change, but correlation alone isn't sufficient without controlling for other factors.",
        "Consider counterarguments and rebuttals. Strong arguments anticipate objections and provide convincing responses. Example: When evaluating 'School uniforms reduce bullying,' consider counter-evidence showing uniforms don't affect underlying social dynamics.",
        "Evaluate overall argument coherence: Do all parts work together? Is there sufficient evidence for the scope of the claim? Does the argument avoid contradictions? Example: An argument claiming 'Technology isolates people' should not cite evidence of increased online communication without addressing how this affects real-world relationships."
      ],
      questions: [
        {
          question: "What makes a claim falsifiable and therefore stronger?",
          type: "short-answer",
          answer: "It can be proven false through evidence and testing.",
          explanation: "Falsifiable claims can be tested and are more scientifically sound."
        },
        {
          question: "True or False: Evidence from social media is always unreliable for academic arguments.",
          type: "true-false",
          answer: "False",
          explanation: "Social media can sometimes provide credible evidence, but it should be verified and used cautiously."
        },
        {
          question: "Identify the logical fallacy in this argument: 'Dr. Smith's research on climate change must be wrong because he drives an SUV.'",
          type: "multiple-choice",
          options: ["Ad hominem", "False dichotomy", "Hasty generalization", "Appeal to emotion"],
          answer: "Ad hominem",
          explanation: "Ad hominem attacks the person rather than addressing the argument's merits."
        },
        {
          question: "What should you check when evaluating evidence credibility?",
          type: "multiple-choice",
          options: ["Source reputation and potential bias", "How many likes it has", "The author's age", "The color of the publication"],
          answer: "Source reputation and potential bias",
          explanation: "Credible evidence comes from authoritative, unbiased sources."
        },
        {
          question: "Why are counterarguments important when evaluating an argument?",
          type: "short-answer",
          answer: "They test the argument's strength and reveal potential weaknesses.",
          explanation: "Considering counterarguments helps identify if an argument is well-reasoned and comprehensive."
        },
        {
          question: "True or False: Correlation always proves causation in arguments.",
          type: "true-false",
          answer: "False",
          explanation: "Correlation shows relationship but doesn't prove one causes the other; confounding variables must be considered."
        },
        {
          question: "What is a 'hasty generalization' fallacy?",
          type: "short-answer",
          answer: "Drawing a conclusion from insufficient or unrepresentative evidence.",
          explanation: "Hasty generalizations occur when conclusions are based on too small or biased samples."
        },
        {
          question: "How can you evaluate if a warrant is weak?",
          type: "multiple-choice",
          options: ["It provides clear logical connections", "It ignores alternative explanations", "It uses credible evidence", "It addresses counterarguments"],
          answer: "It ignores alternative explanations",
          explanation: "Weak warrants fail to consider other possible interpretations of the evidence."
        },
        {
          question: "What makes an argument coherent?",
          type: "short-answer",
          answer: "All parts work together logically without contradictions.",
          explanation: "Coherent arguments have consistent reasoning and supporting elements."
        },
        {
          question: "When evaluating research methodology, what should you look for?",
          type: "multiple-choice",
          options: ["Sample size and selection method", "The researcher's personal opinions", "How long the study took to complete", "The study's budget"],
          answer: "Sample size and selection method",
          explanation: "Good methodology ensures representative and adequate data collection."
        }
      ]
    }
  ]
};

export const week6Meta: WeekMeta = {
  dateRange: "23-27 Feb 2026",
  assignmentTagline: "Academic Writing Quiz (15%) this week",
  assignmentIds: ["academic-writing-quiz"],
};
