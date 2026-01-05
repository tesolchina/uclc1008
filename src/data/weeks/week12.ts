import { WeekData, WeekMeta } from "../types";

export const week12: WeekData = {
  id: 12,
  title: "Week 12",
  theme: "Advanced CRAA (Critical Reading and Academic Argumentation)",
  overview:
    "This week focuses on advanced critical reading and academic argumentation skills. Students will engage in final review, practice presentations, and critical analysis to prepare for the CRAA assessment.",
  inClassActivities: [
    "Advanced CRAA Workshop: Critical Reading Techniques",
    "Argument Construction Practice Sessions",
    "Presentation Skills and Peer Review",
  ],
  learningOutcomes: [
    "Apply advanced critical reading strategies to complex academic texts.",
    "Construct well-supported academic arguments with counterarguments.",
    "Deliver effective presentations of critical analyses.",
    "Provide constructive peer feedback on argumentation.",
  ],
  resources: [
    {
      title: "Advanced Critical Reading Strategies Guide",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Argument Construction Framework",
      type: "practice",
      duration: "20 min",
    },
    {
      title: "Presentation Skills for Academic Arguments",
      type: "video",
      duration: "12 min",
    },
  ],
  practiceTasks: [
    "Analyze a complex academic article using advanced critical reading techniques.",
    "Construct an argument with multiple perspectives and counterarguments.",
    "Practice presenting your critical analysis to peers.",
  ],
  aiPromptHint:
    "You help students master advanced critical reading and academic argumentation skills for their CRAA assessment.",
  skillsIntroduced: ["advanced-critical-reading", "argument-construction"],
  skillsReinforced: ["critical-analysis", "presentation-skills", "peer-review"],
  assignmentsDue: ["ace-final"],
  assignmentsUpcoming: ["craa", "reflective-portfolio"],
  lessons: [
    {
      id: 1,
      title: "Advanced Critical Reading Techniques",
      examples: [
        "When reading 'The Impact of Social Media on Academic Performance,' identify the author's implicit assumptions about technology's role in education and evaluate whether these assumptions are supported by evidence from multiple studies.",
        "In analyzing 'Climate Change and Economic Policy,' examine how the author uses rhetorical strategies like appeals to authority, emotional appeals, and logical reasoning to persuade readers.",
        "For 'Gender Bias in STEM Education,' critically evaluate the methodology section to assess whether the sample size and research design adequately address potential confounding variables."
      ],
      notes: [
        "Advanced critical reading involves identifying the author's purpose, audience, and rhetorical strategies. For example, when reading an article arguing for increased STEM funding, note if the author appeals to economic benefits, national security, or social equity to understand their persuasive approach.",
        "Evaluate source credibility by examining author expertise, publication venue, and recency. A 2023 article in Nature by a renowned climate scientist carries more weight than a blog post from an anonymous author.",
        "Identify logical fallacies such as ad hominem attacks, false dichotomies, or hasty generalizations. For instance, claiming 'All social media is harmful to teenagers' ignores nuanced research showing both positive and negative effects.",
        "Analyze the structure of arguments: claim (main assertion), grounds (evidence), warrant (connection between claim and grounds), and backing (additional support for the warrant).",
        "Consider alternative perspectives and counterarguments. A strong academic argument acknowledges opposing viewpoints, such as addressing skeptics who question climate change data by citing multiple independent studies.",
        "Examine the scope and limitations of research claims. An article claiming 'universal benefits of online learning' may not account for socioeconomic factors affecting access and success."
      ],
      questions: [
        {
          question: "What is the primary purpose of advanced critical reading in academic contexts?",
          type: "multiple-choice",
          options: [
            "To memorize facts and details",
            "To evaluate arguments, identify biases, and assess evidence quality",
            "To find grammatical errors in texts",
            "To summarize content without analysis"
          ],
          answer: "To evaluate arguments, identify biases, and assess evidence quality",
          explanation: "Advanced critical reading goes beyond comprehension to analyze rhetorical strategies, evidence quality, and potential biases."
        },
        {
          question: "True or False: A credible academic source must always be peer-reviewed.",
          type: "true-false",
          answer: "False",
          explanation: "While peer review is a strong indicator of credibility, some credible sources like government reports or established research institutions may not undergo traditional peer review."
        },
        {
          question: "Identify the logical fallacy in this statement: 'Professor Smith's research on climate change can't be trusted because they once worked for an oil company.'",
          type: "multiple-choice",
          options: ["Ad hominem", "False dichotomy", "Hasty generalization", "Appeal to emotion"],
          answer: "Ad hominem",
          explanation: "Ad hominem attacks discredit the person rather than addressing the argument's merits."
        },
        {
          question: "What should you evaluate when assessing the credibility of an academic source?",
          type: "short-answer",
          answer: "Author expertise, publication venue, recency, methodology, and potential biases.",
          explanation: "These factors help determine the reliability and relevance of the source."
        },
        {
          question: "Explain why acknowledging counterarguments strengthens an academic argument.",
          type: "short-answer",
          answer: "Acknowledging counterarguments demonstrates intellectual honesty, addresses potential objections, and shows comprehensive understanding of the topic.",
          explanation: "Strong arguments anticipate and address opposing viewpoints rather than ignoring them."
        },
        {
          question: "True or False: All research claims have universal applicability regardless of context.",
          type: "true-false",
          answer: "False",
          explanation: "Research findings are often context-specific and may not generalize to all populations or situations."
        },
        {
          question: "How can rhetorical strategies influence the persuasiveness of an academic argument?",
          type: "essay",
          answer: "Rhetorical strategies like ethos (credibility), pathos (emotional appeal), and logos (logical reasoning) can make arguments more compelling. However, over-reliance on pathos without sufficient logos can weaken the argument's academic credibility.",
          explanation: "Effective academic arguments balance rhetorical appeals with strong evidence and logical reasoning."
        },
        {
          question: "What is the difference between a claim and grounds in an argument?",
          type: "short-answer",
          answer: "A claim is the main assertion being made, while grounds are the evidence or reasons provided to support that claim.",
          explanation: "Understanding this structure helps evaluate argument strength."
        },
        {
          question: "Why is it important to consider alternative perspectives when critically reading academic texts?",
          type: "short-answer",
          answer: "Considering alternatives prevents confirmation bias, reveals limitations in the argument, and leads to more balanced analysis.",
          explanation: "Critical reading requires examining multiple viewpoints for comprehensive understanding."
        },
        {
          question: "Identify a potential limitation when evaluating research on 'the effects of social media on mental health.'",
          type: "short-answer",
          answer: "Self-selection bias (only certain types of people participate), correlation vs causation issues, or failure to account for confounding variables like socioeconomic status.",
          explanation: "Research limitations affect the generalizability and reliability of findings."
        }
      ]
    },
    {
      id: 2,
      title: "Constructing Strong Academic Arguments",
      examples: [
        "In arguing for mandatory AI ethics courses in universities, present evidence from multiple studies showing AI bias incidents, acknowledge counterarguments about curriculum overload, and propose implementation strategies.",
        "When constructing an argument about remote learning effectiveness, use Toulmin's model: claim (remote learning can be as effective as in-person), grounds (cite studies comparing test scores), warrant (explain how technology enables interactive learning), and backing (reference educational technology research).",
        "For an argument on social media regulation, structure it with: thesis, supporting evidence from psychological studies, counterarguments addressing free speech concerns, and rebuttals citing harm reduction precedents."
      ],
      notes: [
        "Strong academic arguments follow Toulmin's model: claim (main assertion), grounds (evidence), warrant (connection between claim and grounds), backing (additional support), and qualifier (limitations). For example, 'Students should learn coding (claim) because it develops problem-solving skills (grounds) which are essential for future careers (warrant), as evidenced by employer surveys (backing), though not all students need advanced programming (qualifier).'",
        "Include counterarguments to demonstrate critical thinking. A balanced argument on climate policy might acknowledge economic concerns while providing evidence that green transitions create jobs.",
        "Use transitional phrases to create logical flow: 'However,' 'In contrast,' 'Furthermore,' 'Therefore.' These help readers follow the argument's progression.",
        "Support claims with multiple types of evidence: statistical data, expert testimony, examples, and logical reasoning. A single study is rarely sufficient for a strong argument.",
        "Address potential objections proactively. When arguing for increased research funding, anticipate budget concerns by showing long-term economic benefits.",
        "End with clear implications or recommendations. A strong conclusion might specify actionable steps rather than vague statements."
      ],
      questions: [
        {
          question: "What are the key components of Toulmin's model of argumentation?",
          type: "multiple-choice",
          options: [
            "Claim, grounds, warrant, backing, and qualifier",
            "Introduction, body, conclusion",
            "Thesis, evidence, analysis",
            "Problem, solution, benefits"
          ],
          answer: "Claim, grounds, warrant, backing, and qualifier",
          explanation: "Toulmin's model provides a structured approach to building academic arguments."
        },
        {
          question: "True or False: Strong academic arguments should avoid counterarguments to maintain focus.",
          type: "true-false",
          answer: "False",
          explanation: "Including counterarguments demonstrates critical thinking and strengthens the overall argument."
        },
        {
          question: "Why is it important to use multiple types of evidence in academic arguments?",
          type: "short-answer",
          answer: "Multiple evidence types provide comprehensive support, address different learning styles, and make the argument more convincing and robust.",
          explanation: "Diverse evidence strengthens arguments against various critiques."
        },
        {
          question: "What role do transitional phrases play in academic arguments?",
          type: "short-answer",
          answer: "Transitional phrases create logical flow, show relationships between ideas, and help readers follow the argument's progression.",
          explanation: "Clear transitions improve argument clarity and coherence."
        },
        {
          question: "Explain how qualifiers strengthen academic arguments.",
          type: "short-answer",
          answer: "Qualifiers acknowledge limitations and prevent overgeneralization, demonstrating intellectual honesty and nuanced thinking.",
          explanation: "Qualifiers show awareness of argument boundaries and complexities."
        },
        {
          question: "True or False: A single strong study can provide sufficient evidence for any academic argument.",
          type: "true-false",
          answer: "False",
          explanation: "Multiple sources of evidence are typically needed to support complex academic claims adequately."
        },
        {
          question: "How should counterarguments be addressed in academic writing?",
          type: "short-answer",
          answer: "Acknowledge them fairly, provide evidence to refute or limit their impact, and show how your position remains stronger overall.",
          explanation: "Proper counterargument handling demonstrates balanced analysis."
        },
        {
          question: "What makes a conclusion effective in an academic argument?",
          type: "multiple-choice",
          options: [
            "Restating the thesis word-for-word",
            "Introducing new evidence not discussed earlier",
            "Providing clear implications and recommendations",
            "Apologizing for any weaknesses"
          ],
          answer: "Providing clear implications and recommendations",
          explanation: "Strong conclusions connect the argument to broader implications and suggest next steps."
        },
        {
          question: "Why should academic arguments anticipate potential objections?",
          type: "short-answer",
          answer: "Anticipating objections shows comprehensive understanding, addresses reader concerns proactively, and strengthens the argument's credibility.",
          explanation: "Proactive objection handling prevents weak points from undermining the argument."
        },
        {
          question: "Construct a basic Toulmin argument structure for the claim: 'Universities should require AI literacy courses.'",
          type: "essay",
          answer: "Claim: Universities should require AI literacy courses. Grounds: AI is increasingly integrated into professional fields, and lack of understanding leads to misuse. Warrant: Education prepares students for future challenges. Backing: Cite studies on AI job market changes and examples of AI ethical failures. Qualifier: Implementation should be phased and adapted to different disciplines.",
          explanation: "Demonstrates understanding of argument structure and application to a contemporary issue."
        }
      ]
    },
    {
      id: 3,
      title: "Practice Presentations and Critical Analysis",
      examples: [
        "During a presentation on 'The Future of Work in the AI Era,' use visual aids to show employment trend data, pause for emphasis when discussing ethical implications, and conclude with specific policy recommendations.",
        "In presenting a critical analysis of 'Social Media's Impact on Democracy,' structure it with: hook (recent election interference example), thesis (social media amplifies both democratic participation and misinformation), evidence from multiple studies, counterarguments, and practical solutions.",
        "When practicing peer review, provide specific feedback like 'Your warrant connecting social media use to decreased attention spans could be strengthened by citing neurological studies' rather than vague comments like 'This section needs work.'"
      ],
      notes: [
        "Effective presentations begin with a strong hook, clear thesis, organized structure, and memorable conclusion. For example, start a presentation on climate change with a striking statistic: 'Every minute, an area of forest the size of 36 football fields is destroyed.'",
        "Use the 'tell them what you're going to tell them, tell them, tell them what you told them' structure. Introduction previews main points, body develops them with evidence, conclusion summarizes key takeaways.",
        "Incorporate visual aids strategically: graphs for data, timelines for processes, and images for concepts. Avoid text-heavy slides that compete with your spoken delivery.",
        "Practice vocal delivery: vary pace and volume for emphasis, use pauses for important points, and maintain eye contact. Record yourself to identify filler words like 'um' or 'like.'",
        "Critical analysis presentations should evaluate sources, identify strengths and weaknesses, and propose improvements. When analyzing a research article, discuss methodology rigor, sample representativeness, and practical implications.",
        "Peer review feedback should be specific, constructive, and balanced. Focus on content (argument strength), organization (logical flow), and presentation (clarity) rather than personal preferences."
      ],
      questions: [
        {
          question: "What is the most effective structure for academic presentations?",
          type: "multiple-choice",
          options: [
            "Tell them, tell them again, tell them differently",
            "Introduction, random examples, conclusion",
            "Thesis, evidence, more evidence, end",
            "Tell them what you'll tell them, tell them, tell them what you told them"
          ],
          answer: "Tell them what you'll tell them, tell them, tell them what you told them",
          explanation: "This structure ensures clarity and helps audiences follow and retain information."
        },
        {
          question: "True or False: Visual aids should contain detailed paragraphs of text to ensure completeness.",
          type: "true-false",
          answer: "False",
          explanation: "Visual aids should be concise; detailed text competes with the speaker and reduces audience attention."
        },
        {
          question: "Why are pauses important in academic presentations?",
          type: "short-answer",
          answer: "Pauses allow important points to resonate, give audiences time to process information, and help the speaker gather thoughts.",
          explanation: "Strategic pauses enhance communication effectiveness."
        },
        {
          question: "What should be included in a critical analysis presentation?",
          type: "short-answer",
          answer: "Evaluation of sources, identification of strengths and weaknesses, discussion of methodology, and proposals for improvement or application.",
          explanation: "Critical analysis goes beyond summary to evaluate and contextualize the material."
        },
        {
          question: "How can presenters maintain audience engagement during complex topics?",
          type: "short-answer",
          answer: "Use relevant examples, vary delivery pace, incorporate questions, use visual aids effectively, and connect concepts to real-world applications.",
          explanation: "Engagement techniques help audiences stay focused on challenging content."
        },
        {
          question: "True or False: Peer review feedback should focus primarily on positive aspects to encourage the presenter.",
          type: "true-false",
          answer: "False",
          explanation: "Effective peer review provides balanced feedback with specific suggestions for improvement alongside positive comments."
        },
        {
          question: "What makes feedback 'constructive' in peer review?",
          type: "short-answer",
          answer: "Constructive feedback is specific, actionable, and focuses on improvement rather than personal criticism. It explains what works and suggests how to enhance weak areas.",
          explanation: "Constructive feedback helps peers improve their work effectively."
        },
        {
          question: "Why should presentations include counterarguments?",
          type: "short-answer",
          answer: "Including counterarguments demonstrates comprehensive understanding, addresses potential objections, and strengthens the presenter's credibility.",
          explanation: "Balanced presentations show critical thinking and thorough analysis."
        },
        {
          question: "How can vocal delivery enhance a presentation's effectiveness?",
          type: "multiple-choice",
          options: [
            "Speaking in a monotone voice throughout",
            "Using varied pace, volume, and pauses for emphasis",
            "Reading directly from slides",
            "Speaking as quickly as possible"
          ],
          answer: "Using varied pace, volume, and pauses for emphasis",
          explanation: "Vocal variety keeps audiences engaged and emphasizes key points."
        },
        {
          question: "Prepare a brief outline for a 5-minute presentation on 'The Benefits and Risks of Artificial Intelligence in Education.'",
          type: "essay",
          answer: "Introduction: Hook with AI grading example, thesis statement. Body: Benefits (personalized learning, efficiency), Risks (privacy concerns, bias), Evidence from studies. Counterarguments: Address cost concerns. Conclusion: Balanced recommendation for careful implementation.",
          explanation: "Demonstrates ability to structure a presentation with clear organization and balanced content."
        }
      ]
    }
  ]
};

export const week12Meta: WeekMeta = {
  dateRange: "13-17 Apr 2026",
  assignmentTagline: "CRAA Final Review and Practice",
  assignmentIds: ["craa"],
};
