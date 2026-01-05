import { WeekData, WeekMeta } from "../types";

export const week7: WeekData = {
  id: 7,
  title: "Week 7",
  theme: "Continuing ACE (Argumentation Construction and Evaluation)",
  overview:
    "Strengthen your use of the argumentation model by adding counterarguments and rebuttals, and prepare for the ACE Draft.",
  inClassActivities: [
    "Module 3: Activities on warrants, counterarguments, and rebuttals (2.3, 2.4, 2.6, 2.8)",
    "Review of Sample ACE Draft and Study Guide",
    "Test arrangement briefing for ACE Draft",
  ],
  learningOutcomes: [
    "Write a clear main claim supported by reasons and evidence.",
    "Include a relevant counterargument and rebuttal in a short written piece.",
    "Evaluate the strength of your own argument.",
  ],
  resources: [
    {
      title: "Module 3: Building counterarguments and rebuttals",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "Model argument with counterargument and rebuttal",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Argument self-evaluation checklist",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Draft a short argument that includes a counterargument and rebuttal.",
    "Use the checklist to evaluate the strength and clarity of your argument.",
    "Ask the AI tutor where your argument could be more convincing or better supported.",
  ],
  aiPromptHint:
    "You coach students to construct balanced arguments that acknowledge counterarguments and respond to them effectively.",
  skillsIntroduced: ["counterarguments"],
  skillsReinforced: ["toulmin-model", "argument-identification", "synthesising"],
  assignmentsUpcoming: ["ace-draft"],
  lessons: [
    {
      id: 1,
      title: "Building Strong Arguments: Claims and Reasons",
      examples: [
        "Claim: Social media should be banned for children under 13. Reason: It exposes them to inappropriate content and cyberbullying.",
        "Claim: Universities should require all students to learn coding. Reason: Coding skills are essential in the modern job market.",
        "Claim: Remote work should be the default for office jobs. Reason: It reduces commuting time and increases productivity."
      ],
      notes: [
        "A strong claim is specific, debatable, and clearly stated. Example: 'All students should wear uniforms' is stronger than 'School rules are important.'",
        "Reasons should directly support the claim and be logical. Example: For the claim 'Exercise is important,' a reason could be 'It improves physical health and reduces disease risk.'",
        "Use evidence to back up reasons. Example: Cite studies showing that regular exercise reduces heart disease by 30%.",
        "Avoid fallacies like hasty generalizations. Example: Don't say 'My friend got sick from fast food, so all fast food is unhealthy.'",
        "Structure arguments with claim first, then reasons, then evidence. Example: Claim - Reason - Evidence pattern.",
        "Revise claims to make them more precise. Example: Change 'Technology is bad' to 'Excessive screen time harms children's development.'"
      ],
      questions: [
        {
          question: "What makes a claim strong and debatable?",
          type: "short-answer",
          answer: "A strong claim is specific, takes a clear position, and can be supported with evidence.",
          explanation: "Strong claims are not vague opinions but clear statements that invite discussion."
        },
        {
          question: "Identify the claim in this argument: 'Schools should start later because teenagers need more sleep, and studies show better academic performance with later start times.'",
          type: "short-answer",
          answer: "Schools should start later.",
          explanation: "The claim is the main position being argued for."
        },
        {
          question: "Which of the following is a logical reason supporting the claim 'Public transportation should be free'?",
          type: "multiple-choice",
          options: ["It would reduce traffic congestion", "My neighbor likes driving", "Free food is also good", "Weather affects transportation"],
          answer: "It would reduce traffic congestion",
          explanation: "This reason directly supports reducing car use through free alternatives."
        },
        {
          question: "How does evidence strengthen an argument?",
          type: "short-answer",
          answer: "Evidence provides factual support for reasons, making the argument more convincing and credible.",
          explanation: "Without evidence, arguments remain opinions; evidence turns them into reasoned positions."
        },
        {
          question: "What is a fallacy in argumentation?",
          type: "short-answer",
          answer: "A fallacy is a mistake in reasoning that weakens the argument.",
          explanation: "Common fallacies include ad hominem attacks or false cause-effect relationships."
        },
        {
          question: "Rewrite this weak claim to make it stronger: 'Movies are fun.'",
          type: "short-answer",
          answer: "Answers may vary, e.g., 'Animated movies help children develop imagination and emotional intelligence.'",
          explanation: "Strong claims are specific and debatable, not general statements."
        },
        {
          question: "Why should reasons be relevant to the claim?",
          type: "short-answer",
          answer: "Irrelevant reasons distract from the main argument and make it less convincing.",
          explanation: "All parts of an argument should work together to support the main point."
        },
        {
          question: "What type of evidence is most reliable for academic arguments?",
          type: "multiple-choice",
          options: ["Personal anecdotes", "Expert opinions and research studies", "Social media posts", "Popular opinions"],
          answer: "Expert opinions and research studies",
          explanation: "Reliable evidence comes from credible sources like peer-reviewed studies."
        },
        {
          question: "How can you test if your claim is debatable?",
          type: "short-answer",
          answer: "Ask if reasonable people could disagree with it and if it can be supported with evidence.",
          explanation: "Truly debatable claims invite discussion and analysis."
        },
        {
          question: "What is the relationship between a claim and its reasons?",
          type: "short-answer",
          answer: "Reasons explain why the claim is true and provide the logical connection.",
          explanation: "Reasons bridge the gap between the claim and the evidence."
        }
      ]
    },
    {
      id: 2,
      title: "Evaluating Evidence: Quality and Relevance",
      examples: [
        "Strong evidence: A peer-reviewed study showing 80% of participants improved health outcomes. Weak evidence: 'I think it works because it feels right.'",
        "Relevant evidence: Statistics on crime rates to support gun control arguments. Irrelevant evidence: Weather patterns in the same discussion.",
        "Credible source: Data from the World Health Organization. Less credible: An anonymous blog post."
      ],
      notes: [
        "Evaluate evidence by checking its source credibility. Example: Government websites are generally more reliable than personal blogs.",
        "Assess relevance: Evidence must directly support the reason. Example: For arguing about education funding, use studies on student performance, not unrelated economic data.",
        "Check for recency: Recent evidence is often more valuable. Example: Use current statistics rather than data from 20 years ago for modern issues.",
        "Look for bias: Consider if the source has a vested interest. Example: A tobacco company study on smoking risks should be viewed skeptically.",
        "Compare multiple sources: Cross-reference information. Example: If three independent studies show similar results, the evidence is stronger.",
        "Distinguish between facts and opinions: Facts can be verified, opinions cannot. Example: 'The population is 1.4 billion' is a fact; 'China is too crowded' is an opinion."
      ],
      questions: [
        {
          question: "What makes evidence credible?",
          type: "short-answer",
          answer: "Credible evidence comes from reliable sources, can be verified, and is unbiased.",
          explanation: "Credible evidence withstands scrutiny and comes from trustworthy origins."
        },
        {
          question: "Why is relevance important in evidence evaluation?",
          type: "short-answer",
          answer: "Irrelevant evidence distracts from the argument and weakens its overall strength.",
          explanation: "All evidence should directly support the specific reason being made."
        },
        {
          question: "Which source is most credible for scientific evidence?",
          type: "multiple-choice",
          options: ["A celebrity's social media post", "A peer-reviewed journal article", "A personal blog", "An advertisement"],
          answer: "A peer-reviewed journal article",
          explanation: "Peer-reviewed articles undergo expert scrutiny and fact-checking."
        },
        {
          question: "How can you check for bias in a source?",
          type: "short-answer",
          answer: "Look at the author's affiliations, funding sources, and potential conflicts of interest.",
          explanation: "Biased sources may present information in a way that favors their interests."
        },
        {
          question: "What is the difference between primary and secondary evidence?",
          type: "short-answer",
          answer: "Primary evidence is original data or direct observations; secondary evidence analyzes or summarizes primary sources.",
          explanation: "Both can be valuable, but primary evidence is often more direct."
        },
        {
          question: "Why should you use recent evidence when possible?",
          type: "short-answer",
          answer: "Recent evidence reflects current conditions and knowledge, making arguments more applicable today.",
          explanation: "Outdated evidence may not account for recent developments or changes."
        },
        {
          question: "How does sample size affect evidence quality?",
          type: "short-answer",
          answer: "Larger sample sizes generally provide more reliable results and reduce the impact of outliers.",
          explanation: "Small samples may not represent the broader population accurately."
        },
        {
          question: "What should you do if you find conflicting evidence?",
          type: "short-answer",
          answer: "Evaluate the quality and credibility of each source and consider the weight of evidence overall.",
          explanation: "Not all evidence carries equal weight; stronger evidence should be prioritized."
        },
        {
          question: "Why is it important to cite sources for evidence?",
          type: "short-answer",
          answer: "Citing sources allows others to verify the evidence and assess its credibility.",
          explanation: "Proper citation builds trust and enables academic integrity."
        },
        {
          question: "How can statistical evidence be misleading?",
          type: "short-answer",
          answer: "Statistics can be misleading if taken out of context, based on small samples, or presented without proper analysis.",
          explanation: "Always consider the full context and methodology behind statistical claims."
        }
      ]
    },
    {
      id: 3,
      title: "Mastering Counterarguments and Rebuttals",
      examples: [
        "Counterargument: Some argue that homework helps students learn discipline. Rebuttal: While discipline is important, excessive homework can lead to burnout and reduced learning effectiveness.",
        "Counterargument: Technology in classrooms distracts students. Rebuttal: When used properly, technology enhances engagement and provides access to vast educational resources.",
        "Counterargument: Social media increases isolation. Rebuttal: While it can reduce face-to-face interaction, it also connects people globally and supports communities."
      ],
      notes: [
        "A counterargument acknowledges opposing viewpoints. Example: 'Critics claim that...' or 'Some might argue that...'",
        "Rebuttals address counterarguments directly. Example: After stating a counterargument, explain why it's not convincing or how your position is still valid.",
        "Use concession: Admit a valid point before rebutting. Example: 'While it's true that..., this doesn't mean that...'",
        "Strengthen your position by anticipating objections. Example: Address potential weaknesses in your argument proactively.",
        "Keep counterarguments fair and accurate. Example: Don't misrepresent opponents' views to make them easier to refute.",
        "End with a strong rebuttal that reinforces your main claim. Example: Show how your position still holds despite the counterargument."
      ],
      questions: [
        {
          question: "What is the purpose of including counterarguments in an essay?",
          type: "short-answer",
          answer: "Counterarguments show that you've considered multiple perspectives and strengthen your position by addressing objections.",
          explanation: "They demonstrate critical thinking and make your argument more balanced and convincing."
        },
        {
          question: "How does a rebuttal differ from a counterargument?",
          type: "short-answer",
          answer: "A counterargument presents an opposing view; a rebuttal explains why that opposing view is not convincing.",
          explanation: "Rebuttals directly respond to and refute counterarguments."
        },
        {
          question: "What phrase might you use to introduce a counterargument?",
          type: "multiple-choice",
          options: ["However,", "Some critics argue that", "Therefore,", "For example,"],
          answer: "Some critics argue that",
          explanation: "This phrase signals that you're acknowledging an opposing viewpoint."
        },
        {
          question: "Why should counterarguments be presented fairly?",
          type: "short-answer",
          answer: "Presenting them fairly maintains credibility and shows intellectual honesty.",
          explanation: "Misrepresenting opponents weakens your argument and undermines your ethos."
        },
        {
          question: "What is a concession in argumentation?",
          type: "short-answer",
          answer: "A concession admits that part of the counterargument has merit before explaining why your position still holds.",
          explanation: "Concessions show balance and make your rebuttal more persuasive."
        },
        {
          question: "How can anticipating counterarguments strengthen your essay?",
          type: "short-answer",
          answer: "It shows thorough thinking and prevents readers from dismissing your argument due to unaddressed objections.",
          explanation: "Proactive addressing of objections makes your position more robust."
        },
        {
          question: "What should you do if a counterargument is very strong?",
          type: "short-answer",
          answer: "Consider modifying your claim or providing stronger evidence to support your position.",
          explanation: "Strong counterarguments may indicate a need to refine your argument."
        },
        {
          question: "How do counterarguments and rebuttals contribute to academic writing?",
          type: "short-answer",
          answer: "They demonstrate critical thinking, engage with complex issues, and show respect for differing viewpoints.",
          explanation: "This approach elevates the level of discourse in academic writing."
        },
        {
          question: "What is the typical structure for handling counterarguments?",
          type: "short-answer",
          answer: "Present the counterargument, concede any valid points, then provide a rebuttal that reinforces your position.",
          explanation: "This structure maintains balance while ultimately supporting your thesis."
        },
        {
          question: "Why is it important to address counterarguments in the ACE?",
          type: "short-answer",
          answer: "The ACE requires balanced argumentation that considers multiple perspectives, demonstrating higher-order thinking.",
          explanation: "Addressing counterarguments is a key component of strong argumentative writing."
        }
      ]
    }
  ]
};

export const week7Meta: WeekMeta = {
  dateRange: "2-6 Mar 2026",
  assignmentTagline: "Prepare for ACE Draft",
  assignmentIds: [],
};
