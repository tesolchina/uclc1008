// Hour content data for Weeks 1-5 - Enhanced with substantive content

// ============ TYPE DEFINITIONS ============

export interface ExampleItem {
  original: string;
  analysis: string;
  source?: string;
}

export interface KeyConcept {
  term: string;
  definition: string;
  example?: string;
  tip?: string;
}

export interface ArticleExcerpt {
  title: string;
  authors: string;
  year: number;
  abstract?: string;
  excerpt: string;
  glossary?: Record<string, string>;
}

export interface DemoStep {
  title: string;
  content: string;
  highlight?: string;
}

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
  modelAnswer?: string;
  demoSteps?: DemoStep[];
  examples?: ExampleItem[];
}

export interface HourAgenda {
  title: string;
  duration: string;
  activities: string[];
}

export interface WritingTask {
  prompt: string;
  wordLimit: number;
  modelAnswer?: string;
  rubricCriteria?: string[];
  demoSteps?: DemoStep[];
  examples?: ExampleItem[];
}

export interface IframeEmbed {
  url: string;
  title: string;
  height?: number;
}

export interface ChatMessage {
  role: 'teacher' | 'student-john' | 'student-karen' | 'system';
  content: string;
  action?: string; // e.g., "_John leans forward eagerly_"
}

export interface IntegratedSubsection {
  title: string;
  content: string;
}

export interface IntegratedSection {
  id: string;
  title: string;
  subsections: IntegratedSubsection[];
  iframeEmbed?: IframeEmbed;
  chatHistory?: ChatMessage[];
  externalLink?: { url: string; label: string };
}

export interface HourData {
  weekNumber: number;
  hourNumber: number;
  title: string;
  theme: string;
  learningGoals: string[];
  ciloLinks: string[];
  keyConcepts: KeyConcept[];
  articles?: ArticleExcerpt[];
  agenda: HourAgenda[];
  tasks: HourTask[];
  writingTask?: WritingTask;
  behaviourChange?: string;
  integratedSections?: IntegratedSection[];
}

// ============ ARTICLE EXCERPTS (Reused across hours) ============

export const ARTICLE_A: ArticleExcerpt = {
  title: "Supporting schools to use face recognition systems: A continuance intention perspective of elementary school parents in China",
  authors: "Hong, Li, Kuo & An",
  year: 2022,
  abstract: "A great deal of attention has been focused on technological innovation, for example, face recognition, which has been used in some countries in various fields. Nonetheless, there has been little attention paid to parents' acceptance of the use of face recognition systems on campus. To address this gap in the literature, this study examined how different degrees of technological innovativeness and dangerous beliefs in the virtual world (DBVW) influence parents' perceived value of using and intention to continue supporting schools' use of face recognition systems. This study adopted snowball sampling to collect data through questionnaires, and received 380 valid responses from parents living in Xuzhou, China.",
  excerpt: `4 Method

The purpose of this study was to explore whether parents can accept the adoption of face recognition systems for the efficiency and convenience of identity verification when using the technology as a campus access control approach. The data were collected using "Questionnaire Star," a widely used online survey platform in mainland China.

4.1 Procedure
In order to collect a large number of samples, the online questionnaire survey method was used. Representative samples were selected according to the feasibility principle of snowball sampling. The questionnaire was distributed from January 7 to 17, 2020.

4.2 Participants
The participants were parents of elementary students from Xuzhou, China. A total of 394 valid data were collected. The proportion of male and female respondents accounted for 41.6% and 58.4% respectively.

4.3 Instrument
The questionnaire items were adapted from the relevant literature. The BDVW measurement was adapted from Aurigemma & Mattson (2017), the technological innovativeness measurement was adapted from Albertsen et al. (2020).

The questionnaire used a 5-point Likert scale, with options "strongly disagree," "disagree," "neutral," "agree," and "strongly agree."

6.4 Path analysis
Fig. 3 shows that the influence path coefficient of DBVW on perceived value is β = -0.320 (p<0.001), and that of technological innovativeness is β=0.447 (p<0.001). This means that the higher the DBVW is, the lower the perceived value is.

8.2 Limitations
This study did not examine the usage timing, such as the time after returning to physical classrooms, or evening self-study, which might influence the parents' use intention. Similarly, the study did not focus on the usage scope, such as school gates or dormitories.`,
  glossary: {
    "DBVW": "Dangerous Beliefs in the Virtual World - Anxiety about potential dangers while using technologies",
    "Perceived value": "Value that users believe a technology or service has for themselves",
    "Technological innovativeness": "The degree to which an individual is willing to try new technologies",
    "Snowball sampling": "A sampling method where existing participants recruit future participants",
    "5-point Likert scale": "A rating scale from strongly disagree (1) to strongly agree (5)",
    "Path coefficient (β)": "A measure showing the strength of relationship between variables",
    "p<0.001": "Statistical significance - the result is very unlikely to have occurred by chance"
  }
};

export const ARTICLE_B: ArticleExcerpt = {
  title: "Facial recognition technology in schools: critical questions and concerns",
  authors: "Andrejevic & Selwyn",
  year: 2020,
  abstract: "Facial recognition technology is now being introduced across various aspects of public life. This includes the burgeoning integration of facial recognition and facial detection into compulsory schooling to address issues such as campus security, automated registration and student emotion detection. So far, these technologies have largely been seen as routine additions to school systems with already extensive cultures of monitoring and surveillance. While critical commentators are beginning to question the pedagogical limitations of facially driven learning, this article contends that school-based facial recognition presents a number of other social challenges and concerns that merit specific attention. This includes the likelihood of facial recognition technology altering the nature of schools and schooling along divisive, authoritarian and oppressive lines. Against this background, the article considers whether or not a valid case can ever be made for allowing this form of technology in schools.",
  excerpt: `Introduction

The past few years have seen the implementation of automated facial recognition systems across a range of social realms. While these technologies are associated most frequently with promises to strengthen public safety, a growing number of other applications have also emerged – from verifying the identity of bank users, through to 'smart billboards' that display advertisements in response to the moods of passers-by. Of particular interest is how facial recognition technologies are beginning to be implemented in school settings.

In this sense, facial recognition could be seen as a logical extension of technology-based surveillance trends established in schools from the 1990s onwards. However, in this article, we seek to problematise the specific connotations and possible consequences of facial recognition technology in schools. Drawing on emerging debates amongst communications, media and surveillance scholars, the article addresses a number of specific social challenges and concerns – not least various ways in which this technology might alter the nature of schools and schooling along divisive, authoritarian and oppressive lines.

Challenging the take-up of facial recognition in schools

These questions over diminished notions of pedagogy and consent are important. Yet, at this point, we would like to argue that there are a number of additional issues and concerns that cast further serious doubt upon the implementation of facial recognition technologies in schools.

(i) The dehumanising nature of facially focused schooling
First is the argument that the statistical processes through which facial recognition technologies quantify and frame a student's face are inherently reductive. Facial recognition technologies work by assigning numerical values to schematic representations of facial features. This constitutes a very reductive engagement with students in contrast to how they would ordinarily be viewed by a human.

(ii) The foregrounding of students' gender and race
Another unsettling reduction is their role in foregrounding fixed attributions of students' race and gender in informing school decision-making.

Conclusion
Thus, it can be strongly argued that schools should not be places where local communities become desensitised to being automatically identified, profiled, and potentially discriminated against.`,
  glossary: {
    "Problematise": "To critically examine and question something",
    "Inescapability": "Impossible to avoid or escape from",
    "Self-curate": "To personally choose what to share or display",
    "Opt-out": "Choosing not to participate in something",
    "Surveillance": "Careful watching for security purposes",
    "Contends": "Argues or asserts strongly",
    "Reductive": "Oversimplified; reducing complex things to simple terms",
    "Foregrounding": "Making something the main focus or emphasis"
  }
};

// ============ WEEK 1 HOURS ============

export const week1Hours: HourData[] = [
  {
    weekNumber: 1,
    hourNumber: 1,
    title: "Skimming, Scanning & Outlining Academic Texts",
    theme: "Strategic Reading for Academic Articles",
    behaviourChange: "Before reading any paper in detail, always SKIM first: Title → Abstract → Headings → Topic Sentences. Then SCAN for specific information.",
    learningGoals: [
      "Apply skimming techniques to quickly get an overview of academic articles",
      "Use scanning to locate specific information (publisher, author affiliations, dates)",
      "Identify the macro-level structure (sections and their functions) of academic papers",
      "Create micro-level outlines identifying topic sentences, supporting details, and transitions",
      "Understand how outlining skills prepare you for writing summaries and syntheses"
    ],
    ciloLinks: ["CILO 1: Examine Academic Discourse"],
    keyConcepts: [
      {
        term: "Skimming",
        definition: "Reading quickly to get a general understanding of an article - an overview.",
        example: "To skim Article A, read: Title → Abstract → Section Headings → First sentence of each paragraph.",
        tip: "You can start with: Title, Abstract, Introduction & Conclusion, Topic sentences, Section headings, Boldfaced words, Graphics/tables."
      },
      {
        term: "Scanning",
        definition: "Moving your eyes over a text to find specific information quickly.",
        example: "To find the sample size, scan for numbers and words like 'participants', 'sample', 'n=' or 'N=' in Methods/Results.",
        tip: "Look for: numbers, proper nouns, capitalized words, or abbreviations."
      },
      {
        term: "IMRaD Structure",
        definition: "Introduction, Methods, Results, and Discussion - the standard structure for EMPIRICAL research papers.",
        example: "Hong et al. (2022): Introduction (why study FRT?), Methods (survey of 380 parents), Results (DBVW score = 3.865), Discussion (implications).",
        tip: "IMRaD papers have data and statistics. Conceptual papers like Andrejevic & Selwyn DON'T follow IMRaD."
      },
      {
        term: "Empirical vs Conceptual",
        definition: "Empirical = data-driven research with Methods & Results. Conceptual = argument-driven theory without data collection.",
        example: "Hong et al. (2022) is EMPIRICAL - they collected survey data from 380 parents. Andrejevic & Selwyn (2020) is CONCEPTUAL - they theorize about risks without collecting new data.",
        tip: "Check: Does it have a Methods section? Does it report collected data? If YES → Empirical. If NO → Conceptual."
      },
      {
        term: "The Gist",
        definition: "The essential meaning or main point of an article, usually found in the last sentence of the Abstract.",
        example: "The gist of Hong et al.: 'Parents support the use of face recognition systems in elementary school.'",
        tip: "Where to find the gist: Last sentence of the Abstract, or Purpose Statement in the Introduction."
      }
    ],
    articles: [ARTICLE_A],
    agenda: [
      { 
        title: "Skimming & Scanning Techniques", 
        duration: "10 min", 
        activities: [
          "Watch video on skimming vs scanning",
          "Demo: How to preview and skim a text",
          "Key elements to skim: Title, Abstract, Introduction/Conclusion, Topic sentences, Headings"
        ] 
      },
      { 
        title: "Skimming Practice: Article A", 
        duration: "12 min", 
        activities: [
          "Skim Article A (Hong et al., 2022)",
          "Answer: What is the gist? Where did you find it?",
          "Identify: Is it empirical or conceptual? How do you know?"
        ] 
      },
      { 
        title: "IMRaD Structure Deep-Dive", 
        duration: "10 min", 
        activities: [
          "Map Article A's sections to IMRaD",
          "Introduction, Literature Review, Research Model, Method, Results, Discussion, Conclusions",
          "Compare with conceptual papers (no Method/Results)"
        ] 
      },
      { 
        title: "Scanning Practice: Finding Specific Information", 
        duration: "12 min", 
        activities: [
          "Scan for: Sample size (394 participants)",
          "Scan for: Data collection instrument (5-point Likert scale)",
          "Scan for: A statistically significant result (p<0.001)",
          "Scan for: One limitation of the study"
        ] 
      }
    ],
    tasks: [
      // Part 2: Scanning Practice Questions 1-4
      {
        id: "w1h1-scan1",
        type: "mc",
        question: "Who is the publisher of this article?",
        options: ["Elsevier", "Taylor & Francis", "Springer Nature", "SAGE Publications"],
        correctAnswer: 1,
        explanation: "Taylor & Francis publishes the journal 'Learning, Media and Technology'. You can see the T&F logo at the top of the article page.",
        skillFocus: ["scanning"]
      },
      {
        id: "w1h1-scan2",
        type: "mc",
        question: "What is the journal name?",
        options: ["Educational Technology Research", "Learning, Media and Technology", "Computers & Education", "Journal of Digital Learning"],
        correctAnswer: 1,
        explanation: "The journal name appears in the article header and citation information. It's 'Learning, Media and Technology', Volume 45, Issue 2.",
        skillFocus: ["scanning"]
      },
      {
        id: "w1h1-scan3",
        type: "mc",
        question: "Which universities do the authors come from?",
        options: ["Harvard University & MIT", "Monash University (both authors)", "University of Melbourne & University of Sydney", "University of Oxford & Cambridge"],
        correctAnswer: 1,
        explanation: "Both Mark Andrejevic and Neil Selwyn are affiliated with Monash University in Australia. This is shown in the author information section.",
        skillFocus: ["scanning"]
      },
      {
        id: "w1h1-scan4",
        type: "mc",
        question: "When was this article published online?",
        options: ["05 November 2019", "27 January 2020", "14 February 2020", "3 March 2020"],
        correctAnswer: 0,
        explanation: "The article shows 'Published online: 05 Nov 2019' in the publication information section on the Taylor & Francis website.",
        skillFocus: ["scanning"]
      },
      // Part 2: Skimming Practice Questions 5-7
      {
        id: "w1h1-skim1",
        type: "mc",
        question: "What is the main topic of this article?",
        options: ["How to implement facial recognition systems in schools", "Critical examination of facial recognition technology use in educational settings", "The benefits of surveillance technology for student safety", "A comparison of different facial recognition software vendors"],
        correctAnswer: 1,
        explanation: "The title and abstract clearly indicate this is a critical examination of FRT in schools, raising 'critical questions and concerns' rather than promoting its use.",
        skillFocus: ["skimming"]
      },
      {
        id: "w1h1-skim2",
        type: "mc",
        question: "Based on the headings, what is the authors' overall stance on FRT in schools?",
        options: ["Strongly supportive of widespread adoption", "Neutral, presenting only facts without opinion", "Critical and questioning, highlighting concerns", "Focused only on technical implementation details"],
        correctAnswer: 2,
        explanation: "Headings like 'Problematising the rise of facial recognition' and 'Challenging the take-up of facial recognition in schools' indicate a critical, questioning stance.",
        skillFocus: ["skimming"]
      },
      {
        id: "w1h1-skim3",
        type: "mc",
        question: "What type of article structure does this paper follow?",
        options: ["Experimental study with methods, results, and statistics", "Argumentative/analytical essay discussing issues and concerns", "Case study of a specific school implementation", "Literature review summarizing other research only"],
        correctAnswer: 1,
        explanation: "The structure (Introduction → Context → Analysis → Discussion → Conclusion) with no 'Methods' or 'Results' sections indicates this is an argumentative/analytical piece rather than an empirical study.",
        skillFocus: ["skimming", "article-structure"]
      },
      // Part 3a: Macro-Level Outlining Question 8
      {
        id: "w1h1-macro1",
        type: "mc",
        question: "What is the logical flow among sections 4-7 of the article?",
        options: ["General concerns → Educational applications → Explaining adoption → Critiquing adoption", "History → Benefits → Costs → Recommendations", "Problem → Solution → Implementation → Evaluation", "Theory → Methodology → Results → Discussion"],
        correctAnswer: 0,
        explanation: "The sections follow a logical progression: Section 4 raises general concerns about FRT → Section 5 describes how FRT is being applied in education → Section 6 explains WHY schools are adopting it → Section 7 challenges and critiques this adoption.",
        skillFocus: ["outlining", "article-structure"]
      },
      // Part 3a: Writing Practice
      {
        id: "w1h1-macro-structure",
        type: "paragraph",
        question: "Write 3 sentences that summarize what the excerpt covers at the macro level. Do not summarize the content in detail – just describe the structure and progression of ideas.",
        wordLimit: 80,
        hints: ["The excerpt begins by...", "Then, it moves on to discuss...", "Finally, it explores..."],
        skillFocus: ["outlining", "summary-writing"]
      },
      // Part 3a: Macro Structure MC Questions 9-10
      {
        id: "w1h1-macro2",
        type: "mc",
        question: "What is the main focus of each paragraph in the excerpt?",
        options: ["P1: Introduction → P2-4: Three types of applications → P5-6: Engagement monitoring", "P1: History → P2: Benefits → P3: Costs → P4-6: Conclusions", "P1-3: Problem → P4-5: Solution → P6: Implementation", "All paragraphs discuss the same application in different countries"],
        correctAnswer: 0,
        explanation: "P1 introduces FRT in education. P2 covers security, P3 covers attendance, P4 covers online/virtual learning. P5-6 discuss engagement/emotion detection. This shows 4 distinct applications organized logically.",
        skillFocus: ["outlining", "reading-comprehension"]
      },
      {
        id: "w1h1-macro3",
        type: "mc",
        question: "How are the four applications (security, attendance, online authentication, engagement detection) organized in the excerpt?",
        options: ["From most expensive to least expensive", "From physical/visible surveillance to invisible/emotional surveillance", "Chronologically by when they were invented", "Alphabetically by application name"],
        correctAnswer: 1,
        explanation: "The excerpt moves from visible/physical applications (security cameras, attendance tracking) to increasingly invisible/intimate forms of surveillance (online authentication, then emotion/engagement detection from facial expressions).",
        skillFocus: ["outlining", "reading-comprehension"]
      },
      // Part 3b: Micro-Level Outlining Practice
      {
        id: "w1h1-micro-outline",
        type: "paragraph",
        question: "Choose a paragraph from the excerpt and create a micro-level outline identifying the topic sentence, supporting details, and concluding thought.",
        wordLimit: 100,
        hints: ["Topic Sentence: [main idea]", "Supporting Details: [specific points]", "Concluding Thought: [wrap-up]"],
        skillFocus: ["outlining", "paragraph-analysis"]
      }
    ],
    writingTask: {
      prompt: "Using the excerpt from Hong et al. (2022), write 3-4 sentences explaining how this paper demonstrates at least TWO features of academic writing. Include a proper citation.",
      wordLimit: 60,
      modelAnswer: "Hong et al. (2022) demonstrates academic writing through its systematic methodology and use of citations. The study collected data from 380 parents using validated questionnaires, showing rigorous research design. The authors also reference previous studies such as Kaiser et al. (2021) and Perry and Sibley (2010), building on existing knowledge in the field.",
      rubricCriteria: [
        "Identifies 2+ academic features",
        "Provides specific evidence from the excerpt",
        "Uses proper citation format",
        "Clear and coherent writing"
      ],
      demoSteps: [
        { title: "Step 1: Choose 2 features", content: "Pick from: peer review, citations, methodology, expert authors", highlight: "methodology and citations" },
        { title: "Step 2: Find evidence", content: "Look in the excerpt for proof of these features", highlight: "380 valid responses, (Kaiser et al., 2021)" },
        { title: "Step 3: Write with citation", content: "Start with 'Hong et al. (2022) demonstrates...'", highlight: "Hong et al. (2022)" }
      ]
    }
  },
  {
    weekNumber: 1,
    hourNumber: 2,
    title: "Paraphrasing Fundamentals",
    theme: "4 Core Strategies with AI-Guided Practice",
    behaviourChange: "Before writing ANY paraphrase: Read → Understand meaning → Choose strategies → Draft → Cite → Check similarity.",
    learningGoals: [
      "Apply 4 core paraphrasing strategies (synonyms, word forms, voice, sentence structure)",
      "Identify and avoid 'patchwriting' (insufficient changes that constitute plagiarism)",
      "Integrate citations correctly with paraphrased content",
      "Practice paraphrasing with AI-guided step-by-step feedback"
    ],
    ciloLinks: ["CILO 3: Demonstrate Awareness of Academic Conventions", "CILO 4: Demonstrate Awareness of Accuracy in Academic Discourse"],
    keyConcepts: [
      {
        term: "Paraphrasing",
        definition: "Restating someone else's ideas in YOUR OWN words while keeping the original meaning.",
        example: "Original: 'Technology impacts education.' → Paraphrase: 'Educational practices are influenced by technological developments.'",
        tip: "The AWQ requires paraphrasing - NO direct quotes allowed. You must change BOTH words AND structure."
      },
      {
        term: "Patchwriting",
        definition: "A form of plagiarism where you only make minor word changes to the original text.",
        example: "Original: 'Facial recognition technology is now being introduced across various aspects of public life.' Patchwork: 'Facial recognition is currently introduced across many aspects of public life.' ← TOO CLOSE!",
        tip: "If you keep the same sentence structure and only swap a few words, that's patchwriting. Change STRUCTURE too."
      },
      {
        term: "Strategy 1: Synonym Replacement",
        definition: "Replace words with words that have similar meanings.",
        example: "'introduced' → 'implemented', 'various' → 'numerous', 'aspects' → 'areas'",
        tip: "Warning: Don't abuse the thesaurus! Some synonyms don't fit the context. 'Big' doesn't always mean 'enormous'."
      },
      {
        term: "Strategy 2: Word Form Changes",
        definition: "Change the form of words (verb → noun, adjective → adverb, etc.).",
        example: "'technology is introduced' (verb) → 'the introduction of technology' (noun)",
        tip: "This naturally changes sentence structure. Very powerful strategy!"
      },
      {
        term: "Strategy 3: Active ↔ Passive Voice",
        definition: "Change active sentences to passive, or vice versa.",
        example: "Active: 'Researchers collected data' → Passive: 'Data was collected by researchers'",
        tip: "Academic writing often uses passive voice. This is a safe strategy for paraphrasing."
      },
      {
        term: "Strategy 4: Sentence Structure",
        definition: "Reorder the sentence, combine/split sentences, or change clause positions.",
        example: "'Because X happened, Y resulted.' → 'Y was the result of X happening.'",
        tip: "Start your sentence from a different point than the original."
      },
      {
        term: "Citation Integration",
        definition: "Every paraphrase MUST include a citation to the original source.",
        example: "Author-prominent: 'Hong et al. (2022) argue that...' | Info-prominent: '...according to recent research (Hong et al., 2022).'",
        tip: "No citation = plagiarism, even if you paraphrased perfectly!"
      }
    ],
    articles: [ARTICLE_A, ARTICLE_B],
    agenda: [
      { 
        title: "Why Paraphrase? (Concept)", 
        duration: "10 min", 
        activities: [
          "AWQ requires paraphrasing - no direct quotes",
          "The 3 assessed skills: Paraphrase, Summarize, Synthesize",
          "Paraphrase vs. Summary vs. Direct Quote distinction"
        ] 
      },
      { 
        title: "The 4 Paraphrasing Strategies", 
        duration: "20 min", 
        activities: [
          "Strategy 1: Synonym Replacement (with warnings about misuse)",
          "Strategy 2: Word Form Changes (verb → noun)",
          "Strategy 3: Active ↔ Passive Voice",
          "Strategy 4: Sentence Structure Changes"
        ] 
      },
      { 
        title: "Patchwriting Detection", 
        duration: "10 min", 
        activities: [
          "What is patchwriting and why is it plagiarism?",
          "Side-by-side examples: Too Close vs. Acceptable",
          "Practice identifying patchwriting"
        ] 
      },
      { 
        title: "AI-Guided Paraphrasing Practice", 
        duration: "25 min", 
        activities: [
          "Step-by-step guided paraphrasing with AI coach",
          "Practice with sentences from course materials",
          "Get feedback on similarity and quality"
        ] 
      }
    ],
    tasks: [
      {
        id: "w1h2-mc1",
        type: "mc",
        question: "What is the main difference between paraphrasing and summarizing?",
        options: [
          "Paraphrasing is longer than the original; summarizing is shorter",
          "Paraphrasing restates the same content in different words; summarizing condenses the main ideas",
          "Paraphrasing requires citations; summarizing does not",
          "Paraphrasing is for quotes; summarizing is for ideas"
        ],
        correctAnswer: 1,
        explanation: "Paraphrasing = same length, different words (restate). Summarizing = shorter, main ideas only (condense). Both require citations!",
        skillFocus: ["paraphrasing", "summarizing"]
      },
      {
        id: "w1h2-mc2",
        type: "mc",
        question: "Which paraphrasing strategy was used here?\n\nOriginal: 'Researchers collected data from participants.'\nParaphrase: 'Data was gathered from participants by the researchers.'",
        options: [
          "Synonym replacement only",
          "Word form change",
          "Active to passive voice",
          "Sentence structure change"
        ],
        correctAnswer: 2,
        explanation: "The sentence changed from ACTIVE voice ('Researchers collected') to PASSIVE voice ('Data was collected by researchers'). Also used synonym: collected → gathered.",
        skillFocus: ["paraphrasing"],
        demoSteps: [
          { title: "Identify the original structure", content: "Subject (Researchers) + Verb (collected) + Object (data)", highlight: "Active voice" },
          { title: "Identify the paraphrase structure", content: "Object (Data) + was + Verb (gathered) + by Subject", highlight: "Passive voice" },
          { title: "Confirm the strategy", content: "Active → Passive = Voice Change strategy", highlight: "Strategy 3" }
        ]
      },
      {
        id: "w1h2-mc3",
        type: "mc",
        question: "Which paraphrasing strategy was used here?\n\nOriginal: 'The technology significantly impacts education.'\nParaphrase: 'The significant impact of technology on education...'",
        options: [
          "Synonym replacement",
          "Word form change (verb → noun)",
          "Active to passive voice",
          "Combining sentences"
        ],
        correctAnswer: 1,
        explanation: "'impacts' (verb) → 'impact' (noun), 'significantly' (adverb) → 'significant' (adjective). Word form changes naturally alter sentence structure!",
        skillFocus: ["paraphrasing"]
      },
      {
        id: "w1h2-tf1",
        type: "true-false",
        question: "Patchwriting is acceptable as long as you include a citation.",
        correctAnswer: "false",
        explanation: "FALSE! Patchwriting is still plagiarism even with a citation. You must significantly change BOTH the words AND the structure - not just swap a few synonyms.",
        skillFocus: ["academic-integrity"]
      },
      {
        id: "w1h2-mc4",
        type: "mc",
        question: "Is this an acceptable paraphrase or patchwriting?\n\nOriginal: 'Facial recognition technology is now being introduced across various aspects of public life.'\nAttempt: 'Facial recognition is currently being introduced across many aspects of public life.'",
        options: [
          "Acceptable paraphrase - words were changed",
          "Patchwriting - too close to the original",
          "Direct quote - needs quotation marks",
          "Summary - it's shorter"
        ],
        correctAnswer: 1,
        explanation: "This is PATCHWRITING. Only 3 words changed (now→currently, various→many, technology removed), but the sentence structure is IDENTICAL. You must change more than just a few words!",
        skillFocus: ["paraphrasing", "academic-integrity"],
        examples: [
          {
            original: "Facial recognition is currently being introduced across many aspects of public life.",
            analysis: "❌ PATCHWRITING: Same structure, minimal word changes."
          },
          {
            original: "Across numerous areas of society, facial identification systems are increasingly being implemented.",
            analysis: "✅ ACCEPTABLE: Different structure (starts with 'Across'), multiple synonyms (recognition→identification, introduced→implemented, aspects→areas)."
          }
        ]
      },
      {
        id: "w1h2-mc5",
        type: "mc",
        question: "Which is the BEST paraphrase of: 'Parents support the use of face recognition systems in elementary schools.'?",
        options: [
          "Parents support using face recognition in elementary schools.",
          "Face recognition systems are supported by parents in elementary schools.",
          "In primary education settings, facial identification technology receives parental approval.",
          "Parents like face recognition technology in schools."
        ],
        correctAnswer: 2,
        explanation: "Option C uses multiple strategies: synonyms (elementary→primary, face recognition→facial identification, support→approval), word form changes (support→approval), AND restructured the sentence. Options A and B are patchwriting (too similar).",
        skillFocus: ["paraphrasing"]
      },
      {
        id: "w1h2-mc6",
        type: "mc",
        question: "What is the correct APA 7th citation for this paraphrase?\n\n'Recent studies indicate that technological innovation influences parental attitudes toward school safety measures.'",
        context: "Source: Hong, Li, Kuo & An (2022)",
        options: [
          "...safety measures (Hong, Li, Kuo & An, 2022).",
          "...safety measures (Hong et al., 2022).",
          "...safety measures. (Hong et al., 2022)",
          "...safety measures [Hong et al., 2022]."
        ],
        correctAnswer: 1,
        explanation: "For 3+ authors in APA 7th: use 'et al.' from the FIRST citation. The period goes AFTER the parentheses. No brackets in APA - those are for other styles.",
        skillFocus: ["citation"]
      },
      {
        id: "w1h2-mc7",
        type: "mc",
        question: "Which version shows author-prominent citation?",
        options: [
          "Technology impacts education significantly (Hong et al., 2022).",
          "Hong et al. (2022) argue that technology impacts education significantly.",
          "According to (Hong et al., 2022), technology impacts education.",
          "Technology impacts education (2022)."
        ],
        correctAnswer: 1,
        explanation: "Author-prominent (narrative) puts the author's name as part of the sentence: 'Hong et al. (2022) argue...' Option A is info-prominent (parenthetical). Options C and D have formatting errors.",
        skillFocus: ["citation"]
      },
      {
        id: "w1h2-sentence1",
        type: "sentence",
        question: "Paraphrase this sentence using at least 2 strategies, then add a proper citation:\n\n'Parents support the use of face recognition systems in elementary schools.'",
        context: "Original from Hong et al. (2022)",
        wordLimit: 35,
        hints: [
          "Try changing 'support' to a different word form",
          "Consider passive voice: 'Facial recognition is...'",
          "Synonyms: elementary → primary, support → approval/acceptance"
        ],
        skillFocus: ["paraphrasing", "citation"],
        modelAnswer: "According to Hong et al. (2022), parental approval for facial identification technology in primary education settings is evident from recent survey findings.",
        examples: [
          {
            original: "Parents support face recognition systems in schools (Hong et al., 2022).",
            analysis: "❌ Patchwriting - too close to original, minimal changes."
          },
          {
            original: "In primary education contexts, facial identification technology receives considerable parental endorsement (Hong et al., 2022).",
            analysis: "✅ Good! Changed structure, used synonyms (elementary→primary, support→endorsement, face recognition→facial identification)."
          }
        ]
      },
      {
        id: "w1h2-mc8",
        type: "mc",
        question: "You're writing an AWQ response and want to include this idea: 'FRT raises concerns about student privacy.' Which approach is correct for AWQ?",
        options: [
          "Quote directly: 'FRT raises concerns about student privacy' (Andrejevic & Selwyn, 2020).",
          "Paraphrase: Student privacy issues are a significant consideration regarding facial recognition implementation in schools (Andrejevic & Selwyn, 2020).",
          "Summarize without citation: FRT has privacy concerns.",
          "Use your own opinion: I think FRT has privacy problems."
        ],
        correctAnswer: 1,
        explanation: "AWQ requires PARAPHRASING with citations - no direct quotes allowed! Option B paraphrases correctly with a citation. Option A uses quotes (not allowed). Options C and D lack citations or add opinion (not allowed).",
        skillFocus: ["paraphrasing", "awq-prep"]
      }
    ],
    writingTask: {
      prompt: "Paraphrase ONE of the following sentences using at least 2 strategies. Include a proper APA citation.\n\n1. 'Facial recognition technology is now being introduced across various aspects of public life.' (Andrejevic & Selwyn, 2020)\n\n2. 'The research demonstrates that technology significantly impacts education.' (Hong et al., 2022)",
      wordLimit: 40,
      modelAnswer: "Across numerous sectors of society, facial identification systems are increasingly being implemented (Andrejevic & Selwyn, 2020). OR: According to Hong et al. (2022), educational practices are considerably influenced by technological developments.",
      rubricCriteria: [
        "Uses at least 2 paraphrasing strategies",
        "Not patchwriting (significant word AND structure changes)",
        "Preserves the original meaning accurately",
        "Includes correct APA 7th citation format"
      ],
      demoSteps: [
        { title: "Step 1: Read and understand", content: "What is the main idea? Don't paraphrase yet.", highlight: "meaning first" },
        { title: "Step 2: Choose strategies", content: "Select 2+: synonyms, word forms, voice, structure", highlight: "plan your approach" },
        { title: "Step 3: Draft", content: "Write your version WITHOUT looking at the original", highlight: "close the original" },
        { title: "Step 4: Compare", content: "Check similarity - is it still too close?", highlight: "verify changes" },
        { title: "Step 5: Cite", content: "Add APA citation (author-prominent or info-prominent)", highlight: "always cite" }
      ]
    }
  },
  // ============ WEEK 1 HOUR 3: PRACTICE, FEEDBACK & REFLECTION ============
  // NOTE: Content subject to revision based on learning progress
  {
    weekNumber: 1,
    hourNumber: 3,
    title: "Practice, Feedback & Reflection",
    theme: "Consolidate Week 1 Skills Through Guided Practice",
    behaviourChange: "Learning cycle: Practice → AI Feedback → Peer Discussion → Teacher Review → Reflect.",
    learningGoals: [
      "Consolidate skimming, scanning, and paraphrasing skills from Hours 1-2",
      "Receive multi-source feedback: AI, peers, and teacher",
      "Identify personal strengths and areas for improvement",
      "Develop reflective learning habits for continuous growth"
    ],
    ciloLinks: ["CILO 1: Examine Academic Discourse", "CILO 3: Academic Conventions", "CILO 5: Self-Directed Learning"],
    keyConcepts: [
      {
        term: "Deliberate Practice",
        definition: "Focused, purposeful practice with clear goals and immediate feedback — the key to skill development.",
        example: "Instead of reading passively, set a goal: 'I will identify 3 topic sentences and check my answers.'",
        tip: "Practice with intention. Ask: What am I trying to improve? How will I know if I succeeded?"
      },
      {
        term: "Multi-Source Feedback",
        definition: "Getting feedback from different sources: AI (immediate), peers (collaborative), teacher (expert).",
        example: "AI catches technical errors → Peers share strategies → Teacher addresses deeper issues.",
        tip: "Each feedback source offers different insights. Value all three!"
      },
      {
        term: "Performance Summary",
        definition: "An overview of your practice attempts showing patterns, common errors, and progress.",
        example: "Summary: 8/10 MC correct, common error: confusing skimming with scanning, strength: paraphrasing strategies.",
        tip: "Use summaries to identify what to focus on, not just what score you got."
      },
      {
        term: "Reflective Learning",
        definition: "Thinking about your learning process — what worked, what didn't, and what to do differently.",
        example: "'I struggled with word form changes. Next time, I'll practice verb→noun conversions first.'",
        tip: "Reflection turns experience into learning. Take 2 minutes to write down insights."
      }
    ],
    articles: [ARTICLE_A, ARTICLE_B],
    agenda: [
      // ============ PART A: PRACTICE ============
      { 
        title: "Part A: Practice Review & Extension", 
        duration: "20 min", 
        activities: [
          "📊 View summary of your Hour 1-2 practice attempts",
          "🔍 AI identifies common issues and patterns",
          "🎯 Additional targeted practice on weak areas",
          "💡 Get instant AI feedback on new attempts"
        ] 
      },
      // ============ PART B: FEEDBACK ============
      { 
        title: "Part B: Teacher & Peer Feedback", 
        duration: "15 min", 
        activities: [
          "👨‍🏫 [TEACHER]: Review individual student work samples",
          "👨‍🏫 [TEACHER]: Provide targeted feedback on common class issues",
          "👥 [PEER]: Exchange paraphrases with a partner",
          "👥 [PEER]: Give feedback using the checklist provided"
        ] 
      },
      // ============ PART C: REFLECTION ============
      { 
        title: "Part C: Reflection & Goal Setting", 
        duration: "15 min", 
        activities: [
          "📝 Reflect on feedback from AI, peers, and teacher",
          "🤔 What did each feedback source teach you?",
          "📈 Self-assess confidence on Week 1 skills",
          "🎯 Set specific, measurable goals for Week 2"
        ] 
      }
    ],
    tasks: [
      // ============ PART A: PRACTICE TASKS ============
      {
        id: "w1h3-practice-summary",
        type: "short-answer",
        question: "📊 PRACTICE SUMMARY (AI-generated)\n\n[PLACEHOLDER: This section will display a summary of the student's Hour 1-2 practice attempts, including:\n- Tasks completed vs. attempted\n- Common error patterns identified\n- Skills demonstrated vs. needs improvement\n- Recommended focus areas]\n\nBased on your practice summary, what is ONE skill you want to improve today?",
        wordLimit: 30,
        hints: ["Be specific — 'paraphrasing' is too vague", "Good: 'I want to improve word form changes'"],
        skillFocus: ["self-assessment"],
        modelAnswer: "I want to improve my ability to change sentence structure when paraphrasing, as most of my attempts kept the same word order as the original."
      },
      {
        id: "w1h3-mc1",
        type: "mc",
        question: "Quick Review: What is 'skimming'?",
        options: [
          "Reading every word carefully for complete understanding",
          "Reading quickly to get the main idea and overall structure",
          "Looking for specific facts, dates, or numbers",
          "Memorizing key vocabulary from a text"
        ],
        correctAnswer: 1,
        explanation: "Skimming = reading quickly for main idea and structure. Focus on headings, first sentences, and key terms.",
        skillFocus: ["review", "skimming"]
      },
      {
        id: "w1h3-mc2",
        type: "mc",
        question: "Quick Review: What is 'patchwriting'?",
        options: [
          "Writing a rough draft before editing",
          "Combining ideas from multiple sources",
          "Making only minor changes to original text (still plagiarism)",
          "Using quotation marks around borrowed phrases"
        ],
        correctAnswer: 2,
        explanation: "Patchwriting = changing only a few words while keeping the same structure. It's STILL plagiarism even with a citation!",
        skillFocus: ["review", "paraphrasing"]
      },
      {
        id: "w1h3-practice1",
        type: "paragraph",
        question: "🎯 TARGETED PRACTICE\n\nParaphrase this sentence using at least 2 strategies. The AI will provide feedback.\n\n'Facial recognition technologies work by assigning numerical values to schematic representations of facial features.' (Andrejevic & Selwyn, 2020)",
        wordLimit: 60,
        hints: [
          "Try: word form changes (assigning→assignment, work→function)",
          "Try: passive voice (are assigned)",
          "Try: synonyms (numerical→numeric, features→characteristics)"
        ],
        skillFocus: ["paraphrasing", "citation"],
        modelAnswer: "According to Andrejevic and Selwyn (2020), facial identification systems function through the assignment of numeric values to simplified representations of facial characteristics."
      },
      
      // ============ PART B: FEEDBACK TASKS ============
      {
        id: "w1h3-teacher-instructions",
        type: "short-answer",
        question: "👨‍🏫 TEACHER FEEDBACK SECTION\n\n[INSTRUCTIONS FOR TEACHER]:\n1. Access the class dashboard to view student work samples\n2. Identify 2-3 common issues across the class\n3. Share screen and discuss these issues with examples\n4. Provide individual written feedback on flagged submissions\n\n[FOR STUDENTS]: Write down ONE piece of feedback your teacher shared with the class.",
        wordLimit: 50,
        hints: ["Listen carefully to the teacher's feedback", "Focus on feedback relevant to your own work"],
        skillFocus: ["feedback-reception"],
        modelAnswer: "The teacher noted that many students are still keeping the same sentence structure when paraphrasing, which counts as patchwriting. We need to change both words AND structure."
      },
      {
        id: "w1h3-peer-feedback",
        type: "paragraph",
        question: "👥 PEER FEEDBACK ACTIVITY\n\n1. Exchange your paraphrase from the practice task with a partner\n2. Use this checklist to give feedback:\n   ✓ Are 2+ strategies used?\n   ✓ Is the structure genuinely different?\n   ✓ Is the meaning preserved?\n   ✓ Is the citation correct?\n\nWrite the feedback you received from your peer AND one thing you learned from reading their paraphrase.",
        wordLimit: 80,
        hints: ["Be specific about what worked and what could improve", "Learn from how your peer approached the task"],
        skillFocus: ["peer-feedback", "collaborative-learning"],
        modelAnswer: "My peer said my paraphrase used good synonyms but kept a similar structure to the original. They suggested I try starting with a different part of the sentence. From their paraphrase, I learned that changing 'work by assigning' to 'function through the assignment of' is a useful word form change I hadn't thought of."
      },
      
      // ============ PART C: REFLECTION TASKS ============
      {
        id: "w1h3-reflection-sources",
        type: "paragraph",
        question: "🤔 REFLECTION: Learning from Multiple Sources\n\nReflect on the feedback you received today:\n\n1. What did you learn from AI feedback?\n2. What did you learn from peer feedback?\n3. What did you learn from teacher feedback?\n4. Which source was most helpful for you? Why?",
        wordLimit: 120,
        hints: [
          "Each source offers different insights",
          "AI: immediate, technical | Peer: strategies, comparison | Teacher: expert, deeper issues"
        ],
        skillFocus: ["reflection", "metacognition"],
        modelAnswer: "From AI feedback, I learned that my paraphrase was still 65% similar to the original — too close. From my peer, I learned a new strategy: changing verb→noun word forms. From the teacher, I understood WHY patchwriting is problematic — it shows I didn't truly understand the idea. The teacher feedback was most helpful because it explained the reasoning, not just the error."
      },
      {
        id: "w1h3-confidence-rating",
        type: "paragraph",
        question: "📈 SELF-ASSESSMENT\n\nRate your confidence (1-5) on each Week 1 skill:\n\n- Skimming (finding main idea quickly): __/5\n- Scanning (finding specific info): __/5\n- Identifying IMRaD structure: __/5\n- Paraphrasing (2+ strategies): __/5\n- APA in-text citations: __/5\n\nExplain your LOWEST rating — what makes this skill challenging?",
        wordLimit: 100,
        hints: ["Be honest — low ratings help you know where to focus", "Explain WHY it's challenging, not just that it is"],
        skillFocus: ["self-assessment"],
        modelAnswer: "Skimming: 4/5, Scanning: 4/5, IMRaD: 3/5, Paraphrasing: 2/5, Citations: 3/5.\n\nMy lowest is paraphrasing (2/5). I find it challenging because when I try to change the structure, I sometimes change the meaning too. I also struggle to think of synonyms quickly. I need more practice separating 'understanding the idea' from 'writing it in my own words.'"
      },
      {
        id: "w1h3-goal-setting",
        type: "paragraph",
        question: "🎯 GOAL SETTING FOR WEEK 2\n\nWrite ONE specific, measurable goal for next week.\n\nA good goal:\n✓ Is specific (not 'improve paraphrasing' but 'practice word form changes')\n✓ Is measurable (includes a number or clear outcome)\n✓ Is achievable in one week\n\nExample: 'I will complete 5 paraphrasing exercises with AI feedback, focusing on verb→noun changes.'",
        wordLimit: 60,
        hints: ["Include a number or measurable outcome", "Focus on your weakest skill from the self-assessment"],
        skillFocus: ["goal-setting"],
        modelAnswer: "My goal for Week 2: Before each class, I will practice paraphrasing one sentence from the readings using all 4 strategies (synonyms, word forms, voice, structure) and check with the AI coach until I get below 40% similarity."
      }
    ],
    writingTask: {
      prompt: "FINAL REFLECTION: Week 1 Learning Journey\n\nWrite a short reflection (100-150 words) addressing:\n\n1. What was your biggest 'aha moment' this week?\n2. How did feedback from AI, peers, and teacher each contribute to your learning?\n3. What specific action will you take to prepare for the Academic Writing Quiz?",
      wordLimit: 150,
      modelAnswer: "My biggest 'aha moment' was realizing that patchwriting is still plagiarism even with a citation — I used to think changing a few words was enough. The AI feedback showed me exactly how similar my paraphrases were to the original (65%!), which was eye-opening. My peer showed me new strategies I hadn't considered, like starting sentences with different elements. The teacher explained the deeper 'why' — that genuine paraphrasing proves you understood the idea.\n\nTo prepare for the AWQ, I will practice paraphrasing one sentence per day using the AI coach, aiming for <40% similarity. I'll focus on word form changes since that's my weakest strategy.",
      rubricCriteria: [
        "Identifies a specific 'aha moment' or insight",
        "Reflects on value of each feedback source (AI, peer, teacher)",
        "Sets a specific, actionable preparation step",
        "Shows genuine reflection, not generic statements"
      ]
    }
  }
];

// ============ WEEK 2 HOURS ============

export const week2Hours: HourData[] = [
  {
    weekNumber: 2,
    hourNumber: 1,
    title: "In-Text Citations (APA 7th Edition)",
    theme: "Citing Sources Within Summary Writing",
    behaviourChange: "Every time you use an idea from a source, cite it immediately using varied sentence patterns.",
    learningGoals: [
      "Apply APA 7th edition in-text citation rules correctly",
      "Distinguish and use Author-prominent vs Information-prominent styles",
      "Apply the '&' vs 'and' rule and 'et al.' usage for multiple authors",
      "Integrate citations naturally into summary sentences"
    ],
    ciloLinks: ["CILO 2: Citation Conventions"],
    keyConcepts: [
      {
        term: "Author-Prominent Citation",
        definition: "The author's name appears IN the sentence, emphasizing WHO said something.",
        example: "Hong et al. (2022) found that parents support FRT.",
        tip: "Use when the author's identity matters — experts, famous researchers, or when comparing authors' views."
      },
      {
        term: "Information-Prominent Citation",
        definition: "The citation appears at the END in parentheses, emphasizing WHAT was found.",
        example: "Parents generally support FRT in schools (Hong et al., 2022).",
        tip: "Use when the information matters more than who said it."
      },
      {
        term: "Signal-Phrase Citation",
        definition: "Uses introductory phrases like 'According to...' to introduce the source smoothly.",
        example: "According to Hong et al. (2022), parents support FRT.",
        tip: "Use for smooth integration and variety in your writing."
      },
      {
        term: "'&' vs 'and' Rule",
        definition: "Use '&' INSIDE parentheses, use 'and' OUTSIDE in the sentence.",
        example: "✓ (Andrejevic & Selwyn, 2020) | ✓ Andrejevic and Selwyn (2020) argue... | ✗ (Andrejevic and Selwyn, 2020)",
        tip: "Think: & = inside (), and = outside in your sentence."
      },
      {
        term: "'Et al.' Usage (APA 7th)",
        definition: "For 3 or more authors, use 'et al.' from the FIRST citation (changed from APA 6th).",
        example: "Hong et al. (2022) — not 'Hong, Li, Kuo, and An (2022)' even the first time.",
        tip: "Always: et al. (with period after 'al'), never 'et. al' or 'et al'"
      },
      {
        term: "Reporting Verbs",
        definition: "Verbs that introduce what an author said. Different verbs signal different attitudes.",
        example: "Neutral: states, notes, reports | Strong: argues, contends, claims | Evidential: demonstrates, shows, reveals",
        tip: "Match the verb to the author's stance — use 'argues' for debatable claims, 'demonstrates' for evidence-based findings."
      }
    ],
    articles: [ARTICLE_A, ARTICLE_B],
    agenda: [
      { 
        title: "Part 1: Author-Prominent vs Information-Prominent", 
        duration: "12 min", 
        activities: [
          "Compare the two main citation styles",
          "When to use each style",
          "Practice identifying styles in academic text"
        ] 
      },
      { 
        title: "Part 2: The '&' vs 'and' and 'et al.' Rules", 
        duration: "10 min", 
        activities: [
          "The '&' = inside parentheses rule",
          "APA 7th 'et al.' from first citation",
          "Common formatting errors to avoid"
        ] 
      },
      { 
        title: "Part 3: Signal Phrases & Reporting Verbs", 
        duration: "10 min", 
        activities: [
          "Using 'According to...' and other signal phrases",
          "Choosing appropriate reporting verbs",
          "Matching verb strength to author stance"
        ] 
      },
      { 
        title: "Part 4: Citation in Summaries", 
        duration: "10 min", 
        activities: [
          "How to cite when summarizing",
          "Combining paraphrase + citation",
          "Avoiding over-citation and under-citation"
        ] 
      },
      { 
        title: "Part 5: AI Citation Coach", 
        duration: "8 min", 
        activities: [
          "Practice with interactive citation tool",
          "Get feedback on citation patterns"
        ] 
      }
    ],
    tasks: [
      {
        id: "w2h1-mc1",
        type: "mc",
        question: "Which citation style is this? 'Hong et al. (2022) found that parents generally support FRT.'",
        options: [
          "Information-prominent",
          "Author-prominent",
          "Signal-phrase",
          "Secondary citation"
        ],
        correctAnswer: 1,
        explanation: "The author's name (Hong et al.) appears IN the sentence, followed by the year in parentheses. This emphasizes WHO said it = Author-prominent.",
        skillFocus: ["apa-citation"]
      },
      {
        id: "w2h1-mc2",
        type: "mc",
        question: "Which citation style is this? 'Parents in China generally accept FRT in schools (Hong et al., 2022).'",
        options: [
          "Author-prominent",
          "Information-prominent",
          "Signal-phrase",
          "Block quote"
        ],
        correctAnswer: 1,
        explanation: "The citation appears at the END in parentheses. The sentence focuses on WHAT was found, not who found it = Information-prominent.",
        skillFocus: ["apa-citation"]
      },
      {
        id: "w2h1-tf1",
        type: "true-false",
        question: "In APA format, you use '&' between author names inside parentheses and 'and' in the sentence.",
        correctAnswer: "true",
        explanation: "Correct! Use '&' INSIDE parentheses: (Andrejevic & Selwyn, 2020). Use 'and' OUTSIDE: Andrejevic and Selwyn (2020) argue...",
        skillFocus: ["apa-citation"]
      },
      {
        id: "w2h1-mc3",
        type: "mc",
        question: "Which citation is correctly formatted in APA 7th edition?",
        options: [
          "Hong et al (2022) found that...",
          "Hong et al., (2022) found that...",
          "Hong et al. (2022) found that...",
          "(Hong, et al., 2022)"
        ],
        correctAnswer: 2,
        explanation: "In APA 7th: 'et al.' needs a period after 'al' (it's abbreviated Latin). No comma before the year in narrative citations. No comma after 'al' before the year.",
        skillFocus: ["apa-citation"]
      },
      {
        id: "w2h1-fb1",
        type: "fill-blank",
        question: "For works with three or more authors in APA 7th edition, use the first author's name followed by _______.",
        correctAnswer: "et al.",
        explanation: "APA 7th simplified this: use 'et al.' from the FIRST citation for works with 3+ authors. Remember the period after 'al'.",
        skillFocus: ["apa-citation"]
      },
      {
        id: "w2h1-mc4",
        type: "mc",
        question: "Which sentence correctly uses the '&' vs 'and' rule?",
        options: [
          "Andrejevic & Selwyn (2020) argue that FRT is problematic.",
          "According to Andrejevic and Selwyn (2020), FRT raises concerns.",
          "FRT raises concerns (Andrejevic and Selwyn, 2020).",
          "Both A and C are incorrect."
        ],
        correctAnswer: 1,
        explanation: "A uses '&' outside parentheses (wrong). C uses 'and' inside parentheses (wrong). B correctly uses 'and' in the sentence because the author names are OUTSIDE the parentheses.",
        skillFocus: ["apa-citation"]
      },
      {
        id: "w2h1-mc5",
        type: "mc",
        question: "Which reporting verb best matches Andrejevic and Selwyn's (2020) CRITICAL stance on FRT?",
        options: [
          "notes",
          "describes",
          "contends",
          "observes"
        ],
        correctAnswer: 2,
        explanation: "'Contends' signals the author is making an argumentative claim. Since Andrejevic & Selwyn take a critical stance, use a strong verb like 'contends', 'argues', or 'challenges'.",
        skillFocus: ["reporting-verbs"]
      },
      {
        id: "w2h1-mc6",
        type: "mc",
        question: "When writing a summary paragraph with multiple ideas from the same source, how should you cite?",
        options: [
          "Cite every single sentence",
          "Only cite at the very end of the paragraph",
          "Cite at the beginning and signal phrases to show the ideas continue from the same source",
          "No citation needed if you paraphrased"
        ],
        correctAnswer: 2,
        explanation: "Start with a clear citation, then use phrases like 'The authors also note...', 'They further explain...' to show ideas continue from the same source without over-citing.",
        skillFocus: ["apa-citation", "summary-writing"]
      },
      {
        id: "w2h1-sentence1",
        type: "sentence",
        question: "Convert this Author-prominent citation to Information-prominent: 'Hong et al. (2022) found that parents support FRT for its practical benefits.'",
        wordLimit: 25,
        hints: ["Move authors to the end", "Put author names INSIDE parentheses", "Keep the same information"],
        skillFocus: ["apa-citation"],
        modelAnswer: "Parents support FRT for its practical benefits (Hong et al., 2022)."
      },
      {
        id: "w2h1-sentence2",
        type: "sentence",
        question: "Convert this Information-prominent citation to Signal-phrase: 'FRT raises concerns about student privacy (Andrejevic & Selwyn, 2020).'",
        wordLimit: 30,
        hints: ["Use 'According to...'", "Move authors to the start", "Remember: 'and' not '&' outside parentheses"],
        skillFocus: ["apa-citation"],
        modelAnswer: "According to Andrejevic and Selwyn (2020), FRT raises concerns about student privacy."
      }
    ],
    writingTask: {
      prompt: "Write a 3-sentence summary of Hong et al. (2022)'s main finding about parental attitudes toward FRT. Use:\n- Sentence 1: Author-prominent citation with a reporting verb\n- Sentence 2: Continue the idea without repeating the full citation\n- Sentence 3: Information-prominent citation for a supporting detail",
      wordLimit: 80,
      modelAnswer: "Hong et al. (2022) demonstrate that Chinese parents generally support the use of facial recognition technology in elementary schools. The researchers found that perceived practical value outweighed privacy concerns for most participants. This acceptance was particularly strong among parents who embraced technological innovation (Hong et al., 2022).",
      rubricCriteria: [
        "Author-prominent citation with appropriate reporting verb in sentence 1",
        "Smooth continuation without over-citation in sentence 2",
        "Information-prominent citation correctly formatted in sentence 3",
        "Content accurately reflects the source"
      ]
    }
  },
  {
    weekNumber: 2,
    hourNumber: 2,
    title: "End-of-Text Citations (Reference List)",
    theme: "Building APA 7th Reference Entries",
    behaviourChange: "Every in-text citation MUST have a matching reference entry. Check both before submitting.",
    learningGoals: [
      "Construct APA 7th reference entries for journal articles",
      "Identify the 4 required elements: Author, Date, Title, Source",
      "Apply formatting rules for italics, capitalization, and DOIs",
      "Match in-text citations to reference list entries"
    ],
    ciloLinks: ["CILO 2: Citation Conventions"],
    keyConcepts: [
      {
        term: "The 4 Core Elements",
        definition: "Every APA reference needs: (1) Author, (2) Date, (3) Title, (4) Source.",
        example: "Hong, X., Li, Y., Kuo, B., & An, S. (2022). Supporting schools... Education and Information Technologies, 27(3), 1-18.",
        tip: "Think: WHO said it, WHEN, WHAT is it called, WHERE to find it."
      },
      {
        term: "Author Format",
        definition: "Last name, First initial. Second initial. Use '&' before the last author.",
        example: "Andrejevic, M., & Selwyn, N. (2020).",
        tip: "Up to 20 authors: list all. 21+: first 19... last author."
      },
      {
        term: "Title Capitalization",
        definition: "Article titles: Sentence case (only first word and proper nouns capitalized). Journal names: Title Case.",
        example: "Article: 'Facial recognition technology in schools: Critical questions' | Journal: 'Learning, Media and Technology'",
        tip: "Sentence case for articles. Title Case for journals. Italicize journal names."
      },
      {
        term: "DOI Format",
        definition: "Digital Object Identifier — a permanent link. Format: https://doi.org/xxxxx",
        example: "https://doi.org/10.1080/17439884.2019.1644806",
        tip: "Always include DOI if available. Use https://doi.org/ format (not dx.doi.org)."
      },
      {
        term: "Volume & Issue",
        definition: "Volume number in italics, issue number in parentheses (not italicized).",
        example: "Education and Information Technologies, 27(3), 1-18.",
        tip: "Format: Journal Name, volume(issue), pages. Italicize journal name and volume."
      },
      {
        term: "Hanging Indent",
        definition: "The first line is flush left; subsequent lines are indented 0.5 inches.",
        example: "Hong, X., Li, Y., Kuo, B., & An, S. (2022). Supporting schools to use face\n        recognition systems... Education and Information Technologies, 27(3).",
        tip: "In Word: Ctrl+T for hanging indent. Essential for reference lists."
      }
    ],
    articles: [ARTICLE_A, ARTICLE_B],
    agenda: [
      { 
        title: "Part 1: The 4 Core Elements", 
        duration: "12 min", 
        activities: [
          "Learn the WHO-WHEN-WHAT-WHERE framework",
          "Identify elements in sample references",
          "Practice extracting information from articles"
        ] 
      },
      { 
        title: "Part 2: Author & Date Formatting", 
        duration: "10 min", 
        activities: [
          "Last name, Initial. format",
          "Multiple authors: commas and '&'",
          "Date in parentheses with period"
        ] 
      },
      { 
        title: "Part 3: Title & Source Formatting", 
        duration: "10 min", 
        activities: [
          "Sentence case vs Title Case",
          "Italics rules",
          "Volume, issue, and page numbers"
        ] 
      },
      { 
        title: "Part 4: DOIs and Online Sources", 
        duration: "8 min", 
        activities: [
          "When and how to include DOIs",
          "The https://doi.org/ format",
          "What to do if there's no DOI"
        ] 
      },
      { 
        title: "Part 5: AI Reference Builder", 
        duration: "10 min", 
        activities: [
          "Practice building reference entries",
          "Get feedback on formatting"
        ] 
      }
    ],
    tasks: [
      {
        id: "w2h2-mc1",
        type: "mc",
        question: "What are the 4 core elements of an APA reference entry?",
        options: [
          "Title, Abstract, Keywords, DOI",
          "Author, Date, Title, Source",
          "Author, Journal, Volume, Pages",
          "Name, Year, Publisher, URL"
        ],
        correctAnswer: 1,
        explanation: "The 4 core elements are: (1) Author - WHO, (2) Date - WHEN, (3) Title - WHAT, (4) Source - WHERE. Every reference must have these four parts.",
        skillFocus: ["apa-reference"]
      },
      {
        id: "w2h2-mc2",
        type: "mc",
        question: "Which author format is correct for APA 7th?",
        options: [
          "Hong, Xiaomei & Li, Y.",
          "Hong, X., Li, Y., Kuo, B., & An, S.",
          "X. Hong, Y. Li, B. Kuo, and S. An",
          "Hong X, Li Y, Kuo B, An S."
        ],
        correctAnswer: 1,
        explanation: "APA format: Last name, Initial. Use commas between authors, '&' before the final author. No 'and', no full first names.",
        skillFocus: ["apa-reference"]
      },
      {
        id: "w2h2-tf1",
        type: "true-false",
        question: "In APA references, article titles use Title Case (capitalizing major words).",
        correctAnswer: "false",
        explanation: "FALSE! Article titles use sentence case (only first word and proper nouns capitalized). Journal NAMES use Title Case. Example: Article: 'Facial recognition technology in schools' | Journal: 'Learning, Media and Technology'",
        skillFocus: ["apa-reference"]
      },
      {
        id: "w2h2-mc3",
        type: "mc",
        question: "Which journal/volume/issue format is correct?",
        options: [
          "Learning, Media and Technology (15), 2, 115-128",
          "Learning, Media and Technology, 15(2), 115-128.",
          "Learning, Media and Technology, Vol. 15, No. 2, pp. 115-128",
          "Learning Media Technology 15.2: 115-128"
        ],
        correctAnswer: 1,
        explanation: "Correct APA format: Journal Name (italicized), volume(issue), pages. Volume is italicized, issue is in parentheses (not italicized).",
        skillFocus: ["apa-reference"]
      },
      {
        id: "w2h2-fb1",
        type: "fill-blank",
        question: "In APA references, the journal name and _______ number are italicized.",
        correctAnswer: "volume",
        explanation: "Italicize the journal name AND the volume number. The issue number in parentheses is NOT italicized. Example: Education and Information Technologies, 27(3)",
        skillFocus: ["apa-reference"]
      },
      {
        id: "w2h2-mc4",
        type: "mc",
        question: "Which DOI format is correct for APA 7th?",
        options: [
          "DOI: 10.1080/17439884.2019.1644806",
          "doi:10.1080/17439884.2019.1644806",
          "https://doi.org/10.1080/17439884.2019.1644806",
          "Retrieved from dx.doi.org/10.1080/17439884.2019.1644806"
        ],
        correctAnswer: 2,
        explanation: "APA 7th uses the https://doi.org/ format as a clickable link. No 'DOI:' label, no 'Retrieved from', no 'dx.doi.org'.",
        skillFocus: ["apa-reference"]
      },
      {
        id: "w2h2-mc5",
        type: "mc",
        question: "Look at this reference. What's WRONG?\n\n'Hong, X., Li, Y., Kuo, B., & An, S. (2022). Supporting Schools To Use Face Recognition Systems. Education and information technologies, 27(3), 1-18.'",
        options: [
          "The author names are formatted incorrectly",
          "The article title should be in sentence case, and the journal name should be in Title Case",
          "The year should not be in parentheses",
          "The page numbers are formatted incorrectly"
        ],
        correctAnswer: 1,
        explanation: "The article title incorrectly uses Title Case ('Supporting Schools To Use'). It should be sentence case: 'Supporting schools to use'. Also, the journal name should be Title Case: 'Education and Information Technologies'.",
        skillFocus: ["apa-reference"]
      },
      {
        id: "w2h2-tf2",
        type: "true-false",
        question: "Every in-text citation must have a corresponding entry in the reference list.",
        correctAnswer: "true",
        explanation: "TRUE! This is a fundamental rule. If you cite it in the text, it must appear in the reference list. If it's in the reference list, it must be cited in the text.",
        skillFocus: ["apa-reference"]
      },
      {
        id: "w2h2-sentence1",
        type: "sentence",
        question: "What's wrong with this reference entry? Fix it.\n\n'Andrejevic, M. and Selwyn, N. (2020). Facial Recognition Technology In Schools: Critical Questions And Concerns, Learning, Media and Technology, 15(2).'",
        wordLimit: 60,
        hints: ["Check: & vs and", "Check: title capitalization", "Check: what's missing at the end?"],
        skillFocus: ["apa-reference"],
        modelAnswer: "Errors: (1) 'and' should be '&', (2) article title should be sentence case, (3) missing page numbers and DOI. Corrected: Andrejevic, M., & Selwyn, N. (2020). Facial recognition technology in schools: Critical questions and concerns. Learning, Media and Technology, 15(2), 115-128. https://doi.org/10.1080/17439884.2019.1644806"
      }
    ],
    writingTask: {
      prompt: "Create a complete APA 7th reference entry for this article:\n\nAuthors: Xiaomei Hong, Yue Li, Bor-Chen Kuo, and Shirong An\nYear: 2022\nTitle: Supporting schools to use face recognition systems: A continuance intention perspective of elementary school parents in China\nJournal: Education and Information Technologies\nVolume: 27, Issue: 3\nPages: 3679-3696\nDOI: 10.1007/s10639-022-10969-9",
      wordLimit: 100,
      modelAnswer: "Hong, X., Li, Y., Kuo, B., & An, S. (2022). Supporting schools to use face recognition systems: A continuance intention perspective of elementary school parents in China. Education and Information Technologies, 27(3), 3679-3696. https://doi.org/10.1007/s10639-022-10969-9",
      rubricCriteria: [
        "Authors correctly formatted (Last, Initial.)",
        "Date in parentheses with period after",
        "Article title in sentence case",
        "Journal name in Title Case and italicized",
        "Volume italicized, issue in parentheses",
        "DOI in https://doi.org/ format"
      ]
    }
  },
  // ============ WEEK 2 HOUR 3: PRACTICE, FEEDBACK & REFLECTION ============
  // NOTE: Content subject to revision based on learning progress
  {
    weekNumber: 2,
    hourNumber: 3,
    title: "Practice, Feedback & Reflection",
    theme: "Consolidating Citation Skills Through Guided Practice",
    behaviourChange: "Learning cycle: Practice → AI Feedback → Peer Discussion → Teacher Review → Reflect.",
    learningGoals: [
      "Consolidate in-text and end-of-text citation skills from Hours 1-2",
      "Receive multi-source feedback: AI, peers, and teacher",
      "Identify personal strengths and areas for improvement",
      "Develop reflective learning habits for continuous growth"
    ],
    ciloLinks: ["CILO 2: Citation Conventions", "CILO 5: Self-Directed Learning"],
    keyConcepts: [
      {
        term: "Citation Checklist",
        definition: "A systematic way to verify your citations are correct before submitting.",
        example: "✓ Every in-text citation has a reference entry | ✓ '&' inside, 'and' outside | ✓ et al. format correct | ✓ DOI included",
        tip: "Create your own checklist based on your common errors."
      },
      {
        term: "Multi-Source Feedback",
        definition: "Getting feedback from different sources: AI (immediate), peers (collaborative), teacher (expert).",
        example: "AI catches formatting errors → Peers share strategies → Teacher addresses deeper issues.",
        tip: "Each feedback source offers different insights. Value all three!"
      },
      {
        term: "Performance Summary",
        definition: "An overview of your practice attempts showing patterns, common errors, and progress.",
        example: "Summary: 7/10 MC correct, common error: '&' vs 'and' rule, strength: reference formatting.",
        tip: "Use summaries to identify what to focus on, not just what score you got."
      },
      {
        term: "Reflective Learning",
        definition: "Thinking about your learning process — what worked, what didn't, and what to do differently.",
        example: "'I kept confusing sentence case with Title Case. I'll make a visual reminder.'",
        tip: "Reflection turns experience into learning. Take 2 minutes to write down insights."
      }
    ],
    articles: [ARTICLE_A, ARTICLE_B],
    agenda: [
      // ============ PART A: PRACTICE ============
      { 
        title: "Part A: Practice Review & Extension", 
        duration: "20 min", 
        activities: [
          "📊 View summary of your Hour 1-2 practice attempts",
          "🔍 AI identifies common citation errors and patterns",
          "🎯 Additional targeted practice on weak areas",
          "💡 Get instant AI feedback on new citation attempts"
        ] 
      },
      // ============ PART B: FEEDBACK ============
      { 
        title: "Part B: Teacher & Peer Feedback", 
        duration: "15 min", 
        activities: [
          "👨‍🏫 [TEACHER]: Review individual student citation work",
          "👨‍🏫 [TEACHER]: Address common class citation issues",
          "👥 [PEER]: Exchange reference entries with a partner",
          "👥 [PEER]: Check each other's work using the citation checklist"
        ] 
      },
      // ============ PART C: REFLECTION ============
      { 
        title: "Part C: Reflection & Goal Setting", 
        duration: "15 min", 
        activities: [
          "📝 Reflect on feedback from AI, peers, and teacher",
          "🤔 What did each feedback source teach you?",
          "📈 Self-assess confidence on Week 2 citation skills",
          "🎯 Set specific, measurable goals for Week 3"
        ] 
      }
    ],
    tasks: [
      // ============ PART A: PRACTICE TASKS ============
      {
        id: "w2h3-practice-summary",
        type: "short-answer",
        question: "📊 PRACTICE SUMMARY (AI-generated)\n\n[PLACEHOLDER: This section will display a summary of the student's Hour 1-2 practice attempts, including:\n- In-text citation accuracy rate\n- Reference entry completeness\n- Common error patterns identified\n- Recommended focus areas]\n\nBased on your practice summary, what is ONE citation skill you want to improve today?",
        wordLimit: 30,
        hints: ["Be specific — 'citations' is too vague", "Good: 'I want to improve my DOI formatting'"],
        skillFocus: ["self-assessment"],
        modelAnswer: "I want to improve my reference list formatting, especially remembering to use sentence case for article titles and Title Case for journal names."
      },
      {
        id: "w2h3-mc1",
        type: "mc",
        question: "Quick Review: Which is correctly formatted for APA 7th in-text citation?",
        options: [
          "Hong et al (2022)",
          "Hong et al. (2022)",
          "Hong, et al., (2022)",
          "(Hong et. al, 2022)"
        ],
        correctAnswer: 1,
        explanation: "Correct: 'et al.' with period after 'al', no comma before year in narrative citations.",
        skillFocus: ["review", "apa-citation"]
      },
      {
        id: "w2h3-mc2",
        type: "mc",
        question: "Quick Review: In APA references, article titles should use:",
        options: [
          "ALL CAPS",
          "Title Case (Major Words Capitalized)",
          "Sentence case (only first word and proper nouns)",
          "lowercase (no capitals at all)"
        ],
        correctAnswer: 2,
        explanation: "Article titles: Sentence case. Journal names: Title Case. Remember: sentence case for the ARTICLE, Title Case for the JOURNAL.",
        skillFocus: ["review", "apa-reference"]
      },
      {
        id: "w2h3-practice1",
        type: "paragraph",
        question: "🎯 TARGETED PRACTICE\n\nWrite a sentence with an in-text citation, then create the matching reference entry for this source:\n\nAuthors: Mark Andrejevic and Neil Selwyn\nYear: 2020\nTitle: Facial recognition technology in schools: Critical questions and concerns\nJournal: Learning, Media and Technology\nVolume: 15, Issue: 2, Pages: 115-128\nDOI: 10.1080/17439884.2019.1644806",
        wordLimit: 150,
        hints: [
          "Choose author-prominent or information-prominent style",
          "Remember: & vs and, sentence case vs Title Case",
          "Include the DOI in https://doi.org/ format"
        ],
        skillFocus: ["apa-citation", "apa-reference"],
        modelAnswer: "In-text: Andrejevic and Selwyn (2020) argue that facial recognition technology raises significant concerns about student privacy in schools.\n\nReference: Andrejevic, M., & Selwyn, N. (2020). Facial recognition technology in schools: Critical questions and concerns. Learning, Media and Technology, 15(2), 115-128. https://doi.org/10.1080/17439884.2019.1644806"
      },
      
      // ============ PART B: FEEDBACK TASKS ============
      {
        id: "w2h3-teacher-instructions",
        type: "short-answer",
        question: "👨‍🏫 TEACHER FEEDBACK SECTION\n\n[INSTRUCTIONS FOR TEACHER]:\n1. Access the class dashboard to view student citation attempts\n2. Identify 2-3 common citation errors across the class\n3. Share screen and demonstrate correct formatting\n4. Provide individual written feedback on flagged submissions\n\n[FOR STUDENTS]: Write down ONE piece of feedback your teacher shared about citation formatting.",
        wordLimit: 50,
        hints: ["Listen carefully to the teacher's feedback", "Focus on feedback relevant to your own errors"],
        skillFocus: ["feedback-reception"],
        modelAnswer: "The teacher pointed out that many of us are forgetting to italicize the journal name AND volume number in references. Only the issue number in parentheses should NOT be italicized."
      },
      {
        id: "w2h3-peer-feedback",
        type: "paragraph",
        question: "👥 PEER FEEDBACK ACTIVITY\n\n1. Exchange your reference entry from the practice task with a partner\n2. Use this checklist to check their work:\n   ✓ Authors: Last, Initial. format with '&'?\n   ✓ Title: Sentence case?\n   ✓ Journal: Title Case and italicized?\n   ✓ Volume: Italicized? Issue in parentheses?\n   ✓ DOI: https://doi.org/ format?\n\nWrite the feedback you received AND one error you caught in your peer's work.",
        wordLimit: 80,
        hints: ["Be specific about what was correct and what needs fixing", "Learning to spot errors in others' work helps you avoid them yourself"],
        skillFocus: ["peer-feedback", "collaborative-learning"],
        modelAnswer: "My peer found that I forgot to italicize the volume number — I only italicized the journal name. In their reference, I noticed they used 'and' instead of '&' before the last author. We both learned that these small details matter in APA formatting."
      },
      
      // ============ PART C: REFLECTION TASKS ============
      {
        id: "w2h3-reflection-sources",
        type: "paragraph",
        question: "🤔 REFLECTION: Learning from Multiple Sources\n\nReflect on the feedback you received today:\n\n1. What did you learn from AI feedback?\n2. What did you learn from peer feedback?\n3. What did you learn from teacher feedback?\n4. Which source was most helpful for your citation skills? Why?",
        wordLimit: 120,
        hints: [
          "Each source offers different insights",
          "AI: immediate, technical | Peer: comparison, shared learning | Teacher: expert explanation"
        ],
        skillFocus: ["reflection", "metacognition"],
        modelAnswer: "From AI feedback, I learned I was consistently missing the period after 'et al.' — a pattern I hadn't noticed. From my peer, I learned a memory trick: 'And is for sentences, Ampersand is for parentheses.' From the teacher, I understood WHY sentence case is used for titles — it's less emphasis than the journal name. The AI was most helpful because it caught errors I made repeatedly without realizing."
      },
      {
        id: "w2h3-confidence-rating",
        type: "paragraph",
        question: "📈 SELF-ASSESSMENT\n\nRate your confidence (1-5) on each Week 2 skill:\n\n- Author-prominent citations: __/5\n- Information-prominent citations: __/5\n- '&' vs 'and' rule: __/5\n- 'et al.' formatting: __/5\n- Building reference entries: __/5\n- Matching in-text to references: __/5\n\nExplain your LOWEST rating — what makes this skill challenging?",
        wordLimit: 100,
        hints: ["Be honest — low ratings help you know where to focus", "Explain WHY it's challenging, not just that it is"],
        skillFocus: ["self-assessment"],
        modelAnswer: "Author-prominent: 4/5, Information-prominent: 4/5, '&' vs 'and': 5/5, 'et al.': 4/5, Reference entries: 2/5, Matching: 3/5.\n\nMy lowest is building reference entries (2/5). I find it challenging because there are so many small formatting rules — what to italicize, where to put periods, sentence case vs Title Case. I need a checklist I can follow step by step."
      },
      {
        id: "w2h3-goal-setting",
        type: "paragraph",
        question: "🎯 GOAL SETTING FOR WEEK 3\n\nWrite ONE specific, measurable goal for next week.\n\nA good goal:\n✓ Is specific (not 'improve citations' but 'master reference formatting')\n✓ Is measurable (includes a number or clear outcome)\n✓ Is achievable in one week\n\nExample: 'I will build 3 reference entries from scratch without looking at examples, then check against APA guidelines.'",
        wordLimit: 60,
        hints: ["Include a number or measurable outcome", "Focus on your weakest skill from the self-assessment"],
        skillFocus: ["goal-setting"],
        modelAnswer: "My goal for Week 3: Create a personal 'APA Reference Checklist' with the 6 key elements, then practice building one reference entry each day before class using the AI checker until I can do it without errors."
      }
    ],
    writingTask: {
      prompt: "FINAL REFLECTION: Week 2 Learning Journey\n\nWrite a short reflection (100-150 words) addressing:\n\n1. What was your biggest 'aha moment' about citations this week?\n2. How did feedback from AI, peers, and teacher each contribute to your learning?\n3. How will you use citation skills to prepare for the Academic Writing Quiz?",
      wordLimit: 150,
      modelAnswer: "My biggest 'aha moment' was realizing that article titles use sentence case but journal names use Title Case — I had been doing it backwards! The AI feedback instantly caught my formatting errors, which helped me see patterns I was missing. My peer taught me a memory trick for '&' vs 'and' that I'll never forget. The teacher explained the logic behind the rules, which makes them easier to remember.\n\nFor the AWQ, I'll create a citation checklist with all the rules I learned and use it to verify every citation before submitting. I'll also practice building reference entries using the AI checker until I can do it correctly without help.",
      rubricCriteria: [
        "Identifies a specific 'aha moment' about citations",
        "Reflects on value of each feedback source (AI, peer, teacher)",
        "Connects citation skills to AWQ preparation",
        "Shows genuine reflection, not generic statements"
      ]
    }
  }
];

// ============ WEEK 3 HOURS (Summarising & Synthesising) ============

export const week3Hours: HourData[] = [
  {
    weekNumber: 3,
    hourNumber: 1,
    title: "The Art of Summarising",
    theme: "Distilling Information Concisely",
    behaviourChange: "Always ask: 'Is this a CLAIM or EVIDENCE?' Include claims, skip evidence.",
    learningGoals: [
      "Apply the 5 steps of summarising",
      "Maintain neutrality - no personal opinions",
      "Keep claims, skip data and methodology",
      "Write concise summaries in your own words"
    ],
    ciloLinks: ["CILO 2: Summarising Skills"],
    keyConcepts: [
      {
        term: "Summarising",
        definition: "Condensing source material to its essential points while preserving meaning and maintaining neutrality.",
        example: "A 500-word excerpt → 50-word summary that captures the main claim without specific data.",
        tip: "Ask: What would I tell someone in 30 seconds about this paper?"
      },
      {
        term: "The 5 Steps of Summarising",
        definition: "(1) Read thoroughly, (2) Identify key points, (3) Eliminate extraneous information, (4) Use your own words, (5) Maintain the original tone.",
        example: "Step 3 is crucial: methodology details, specific statistics, and examples are 'extraneous'.",
        tip: "Steps 3-4 are where most students struggle. Practice these specifically."
      },
      {
        term: "Keep Claims, Skip Data",
        definition: "Include what the author ARGUES; exclude how they PROVED it.",
        example: "Keep: 'Parents accept FRT despite privacy concerns' | Skip: 'The score was 3.919 out of 5.000'",
        tip: "If it has numbers, methodology terms, or specific examples - probably skip it."
      },
      {
        term: "Neutrality Principle",
        definition: "A summary presents the author's views, NOT your opinion about them.",
        example: "❌ 'Hong et al. correctly found...' ✓ 'Hong et al. found...'",
        tip: "Avoid evaluative words: 'correctly', 'unfortunately', 'importantly', 'interestingly'"
      }
    ],
    articles: [ARTICLE_A],
    agenda: [
      { 
        title: "5 Steps of Summarising", 
        duration: "12 min", 
        activities: [
          "Learn the 5-step process",
          "Focus on Step 3: eliminating extraneous info",
          "Practice identifying what to keep vs. skip"
        ] 
      },
      { 
        title: "Keep Claims, Skip Data Workshop", 
        duration: "12 min", 
        activities: [
          "Sort sentences into Claims vs. Data",
          "Practice condensing data-heavy paragraphs",
          "Apply to Hong et al. excerpt"
        ] 
      },
      { 
        title: "Neutrality Practice", 
        duration: "8 min", 
        activities: [
          "Identify biased vs. neutral language",
          "Revise biased summaries"
        ] 
      },
      { 
        title: "Writing Task", 
        duration: "12 min", 
        activities: [
          "Summarise Article A in 50 words (claims only)"
        ] 
      }
    ],
    tasks: [
      {
        id: "w3h1-demo1",
        type: "mc",
        question: "Read: 'The average score of parents' perceived value is 3.919, which is much higher than the neutral level (3.000), indicating that the parents generally recognize the value of face recognition systems.' For your summary, you should write:",
        options: [
          "'The perceived value score was 3.919, higher than the neutral 3.000'",
          "'Parents generally recognize the value of face recognition systems'",
          "'Confirmatory factor analysis showed significant results'",
          "'The score indicates parents recognize value'"
        ],
        correctAnswer: 1,
        explanation: "Keep the CLAIM ('parents recognize the value'), skip the DATA (3.919, 3.000). Option B captures the meaning without unnecessary statistics.",
        skillFocus: ["summarising"],
        demoSteps: [
          { title: "Step 1: Find the claim", content: "What is the author's CONCLUSION?", highlight: "'parents generally recognize the value'" },
          { title: "Step 2: Identify the data", content: "What are the numbers/evidence?", highlight: "'3.919, 3.000' = DATA to skip" },
          { title: "Step 3: Write the summary", content: "Include claim, exclude data", highlight: "Option B is correct" }
        ]
      },
      {
        id: "w3h1-mc1",
        type: "mc",
        question: "Which of these should be EXCLUDED from a summary of Hong et al. (2022)?",
        options: [
          "Parents support FRT despite privacy concerns",
          "380 valid responses were collected through questionnaires",
          "Practical benefits outweigh perceived risks",
          "The study was conducted in China"
        ],
        correctAnswer: 1,
        explanation: "Methodology details ('380 responses', 'questionnaires') should be excluded. Keep claims (A, C) and essential context (D if relevant).",
        skillFocus: ["summarising"]
      },
      {
        id: "w3h1-tf1",
        type: "true-false",
        question: "A good summary includes your evaluation of whether the author is correct.",
        correctAnswer: "false",
        explanation: "Summaries must be NEUTRAL. Present what the author says, not whether you agree. Save evaluation for your own argument sections.",
        skillFocus: ["summarising"]
      },
      {
        id: "w3h1-fb1",
        type: "fill-blank",
        question: "When summarising, you keep the _______ but exclude the evidence and examples.",
        correctAnswer: "claims",
        explanation: "Claims are the main arguments/conclusions. Evidence (data, quotes, examples) supports claims but is too detailed for summaries.",
        skillFocus: ["summarising"]
      },
      {
        id: "w3h1-mc2",
        type: "mc",
        question: "Which summary is BIASED (breaks neutrality)?",
        options: [
          "Hong et al. (2022) found that parents accept FRT.",
          "Hong et al. (2022) correctly demonstrate that parents should accept FRT.",
          "According to Hong et al. (2022), parents recognize the value of FRT.",
          "Hong et al. (2022) report that parents support FRT despite concerns."
        ],
        correctAnswer: 1,
        explanation: "'Correctly' and 'should' reveal the writer's opinion. Summaries should neutrally present what authors say, not evaluate whether they're right.",
        skillFocus: ["summarising"]
      },
      {
        id: "w3h1-paragraph1",
        type: "paragraph",
        question: "Summarise this in 40 words (claims only, no data): 'Hong et al. (2022) surveyed 500 parents across 10 schools using questionnaires distributed via email. The response rate was 67%. Results showed that 78% of parents supported FRT, citing safety (3.865 mean score) and convenience (3.742 mean score) as key factors.'",
        wordLimit: 50,
        hints: ["Skip: 500 parents, 10 schools, 67%, 78%, 3.865, 3.742", "Keep: parents support FRT, reasons are safety and convenience"],
        skillFocus: ["summarising"],
        modelAnswer: "Hong et al. (2022) found that parents generally support facial recognition technology in schools, primarily due to perceived benefits in safety and convenience. Despite some concerns, parents value the practical advantages the technology offers.",
        examples: [
          {
            original: "78% of parents supported FRT with a mean score of 3.865 for safety",
            analysis: "Too much data! Skip percentages and mean scores."
          },
          {
            original: "Parents support FRT because they value its safety and convenience benefits",
            analysis: "Good! Captures the claim without specific numbers."
          }
        ]
      }
    ],
    writingTask: {
      prompt: "Summarise Article A's (Hong et al., 2022) main argument in exactly 50 words. Focus on claims, not data. Include a citation.",
      wordLimit: 55,
      modelAnswer: "Hong et al. (2022) found that despite privacy concerns, parents in China generally support facial recognition technology in schools. Their acceptance stems from perceived practical benefits including enhanced safety and convenience. The study suggests parents prioritize these advantages over potential risks when evaluating school technology adoption.",
      rubricCriteria: [
        "Main claim captured accurately",
        "No specific data/statistics included",
        "Neutral tone maintained",
        "Approximately 50 words",
        "Proper citation included"
      ]
    }
  },
  {
    weekNumber: 3,
    hourNumber: 2,
    title: "Synthesis Skills",
    theme: "Connecting Ideas from Multiple Sources",
    behaviourChange: "Never write 'Article A says X. Article B says Y.' Always show the RELATIONSHIP.",
    learningGoals: [
      "Distinguish synthesis from listing",
      "Identify relationships: agreement, contrast, elaboration",
      "Use synthesis connectives effectively",
      "Create integrated paragraphs from multiple sources"
    ],
    ciloLinks: ["CILO 2: Synthesising Skills", "CILO 3: Argument Construction"],
    keyConcepts: [
      {
        term: "Synthesis",
        definition: "Combining ideas from multiple sources to show relationships (agreement, contrast, elaboration) - NOT just listing them separately.",
        example: "✓ 'While Hong et al. (2022) support FRT, Andrejevic and Selwyn (2020) challenge this optimism...'",
        tip: "The key word is RELATIONSHIP. How do the sources connect?"
      },
      {
        term: "Listing (AVOID!)",
        definition: "Presenting sources one after another without showing how they connect.",
        example: "❌ 'Article A says parents support FRT. Article B says FRT is problematic.'",
        tip: "If you could swap the order of sentences and nothing changes, you're listing, not synthesising."
      },
      {
        term: "Synthesis Relationships",
        definition: "Agreement (sources support each other), Contrast (sources disagree), Elaboration (one extends the other).",
        example: "Agreement: 'Both Hong et al. and Wang (2020) emphasize...' | Contrast: 'While Hong et al. support FRT, Andrejevic and Selwyn challenge...'",
        tip: "Most AWQ synthesis will be CONTRAST - the articles usually have opposing views."
      },
      {
        term: "Contrast Connectives",
        definition: "Words that signal opposing viewpoints: however, conversely, in contrast, while, whereas, on the other hand, nevertheless.",
        example: "'Hong et al. support FRT. However, Andrejevic and Selwyn raise serious concerns.'",
        tip: "These connectives are your best friends for synthesis. Learn 4-5 and use them."
      }
    ],
    articles: [ARTICLE_A, ARTICLE_B],
    agenda: [
      { 
        title: "Listing vs. Synthesis Demo", 
        duration: "12 min", 
        activities: [
          "Compare listing vs. synthesis examples",
          "Identify what makes synthesis effective",
          "Practice spotting the difference"
        ] 
      },
      { 
        title: "Synthesis Relationships", 
        duration: "10 min", 
        activities: [
          "Learn: Agreement, Contrast, Elaboration",
          "Apply to Hong et al. vs. Andrejevic & Selwyn"
        ] 
      },
      { 
        title: "Connectives Practice", 
        duration: "10 min", 
        activities: [
          "Learn key contrast connectives",
          "Practice combining sources"
        ] 
      },
      { 
        title: "Writing Task", 
        duration: "12 min", 
        activities: [
          "Write a synthesised topic sentence connecting both sources"
        ] 
      }
    ],
    tasks: [
      {
        id: "w3h2-demo1",
        type: "mc",
        question: "Which example shows SYNTHESIS rather than listing?",
        options: [
          "Article A supports FRT. Article B is against FRT.",
          "While Hong et al. (2022) found parental support for FRT, Andrejevic and Selwyn (2020) challenge this optimism by highlighting consent issues.",
          "Hong et al. studied parents. Andrejevic and Selwyn studied ethics.",
          "The first article is positive. The second article is negative."
        ],
        correctAnswer: 1,
        explanation: "Option B CONNECTS the sources using 'While... challenge this optimism by...' It shows the RELATIONSHIP (contrast). The other options just list facts separately.",
        skillFocus: ["synthesising"],
        demoSteps: [
          { title: "Step 1: Look for connectives", content: "Are there linking words?", highlight: "'While... challenge this...' = contrast connective" },
          { title: "Step 2: Check for relationship", content: "Does it show how sources CONNECT?", highlight: "Yes - shows one 'challenges' the other" },
          { title: "Step 3: Verify integration", content: "Are sources in the SAME sentence?", highlight: "Yes - both sources integrated in one idea" }
        ]
      },
      {
        id: "w3h2-tf1",
        type: "true-false",
        question: "Synthesis means summarising each source in separate paragraphs.",
        correctAnswer: "false",
        explanation: "Synthesis means INTEGRATING sources to show relationships. Separate paragraphs for each source is LISTING. For AWQ, blend sources within paragraphs.",
        skillFocus: ["synthesising"]
      },
      {
        id: "w3h2-fb1",
        type: "fill-blank",
        question: "Connectives like 'however', 'conversely', and 'in contrast' signal a _______ relationship between sources.",
        correctAnswer: "contrast",
        explanation: "These connectives tell readers that the next idea will OPPOSE or DIFFER from the previous one. Essential for showing disagreement between sources.",
        skillFocus: ["synthesising"]
      },
      {
        id: "w3h2-mc1",
        type: "mc",
        question: "What is the relationship between Hong et al. (2022) and Andrejevic & Selwyn (2020) on FRT in schools?",
        options: [
          "Agreement - both support FRT",
          "Elaboration - one extends the other's argument",
          "Contrast - they have opposing views on FRT",
          "Neither relates to the other"
        ],
        correctAnswer: 2,
        explanation: "CONTRAST: Hong et al. present parental support for FRT; Andrejevic & Selwyn raise critical concerns. Same topic, opposite stances.",
        skillFocus: ["synthesising"]
      },
      {
        id: "w3h2-sentence1",
        type: "sentence",
        question: "Combine these into ONE synthesised sentence: 'Hong et al. (2022) found that parents support FRT.' + 'Andrejevic & Selwyn (2020) argue that FRT raises consent concerns.'",
        wordLimit: 40,
        hints: ["Use a contrast connective: while, whereas, however", "Show the RELATIONSHIP between the views"],
        skillFocus: ["synthesising"],
        modelAnswer: "While Hong et al. (2022) found parental support for FRT in schools, Andrejevic and Selwyn (2020) raise concerns about the technology's impact on student consent.",
        examples: [
          {
            original: "Hong et al. (2022) support FRT. However, Andrejevic and Selwyn (2020) are against it.",
            analysis: "Better than listing, but too simple. Try integrating more fully."
          },
          {
            original: "The debate surrounding FRT reveals tension between practical benefits valued by parents (Hong et al., 2022) and ethical concerns about consent (Andrejevic & Selwyn, 2020).",
            analysis: "Excellent! Shows the RELATIONSHIP (tension/debate) and integrates both sources meaningfully."
          }
        ]
      },
      {
        id: "w3h2-paragraph1",
        type: "paragraph",
        question: "Write a synthesised paragraph (3-4 sentences) comparing Hong et al. (2022) and Andrejevic & Selwyn (2020) on FRT. Show the contrast relationship and use appropriate connectives.",
        wordLimit: 80,
        hints: [
          "Start with what they have in common (both discuss FRT in schools)",
          "Show the contrast (different stances)",
          "Use connectives: while, however, conversely, in contrast"
        ],
        skillFocus: ["synthesising"],
        modelAnswer: "Both Hong et al. (2022) and Andrejevic and Selwyn (2020) examine facial recognition technology in educational settings, but reach contrasting conclusions. While Hong et al. demonstrate that parents generally accept FRT due to its perceived practical benefits, Andrejevic and Selwyn challenge this optimism by foregrounding concerns about student consent and inescapable surveillance. This debate highlights the fundamental tension between security benefits and ethical considerations in school technology adoption."
      }
    ],
    writingTask: {
      prompt: "Write a synthesised topic sentence (25-35 words) that captures the CONTRAST between Hong et al. (2022) and Andrejevic & Selwyn (2020) on FRT in schools.",
      wordLimit: 40,
      modelAnswer: "While Hong et al. (2022) demonstrate parental acceptance of FRT for its practical benefits, Andrejevic and Selwyn (2020) challenge this perspective by foregrounding fundamental concerns about student consent and surveillance.",
      rubricCriteria: [
        "Both sources cited correctly",
        "Contrast relationship clearly shown",
        "Uses appropriate connective",
        "Single, coherent sentence",
        "Captures the key difference between sources"
      ]
    }
  },
  {
    weekNumber: 3,
    hourNumber: 3,
    title: "AWQ Structure Prep",
    theme: "Mastering the 3-Paragraph Format",
    behaviourChange: "AWQ = Introduction (background + thesis) → Body (synthesised summary) → Conclusion (implications).",
    learningGoals: [
      "Master the 3-paragraph AWQ structure",
      "Write effective thesis statements",
      "Build synthesised body paragraphs",
      "Apply time management (10-20-20-10)"
    ],
    ciloLinks: ["CILO 2: Summary Structure", "CILO 3: Drafting Skills"],
    keyConcepts: [
      {
        term: "AWQ 3-Paragraph Structure",
        definition: "Introduction (background + thesis) → Body (synthesised summary of both sources) → Conclusion (implications).",
        example: "~50 words intro, ~200 words body, ~50 words conclusion = 300 words total.",
        tip: "The body is where most points are - focus your time there."
      },
      {
        term: "Thesis Statement",
        definition: "A sentence that tells the reader what your summary will cover and how the sources relate.",
        example: "'This summary examines contrasting perspectives on FRT in schools, from parental acceptance (Hong et al., 2022) to ethical concerns (Andrejevic & Selwyn, 2020).'",
        tip: "Preview BOTH sources and their relationship in your thesis."
      },
      {
        term: "Body Paragraph Topic Sentence",
        definition: "Opens the body paragraph by stating the main point - usually the synthesis of both sources.",
        example: "'The debate surrounding FRT in schools fundamentally concerns the tension between practical benefits and ethical risks.'",
        tip: "Don't start with one author - start with the SYNTHESISED point."
      },
      {
        term: "AWQ Time Management",
        definition: "10 minutes planning → 20 minutes body → 20 minutes intro/conclusion → 10 minutes review.",
        example: "50 minutes total. Spend most time on body (highest marks). Review for citation errors.",
        tip: "PLAN before writing. A 2-minute outline saves 10 minutes of confusion."
      }
    ],
    articles: [ARTICLE_A, ARTICLE_B],
    agenda: [
      { 
        title: "AWQ Structure Overview", 
        duration: "10 min", 
        activities: [
          "Learn the 3-paragraph model",
          "Examine model AWQ response",
          "Understand marking criteria"
        ] 
      },
      { 
        title: "Thesis Statements", 
        duration: "10 min", 
        activities: [
          "Formula: Context + Preview of sources",
          "Practice writing thesis statements"
        ] 
      },
      { 
        title: "Body Paragraph Structure", 
        duration: "10 min", 
        activities: [
          "Topic sentence → Synthesised summary → Supporting points",
          "Analyze model body paragraph"
        ] 
      },
      { 
        title: "Writing Task", 
        duration: "15 min", 
        activities: [
          "Draft an AWQ introduction paragraph"
        ] 
      }
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
        explanation: "The intro provides CONTEXT (what is FRT?) and a THESIS (what will this summary cover?). Save detailed summary for the body.",
        skillFocus: ["awq-structure"]
      },
      {
        id: "w3h3-tf1",
        type: "true-false",
        question: "The body paragraph of an AWQ should synthesise the sources rather than summarise them separately.",
        correctAnswer: "true",
        explanation: "Correct! Synthesis (showing relationships) is what distinguishes good AWQ responses from weak ones. Blend sources, don't list them.",
        skillFocus: ["awq-structure", "synthesising"]
      },
      {
        id: "w3h3-fb1",
        type: "fill-blank",
        question: "A thesis statement provides context and _______ the content of the summary.",
        correctAnswer: "previews",
        explanation: "The thesis tells readers what to expect - which sources you'll discuss and how they relate.",
        skillFocus: ["awq-structure"]
      },
      {
        id: "w3h3-mc2",
        type: "mc",
        question: "What is the recommended time allocation for the AWQ?",
        options: [
          "5-40-5 (mostly body writing)",
          "10-20-20-10 (planning, body, intro/conclusion, review)",
          "Equal time for all sections",
          "No planning needed - just start writing"
        ],
        correctAnswer: 1,
        explanation: "10 min planning, 20 min body (most important), 20 min intro/conclusion, 10 min review. Planning prevents wasted time on disorganized writing.",
        skillFocus: ["time-management"]
      },
      {
        id: "w3h3-sentence1",
        type: "sentence",
        question: "Write a thesis statement for an AWQ on FRT in schools. Preview BOTH sources (Hong et al., 2022; Andrejevic & Selwyn, 2020) and their relationship.",
        wordLimit: 40,
        hints: ["Context + Preview", "Show the contrast between sources", "Name both sources"],
        skillFocus: ["awq-structure"],
        modelAnswer: "This summary examines contrasting perspectives on FRT in schools, comparing parental acceptance of the technology (Hong et al., 2022) with critical concerns about student consent and surveillance (Andrejevic & Selwyn, 2020).",
        examples: [
          {
            original: "This essay will discuss two articles about FRT.",
            analysis: "Too vague! Name the sources and show their relationship."
          },
          {
            original: "This summary examines the debate between parental acceptance (Hong et al., 2022) and ethical concerns (Andrejevic & Selwyn, 2020) regarding FRT implementation in schools.",
            analysis: "Excellent! Previews both sources, shows contrast, indicates topic."
          }
        ]
      },
      {
        id: "w3h3-paragraph1",
        type: "paragraph",
        question: "Write an AWQ introduction paragraph (60-80 words) including: (1) Background on FRT in schools, (2) A thesis statement that previews both sources and their relationship.",
        wordLimit: 85,
        hints: [
          "Start broad: 'Facial recognition technology is increasingly...'",
          "Narrow to schools",
          "Thesis: 'This summary examines contrasting perspectives from...'"
        ],
        skillFocus: ["awq-structure", "thesis-writing"],
        modelAnswer: "Facial recognition technology (FRT) is increasingly being adopted in educational settings for purposes such as security and attendance monitoring. However, its implementation in schools has sparked debate among researchers and stakeholders. This summary examines contrasting perspectives on FRT adoption, comparing parental acceptance of the technology (Hong et al., 2022) with critical concerns about student consent and the normalisation of surveillance (Andrejevic & Selwyn, 2020)."
      }
    ],
    writingTask: {
      prompt: "Draft a complete AWQ introduction paragraph (60-80 words). Include: (1) Background context on FRT in schools, (2) A thesis statement that previews the contrasting perspectives of Hong et al. (2022) and Andrejevic & Selwyn (2020).",
      wordLimit: 85,
      modelAnswer: "Facial recognition technology (FRT) is increasingly incorporated in schools for functions including security and automated registration. This summary reports key arguments regarding FRT adoption in educational settings. While Hong et al. (2022) examine parental acceptance of this technology, focusing on perceived practical benefits, Andrejevic and Selwyn (2020) raise critical concerns about student consent and the inescapable nature of facial surveillance.",
      rubricCriteria: [
        "Background context provided",
        "Both sources mentioned",
        "Thesis previews content",
        "Relationship between sources indicated",
        "60-80 words"
      ]
    }
  }
];

// ============ WEEK 4 HOURS (Intensive Practice) ============

export const week4Hours: HourData[] = [
  {
    weekNumber: 4,
    hourNumber: 1,
    title: "AI Agent Demo",
    theme: "Learning with AI Agents",
    behaviourChange: "AI agents can help you prepare systematically by organizing materials and creating practice tasks.",
    learningGoals: [
      "Understand how AI agents work with files and context",
      "See how to use AI for AWQ preparation",
      "Explore the demo materials on GitHub"
    ],
    ciloLinks: ["CILO 5: AI as Learning Partner"],
    keyConcepts: [
      {
        term: "AI Agent",
        definition: "An AI system that can read files, access context, and perform multi-step tasks to help you achieve goals.",
        example: "An agent can read a review article, extract the reference list, and identify which articles might appear in your quiz.",
        tip: "Think of AI agents as research assistants that can process large amounts of information quickly."
      },
      {
        term: "Context Window",
        definition: "The amount of information an AI can 'remember' during a conversation. More context = better responses.",
        example: "Sharing the context.md file gives the agent crucial info: quiz date, topic, source materials.",
        tip: "Always provide relevant context when working with AI agents."
      }
    ],
    articles: [],
    agenda: [
      { 
        title: "Class Roleplay Demo", 
        duration: "15 min", 
        activities: [
          "Watch the Poe chat roleplay below",
          "Dr. Wang explains AI agents to John & Karen",
          "See how context files guide agent behavior"
        ] 
      },
      { 
        title: "GitHub Materials Walkthrough", 
        duration: "15 min", 
        activities: [
          "Explore the AIagentDemo folder",
          "Review context.md, taskOrientation.md",
          "Understand the file structure"
        ] 
      },
      { 
        title: "Interactive Practice", 
        duration: "14 min", 
        activities: [
          "Try the interactive writing guide",
          "Practice with mock AWQ materials"
        ] 
      }
    ],
    integratedSections: [
      {
        id: "w4h1-intro",
        title: "Introduction: AI Agents for AWQ Prep",
        subsections: [
          {
            title: "What is an AI Agent?",
            content: "An AI agent is more than just a chatbot - it can read files, follow multi-step instructions, and help you work through complex tasks systematically. In this demo, Dr. Simon Wang shows students John and Karen how AI agents can help prepare for the Academic Writing Quiz (AWQ)."
          },
          {
            title: "Key Takeaway",
            content: "AI agents work best when you give them clear context. The 'context.md' file tells the agent everything it needs: quiz date, topic, available materials. With this information, the agent can help extract references, create study guides, and generate practice tasks."
          }
        ]
      },
      {
        id: "w4h1-chat-demo",
        title: "Part 1: Class Roleplay Demo",
        subsections: [
          {
            title: "About This Conversation",
            content: "This roleplay demonstrates how teachers can use AI agents for AWQ preparation. Dr. Simon Wang explains the concept to two students: John (highly motivated) and Karen (a bit laid-back)."
          }
        ],
        externalLink: {
          url: "https://poe.com/s/e4bKuU0Pg2KNCWZDzHhu",
          label: "View full chat on Poe.com"
        },
        chatHistory: [
          { role: "teacher", content: "Hello section 53 students! Great news - we now have more info about the Academic Writing Quiz. Check out the email from the course coordinator." },
          { role: "student-john", action: "_leans forward eagerly_", content: "Dr. Wang! I've been reviewing the syllabus. Will it focus more on grammar or reading comprehension?" },
          { role: "student-karen", action: "_glances up from her phone_", content: "Oh, the exam's coming up already? When is it again?" },
          { role: "teacher", content: "The AWQ is in Week 6. You have 50 minutes to summarise, paraphrase, and synthesise TWO journal excerpts about 'The impact of AI chatbots and companion apps on humans' in NO MORE THAN 300 words." },
          { role: "student-john", content: "So it's closed-book, 50 minutes, 300 words max. We need to synthesise two excerpts. Dr. Wang, should I read all the references in the Ho et al. review article?" },
          { role: "student-karen", content: "Wait, we can't use our phones or notes at all? What's the difference between summarising and synthesising again?" },
          { role: "student-john", content: "Summarising is condensing one source's main ideas. Synthesising is combining ideas from multiple sources and showing how they connect." },
          { role: "teacher", content: "That's right! Now, I want to show you how AI agents can help with the grunt work. I've prepared a context.md file that briefs the AI agent on our task..." },
          { role: "student-john", action: "_eyes light up_", content: "So the agent can read the Ho et al. review and help identify which references might appear as excerpts? That's clever!" },
          { role: "student-karen", content: "Wait, so there's an AI agent that can read files on your computer? Is it like ChatGPT but with file access?" },
          { role: "teacher", content: "Yes! Instead of chatting back-and-forth, we write instructions in files like context.md. The agent reads the file path, finds more paths and instructions inside, and processes everything systematically." },
          { role: "student-john", content: "So it's like programming the agent through markdown files! The files become both the data and the instructions. That's why it can handle complex multi-step tasks." },
          { role: "student-karen", action: "_looks impressed_", content: "And because it's all in files, we can reuse and modify them. So the agent is like... a research assistant who reads everything first and tells you what's important?" },
          { role: "teacher", content: "Exactly! The agent created focusReading.md with the top 20 most likely articles for the quiz, plus taskOrientation.md with 10 key facts about the AWQ. All available on GitHub." },
          { role: "student-john", content: "This is really powerful! The log shows the agent's reasoning at each step. Can we set this up ourselves?" },
          { role: "teacher", content: "Yes! Register for GitHub with your HKBU email, apply for student education benefits, then fork my repo. You can run it all in the browser using Codespaces - no local setup needed!" }
        ]
      },
      {
        id: "w4h1-github-setup",
        title: "Part 2: Set Up Your GitHub Account",
        subsections: [
          {
            title: "Step 1: Create GitHub Account",
            content: "**Sign up using your HKBU email address** at [github.com](https://github.com/signup). Using your university email is essential for the next step - getting free student benefits including Copilot access."
          },
          {
            title: "Step 2: Apply for Student Benefits",
            content: "GitHub offers FREE premium features for students! Apply at [GitHub Education](https://docs.github.com/en/education/about-github-education/github-education-for-students/apply-to-github-education-as-a-student). You'll get **GitHub Copilot free**, unlimited private repos, and more. This usually takes 1-7 days to approve."
          },
          {
            title: "Step 3: Fork the Repository",
            content: "Go to [tesolchina/genAI2026](https://github.com/tesolchina/genAI2026) and click the **Fork** button (top right). This creates your own copy of the repository. Direct link: [Fork this repo](https://github.com/tesolchina/genAI2026/fork)"
          },
          {
            title: "Step 4: Open Codespace",
            content: "After forking, click the green **Code** button on YOUR forked repo, then select **Codespaces** → **Create codespace on main**. This opens a VS Code environment in your browser - no installation needed! You can now talk to the AI agent directly."
          }
        ],
        externalLink: {
          url: "https://github.com/tesolchina/genAI2026/tree/main",
          label: "View repository on GitHub"
        }
      },
      {
        id: "w4h1-materials",
        title: "Part 3: Demo Materials Walkthrough",
        subsections: [
          {
            title: "Repository Overview",
            content: "The demo materials are available on GitHub. This repository contains context files, extracted references, focused reading materials, and interactive practice tools."
          },
          {
            title: "Key Files",
            content: "**context.md** - Background info for the AI agent (quiz date, topic, materials)\\n\\n**Ho2025.md** - The review article with all references\\n\\n**extractFilterRef.md** - Instructions for extracting relevant references\\n\\n**taskOrientation.md** - 10 key facts about the AWQ with sources\\n\\n**focusReading.md** - Focused reading strategy\\n\\n**StudyGuideAWQ.md** - Comprehensive study guide"
          },
          {
            title: "Interactive Tools",
            content: "The **teacherJumpIntoWater** folder contains an interactive writing guide game that walks you through the AWQ writing process step by step."
          }
        ],
        externalLink: {
          url: "https://github.com/tesolchina/genAI2026/tree/main/courses/UCLC1008/AIagentDemo",
          label: "Browse repository on GitHub"
        }
      },
      {
        id: "w4h1-practice",
        title: "Part 4: Try the Interactive Guide",
        subsections: [
          {
            title: "Interactive Writing Guide",
            content: "The interactive writing guide game takes you through a 12-step AWQ writing process with progress tracking, citation references, and word count monitoring."
          }
        ],
        iframeEmbed: {
          url: "https://tesolchina.github.io/genAI2026/courses/UCLC1008/AIagentDemo/teacherJumpIntoWater/guide_game_FRT.html",
          title: "Interactive AWQ Writing Guide",
          height: 700
        }
      }
    ],
    tasks: []
  },
  {
    weekNumber: 4,
    hourNumber: 2,
    title: "AI-Guided Writing Game",
    theme: "Step-by-Step AWQ Practice with AI Feedback",
    behaviourChange: "Get feedback at EACH step, not just at the end. Learning happens during the process.",
    learningGoals: [
      "Practice AWQ writing with step-by-step AI guidance",
      "Receive immediate feedback on introduction, body, and conclusion",
      "Learn to synthesise sources through guided practice",
      "Build confidence for the real AWQ"
    ],
    ciloLinks: ["CILO 2: All Skills", "CILO 3: Drafting", "CILO 5: AI as Learning Partner"],
    keyConcepts: [],
    agenda: [
      { 
        title: "Read & Understand", 
        duration: "5 min", 
        activities: [
          "Read both article excerpts",
          "Identify main argument of each",
          "Chat with AI tutor for clarification"
        ] 
      },
      { 
        title: "Plan Your Response", 
        duration: "5 min", 
        activities: [
          "List 2-3 key points from each source",
          "Identify relationships (agree/contrast/elaborate)",
          "Get AI feedback on your plan"
        ] 
      },
      { 
        title: "Write with AI Guidance", 
        duration: "25 min", 
        activities: [
          "Write introduction (2-3 sentences) → Get feedback",
          "Write body paragraph (4-6 sentences) → Get feedback",
          "Write conclusion (1-2 sentences) → Get feedback"
        ] 
      },
      { 
        title: "Final Review", 
        duration: "10 min", 
        activities: [
          "Get comprehensive AI review",
          "Check word count and citations",
          "Receive score on 5 AWQ criteria"
        ] 
      }
    ],
    tasks: []
  },
  {
    weekNumber: 4,
    hourNumber: 3,
    title: "OCR Writing Review",
    theme: "AI-Assisted Handwriting Analysis",
    behaviourChange: "Get feedback on your handwritten work immediately - no need to retype!",
    learningGoals: [
      "Upload a photo of your handwritten AWQ summary",
      "Review and correct OCR-extracted text",
      "Receive AI feedback based on teacher's criteria",
      "Discuss improvements with the AI tutor"
    ],
    ciloLinks: ["CILO 3: Revision Skills", "CILO 5: AI as Learning Partner"],
    keyConcepts: [
      {
        term: "OCR (Optical Character Recognition)",
        definition: "Technology that converts images of text into editable digital text.",
        example: "Upload a photo of your handwritten notes and the AI extracts the text for review.",
        tip: "Take clear, well-lit photos for best results. Ensure your handwriting is reasonably neat."
      },
      {
        term: "Self-Correction",
        definition: "The skill of identifying and fixing your own mistakes before submitting work.",
        example: "After OCR extraction, check for typos, missing words, and formatting errors.",
        tip: "Read the extracted text aloud to catch errors the OCR might have introduced."
      },
      {
        term: "Beta Platform Notice",
        definition: "This platform is in beta testing mode. Some features may not work perfectly.",
        example: "If OCR fails to extract your handwriting, you can manually type your summary instead.",
        tip: "Take screenshots of your work regularly to save your progress. We apologize for any inconvenience!"
      }
    ],
    articles: [ARTICLE_A, ARTICLE_B],
    agenda: [
      { 
        title: "Important Notes", 
        duration: "2 min", 
        activities: [
          "⚠️ The actual test paper will be provided in class",
          "🧪 This platform is in BETA mode - some features may have issues",
          "💾 Take screenshots to save your work as backup",
          "✍️ If OCR doesn't work, type your summary manually"
        ] 
      },
      { 
        title: "Upload & Extract", 
        duration: "5 min", 
        activities: [
          "Take a clear photo of your handwritten summary",
          "Upload to the OCR tool",
          "Review extracted text",
          "If OCR fails: manually type your summary"
        ] 
      },
      { 
        title: "Edit & Correct", 
        duration: "10 min", 
        activities: [
          "Fix any OCR errors",
          "Correct spelling and grammar",
          "Ensure proper citations are included"
        ] 
      },
      { 
        title: "AI Review", 
        duration: "15 min", 
        activities: [
          "Get comprehensive feedback on your summary",
          "Ask follow-up questions",
          "Identify areas for improvement"
        ] 
      },
      { 
        title: "Revision", 
        duration: "15 min", 
        activities: [
          "Apply feedback to improve your work",
          "Re-submit for updated feedback if time permits"
        ] 
      }
    ],
    tasks: [],
    writingTask: {
      prompt: "Upload a photo of your handwritten AWQ summary. The AI will extract and review it.",
      wordLimit: 220,
      rubricCriteria: ["Summary Accuracy (20%)", "Synthesis (20%)", "Paraphrasing (20%)", "Academic Tone (20%)", "Citations (20%)"]
    }
  }
];

// ============ WEEK 5 HOURS (Final Preparation) ============

export const week5Hours: HourData[] = [
  {
    weekNumber: 5,
    hourNumber: 1,
    title: "Full Mock AWQ",
    theme: "Complete Exam Simulation",
    behaviourChange: "Treat every practice like the real exam. Build exam habits now.",
    learningGoals: [
      "Complete a full 50-minute AWQ simulation",
      "Apply all learned skills under exam conditions",
      "Build exam confidence"
    ],
    ciloLinks: ["CILO 2: All Skills", "CILO 3: Drafting"],
    keyConcepts: [
      {
        term: "Exam Conditions",
        definition: "No notes, no AI, no dictionaries - just you, the excerpts, and a timer.",
        example: "Phone away. Timer visible. Write continuously for 50 minutes.",
        tip: "The more realistic your practice, the more confident you'll be on exam day."
      }
    ],
    articles: [ARTICLE_A, ARTICLE_B],
    agenda: [
      { 
        title: "Exam Conditions Setup", 
        duration: "5 min", 
        activities: [
          "No resources except articles",
          "Timer set for 50 minutes",
          "Simulate exam environment"
        ] 
      },
      { 
        title: "Mock AWQ", 
        duration: "50 min", 
        activities: [
          "300-word response",
          "Complete 3-paragraph structure",
          "Full exam conditions"
        ] 
      }
    ],
    tasks: [
      {
        id: "w5h1-paragraph1",
        type: "paragraph",
        question: "FULL MOCK AWQ (50 min): Write a 300-word summary synthesising Hong et al. (2022) and Andrejevic & Selwyn (2020). Follow the 3-paragraph structure: Introduction (background + thesis), Body (synthesised summary), Conclusion (implications).",
        wordLimit: 320,
        hints: ["10 min planning", "30 min writing", "10 min reviewing", "Remember: SYNTHESISE, don't list"],
        skillFocus: ["awq-structure", "summarising", "synthesising", "paraphrasing", "citation"]
      }
    ],
    writingTask: {
      prompt: "Complete a full 300-word AWQ in 50 minutes under exam conditions. No AI assistance during the task.",
      wordLimit: 320,
      rubricCriteria: ["Summary accuracy (20%)", "Synthesis (20%)", "Paraphrasing (20%)", "Academic tone (20%)", "Citations (20%)"]
    }
  },
  {
    weekNumber: 5,
    hourNumber: 2,
    title: "Feedback Session",
    theme: "Learning from Model Answers",
    behaviourChange: "Compare your work to models. Ask: 'What did they do that I didn't?'",
    learningGoals: [
      "Understand what makes a high-scoring response",
      "Identify common pitfalls",
      "Learn from peer and model answers"
    ],
    ciloLinks: ["CILO 3: Revision", "CILO 5: AI Learning Partner"],
    keyConcepts: [
      {
        term: "Model Answer Analysis",
        definition: "Studying successful responses to understand effective techniques.",
        example: "Student A's thesis: 'This summary examines contrasting perspectives...' - clear preview of content.",
        tip: "Don't just read models - ANALYZE them. What makes each sentence effective?"
      }
    ],
    articles: [ARTICLE_A, ARTICLE_B],
    agenda: [
      { 
        title: "Model Answer Analysis", 
        duration: "15 min", 
        activities: [
          "Study Student A's high-scoring response",
          "Identify effective techniques",
          "Note synthesis strategies"
        ] 
      },
      { 
        title: "Common Pitfalls", 
        duration: "10 min", 
        activities: [
          "Review frequent errors from Student B",
          "How to avoid them"
        ] 
      },
      { 
        title: "Peer Comparison", 
        duration: "10 min", 
        activities: [
          "Compare your mock to model",
          "Identify 3 improvements"
        ] 
      },
      { 
        title: "Revision Task", 
        duration: "10 min", 
        activities: [
          "Rewrite one paragraph to match model quality"
        ] 
      }
    ],
    tasks: [
      {
        id: "w5h2-mc1",
        type: "mc",
        question: "In Student A's model answer, what makes the thesis statement effective?",
        options: [
          "It's very long and detailed",
          "It previews both sources and shows their relationship",
          "It includes direct quotes",
          "It gives the student's opinion"
        ],
        correctAnswer: 1,
        explanation: "Effective thesis = previews content + shows relationship. 'This summary examines contrasting perspectives... comparing parental acceptance (Hong et al.) with ethical concerns (Andrejevic & Selwyn).'",
        skillFocus: ["awq-structure"]
      },
      {
        id: "w5h2-paragraph1",
        type: "paragraph",
        question: "Rewrite your conclusion paragraph to match the quality of the model answer. Focus on implications and a strong closing.",
        wordLimit: 70,
        hints: ["Avoid new information", "Sum up the key tension", "End with a forward-looking statement"],
        skillFocus: ["awq-structure", "conclusion-writing"],
        modelAnswer: "In conclusion, the adoption of FRT in schools represents a complex balance between security benefits and ethical concerns. While practical advantages drive parental acceptance, ongoing attention to student privacy and consent remains essential for responsible implementation of this technology in educational settings."
      }
    ],
    writingTask: {
      prompt: "Compare your mock AWQ conclusion to the model answer. Rewrite yours to improve it, then explain (in 30 words) what you changed.",
      wordLimit: 100,
      rubricCriteria: ["Improved conclusion", "Matches model quality", "Changes explained"]
    }
  },
  {
    weekNumber: 5,
    hourNumber: 3,
    title: "Final Readiness",
    theme: "Last-Minute Preparation",
    behaviourChange: "Know your 3 biggest weaknesses and have a plan to avoid them.",
    learningGoals: [
      "Confirm readiness with checklist",
      "Master time management for the real exam",
      "Address final questions and concerns"
    ],
    ciloLinks: ["All CILOs"],
    keyConcepts: [
      {
        term: "Readiness Checklist",
        definition: "5 questions to verify you're ready: Can you cite without hesitation? Paraphrase without patchwriting? Synthesise? Write 300 words in 40 min? Know the structure?",
        example: "If any answer is 'no' - focus your remaining time there.",
        tip: "Be honest with yourself. It's better to know your weaknesses now than discover them in the exam."
      },
      {
        term: "Top 3 Errors",
        definition: "The most common mistakes: (1) Listing instead of synthesising, (2) Including too much data, (3) Citation format errors.",
        example: "Create a mental checklist: 'Before submitting, check for listing, data, and citation errors.'",
        tip: "Most students lose marks on the same errors repeatedly. Break the pattern."
      }
    ],
    articles: [ARTICLE_A, ARTICLE_B],
    agenda: [
      { 
        title: "Time Management Review", 
        duration: "8 min", 
        activities: [
          "10-20-20-10 breakdown",
          "Backup strategies if running out of time"
        ] 
      },
      { 
        title: "Top Errors to Avoid", 
        duration: "8 min", 
        activities: [
          "Personal error patterns",
          "Class common mistakes"
        ] 
      },
      { 
        title: "Readiness Checklist", 
        duration: "8 min", 
        activities: [
          "Self-assessment completion",
          "Confidence check"
        ] 
      },
      { 
        title: "Final Writing Task", 
        duration: "12 min", 
        activities: [
          "Write a perfect conclusion paragraph"
        ] 
      },
      { 
        title: "Q&A", 
        duration: "8 min", 
        activities: [
          "Address remaining questions"
        ] 
      }
    ],
    tasks: [
      {
        id: "w5h3-tf1",
        type: "true-false",
        question: "Self-check: I can cite in APA format without hesitation.",
        correctAnswer: "true",
        explanation: "This should be TRUE before the exam. If not, practice more citation formats immediately.",
        skillFocus: ["self-assessment"]
      },
      {
        id: "w5h3-tf2",
        type: "true-false",
        question: "Self-check: I understand the difference between listing and synthesising.",
        correctAnswer: "true",
        explanation: "Synthesis is crucial for high AWQ scores. You should be able to explain the difference and demonstrate it in your writing.",
        skillFocus: ["self-assessment"]
      },
      {
        id: "w5h3-paragraph1",
        type: "paragraph",
        question: "Write a PERFECT conclusion paragraph (50-60 words) for an AWQ on FRT in schools. This is your final practice - make it count!",
        wordLimit: 65,
        hints: ["Summarise the key tension", "No new information", "Forward-looking closing"],
        skillFocus: ["conclusion-writing", "awq-structure"],
        modelAnswer: "In conclusion, the adoption of FRT in schools represents a complex balance between security benefits and ethical concerns. While practical advantages drive parental acceptance, ongoing attention to student privacy and consent remains essential for responsible implementation of this technology in educational settings."
      }
    ],
    writingTask: {
      prompt: "Final Task: Write an ideal conclusion paragraph (50-60 words) that you would be proud to submit in the real AWQ.",
      wordLimit: 65,
      modelAnswer: "In conclusion, the adoption of FRT in schools represents a complex balance between security benefits and ethical concerns. While practical advantages drive parental acceptance, ongoing attention to student privacy and consent remains essential for responsible implementation of this technology in educational settings.",
      rubricCriteria: ["Summarises key points", "No new information", "Forward-looking", "50-60 words"]
    }
  }
];

// ============ EXPORTS ============

export const allHoursData = [
  ...week1Hours,
  ...week2Hours,
  ...week3Hours,
  ...week4Hours,
  ...week5Hours
];

export function getHourData(weekNumber: number, hourNumber: number): HourData | undefined {
  return allHoursData.find(h => h.weekNumber === weekNumber && h.hourNumber === hourNumber);
}

export function getWeekHours(weekNumber: number): HourData[] {
  return allHoursData.filter(h => h.weekNumber === weekNumber);
}
