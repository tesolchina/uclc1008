import { WeekData, WeekMeta } from "../types";

export const week11: WeekData = {
  id: 11,
  title: "Week 11",
  theme: "Critical Response & Preparing for Peer Evaluation",
  overview:
    "Consolidate your critical response skills and get ready to give and receive peer feedback on your draft.",
  inClassActivities: [
    "Briefing on forthcoming assignments",
    "Module 4: Part 3",
    "Reminder: Week 12 – In-class Peer Evaluation on Argument Construction and Evaluation (Draft) (5%)",
  ],
  learningOutcomes: [
    "Identify strengths and areas for improvement in a peer's argumentative draft.",
    "Give constructive, specific feedback linked to the argumentation model.",
    "Revise your own work based on peer and teacher comments.",
  ],
  resources: [
    {
      title: "Peer evaluation criteria for Argument Construction and Evaluation (Draft)",
      type: "reading",
      duration: "10 min",
    },
    {
      title: "Sample peer feedback comments",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Revision planning worksheet",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Practise annotating a sample paragraph using the peer evaluation criteria.",
    "Write three concrete suggestions you could give a peer to strengthen their argument.",
    "Ask the AI tutor to help you rephrase feedback comments more clearly and politely.",
  ],
  aiPromptHint:
    "You support students in giving and receiving constructive peer feedback focused on argument quality.",
  skillsIntroduced: ["peer-feedback"],
  skillsReinforced: ["critical-evaluation", "toulmin-model", "counterarguments"],
  assignmentsUpcoming: ["peer-evaluation", "ace-final", "ai-reflection", "craa", "reflective-portfolio"],
  lessons: [
    {
      id: 1,
      title: "Advanced Critical Reading of Arguments",
      examples: [
        "Claim: 'AI tutors will replace human teachers entirely by 2030.' Evidence: Statistics showing 40% AI adoption in education by 2025. Explanation: Exponential growth in AI capabilities and cost savings for institutions.",
        "Claim: 'Social media platforms should be regulated like tobacco products.' Evidence: Studies linking social media use to increased anxiety in teenagers. Explanation: Both pose significant public health risks requiring government intervention.",
        "Claim: 'Remote work increases productivity for all job types.' Evidence: Survey data from tech companies showing 25% productivity gains. Explanation: Reduced commute time and flexible schedules enhance focus and work-life balance."
      ],
      notes: [
        "Identify the core claim: The main assertion the argument is making. Example: In the AI tutor claim, the core is 'complete replacement by 2030', not just 'AI will be used in education'.",
        "Evaluate evidence credibility: Check sources, recency, and relevance. Example: A peer-reviewed 2024 study on AI in education is more credible than a 2018 blog post.",
        "Analyze the explanation: How well does the reasoning connect evidence to claim? Example: If evidence shows AI can handle basic tutoring, the explanation must justify why this means complete replacement.",
        "Spot assumptions: Unstated beliefs that underpin the argument. Example: The remote work claim assumes all employees have suitable home environments.",
        "Consider alternative interpretations: Could the evidence support different conclusions? Example: Productivity gains in surveys might be due to self-selection bias.",
        "Assess rhetorical appeals: Balance of ethos (credibility), pathos (emotion), and logos (logic). Example: The social media regulation argument uses pathos through health concerns."
      ],
      questions: [
        {
          question: "What is the core claim in the argument: 'While AI can assist in education, human teachers will remain essential due to their ability to provide emotional support and adapt to complex student needs.'",
          type: "short-answer",
          answer: "Human teachers will remain essential in education despite AI assistance.",
          explanation: "The claim is the main assertion that human teachers are irreplaceable."
        },
        {
          question: "Which type of evidence is strongest for evaluating an argument's validity?",
          type: "multiple-choice",
          options: ["Personal anecdotes", "Peer-reviewed research studies", "Social media opinions", "Popular blog posts"],
          answer: "Peer-reviewed research studies",
          explanation: "Peer-reviewed studies undergo rigorous scrutiny and are generally more reliable than anecdotal or unverified sources."
        },
        {
          question: "Identify the assumption in this claim: 'Since remote work has increased productivity in tech companies, it should be mandatory for all industries.'",
          type: "short-answer",
          answer: "That productivity gains in tech companies apply universally to all industries.",
          explanation: "The argument assumes generalizability without considering industry-specific factors."
        },
        {
          question: "How does pathos function in argumentation?",
          type: "short-answer",
          answer: "Pathos appeals to emotions to persuade the audience.",
          explanation: "Unlike logos (logic) or ethos (credibility), pathos uses emotional appeals."
        },
        {
          question: "What makes an explanation weak in an academic argument?",
          type: "multiple-choice",
          options: ["It uses complex vocabulary", "It contains logical fallacies", "It cites many sources", "It is concise"],
          answer: "It contains logical fallacies",
          explanation: "Logical fallacies undermine the reasoning connecting evidence to claim."
        },
        {
          question: "Analyze the evidence quality in: 'According to a 2015 survey of 50 people, social media causes depression.'",
          type: "short-answer",
          answer: "Weak due to small sample size, outdated data, and lack of controls.",
          explanation: "Strong evidence requires large, recent, representative samples and rigorous methodology."
        },
        {
          question: "What is a counter-evidence consideration for the claim that 'AI will replace teachers'?",
          type: "short-answer",
          answer: "AI lacks emotional intelligence and adaptability to unpredictable classroom dynamics.",
          explanation: "Counter-evidence challenges the claim by highlighting limitations not addressed in the original argument."
        },
        {
          question: "True or False: All assumptions in an argument must be explicitly stated.",
          type: "true-false",
          answer: "False",
          explanation: "Many assumptions are implicit and require critical reading to identify."
        },
        {
          question: "How can alternative interpretations weaken an argument?",
          type: "short-answer",
          answer: "By showing that the evidence could support different conclusions.",
          explanation: "If evidence is ambiguous, it reduces the argument's persuasiveness."
        },
        {
          question: "Which rhetorical appeal is primarily used in: 'As a leading expert in AI ethics, I can assure you that...'?",
          type: "multiple-choice",
          options: ["Logos", "Pathos", "Ethos", "Kairos"],
          answer: "Ethos",
          explanation: "Ethos establishes the speaker's credibility and authority."
        }
      ]
    },
    {
      id: 2,
      title: "Constructing Effective Counterarguments",
      examples: [
        "Original claim: 'Social media enhances social connections.' Counterargument: 'While social media facilitates superficial connections, it often reduces deep, meaningful relationships due to algorithmic echo chambers.'",
        "Original claim: 'Remote work is always more productive.' Counterargument: 'Remote work can increase productivity for independent tasks but may hinder collaboration and innovation in team-based creative work.'",
        "Original claim: 'AI will eliminate bias in hiring.' Counterargument: 'AI systems can perpetuate and amplify existing biases if trained on biased historical data without proper oversight.'"
      ],
      notes: [
        "Start with the original claim: Clearly restate what you're countering. Example: 'Contrary to the claim that social media enhances connections...'",
        "Present counter-evidence: Use credible sources that contradict the original. Example: Cite studies showing decreased face-to-face interactions among heavy social media users.",
        "Provide logical explanations: Show why your evidence undermines the claim. Example: Explain how algorithms create filter bubbles that limit diverse perspectives.",
        "Address potential rebuttals: Anticipate counter-counterarguments. Example: Acknowledge that social media can connect geographically dispersed people.",
        "Maintain balanced tone: Use respectful language while being firm. Example: 'While there are benefits, the drawbacks are significant...'",
        "Conclude with implications: Explain why your counterargument matters. Example: 'This suggests we need balanced approaches to technology use.'"
      ],
      questions: [
        {
          question: "What is the first step in constructing a counterargument?",
          type: "multiple-choice",
          options: ["Present your evidence", "Restate the original claim", "Make emotional appeals", "Cite authorities"],
          answer: "Restate the original claim",
          explanation: "Clearly identifying what you're countering ensures your argument directly addresses the issue."
        },
        {
          question: "How should counter-evidence be selected?",
          type: "short-answer",
          answer: "It should be credible, relevant, and directly contradict the original claim.",
          explanation: "Weak counter-evidence undermines your position."
        },
        {
          question: "What makes a counterargument balanced?",
          type: "short-answer",
          answer: "Acknowledging valid points from the original argument while presenting contradictory evidence.",
          explanation: "Balanced counterarguments are more persuasive and demonstrate critical thinking."
        },
        {
          question: "Identify the logical fallacy in this counterargument: 'The claim that AI improves education is wrong because AI is just a fad.'",
          type: "short-answer",
          answer: "Ad hominem or oversimplification - it attacks the technology rather than addressing the specific claim.",
          explanation: "Effective counterarguments must engage with the substance of the argument."
        },
        {
          question: "Why is anticipating rebuttals important in counterarguments?",
          type: "short-answer",
          answer: "It strengthens your position by showing you've considered alternative perspectives.",
          explanation: "Addressing potential objections demonstrates thorough analysis."
        },
        {
          question: "Construct a counterargument claim for: 'Remote work should be mandatory for all jobs.'",
          type: "short-answer",
          answer: "Remote work may not be suitable for all job types, particularly those requiring intensive collaboration or hands-on supervision.",
          explanation: "Counterarguments should be specific and evidence-based."
        },
        {
          question: "What tone should be used in academic counterarguments?",
          type: "multiple-choice",
          options: ["Aggressive and confrontational", "Respectful and analytical", "Sarcastic and dismissive", "Emotional and passionate"],
          answer: "Respectful and analytical",
          explanation: "Academic discourse values reasoned critique over personal attacks."
        },
        {
          question: "True or False: Counterarguments must completely disprove the original claim.",
          type: "true-false",
          answer: "False",
          explanation: "Counterarguments can show limitations or alternative interpretations without total refutation."
        },
        {
          question: "How do implications strengthen a counterargument?",
          type: "short-answer",
          answer: "They show the broader significance and real-world consequences of accepting the counterargument.",
          explanation: "Implications help persuade audiences of the counterargument's importance."
        },
        {
          question: "What is a potential rebuttal to the counterargument that 'AI perpetuates bias in hiring'?",
          type: "short-answer",
          answer: "AI can be designed with bias-detection algorithms and diverse training data to minimize bias.",
          explanation: "Strong counterarguments anticipate and address potential objections."
        }
      ]
    },
    {
      id: 3,
      title: "Oral Presentation Techniques for CRAA",
      examples: [
        "Structure: 'The speaker claimed that AI will replace teachers by 2030, supported by adoption statistics and cost analysis. However, I argue that human teachers remain essential due to their emotional intelligence and adaptability.'",
        "Evidence integration: 'While the 40% adoption rate is impressive, studies from Harvard University show that student-teacher relationships are crucial for motivation, which AI cannot replicate.'",
        "Conclusion: 'In conclusion, while AI has a role in education, complete replacement overlooks the human elements essential for effective learning.'"
      ],
      notes: [
        "Structure your response: Start with summary (claim, evidence, explanation), present counterargument, conclude with key points. Example: Use transitions like 'However' to move between sections.",
        "Time management: Practice delivering content within 2 minutes. Example: Aim for 30-45 seconds per section (summary, counterargument, conclusion).",
        "Clear articulation: Speak slowly and enunciate. Example: Avoid rushing through complex terms like 'algorithmic bias'.",
        "Evidence integration: Weave in counter-evidence smoothly. Example: 'Contrary to the cost savings argument, research shows...'",
        "Body language: Maintain eye contact and use natural gestures. Example: Face the audience and use hand movements to emphasize points.",
        "Confidence building: Practice multiple times. Example: Record yourself and note areas for improvement in pacing and clarity."
      ],
      questions: [
        {
          question: "What is the recommended structure for a CRAA oral response?",
          type: "multiple-choice",
          options: ["Counterargument first, then summary", "Summary, counterargument, conclusion", "Evidence only", "Personal opinion"],
          answer: "Summary, counterargument, conclusion",
          explanation: "This structure ensures comprehensive coverage within the time limit."
        },
        {
          question: "How much time should be allocated to each section in a 2-minute CRAA response?",
          type: "short-answer",
          answer: "Approximately 30-45 seconds for summary, 45-60 seconds for counterargument, 20-30 seconds for conclusion.",
          explanation: "Proper time allocation ensures balanced coverage of all required elements."
        },
        {
          question: "Why is clear articulation important in CRAA presentations?",
          type: "short-answer",
          answer: "It ensures the audience can understand complex academic concepts and arguments.",
          explanation: "Poor articulation can undermine even strong arguments."
        },
        {
          question: "How should counter-evidence be integrated into oral responses?",
          type: "short-answer",
          answer: "Use transitional phrases and cite sources briefly while explaining their relevance.",
          explanation: "Smooth integration maintains flow and credibility."
        },
        {
          question: "What body language techniques enhance CRAA presentations?",
          type: "multiple-choice",
          options: ["Avoiding eye contact", "Speaking to notes only", "Maintaining eye contact and using natural gestures", "Fidgeting constantly"],
          answer: "Maintaining eye contact and using natural gestures",
          explanation: "Positive body language increases persuasiveness and engagement."
        },
        {
          question: "True or False: Memorizing your entire CRAA response word-for-word is recommended.",
          type: "true-false",
          answer: "False",
          explanation: "Memorization can lead to robotic delivery; practicing key points allows for natural presentation."
        },
        {
          question: "How can you build confidence for CRAA presentations?",
          type: "short-answer",
          answer: "Practice multiple times, record yourself, and focus on content mastery rather than perfection.",
          explanation: "Confidence comes from preparation and familiarity with the material."
        },
        {
          question: "What should you do if you run out of time during a CRAA response?",
          type: "short-answer",
          answer: "Prioritize concluding your main counterargument points over introducing new evidence.",
          explanation: "A strong conclusion is more important than incomplete additional points."
        },
        {
          question: "How should transitions be used in CRAA oral responses?",
          type: "short-answer",
          answer: "Use phrases like 'however,' 'in contrast,' or 'moreover' to connect ideas smoothly.",
          explanation: "Transitions help the audience follow your argumentative flow."
        },
        {
          question: "Why is it important to cite sources briefly in CRAA presentations?",
          type: "short-answer",
          answer: "It establishes credibility without taking excessive time from the limited presentation period.",
          explanation: "Source citation supports your counter-evidence while maintaining time efficiency."
        }
      ]
    }
  ]
};

export const week11Meta: WeekMeta = {
  dateRange: "30 Mar - 3 Apr 2026",
  assignmentTagline: "Peer Evaluation next week",
  assignmentIds: [],
};
