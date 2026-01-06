import { WeekData, WeekMeta } from "../types";

export const week5: WeekData = {
  id: 5,
  title: "Week 5",
  theme: "Argumentation Model",
  overview:
    "Move into Module 3 and learn how academic arguments are structured using an argumentation model.",
  inClassActivities: [
    "Module 3: Introduction and activities",
  ],
  learningOutcomes: [
    "Identify claims, reasons, and evidence in academic arguments.",
    "Describe a basic argumentation model (e.g. Toulmin).",
    "Label parts of an argument in short sample texts.",
  ],
  resources: [
    {
      title: "Module 3: Argumentation model – overview",
      type: "video",
      duration: "12 min",
    },
    {
      title: "Sample academic argument (short article/extract)",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "Argument structure worksheet",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Use the worksheet to label claims, reasons, and evidence in a sample argument.",
    "Draw a simple diagram of the argumentation model for one reading.",
    "Ask the AI tutor to check whether you have correctly identified each part of the model.",
  ],
  aiPromptHint:
    "You specialise in helping students recognise and label the parts of academic arguments using a standard argumentation model.",
  skillsIntroduced: ["argument-identification", "toulmin-model"],
  skillsReinforced: ["summarising", "synthesising"],
  assignmentsUpcoming: ["academic-writing-quiz"],
  lessons: [
    {
      id: 1,
      title: "Advanced Reading Comprehension for Academic Texts",
      examples: [
        "Excerpt from Smith (2023): 'The integration of artificial intelligence in educational settings has shown mixed results. While some studies indicate improved student engagement, others highlight concerns about data privacy and algorithmic bias.'",
        "Excerpt from Johnson and Lee (2024): 'Critical thinking skills development requires not only exposure to diverse perspectives but also structured opportunities for analysis and evaluation of arguments.'",
        "Excerpt from Chen et al. (2022): 'Peer assessment in writing courses can enhance learning outcomes when properly scaffolded, though challenges remain in ensuring fairness and consistency.'"
      ],
      notes: [
        "Advanced reading comprehension involves identifying the author's main claim, supporting evidence, and underlying assumptions. For example, in the Smith (2023) excerpt, the main claim is 'mixed results' of AI integration, supported by contrasting studies on engagement and privacy concerns.",
        "Look for signal words that indicate relationships between ideas: 'while' shows contrast, 'however' introduces counterpoints, 'therefore' indicates conclusions. In academic texts, these help understand the argument structure.",
        "Distinguish between facts, opinions, and evidence. Facts are verifiable (e.g., 'studies indicate improved engagement'), opinions are interpretations (e.g., 'concerns about algorithmic bias'), and evidence supports claims (e.g., research findings).",
        "Identify the author's stance or position on the topic. For instance, Chen et al. (2022) acknowledge benefits of peer assessment but emphasize the need for scaffolding and fairness measures.",
        "Recognize rhetorical strategies: some authors use hedging language ('may enhance', 'can improve') to qualify claims, while others use strong assertions. This affects how you interpret the argument's strength.",
        "Practice reading for synthesis: note how different sources complement or contradict each other. For example, combining Smith (2023) and Johnson and Lee (2024) shows both technological and pedagogical approaches to education."
      ],
      questions: [
        {
          question: "What is the main claim in the Smith (2023) excerpt about AI integration in education?",
          type: "multiple-choice",
          options: [
            "AI always improves student engagement",
            "AI integration shows mixed results",
            "AI only raises privacy concerns",
            "AI has no impact on education"
          ],
          answer: "AI integration shows mixed results",
          explanation: "The excerpt explicitly states 'mixed results' and provides both positive and negative aspects."
        },
        {
          question: "Identify the author's stance in the Chen et al. (2022) excerpt regarding peer assessment.",
          type: "short-answer",
          answer: "Positive but cautious - acknowledges benefits when scaffolded but notes challenges in fairness",
          explanation: "The authors recognize benefits while emphasizing the need for proper implementation and fairness measures."
        },
        {
          question: "True or False: The Johnson and Lee (2024) excerpt suggests that exposure to diverse perspectives alone is sufficient for developing critical thinking skills.",
          type: "true-false",
          answer: "False",
          explanation: "The excerpt states that both exposure AND structured opportunities for analysis and evaluation are required."
        },
        {
          question: "What type of relationship does the word 'while' indicate in the Smith (2023) excerpt?",
          type: "multiple-choice",
          options: ["Cause and effect", "Contrast", "Sequence", "Addition"],
          answer: "Contrast",
          explanation: "'While' introduces contrasting ideas about engagement benefits versus privacy concerns."
        },
        {
          question: "Which excerpt uses hedging language to qualify its claims?",
          type: "multiple-choice",
          options: ["Smith (2023)", "Johnson and Lee (2024)", "Chen et al. (2022)", "All of them"],
          answer: "Chen et al. (2022)",
          explanation: "Uses 'can enhance' and 'challenges remain' to qualify the benefits of peer assessment."
        },
        {
          question: "Synthesize the main ideas from Smith (2023) and Johnson and Lee (2024) regarding technology in education.",
          type: "short-answer",
          answer: "Both acknowledge technology's potential but emphasize the need for careful implementation and additional pedagogical support beyond just technology exposure.",
          explanation: "Smith shows mixed AI results, Johnson and Lee stress structured opportunities beyond exposure."
        },
        {
          question: "What evidence does Chen et al. (2022) provide to support their claims about peer assessment?",
          type: "short-answer",
          answer: "They mention that peer assessment can enhance outcomes when scaffolded, but challenges exist in fairness and consistency.",
          explanation: "The excerpt provides conditional benefits and identifies specific challenges as supporting evidence."
        },
        {
          question: "Identify whether this statement from the excerpts represents a fact, opinion, or evidence: 'Some studies indicate improved student engagement.'",
          type: "multiple-choice",
          options: ["Fact", "Opinion", "Evidence", "Assumption"],
          answer: "Evidence",
          explanation: "It references studies as support for claims about AI integration."
        },
        {
          question: "How does the Johnson and Lee (2024) excerpt qualify the development of critical thinking skills?",
          type: "short-answer",
          answer: "Requires both exposure to diverse perspectives AND structured opportunities for analysis and evaluation.",
          explanation: "The excerpt specifies two necessary components, not just exposure alone."
        },
        {
          question: "Which rhetorical strategy is used in the Smith (2023) excerpt to present a balanced view?",
          type: "multiple-choice",
          options: ["Hedging", "Strong assertion", "Balanced contrast", "Personal anecdote"],
          answer: "Balanced contrast",
          explanation: "Presents both positive (engagement) and negative (privacy, bias) aspects of AI integration."
        }
      ]
    },
    {
      id: 2,
      title: "Paraphrasing and Summarizing Techniques",
      examples: [
        "Original: 'The rapid advancement of technology has fundamentally transformed the landscape of education, creating both opportunities and challenges for educators and learners alike.' (Brown, 2023)",
        "Original: 'Peer review processes in academic writing serve multiple purposes: they ensure quality control, provide constructive feedback, and foster a culture of scholarly collaboration.' (Davis & Wilson, 2024)",
        "Original: 'While digital literacy skills are increasingly essential in modern society, many students lack adequate training in critically evaluating online information sources.' (Garcia et al., 2022)"
      ],
      notes: [
        "Paraphrasing involves restating ideas in your own words while maintaining the original meaning. Example: Original - 'Technology has transformed education.' Paraphrase - 'Technological developments have changed the educational environment.'",
        "Summarizing condenses main ideas into fewer words, focusing on key points. Example: Summarize the Brown (2023) excerpt as: 'Technology's rapid progress has changed education, offering both benefits and difficulties.'",
        "Key paraphrasing techniques: change word order, use synonyms, combine sentences, maintain academic tone. Avoid changing meaning or omitting important details.",
        "For AWQ preparation, practice paraphrasing complex sentences. Example: Original - 'Digital literacy skills are increasingly essential.' Paraphrase - 'Proficiency in digital technologies is becoming more crucial.'",
        "Summarizing multiple sources requires synthesis: identify common themes and contrasting views. Example: Combine Garcia et al. (2022) and Davis & Wilson (2024) - 'While peer review ensures academic quality, many students lack skills to evaluate digital sources.'",
        "Common pitfalls: patchwriting (minor changes to original), plagiarism (copying without citation), losing original meaning. Always cite paraphrased ideas."
      ],
      questions: [
        {
          question: "Paraphrase this sentence: 'The rapid advancement of technology has fundamentally transformed the landscape of education.'",
          type: "short-answer",
          answer: "Technological progress has significantly changed the educational environment.",
          explanation: "Uses synonyms (advancement→progress, transformed→changed, landscape→environment) and maintains meaning."
        },
        {
          question: "Summarize the main idea of the Davis & Wilson (2024) excerpt in one sentence.",
          type: "short-answer",
          answer: "Peer review serves quality control, feedback, and scholarly collaboration in academic writing.",
          explanation: "Condenses the three purposes into a concise statement."
        },
        {
          question: "True or False: When paraphrasing, you can omit details that you consider unimportant.",
          type: "true-false",
          answer: "False",
          explanation: "Paraphrasing must maintain all important details and original meaning."
        },
        {
          question: "Identify the paraphrasing error in this attempt: 'Technology has quickly advanced and completely changed education's appearance.'",
          type: "multiple-choice",
          options: [
            "Uses synonyms inappropriately",
            "Changes the original meaning",
            "Maintains academic tone",
            "Combines sentences effectively"
          ],
          answer: "Changes the original meaning",
          explanation: "'Completely changed education's appearance' alters 'fundamentally transformed the landscape' to something less significant."
        },
        {
          question: "Which technique is demonstrated in this paraphrase: Original - 'Digital literacy is essential.' Paraphrase - 'Proficiency in digital technologies is crucial.'",
          type: "multiple-choice",
          options: ["Word order change", "Synonym use", "Sentence combination", "Meaning change"],
          answer: "Synonym use",
          explanation: "Replaces 'literacy' with 'proficiency', 'essential' with 'crucial', 'digital' with 'digital technologies'."
        },
        {
          question: "Synthesize and summarize the contrasting ideas from Garcia et al. (2022) and Davis & Wilson (2024).",
          type: "short-answer",
          answer: "While peer review ensures academic quality through collaboration, students often lack training in evaluating digital information sources.",
          explanation: "Combines the peer review benefits with the digital literacy gap."
        },
        {
          question: "What is patchwriting, and why is it problematic for AWQ?",
          type: "short-answer",
          answer: "Patchwriting is making minor changes to original text without proper paraphrasing. It's problematic because it can lead to unintentional plagiarism and doesn't demonstrate understanding.",
          explanation: "AWQ requires original writing in student's own words."
        },
        {
          question: "Paraphrase this complex sentence: 'Peer review processes serve multiple purposes: they ensure quality control, provide constructive feedback, and foster scholarly collaboration.'",
          type: "short-answer",
          answer: "The peer review system fulfills several functions: it maintains standards, offers helpful criticism, and encourages academic cooperation.",
          explanation: "Uses synonyms and rephrases the list structure while keeping all three purposes."
        },
        {
          question: "True or False: Summaries should always be shorter than the original text.",
          type: "true-false",
          answer: "True",
          explanation: "Summarizing by definition condenses information to essential points in fewer words."
        },
        {
          question: "How does paraphrasing differ from summarizing in academic writing preparation?",
          type: "short-answer",
          answer: "Paraphrasing restates ideas in your own words maintaining similar length, while summarizing condenses main ideas into fewer words.",
          explanation: "Paraphrasing preserves detail, summarizing focuses on key points."
        }
      ]
    },
    {
      id: 3,
      title: "APA Citation in Academic Writing",
      examples: [
        "According to Smith (2023), artificial intelligence enhances learning outcomes when properly implemented.",
        "Research indicates that peer assessment improves writing skills (Johnson & Lee, 2024).",
        "Chen et al. (2022) argue that digital literacy requires both technical skills and critical thinking."
      ],
      notes: [
        "APA citations use author-date format: (Author, Year) for parenthetical citations. Example: 'AI improves education (Smith, 2023).'",
        "Signal phrases introduce citations smoothly: 'According to Smith (2023)...' or 'Smith (2023) reports that...'. This integrates sources naturally into your writing.",
        "For multiple authors: two authors use '&' (Smith & Jones, 2023), three or more use 'et al.' after first author (Smith et al., 2023).",
        "Information-prominent citations place the citation after the information: 'Artificial intelligence enhances learning outcomes (Smith, 2023).'",
        "Avoid floating citations - always connect them to specific ideas. Example: Don't write 'AI is important (Smith, 2023).' Instead: 'AI enhances learning outcomes (Smith, 2023).'",
        "For AWQ, cite paraphrased ideas, not just direct quotes. Example: Paraphrase and cite: 'Technology transforms education (Brown, 2023).' rather than quoting directly."
      ],
      questions: [
        {
          question: "Which of these is a correctly formatted APA citation for two authors?",
          type: "multiple-choice",
          options: ["(Smith and Jones, 2023)", "(Smith & Jones, 2023)", "(Smith et al., 2023)", "(Smith, Jones, 2023)"],
          answer: "(Smith & Jones, 2023)",
          explanation: "APA uses '&' between two authors in parenthetical citations."
        },
        {
          question: "Identify the citation style in this sentence: 'According to Chen et al. (2022), digital literacy requires critical thinking.'",
          type: "multiple-choice",
          options: ["Parenthetical", "Signal phrase", "Information-prominent", "Narrative"],
          answer: "Signal phrase",
          explanation: "Uses 'According to' to introduce the source before the information."
        },
        {
          question: "True or False: In APA style, you should use 'and' instead of '&' in parenthetical citations.",
          type: "true-false",
          answer: "False",
          explanation: "APA requires '&' in parenthetical citations and 'and' in narrative text."
        },
        {
          question: "Correct this floating citation: 'AI is important (Smith, 2023).' Make it information-prominent.",
          type: "short-answer",
          answer: "Artificial intelligence enhances learning outcomes (Smith, 2023).",
          explanation: "Connects the citation to specific information rather than a vague statement."
        },
        {
          question: "How should you cite a source with three authors in APA?",
          type: "multiple-choice",
          options: ["(Author1, Author2, Author3, 2023)", "(Author1 & Author2 & Author3, 2023)", "(Author1 et al., 2023)", "(Author1, Author2, and Author3, 2023)"],
          answer: "(Author1 et al., 2023)",
          explanation: "For three or more authors, use 'et al.' after the first author's name."
        },
        {
          question: "Rewrite this sentence using a signal phrase citation: 'Peer assessment improves writing skills (Johnson & Lee, 2024).'",
          type: "short-answer",
          answer: "Johnson and Lee (2024) state that peer assessment improves writing skills.",
          explanation: "Integrates the citation using a signal phrase for smoother reading."
        },
        {
          question: "What is a floating citation, and why should you avoid it?",
          type: "short-answer",
          answer: "A floating citation is not connected to specific information, like 'This is important (Smith, 2023).' Avoid because it doesn't show which idea comes from the source.",
          explanation: "Floating citations make it unclear what information the citation supports."
        },
        {
          question: "True or False: You only need to cite direct quotes, not paraphrased ideas.",
          type: "true-false",
          answer: "False",
          explanation: "All ideas taken from sources, whether quoted or paraphrased, must be cited to avoid plagiarism."
        },
        {
          question: "Identify the error in this citation: 'Research shows that technology helps learning (Smith and Jones 2023).'",
          type: "multiple-choice",
          options: ["Missing comma", "Wrong conjunction", "Missing parentheses", "Wrong year format"],
          answer: "Wrong conjunction",
          explanation: "Should use '&' not 'and' in parenthetical citations."
        },
        {
          question: "For AWQ preparation, when should you use information-prominent citations versus signal phrases?",
          type: "short-answer",
          answer: "Use information-prominent when the source is less important than the information; use signal phrases when introducing author expertise or contrasting views.",
          explanation: "Citation style choice depends on writing emphasis and flow."
        }
      ]
    }
  ]
};

export const week5Meta: WeekMeta = {
  dateRange: "10-14 Feb 2026",
  assignmentTagline: "Academic Writing Quiz next week",
  assignmentIds: [],
};
