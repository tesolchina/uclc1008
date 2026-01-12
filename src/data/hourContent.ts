// Hour content data for Weeks 1-5
export interface HourTask {
  id: string;
  type: 'mc' | 'true-false' | 'fill-blank' | 'short-answer' | 'sentence' | 'paragraph';
  question: string;
  context?: string;
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  wordLimit?: number;
  hints?: string[];
  skillFocus?: string[];
}

export interface HourAgenda {
  title: string;
  duration: string;
  activities: string[];
}

export interface HourData {
  weekNumber: number;
  hourNumber: number;
  title: string;
  theme: string;
  learningGoals: string[];
  ciloLinks: string[];
  agenda: HourAgenda[];
  tasks: HourTask[];
  writingTask?: {
    prompt: string;
    wordLimit: number;
    modelAnswer?: string;
    rubricCriteria?: string[];
  };
}

// Week 1 Hours
export const week1Hours: HourData[] = [
  {
    weekNumber: 1,
    hourNumber: 1,
    title: "Features of Academic Research Papers",
    theme: "Understanding What Makes Papers 'Academic'",
    learningGoals: [
      "Identify characteristics that make research papers 'academic'",
      "Understand the role of peer review as academic gatekeeping",
      "Recognize the importance of citations in academic discourse"
    ],
    ciloLinks: ["CILO 1: Examine Academic Discourse"],
    agenda: [
      { title: "Introduction: Academic vs. Non-Academic", duration: "10 min", activities: ["Compare academic and popular sources", "Identify key differences"] },
      { title: "Expert Authorship & Peer Review", duration: "15 min", activities: ["Discuss who writes academic papers", "Understand peer review process"] },
      { title: "Citation Conventions", duration: "10 min", activities: ["Why citations matter", "Building on existing knowledge"] },
      { title: "Writing Task", duration: "10 min", activities: ["Write 2 sentences describing an academic feature"] }
    ],
    tasks: [
      {
        id: "w1h1-mc1",
        type: "mc",
        question: "Which of the following is a characteristic of academic research papers?",
        options: [
          "Written by journalists for general audiences",
          "Published in peer-reviewed journals after expert evaluation",
          "Uses informal language and personal opinions",
          "Does not require citations or references"
        ],
        correctAnswer: 1,
        explanation: "Academic papers are published in peer-reviewed journals, meaning they undergo evaluation by experts before publication.",
        skillFocus: ["academic-discourse"]
      },
      {
        id: "w1h1-tf1",
        type: "true-false",
        question: "Peer review means that only the journal editor reads the paper before publication.",
        correctAnswer: "false",
        explanation: "Peer review involves multiple experts in the field reviewing the paper, not just the editor.",
        skillFocus: ["academic-discourse"]
      },
      {
        id: "w1h1-fb1",
        type: "fill-blank",
        question: "Academic papers use _______ to acknowledge sources and build on existing knowledge.",
        correctAnswer: "citations",
        explanation: "Citations are essential in academic writing to give credit and show how work relates to existing research.",
        skillFocus: ["citation"]
      },
      {
        id: "w1h1-sa1",
        type: "short-answer",
        question: "Why is peer review important for academic credibility?",
        hints: ["Think about quality control", "Consider expertise"],
        wordLimit: 50,
        skillFocus: ["critical-thinking"]
      }
    ],
    writingTask: {
      prompt: "Using the excerpt from Hong et al. (2022), write 2 sentences explaining how this paper demonstrates expert authorship.",
      wordLimit: 50,
      modelAnswer: "Hong et al. (2022) demonstrates expert authorship as the researchers are affiliated with academic institutions and conducted systematic data collection. Their findings are published in a peer-reviewed journal, indicating the work has been evaluated by other experts in the field.",
      rubricCriteria: ["Identifies expert affiliation", "Mentions peer review", "Uses citation correctly"]
    }
  },
  {
    weekNumber: 1,
    hourNumber: 2,
    title: "Anatomy of Academic Articles",
    theme: "Empirical vs. Conceptual Articles",
    learningGoals: [
      "Distinguish between empirical and conceptual journal articles",
      "Analyze article titles for subject, context, and stance",
      "Decode abstract structure"
    ],
    ciloLinks: ["CILO 1: Examine Academic Discourse", "CILO 2: Evaluate Arguments"],
    agenda: [
      { title: "Empirical vs. Conceptual", duration: "12 min", activities: ["Compare IMRaD structure vs. argument structure", "Identify clues in abstracts"] },
      { title: "Title Analysis Strategy", duration: "10 min", activities: ["Subject + Context + Stance formula", "Practice with sample titles"] },
      { title: "Abstract Decoding", duration: "10 min", activities: ["Label abstract sections", "Identify purpose statements"] },
      { title: "Writing Task", duration: "10 min", activities: ["Paraphrase a key finding with citation"] }
    ],
    tasks: [
      {
        id: "w1h2-mc1",
        type: "mc",
        question: "The article 'Supporting schools to use facial recognition technology' is most likely:",
        options: [
          "A conceptual article arguing against FRT",
          "An empirical article with a positive stance toward FRT",
          "A literature review with no stance",
          "An editorial opinion piece"
        ],
        correctAnswer: 1,
        explanation: "The word 'Supporting' indicates a positive stance, and the research context suggests it's empirical.",
        skillFocus: ["stance-prediction"]
      },
      {
        id: "w1h2-tf1",
        type: "true-false",
        question: "Empirical articles always follow the IMRaD structure (Introduction, Methods, Results, Discussion).",
        correctAnswer: "true",
        explanation: "IMRaD is the standard structure for empirical research articles.",
        skillFocus: ["article-structure"]
      },
      {
        id: "w1h2-fb1",
        type: "fill-blank",
        question: "A title that contains words like 'concerns' or 'critical questions' suggests a _______ stance.",
        correctAnswer: "negative",
        explanation: "Words like 'concerns' and 'critical' signal the author's skeptical or negative position.",
        skillFocus: ["stance-prediction"]
      },
      {
        id: "w1h2-sentence1",
        type: "sentence",
        question: "Write a sentence that paraphrases this finding: 'The results suggest that parents support the use of FRT because they value its practical benefits.'",
        wordLimit: 30,
        hints: ["Change the structure", "Use synonyms", "Keep the meaning"],
        skillFocus: ["paraphrasing"]
      }
    ],
    writingTask: {
      prompt: "Paraphrase ONE key finding from the abstract of Hong et al. (2022) in your own words, including a proper citation.",
      wordLimit: 40,
      modelAnswer: "According to Hong et al. (2022), parents showed acceptance of facial recognition technology in schools primarily due to its perceived practical advantages.",
      rubricCriteria: ["Accurate paraphrase", "Proper citation format", "Own words (not patchwriting)"]
    }
  },
  {
    weekNumber: 1,
    hourNumber: 3,
    title: "Reading with Purpose",
    theme: "Efficient Navigation Strategies",
    learningGoals: [
      "Use section headings as navigation roadmaps",
      "Identify topic sentences in paragraphs",
      "Distinguish claims from supporting evidence"
    ],
    ciloLinks: ["CILO 2: Evaluate Arguments"],
    agenda: [
      { title: "Section Headings as Roadmaps", duration: "10 min", activities: ["Analyze heading structure", "Predict content from headings"] },
      { title: "Topic Sentences", duration: "12 min", activities: ["Topic + Controlling Idea formula", "Locate topic sentences in paragraphs"] },
      { title: "Claims vs. Evidence", duration: "10 min", activities: ["What to keep for summaries", "What to skip (data, examples)"] },
      { title: "Writing Task", duration: "10 min", activities: ["Write a topic sentence summarizing an author's claim"] }
    ],
    tasks: [
      {
        id: "w1h3-mc1",
        type: "mc",
        question: "A topic sentence typically appears:",
        options: [
          "At the end of a paragraph",
          "In the middle of a paragraph",
          "At the beginning of a paragraph",
          "Only in the conclusion"
        ],
        correctAnswer: 2,
        explanation: "Topic sentences usually appear at the beginning of a paragraph and state the main idea.",
        skillFocus: ["topic-sentences"]
      },
      {
        id: "w1h3-tf1",
        type: "true-false",
        question: "When summarizing, you should include specific statistics and data from the original text.",
        correctAnswer: "false",
        explanation: "Summaries focus on claims and main ideas, not specific data or evidence.",
        skillFocus: ["summarising"]
      },
      {
        id: "w1h3-fb1",
        type: "fill-blank",
        question: "A topic sentence contains a _______ and a controlling idea.",
        correctAnswer: "topic",
        explanation: "The formula is Topic + Controlling Idea, which together state what the paragraph is about.",
        skillFocus: ["topic-sentences"]
      },
      {
        id: "w1h3-paragraph1",
        type: "paragraph",
        question: "Write a short paragraph (3-4 sentences) explaining the difference between claims and evidence in academic writing. Give an example.",
        wordLimit: 80,
        hints: ["Define claim", "Define evidence", "Explain which to include in summaries"],
        skillFocus: ["summarising", "critical-thinking"]
      }
    ],
    writingTask: {
      prompt: "Write a topic sentence that captures Andrejevic and Selwyn's main argument about consent in FRT.",
      wordLimit: 30,
      modelAnswer: "Andrejevic and Selwyn (2020) argue that facial recognition technology in schools undermines students' ability to consent to data collection.",
      rubricCriteria: ["Clear topic", "Controlling idea present", "Accurate representation of source"]
    }
  }
];

// Week 2 Hours
export const week2Hours: HourData[] = [
  {
    weekNumber: 2,
    hourNumber: 1,
    title: "APA Citation Bootcamp",
    theme: "Mastering In-Text Citations",
    learningGoals: [
      "Apply APA 7th edition in-text citation rules",
      "Distinguish Author-prominent, Signal-phrase, and Information-prominent styles",
      "Use 'et al.' correctly"
    ],
    ciloLinks: ["CILO 2: Citation Conventions"],
    agenda: [
      { title: "Three Citation Styles", duration: "12 min", activities: ["Author-prominent vs. Info-prominent vs. Signal-phrase", "When to use each"] },
      { title: "'&' vs 'and' Rules", duration: "8 min", activities: ["Parenthetical vs. narrative citations", "Practice exercises"] },
      { title: "Et al. Usage", duration: "8 min", activities: ["When to use et al.", "First citation vs. subsequent"] },
      { title: "Writing Task", duration: "12 min", activities: ["Rewrite same idea using all 3 citation styles"] }
    ],
    tasks: [
      {
        id: "w2h1-mc1",
        type: "mc",
        question: "Which citation is correctly formatted in APA 7th edition?",
        options: [
          "Hong et al (2022) found that...",
          "Hong et al., (2022) found that...",
          "Hong et al. (2022) found that...",
          "(Hong, et al., 2022)"
        ],
        correctAnswer: 2,
        explanation: "In APA 7th, 'et al.' has a period after 'al' but no comma before the year in narrative citations.",
        skillFocus: ["apa-citation"]
      },
      {
        id: "w2h1-tf1",
        type: "true-false",
        question: "In APA format, you use '&' between author names inside parentheses and 'and' in the sentence.",
        correctAnswer: "true",
        explanation: "Use '&' in parenthetical citations: (Hong & Smith, 2022) but 'and' in narrative: Hong and Smith (2022).",
        skillFocus: ["apa-citation"]
      },
      {
        id: "w2h1-fb1",
        type: "fill-blank",
        question: "For works with three or more authors, use the first author's name followed by _______.",
        correctAnswer: "et al.",
        explanation: "APA 7th uses 'et al.' from the first citation for works with 3+ authors.",
        skillFocus: ["apa-citation"]
      },
      {
        id: "w2h1-sentence1",
        type: "sentence",
        question: "Convert this information-prominent citation to author-prominent: 'Parents support FRT for its practical benefits (Hong et al., 2022).'",
        wordLimit: 25,
        hints: ["Start with the authors", "Move the year to parentheses"],
        skillFocus: ["apa-citation"]
      }
    ],
    writingTask: {
      prompt: "Express this idea using all 3 citation styles: 'FRT is adopted in schools for security reasons.' Source: Hong et al. (2022)",
      wordLimit: 75,
      modelAnswer: "Author-prominent: Hong et al. (2022) found that FRT is adopted in schools for security reasons. Information-prominent: FRT is adopted in schools for security reasons (Hong et al., 2022). Signal-phrase: According to Hong et al. (2022), FRT is adopted in schools for security reasons.",
      rubricCriteria: ["All 3 styles used", "Correct APA format", "Consistent meaning"]
    }
  },
  {
    weekNumber: 2,
    hourNumber: 2,
    title: "Paraphrasing Strategies",
    theme: "Expressing Ideas in Your Own Words",
    learningGoals: [
      "Apply 5 paraphrasing strategies",
      "Avoid patchwriting and plagiarism",
      "Maintain original meaning while changing words"
    ],
    ciloLinks: ["CILO 2: Paraphrasing Skills", "CILO 3: Drafting Skills"],
    agenda: [
      { title: "5 Paraphrasing Strategies", duration: "15 min", activities: ["Synonyms", "Word forms", "Voice", "Sentence structure", "Combining/splitting"] },
      { title: "Patchwriting Warning", duration: "8 min", activities: ["Identify patchwriting", "How to avoid it"] },
      { title: "Practice Paraphrasing", duration: "10 min", activities: ["Apply strategies to sample sentences"] },
      { title: "Writing Task", duration: "10 min", activities: ["Paraphrase a passage using 2+ strategies"] }
    ],
    tasks: [
      {
        id: "w2h2-mc1",
        type: "mc",
        question: "Which paraphrasing strategy changes 'The technology enables...' to 'The technology's enablement of...'?",
        options: [
          "Using synonyms",
          "Changing word forms",
          "Changing voice",
          "Splitting sentences"
        ],
        correctAnswer: 1,
        explanation: "Changing 'enables' (verb) to 'enablement' (noun) is changing word forms.",
        skillFocus: ["paraphrasing"]
      },
      {
        id: "w2h2-tf1",
        type: "true-false",
        question: "Patchwriting is acceptable as long as you include a citation.",
        correctAnswer: "false",
        explanation: "Patchwriting (making minor changes to original text) is a form of plagiarism even with citations.",
        skillFocus: ["paraphrasing", "academic-integrity"]
      },
      {
        id: "w2h2-fb1",
        type: "fill-blank",
        question: "Changing 'The teacher observed the students' to 'The students were observed by the teacher' uses the strategy of changing _______.",
        correctAnswer: "voice",
        explanation: "This changes from active voice to passive voice.",
        skillFocus: ["paraphrasing"]
      },
      {
        id: "w2h2-paragraph1",
        type: "paragraph",
        question: "Paraphrase this passage using at least 2 strategies: 'There is no option for students to self-curate and restrict what data they share because the school has already made this decision on their behalf.'",
        wordLimit: 60,
        hints: ["Try synonyms for 'self-curate' and 'restrict'", "Consider restructuring the sentence"],
        skillFocus: ["paraphrasing"]
      }
    ],
    writingTask: {
      prompt: "Paraphrase this sentence using AT LEAST 2 strategies. Identify which strategies you used: 'Students cannot choose what personal data to share because schools make these decisions for them.'",
      wordLimit: 50,
      modelAnswer: "Schools determine which personal information is collected, leaving students without the ability to control their own data sharing (synonym + restructure). Strategy 1: Synonyms (choose→determine, personal data→personal information). Strategy 2: Restructuring the sentence order.",
      rubricCriteria: ["2+ strategies used", "Meaning preserved", "Strategies identified"]
    }
  },
  {
    weekNumber: 2,
    hourNumber: 3,
    title: "Integrated Writing",
    theme: "Combining Paraphrase with Citation",
    learningGoals: [
      "Use appropriate reporting verbs for different stances",
      "Apply the 'citation sandwich' technique",
      "Integrate sources smoothly into your writing"
    ],
    ciloLinks: ["CILO 2: Source Integration", "CILO 3: Academic Writing"],
    agenda: [
      { title: "Reporting Verbs", duration: "10 min", activities: ["Positive: supports, demonstrates", "Neutral: states, notes", "Critical: argues, challenges"] },
      { title: "The Citation Sandwich", duration: "10 min", activities: ["Introduce → Quote/Paraphrase → Comment", "Practice examples"] },
      { title: "Stance Matching", duration: "8 min", activities: ["Match verbs to author stance"] },
      { title: "Writing Task", duration: "12 min", activities: ["Write 3 sentences using different reporting verbs"] }
    ],
    tasks: [
      {
        id: "w2h3-mc1",
        type: "mc",
        question: "Which reporting verb suggests the author has a critical stance?",
        options: [
          "states",
          "describes",
          "challenges",
          "notes"
        ],
        correctAnswer: 2,
        explanation: "'Challenges' implies disagreement or criticism, while others are more neutral.",
        skillFocus: ["reporting-verbs"]
      },
      {
        id: "w2h3-tf1",
        type: "true-false",
        question: "'Argues' is a neutral reporting verb that can be used for any source.",
        correctAnswer: "false",
        explanation: "'Argues' typically implies the author is making a debatable claim or taking a position.",
        skillFocus: ["reporting-verbs"]
      },
      {
        id: "w2h3-fb1",
        type: "fill-blank",
        question: "The 'citation sandwich' has three parts: introduce the source, provide the _______, and add your comment.",
        correctAnswer: "quote or paraphrase",
        explanation: "The middle layer is the actual content from the source (quoted or paraphrased).",
        skillFocus: ["source-integration"]
      },
      {
        id: "w2h3-sentence1",
        type: "sentence",
        question: "Rewrite using a different reporting verb: 'Hong et al. (2022) say that parents accept FRT.'",
        wordLimit: 20,
        hints: ["Try 'found', 'report', 'demonstrate', or 'highlight'"],
        skillFocus: ["reporting-verbs"]
      }
    ],
    writingTask: {
      prompt: "Write 3 sentences about Hong et al. (2022) using THREE different reporting verbs (one positive, one neutral, one that shows the author's claim).",
      wordLimit: 75,
      modelAnswer: "Hong et al. (2022) demonstrate that parents generally accept FRT in schools. The study notes that security concerns drive parental support. Hong et al. (2022) argue that practical benefits outweigh privacy concerns for most parents.",
      rubricCriteria: ["3 different reporting verbs", "Appropriate verb choices", "Correct citation format"]
    }
  }
];

// Week 3 Hours
export const week3Hours: HourData[] = [
  {
    weekNumber: 3,
    hourNumber: 1,
    title: "The Art of Summarising",
    theme: "Distilling Information Concisely",
    learningGoals: [
      "Summarize claims while omitting detailed evidence",
      "Maintain neutrality in summaries",
      "Apply the 'delete and condense' method"
    ],
    ciloLinks: ["CILO 2: Summarising Skills"],
    agenda: [
      { title: "What to Keep vs. Cut", duration: "12 min", activities: ["Keep claims and main arguments", "Cut specific data, examples, methodology details"] },
      { title: "Neutrality Principle", duration: "8 min", activities: ["No personal opinions", "Accurate representation"] },
      { title: "Practice Summarising", duration: "12 min", activities: ["Summarise a paragraph to key points"] },
      { title: "Writing Task", duration: "10 min", activities: ["Summarise Article A in 50 words"] }
    ],
    tasks: [
      {
        id: "w3h1-mc1",
        type: "mc",
        question: "When summarising academic text, you should:",
        options: [
          "Include all statistics and data",
          "Add your personal opinion on the topic",
          "Focus on main claims and omit detailed evidence",
          "Copy key sentences directly from the source"
        ],
        correctAnswer: 2,
        explanation: "Summaries focus on main ideas and claims, not specific data or evidence.",
        skillFocus: ["summarising"]
      },
      {
        id: "w3h1-tf1",
        type: "true-false",
        question: "A good summary includes your evaluation of whether the author is correct.",
        correctAnswer: "false",
        explanation: "Summaries should be neutral and not include personal evaluation.",
        skillFocus: ["summarising"]
      },
      {
        id: "w3h1-fb1",
        type: "fill-blank",
        question: "In summarising, you keep the _______ but omit the evidence and examples.",
        correctAnswer: "claims",
        explanation: "Summaries capture main claims/arguments, not supporting details.",
        skillFocus: ["summarising"]
      },
      {
        id: "w3h1-paragraph1",
        type: "paragraph",
        question: "Summarise this in 40 words: 'Hong et al. (2022) surveyed 500 parents across 10 schools using questionnaires distributed via email. The response rate was 67%. Results showed that 78% of parents supported FRT, citing safety (3.865 mean score) and convenience (3.742 mean score) as key factors.'",
        wordLimit: 50,
        hints: ["Focus on what was found, not how", "Skip the numbers", "Keep the main finding"],
        skillFocus: ["summarising"]
      }
    ],
    writingTask: {
      prompt: "Summarise Article A's (Hong et al., 2022) main argument in exactly 50 words. Focus on claims, not data.",
      wordLimit: 50,
      modelAnswer: "Hong et al. (2022) found that despite privacy concerns, parents generally support facial recognition technology in schools. Their acceptance stems from perceived practical benefits including enhanced safety and convenience. The study suggests schools should address privacy concerns while emphasizing these practical advantages to gain parental support.",
      rubricCriteria: ["Main claim captured", "No specific data included", "Neutral tone", "Close to 50 words"]
    }
  },
  {
    weekNumber: 3,
    hourNumber: 2,
    title: "Synthesis Skills",
    theme: "Connecting Ideas from Multiple Sources",
    learningGoals: [
      "Distinguish synthesis from listing",
      "Find connections between sources (agreement, contrast, elaboration)",
      "Use synthesis connectives effectively"
    ],
    ciloLinks: ["CILO 2: Synthesising Skills", "CILO 3: Argument Construction"],
    agenda: [
      { title: "Listing vs. Synthesis", duration: "10 min", activities: ["Bad: 'A says X. B says Y.'", "Good: 'While A argues X, B challenges this by...'"] },
      { title: "Finding Connections", duration: "12 min", activities: ["Agreement, contrast, elaboration", "Create a synthesis grid"] },
      { title: "Synthesis Connectives", duration: "8 min", activities: ["however, conversely, similarly, in contrast"] },
      { title: "Writing Task", duration: "12 min", activities: ["Write a synthesised topic sentence"] }
    ],
    tasks: [
      {
        id: "w3h2-mc1",
        type: "mc",
        question: "Which example shows synthesis rather than listing?",
        options: [
          "Article A supports FRT. Article B is against FRT.",
          "While Hong et al. (2022) found parental support for FRT, Andrejevic and Selwyn (2020) challenge this optimism by highlighting consent issues.",
          "Hong et al. studied parents. Andrejevic and Selwyn studied ethics.",
          "The first article is positive. The second article is negative."
        ],
        correctAnswer: 1,
        explanation: "Option B connects the sources by showing the relationship (challenge) between their positions.",
        skillFocus: ["synthesising"]
      },
      {
        id: "w3h2-tf1",
        type: "true-false",
        question: "Synthesis means summarising each source in separate paragraphs.",
        correctAnswer: "false",
        explanation: "Synthesis means integrating sources to show relationships, not separating them.",
        skillFocus: ["synthesising"]
      },
      {
        id: "w3h2-fb1",
        type: "fill-blank",
        question: "The connective '_______ ' is used to show contrast between two sources.",
        correctAnswer: "however",
        explanation: "Words like 'however', 'conversely', and 'in contrast' signal opposing views.",
        skillFocus: ["synthesising"]
      },
      {
        id: "w3h2-sentence1",
        type: "sentence",
        question: "Combine these into one synthesised sentence: 'Hong et al. (2022) support FRT.' + 'Andrejevic & Selwyn (2020) raise consent concerns.'",
        wordLimit: 35,
        hints: ["Use a contrast connective", "Show the relationship"],
        skillFocus: ["synthesising"]
      }
    ],
    writingTask: {
      prompt: "Write a synthesised topic sentence (25-30 words) that connects Hong et al. (2022) and Andrejevic & Selwyn (2020) showing their contrasting views on FRT in schools.",
      wordLimit: 35,
      modelAnswer: "While Hong et al. (2022) demonstrate parental acceptance of FRT for its practical benefits, Andrejevic and Selwyn (2020) challenge this perspective by foregrounding fundamental concerns about student consent.",
      rubricCriteria: ["Both sources cited", "Contrast shown", "Relationship clear", "Single sentence"]
    }
  },
  {
    weekNumber: 3,
    hourNumber: 3,
    title: "AWQ Structure Prep",
    theme: "Mastering the 3-Paragraph Format",
    learningGoals: [
      "Structure a 300-word summary with Introduction, Body, Conclusion",
      "Write an effective thesis statement",
      "Build body paragraphs with synthesis"
    ],
    ciloLinks: ["CILO 2: Summary Structure", "CILO 3: Drafting Skills"],
    agenda: [
      { title: "AWQ 3-Paragraph Model", duration: "10 min", activities: ["Introduction: Background + Thesis", "Body: Synthesised summary", "Conclusion: Implications"] },
      { title: "Thesis Statement Formula", duration: "10 min", activities: ["Context + Preview of sources", "Example thesis statements"] },
      { title: "Body Paragraph Structure", duration: "10 min", activities: ["Topic sentence + Synthesis + Supporting points"] },
      { title: "Writing Task", duration: "12 min", activities: ["Draft an AWQ introduction"] }
    ],
    tasks: [
      {
        id: "w3h3-mc1",
        type: "mc",
        question: "An AWQ introduction should include:",
        options: [
          "A detailed summary of both articles",
          "Background context and a thesis statement previewing the summary",
          "Your personal opinion on the topic",
          "Direct quotes from both sources"
        ],
        correctAnswer: 1,
        explanation: "The introduction provides context and previews what the summary will cover.",
        skillFocus: ["awq-structure"]
      },
      {
        id: "w3h3-tf1",
        type: "true-false",
        question: "The body paragraph of an AWQ should synthesise the sources rather than summarise them separately.",
        correctAnswer: "true",
        explanation: "Synthesis (showing relationships) is a key AWQ skill that distinguishes high-scoring responses.",
        skillFocus: ["awq-structure", "synthesising"]
      },
      {
        id: "w3h3-fb1",
        type: "fill-blank",
        question: "A thesis statement provides _______ and previews the content of the summary.",
        correctAnswer: "context",
        explanation: "The thesis sets up the topic and indicates what aspects will be covered.",
        skillFocus: ["awq-structure"]
      },
      {
        id: "w3h3-paragraph1",
        type: "paragraph",
        question: "Write an AWQ introduction paragraph (60-80 words) about FRT in schools, including background and a thesis that previews both sources.",
        wordLimit: 80,
        hints: ["Start with general context about FRT", "Mention both perspectives", "Preview what the summary will cover"],
        skillFocus: ["awq-structure", "thesis-writing"]
      }
    ],
    writingTask: {
      prompt: "Draft an AWQ introduction paragraph (60-80 words) including: 1) Background on FRT in schools, 2) A thesis statement that previews the contrasting perspectives of Hong et al. (2022) and Andrejevic & Selwyn (2020).",
      wordLimit: 80,
      modelAnswer: "Facial recognition technology (FRT) is increasingly being adopted in educational settings for security purposes. This summary examines two contrasting perspectives on FRT in schools. While Hong et al. (2022) explore parental acceptance of this technology, Andrejevic and Selwyn (2020) raise critical concerns about student privacy and consent. Together, these articles highlight the tension between security benefits and ethical considerations.",
      rubricCriteria: ["Background provided", "Both sources mentioned", "Thesis previews content", "60-80 words"]
    }
  }
];

// Week 4 Hours
export const week4Hours: HourData[] = [
  {
    weekNumber: 4,
    hourNumber: 1,
    title: "Speed Drills",
    theme: "Building Fluency Under Pressure",
    learningGoals: [
      "Complete citation and paraphrasing tasks quickly",
      "Identify stance and structure rapidly",
      "Build confidence for timed writing"
    ],
    ciloLinks: ["CILO 2: All Skills"],
    agenda: [
      { title: "Rapid Citation Quiz", duration: "8 min", activities: ["10 citation format questions", "Timed challenge"] },
      { title: "Stance Speed Round", duration: "8 min", activities: ["Identify stance from titles quickly", "Build pattern recognition"] },
      { title: "Paraphrase Challenge", duration: "8 min", activities: ["Quick paraphrase exercises"] },
      { title: "Mini-Summary Task", duration: "16 min", activities: ["100-word summary in 10 minutes"] }
    ],
    tasks: [
      {
        id: "w4h1-mc1",
        type: "mc",
        question: "Quick! Which is correct APA format?",
        options: ["(Hong, et al., 2022)", "(Hong et al., 2022)", "Hong et al (2022)", "(Hong et al 2022)"],
        correctAnswer: 1,
        explanation: "Correct APA: no comma before et al., period after 'al', comma before year.",
        skillFocus: ["apa-citation"]
      },
      {
        id: "w4h1-tf1",
        type: "true-false",
        question: "'Critical questions about...' in a title suggests positive stance.",
        correctAnswer: "false",
        explanation: "'Critical questions' signals skepticism or negative stance.",
        skillFocus: ["stance-prediction"]
      },
      {
        id: "w4h1-fb1",
        type: "fill-blank",
        question: "Quick! In narrative citations, use 'and' but in parenthetical citations use '_______'.",
        correctAnswer: "&",
        explanation: "& in parentheses, 'and' in the sentence text.",
        skillFocus: ["apa-citation"]
      },
      {
        id: "w4h1-paragraph1",
        type: "paragraph",
        question: "TIMED (10 min): Write a 100-word summary of Hong et al.'s (2022) findings on parental acceptance of FRT.",
        wordLimit: 100,
        hints: ["Focus on main claims only", "Don't include statistics", "Use proper citation"],
        skillFocus: ["summarising", "time-management"]
      }
    ],
    writingTask: {
      prompt: "SPEED TASK: Write a 100-word summary of Article A in exactly 10 minutes. Focus on claims only.",
      wordLimit: 100,
      rubricCriteria: ["Main claims captured", "No excessive detail", "Proper citation", "Completed in time"]
    }
  },
  {
    weekNumber: 4,
    hourNumber: 2,
    title: "Timed Practice",
    theme: "AWQ Simulation",
    learningGoals: [
      "Complete a mini-AWQ under time pressure",
      "Apply time management strategies",
      "Experience exam conditions"
    ],
    ciloLinks: ["CILO 2: All Skills", "CILO 3: Drafting"],
    agenda: [
      { title: "Time Management Strategy", duration: "5 min", activities: ["10-20-20-10 breakdown for AWQ", "Planning before writing"] },
      { title: "Mini-AWQ Simulation", duration: "25 min", activities: ["200-word response", "Both sources", "Exam conditions"] },
      { title: "Self-Assessment", duration: "10 min", activities: ["Score using AWQ rubric", "Identify strengths and gaps"] }
    ],
    tasks: [
      {
        id: "w4h2-paragraph1",
        type: "paragraph",
        question: "MINI-AWQ (25 min): Write a 200-word synthesis of Hong et al. (2022) and Andrejevic & Selwyn (2020) on FRT in schools. Include introduction, body, and conclusion.",
        wordLimit: 200,
        hints: ["Spend 5 min planning", "15 min writing", "5 min reviewing"],
        skillFocus: ["awq-structure", "synthesising", "time-management"]
      }
    ],
    writingTask: {
      prompt: "Complete a 200-word mini-AWQ in 25 minutes. Include: Introduction (with thesis), Body (synthesised summary), Conclusion.",
      wordLimit: 200,
      rubricCriteria: ["All 3 sections present", "Sources synthesised", "Proper citations", "Academic tone", "Completed in time"]
    }
  },
  {
    weekNumber: 4,
    hourNumber: 3,
    title: "Self-Correction Lab",
    theme: "Learning from Mistakes",
    learningGoals: [
      "Use the AWQ rubric for self-assessment",
      "Identify patterns in your errors",
      "Revise and improve your work"
    ],
    ciloLinks: ["CILO 3: Revision Skills", "CILO 5: AI as Learning Partner"],
    agenda: [
      { title: "Rubric Review", duration: "8 min", activities: ["Understand each criterion", "Scoring guidelines"] },
      { title: "Sample Analysis", duration: "12 min", activities: ["Compare Student A (80%) vs Student B (61%)", "Identify differences"] },
      { title: "Error Identification", duration: "8 min", activities: ["Common mistake checklist", "Pattern recognition"] },
      { title: "Revision Task", duration: "12 min", activities: ["Revise your mini-AWQ from Hour 4.2"] }
    ],
    tasks: [
      {
        id: "w4h3-mc1",
        type: "mc",
        question: "What distinguishes Student A's response (80%) from Student B's (61%)?",
        options: [
          "Student A used more direct quotes",
          "Student A synthesised sources while Student B listed them separately",
          "Student A wrote more words",
          "Student A included more statistics"
        ],
        correctAnswer: 1,
        explanation: "Synthesis is the key differentiator - connecting sources rather than treating them separately.",
        skillFocus: ["synthesising", "self-assessment"]
      },
      {
        id: "w4h3-tf1",
        type: "true-false",
        question: "Including specific data like '3.865 mean score' improves your AWQ score.",
        correctAnswer: "false",
        explanation: "AWQ summaries should focus on claims, not detailed data.",
        skillFocus: ["summarising"]
      },
      {
        id: "w4h3-paragraph1",
        type: "paragraph",
        question: "Revise ONE paragraph from your mini-AWQ to improve synthesis. Explain what changes you made and why.",
        wordLimit: 100,
        hints: ["Look for listing", "Add connectives", "Show relationships between sources"],
        skillFocus: ["revision", "synthesising"]
      }
    ],
    writingTask: {
      prompt: "Revise your mini-AWQ body paragraph. Focus on improving synthesis. Write the revised version and a brief explanation (30 words) of your changes.",
      wordLimit: 150,
      rubricCriteria: ["Clear improvement visible", "Better synthesis", "Changes explained"]
    }
  }
];

// Week 5 Hours
export const week5Hours: HourData[] = [
  {
    weekNumber: 5,
    hourNumber: 1,
    title: "Full Mock AWQ",
    theme: "Complete Exam Simulation",
    learningGoals: [
      "Complete a full 50-minute AWQ simulation",
      "Apply all learned skills under exam conditions",
      "Build exam confidence"
    ],
    ciloLinks: ["CILO 2: All Skills", "CILO 3: Drafting"],
    agenda: [
      { title: "Exam Conditions Setup", duration: "5 min", activities: ["No resources except articles", "Timer set for 50 minutes"] },
      { title: "Mock AWQ", duration: "50 min", activities: ["300-word response", "Complete 3-paragraph structure"] }
    ],
    tasks: [
      {
        id: "w5h1-paragraph1",
        type: "paragraph",
        question: "FULL MOCK AWQ (50 min): Write a 300-word summary synthesising Hong et al. (2022) and Andrejevic & Selwyn (2020). Follow the 3-paragraph structure: Introduction, Body, Conclusion.",
        wordLimit: 300,
        hints: ["10 min planning", "30 min writing", "10 min reviewing"],
        skillFocus: ["awq-structure", "summarising", "synthesising", "paraphrasing", "citation"]
      }
    ],
    writingTask: {
      prompt: "Complete a full 300-word AWQ in 50 minutes under exam conditions. No AI assistance during the task.",
      wordLimit: 300,
      rubricCriteria: ["Summary accuracy (20%)", "Synthesis (20%)", "Paraphrasing (20%)", "Academic tone (20%)", "Citations (20%)"]
    }
  },
  {
    weekNumber: 5,
    hourNumber: 2,
    title: "Feedback Session",
    theme: "Learning from Model Answers",
    learningGoals: [
      "Understand what makes a high-scoring response",
      "Identify common pitfalls",
      "Learn from peer and model answers"
    ],
    ciloLinks: ["CILO 3: Revision", "CILO 5: AI Learning Partner"],
    agenda: [
      { title: "Model Answer Analysis", duration: "15 min", activities: ["Study Student A response", "Identify effective techniques"] },
      { title: "Common Pitfalls", duration: "10 min", activities: ["Review frequent errors", "How to avoid them"] },
      { title: "Peer Comparison", duration: "10 min", activities: ["Compare your response to model"] },
      { title: "Revision Task", duration: "10 min", activities: ["Rewrite one paragraph to match model quality"] }
    ],
    tasks: [
      {
        id: "w5h2-mc1",
        type: "mc",
        question: "In the model answer, what makes the thesis statement effective?",
        options: [
          "It's very long and detailed",
          "It previews both sources and the relationship between them",
          "It includes direct quotes",
          "It gives the student's opinion"
        ],
        correctAnswer: 1,
        explanation: "Effective thesis statements preview the content and show how sources relate.",
        skillFocus: ["awq-structure"]
      },
      {
        id: "w5h2-paragraph1",
        type: "paragraph",
        question: "Rewrite your conclusion paragraph to match the quality of the model answer. Focus on implications and a strong closing.",
        wordLimit: 60,
        hints: ["Avoid introducing new information", "Sum up the key tension", "End with a forward-looking statement"],
        skillFocus: ["awq-structure", "conclusion-writing"]
      }
    ],
    writingTask: {
      prompt: "Compare your mock AWQ conclusion to the model answer. Rewrite yours to improve it, then explain (in 30 words) what you changed.",
      wordLimit: 90,
      rubricCriteria: ["Improved conclusion", "Matches model quality", "Changes explained"]
    }
  },
  {
    weekNumber: 5,
    hourNumber: 3,
    title: "Final Readiness",
    theme: "Last-Minute Preparation",
    learningGoals: [
      "Confirm readiness with checklist",
      "Master time management for the real exam",
      "Address final questions and concerns"
    ],
    ciloLinks: ["All CILOs"],
    agenda: [
      { title: "Time Management Strategy", duration: "8 min", activities: ["10-20-20-10 breakdown review", "Backup strategies"] },
      { title: "Top Errors to Avoid", duration: "8 min", activities: ["Personal error patterns", "Class common mistakes"] },
      { title: "Readiness Checklist", duration: "8 min", activities: ["Self-assessment completion", "Confidence check"] },
      { title: "Final Writing Task", duration: "10 min", activities: ["Write a perfect conclusion paragraph"] },
      { title: "Q&A", duration: "8 min", activities: ["Address remaining questions"] }
    ],
    tasks: [
      {
        id: "w5h3-tf1",
        type: "true-false",
        question: "I can cite in APA format without hesitation.",
        correctAnswer: "true",
        explanation: "Self-assessment: You should be confident with APA citations before the exam.",
        skillFocus: ["self-assessment"]
      },
      {
        id: "w5h3-tf2",
        type: "true-false",
        question: "I understand the difference between listing and synthesising.",
        correctAnswer: "true",
        explanation: "Synthesis is crucial for high AWQ scores.",
        skillFocus: ["self-assessment"]
      },
      {
        id: "w5h3-paragraph1",
        type: "paragraph",
        question: "Write a PERFECT conclusion paragraph (50-60 words) for an AWQ on FRT in schools. This is your final practice.",
        wordLimit: 60,
        hints: ["Summarise the key tension", "No new information", "Forward-looking closing"],
        skillFocus: ["conclusion-writing", "awq-structure"]
      }
    ],
    writingTask: {
      prompt: "Final Task: Write an ideal conclusion paragraph (50-60 words) that you would be proud to submit in the real AWQ.",
      wordLimit: 60,
      modelAnswer: "In conclusion, the adoption of FRT in schools represents a complex balance between security benefits and ethical concerns. While practical advantages drive parental acceptance, ongoing attention to student privacy and consent remains essential for responsible implementation of this technology in educational settings.",
      rubricCriteria: ["Summarises key points", "No new information", "Forward-looking", "50-60 words"]
    }
  }
];

// Export all hours data
export const allHoursData = [
  ...week1Hours,
  ...week2Hours,
  ...week3Hours,
  ...week4Hours,
  ...week5Hours
];

// Helper function to get hour data
export function getHourData(weekNumber: number, hourNumber: number): HourData | undefined {
  return allHoursData.find(h => h.weekNumber === weekNumber && h.hourNumber === hourNumber);
}

// Helper function to get all hours for a week
export function getWeekHours(weekNumber: number): HourData[] {
  return allHoursData.filter(h => h.weekNumber === weekNumber);
}