import { WeekData, WeekMeta } from "../types";

export const week9: WeekData = {
  id: 9,
  title: "Week 9",
  theme: "Critical Response & ACE Draft Test",
  overview:
    "Continue Module 4 and complete the in-class Argument Construction and Evaluation (Draft) test.",
  inClassActivities: [
    "In-class Argument Construction and Evaluation (Draft) Test (15%) [100 minutes]",
    "Module 4: Part 2 (Activity 2.1)",
    "Reminder: Bring necessary devices and disable writing-support apps for the test",
  ],
  learningOutcomes: [
    "Apply an argumentation model to the draft of a longer written assignment.",
    "Integrate summary and critique of source ideas in your own argument.",
    "Understand the requirements of the in-class draft assignment.",
  ],
  resources: [
    {
      title: "Assignment brief: Argument Construction and Evaluation (Draft)",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Model outline for the draft assignment",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Draft planning template (claims, counterarguments, rebuttals)",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Use the planning template to map out your draft argument before the in-class task.",
    "Write a practice paragraph that combines source summary with your own evaluation.",
    "Ask the AI tutor to comment on whether your paragraph clearly follows an argumentation model.",
  ],
  aiPromptHint:
    "You guide students in planning and testing out ideas for the Argument Construction and Evaluation draft without generating full answers.",
  skillsIntroduced: [],
  skillsReinforced: ["toulmin-model", "counterarguments", "summarising", "synthesising", "paraphrasing", "apa-referencing", "critical-evaluation"],
  assignmentsDue: ["ace-draft"],
  assignmentsUpcoming: ["peer-evaluation", "ace-final", "ai-reflection"],
  lessons: [
    {
      id: 1,
      title: "Reviewing Argumentation Models for ACE",
      examples: [
        "Toulmin Model: Claim - 'Social media should be banned in schools'; Grounds - 'Studies show 70% decrease in focus'; Warrant - 'Reduced distractions improve learning'; Backing - 'Research from Stanford University'; Qualifier - 'In most cases'; Rebuttal - 'Unless used for educational purposes'",
        "Rogerian Argument: Find common ground - 'Both sides agree education is important'; State opponent's position - 'Technology enhances learning'; Present your position - 'But unlimited access harms concentration'; Show benefits - 'Structured tech use improves outcomes'",
        "Classical Argument: Introduction with hook - 'In our digital age...'; Background - 'Schools face tech integration challenges'; Thesis - 'Limited social media access improves academic performance'; Evidence - 'Citations from studies'; Counterarguments - 'Address concerns about digital literacy'; Conclusion - 'Restate benefits'"
      ],
      notes: [
        "The Toulmin model provides a structured framework for arguments: Claim (main argument), Grounds (evidence), Warrant (connection between claim and grounds), Backing (support for warrant), Qualifier (limitations), and Rebuttal (counterarguments). For example, in an ACE draft, you might claim 'Online learning is as effective as traditional classroom learning' with grounds from research studies.",
        "Rogerian arguments focus on finding common ground and reducing conflict. Instead of attacking opponents, acknowledge their valid points. For instance, when arguing about AI in education, recognize teachers' concerns about job displacement while showing AI's benefits for personalized learning.",
        "Classical arguments follow a structured pattern: introduction, background, thesis, evidence, counterarguments, and conclusion. This model is particularly useful for longer assignments like the ACE draft, where you need to build a comprehensive case.",
        "When preparing for ACE, practice identifying the argumentation model in sample essays. Look for how authors structure their claims, provide evidence, and address counterarguments. For example, analyze how different models handle the same topic like 'Should universities require AI literacy courses?'",
        "Effective arguments integrate source evaluation with your own analysis. Don't just summarize sources - critique their methodology, relevance, and implications. For instance, evaluate a study's sample size, research design, and how findings apply to your specific context.",
        "Final review tip: Create argument maps showing how your claims connect to evidence and counterarguments. This visual planning helps ensure your ACE draft follows a logical structure and addresses all required elements."
      ],
      questions: [
        {
          question: "Which element of the Toulmin model explains why the grounds support the claim?",
          type: "multiple-choice",
          options: ["Claim", "Grounds", "Warrant", "Backing"],
          answer: "Warrant",
          explanation: "The warrant explains the logical connection between the claim and the supporting grounds."
        },
        {
          question: "True or False: Rogerian arguments avoid addressing counterarguments to maintain harmony.",
          type: "true-false",
          answer: "False",
          explanation: "Rogerian arguments acknowledge and address counterarguments while finding common ground."
        },
        {
          question: "What is the primary purpose of the 'qualifier' in Toulmin's model?",
          type: "multiple-choice",
          options: ["To state the main claim", "To provide evidence", "To limit the claim's scope", "To attack opponents"],
          answer: "To limit the claim's scope",
          explanation: "Qualifiers acknowledge limitations and conditions, making arguments more credible."
        },
        {
          question: "In a classical argument structure, what comes immediately after the thesis statement?",
          type: "multiple-choice",
          options: ["Introduction", "Evidence presentation", "Counterarguments", "Conclusion"],
          answer: "Evidence presentation",
          explanation: "After stating the thesis, provide evidence to support your position."
        },
        {
          question: "Describe how you would apply the Toulmin model to argue that 'Universities should adopt AI-assisted grading systems.'",
          type: "short-answer",
          answer: "Claim: Universities should adopt AI-assisted grading; Grounds: AI can grade consistently and quickly; Warrant: Consistency improves fairness; Backing: Studies showing human grading variability; Qualifier: For objective assessments; Rebuttal: Human judgment needed for subjective work.",
          explanation: "Demonstrates understanding of applying argumentation models to real topics."
        },
        {
          question: "Why is it important to include counterarguments in your ACE draft?",
          type: "short-answer",
          answer: "Counterarguments show you've considered multiple perspectives, strengthen your position by addressing weaknesses, and demonstrate critical thinking skills required for academic writing.",
          explanation: "Addresses evaluation techniques and comprehensive argumentation."
        },
        {
          question: "Identify the argumentation model used in this thesis: 'While social media offers educational benefits, its negative impact on student concentration necessitates stricter school policies.'",
          type: "multiple-choice",
          options: ["Toulmin", "Rogerian", "Classical", "Cannot determine"],
          answer: "Rogerian",
          explanation: "The thesis acknowledges benefits (common ground) while arguing for restrictions, typical of Rogerian approach."
        },
        {
          question: "What should you evaluate when critiquing a source for your ACE draft?",
          type: "multiple-choice",
          options: ["Author's credentials only", "Publication date only", "Methodology, sample size, relevance, and recency", "Word count"],
          answer: "Methodology, sample size, relevance, and recency",
          explanation: "Critical evaluation requires assessing research quality and applicability."
        },
        {
          question: "True or False: In academic arguments, emotional appeals are more effective than logical evidence.",
          type: "true-false",
          answer: "False",
          explanation: "Academic arguments rely on logical evidence, reasoning, and credible sources rather than emotions."
        },
        {
          question: "Explain how to construct a rebuttal to the counterargument that 'AI will replace human teachers entirely.'",
          type: "short-answer",
          answer: "Acknowledge the concern, then provide evidence that AI enhances rather than replaces teachers by handling routine tasks, allowing humans to focus on complex teaching aspects like mentoring and creativity.",
          explanation: "Practices counterargument evaluation and rebuttal construction for ACE preparation."
        }
      ]
    },
    {
      id: 2,
      title: "Building Strong Claims and Evidence Integration",
      examples: [
        "Weak claim: 'Technology is bad for education.' Strong claim: 'Unrestricted social media access in classrooms reduces student attention spans by 40%, according to recent studies.'",
        "Evidence integration: Source states 'Mobile devices distract students' (Smith, 2023). This supports my claim that device policies improve focus, as Smith's research shows 25% better concentration without distractions.",
        "Synthesis example: While Johnson (2022) found benefits in educational apps, Chen (2023) demonstrated that non-educational apps decrease productivity. This suggests selective technology use maximizes benefits while minimizing drawbacks."
      ],
      notes: [
        "Strong claims are specific, debatable, and supported by evidence. Avoid vague statements like 'AI is important' - instead use 'AI tutoring systems can improve math scores by 15% for struggling students based on meta-analysis of 50 studies.'",
        "Evidence integration requires paraphrasing and synthesizing sources rather than direct copying. For example, transform 'Students who used tablets scored 10% higher' into 'Tablet integration correlates with improved test performance, suggesting technology's potential for enhanced learning outcomes.'",
        "Use signal phrases to integrate sources smoothly: 'According to Johnson (2022)...' or 'Research indicates...' This shows your engagement with sources while maintaining your voice as the writer.",
        "Balance multiple perspectives in your evidence. Don't cherry-pick only supporting sources - include contradictory evidence and explain why your position is stronger. For instance, acknowledge limitations in studies while emphasizing overall trends.",
        "Practice evaluating source credibility: Check author expertise, publication venue, methodology rigor, and recency. A 2023 peer-reviewed study carries more weight than a 2010 blog post.",
        "Final preparation tip: Create an evidence log for your ACE topic, listing claims, supporting sources, counterarguments, and your rebuttals. This organized approach ensures comprehensive coverage."
      ],
      questions: [
        {
          question: "What makes a claim 'strong' for academic argumentation?",
          type: "multiple-choice",
          options: ["It's popular opinion", "It's specific, debatable, and evidence-based", "It's short and simple", "It agrees with everyone"],
          answer: "It's specific, debatable, and evidence-based",
          explanation: "Strong claims are precise, arguable, and supported by credible evidence."
        },
        {
          question: "True or False: Direct quotes should make up most of your evidence in ACE drafts.",
          type: "true-false",
          answer: "False",
          explanation: "ACE emphasizes paraphrasing and synthesis over direct quotation to demonstrate understanding."
        },
        {
          question: "Which signal phrase best integrates this source: 'Williams (2023) found that blended learning improves retention.'",
          type: "multiple-choice",
          options: ["Williams says", "According to Williams", "Williams claims", "All are equally good"],
          answer: "According to Williams",
          explanation: "'According to' is formal and academic, suitable for evidence integration."
        },
        {
          question: "Why should you include contradictory evidence in your argument?",
          type: "short-answer",
          answer: "Including counter-evidence shows you've considered multiple perspectives, strengthens your position by addressing weaknesses, and demonstrates critical thinking.",
          explanation: "Addresses evaluation techniques and comprehensive argumentation."
        },
        {
          question: "Evaluate this claim for ACE suitability: 'Schools need more funding.'",
          type: "short-answer",
          answer: "Too vague and broad - needs specificity like 'Urban schools need 20% more funding for technology integration to close the digital divide, as evidenced by achievement gaps in underfunded districts.'",
          explanation: "Practices claim evaluation and strengthening for ACE preparation."
        },
        {
          question: "What factors should you consider when evaluating a source's credibility?",
          type: "multiple-choice",
          options: ["Author's name length", "Publication date, methodology, author expertise, and peer review status", "Font size in the article", "Number of pictures"],
          answer: "Publication date, methodology, author expertise, and peer review status",
          explanation: "Critical evaluation requires assessing research quality and authority."
        },
        {
          question: "True or False: Paraphrasing sources is less valuable than direct quotation in academic writing.",
          type: "true-false",
          answer: "False",
          explanation: "Paraphrasing demonstrates deeper understanding and allows better integration into your argument."
        },
        {
          question: "How would you synthesize these two sources: Source A says 'AI improves efficiency'; Source B says 'AI reduces errors by 30%'?",
          type: "short-answer",
          answer: "Both sources support AI's benefits in educational assessment: while Source A emphasizes efficiency gains, Source B provides specific quantitative evidence of error reduction, together suggesting AI's potential for more reliable evaluation.",
          explanation: "Practices evidence synthesis skills needed for ACE drafts."
        },
        {
          question: "What is the main purpose of an evidence log during ACE preparation?",
          type: "multiple-choice",
          options: ["To count words", "To organize claims, sources, and counterarguments systematically", "To list favorite quotes", "To track reading time"],
          answer: "To organize claims, sources, and counterarguments systematically",
          explanation: "Evidence logs help structure comprehensive arguments for the draft."
        },
        {
          question: "Identify a weakness in this evidence integration: 'Many studies show technology helps learning (Smith, 2020; Johnson, 2021; Chen, 2022).'",
          type: "short-answer",
          answer: "Too vague - doesn't specify what the studies found, how they relate to the claim, or why they should be trusted. Needs specific findings and evaluation of each source's relevance.",
          explanation: "Practices critical evaluation of evidence integration techniques."
        }
      ]
    },
    {
      id: 3,
      title: "Mastering Counterarguments and Rebuttals",
      examples: [
        "Counterargument: 'Critics argue that banning social media in schools violates students' freedom of expression.' Rebuttal: 'While free expression is important, research shows social media reduces academic performance by 25%, making limited restrictions a reasonable balance for educational success.'",
        "Steel-manning counterarguments: Opponent claims 'AI grading is unfair to creative subjects.' Strong rebuttal: 'AI can evaluate objective criteria consistently, freeing teachers to focus on subjective creative assessment where human judgment is most valuable.'",
        "Multiple rebuttal strategies: Address counterargument with evidence, concede partial validity, or show irrelevance. For example, if someone argues 'Online learning lacks social interaction,' rebut with 'Studies show well-designed online courses include collaborative elements that match traditional classrooms.'"
      ],
      notes: [
        "Counterarguments anticipate objections to your position. Strong arguments address the strongest possible counterarguments, not weak straw-man versions. For example, when arguing for AI in education, address legitimate concerns about algorithmic bias rather than dismissing all criticism.",
        "Rebuttals provide evidence-based responses to counterarguments. Use research, logical reasoning, or concessions. For instance, 'While privacy concerns are valid, encrypted systems with parental controls can protect student data while enabling personalized learning.'",
        "Steel-manning strengthens your argument by charitably representing opponents' positions. This shows intellectual honesty and makes your rebuttals more convincing. Avoid weak counterarguments that are easy to dismiss.",
        "Structure rebuttals clearly: 1) Acknowledge the counterargument fairly, 2) Provide evidence or reasoning against it, 3) Connect back to your main claim. This demonstrates critical thinking and comprehensive analysis.",
        "Practice evaluating counterarguments by asking: Is this the strongest objection? What evidence supports it? How does it challenge my claim? What concessions can I make while maintaining my position?",
        "Final ACE tip: Create a counterargument-rebuttal chart for your topic. List potential objections, evaluate their strength, and prepare evidence-based responses. This preparation ensures your draft addresses all major concerns."
      ],
      questions: [
        {
          question: "What is 'steel-manning' a counterargument?",
          type: "multiple-choice",
          options: ["Making it stronger than it really is", "Presenting the weakest version", "Ignoring it completely", "Agreeing with it fully"],
          answer: "Making it stronger than it really is",
          explanation: "Steel-manning presents the opponent's argument in its strongest form to make your rebuttal more credible."
        },
        {
          question: "True or False: You should only address weak counterarguments in your ACE draft to make your position look stronger.",
          type: "true-false",
          answer: "False",
          explanation: "Addressing the strongest counterarguments demonstrates critical thinking and strengthens your position."
        },
        {
          question: "Which rebuttal strategy involves acknowledging some validity in the counterargument?",
          type: "multiple-choice",
          options: ["Complete rejection", "Concession", "Dismissal", "Avoidance"],
          answer: "Concession",
          explanation: "Concession acknowledges valid points while showing why your position is still stronger overall."
        },
        {
          question: "Why is it important to anticipate counterarguments in academic writing?",
          type: "short-answer",
          answer: "It shows you've considered multiple perspectives, strengthens your position by addressing weaknesses, and demonstrates the critical thinking required for academic argumentation.",
          explanation: "Addresses evaluation techniques and comprehensive argumentation skills."
        },
        {
          question: "Construct a rebuttal to this counterargument: 'Social media bans in schools are ineffective because students will just use it outside school.'",
          type: "short-answer",
          answer: "While students may access social media outside school, research shows that in-school restrictions reduce distractions during learning time, improving focus and academic performance by 20-30% according to multiple studies.",
          explanation: "Practices rebuttal construction for ACE preparation."
        },
        {
          question: "What makes a counterargument 'strong'?",
          type: "multiple-choice",
          options: ["It's popular opinion", "It's based on evidence and directly challenges your claim", "It's very emotional", "It agrees with your position"],
          answer: "It's based on evidence and directly challenges your claim",
          explanation: "Strong counterarguments are evidence-based and pose real challenges to your position."
        },
        {
          question: "True or False: Rebuttals should completely dismiss counterarguments without any acknowledgment.",
          type: "true-false",
          answer: "False",
          explanation: "Effective rebuttals acknowledge counterarguments fairly before providing evidence against them."
        },
        {
          question: "Evaluate this rebuttal strategy: 'Some people say AI will replace teachers, but that's ridiculous.'",
          type: "short-answer",
          answer: "Weak - uses dismissive language instead of evidence. Better: 'While AI can handle routine tasks, human teachers provide essential emotional intelligence and complex mentoring that technology cannot replicate, as shown in studies comparing AI-only vs hybrid education models.'",
          explanation: "Practices critical evaluation of rebuttal techniques."
        },
        {
          question: "How should you structure a counterargument and rebuttal paragraph in your ACE draft?",
          type: "short-answer",
          answer: "1) Acknowledge the counterargument fairly, 2) Provide evidence or reasoning to address it, 3) Explain why your position remains stronger, 4) Connect back to your main claim.",
          explanation: "Provides practical guidance for ACE draft structure."
        },
        {
          question: "Identify the counterargument and rebuttal in this sentence: 'Although critics argue that online learning lacks personal interaction, well-designed virtual classrooms with discussion forums and video conferencing actually foster more diverse interactions than traditional lectures.'",
          type: "short-answer",
          answer: "Counterargument: online learning lacks personal interaction; Rebuttal: well-designed virtual classrooms with forums and video conferencing foster diverse interactions.",
          explanation: "Practices identification of argumentation elements for final review."
        }
      ]
    }
  ]
};

export const week9Meta: WeekMeta = {
  dateRange: "16-20 Mar 2026",
  assignmentTagline: "ACE Draft (15%) this week",
  assignmentIds: ["ace-draft"],
};
