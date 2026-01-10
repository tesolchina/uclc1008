import { LearningUnit } from "../types";

// The article excerpt for Week 1 analysis
export const articleExcerpt = {
  title: "Facial recognition technology in schools: critical questions and concerns",
  authors: "Mark Andrejevic & Neil Selwyn (2020)",
  source: "Learning, Media and Technology, 45:2, 115-128",
  paragraphs: [
    {
      paragraphNumber: 1,
      sentences: [
        { sentenceNumber: 1, text: "Against this contentious background, then, we need to consider how these technologies are being applied to the specific context of education.", isTopicSentence: true },
        { sentenceNumber: 2, text: "While rarely foregrounded in debates about facial recognition in society, the school sector is one of the public settings where this technology is beginning to be taken up and implemented at scale." },
        { sentenceNumber: 3, text: "This is perhaps not surprising given, on the one hand, the role played by the classroom in the development of monitoring and disciplinary practices and, on the other, the increasing normalisation of surveillance in the name of protecting and securing young people." }
      ]
    },
    {
      paragraphNumber: 2,
      sentences: [
        { sentenceNumber: 1, text: "One prominent educational application of facial recognition technology is campus security.", isTopicSentence: true, isMainPoint: true },
        { sentenceNumber: 2, text: "This form of facial recognition is most prevalent in the US, where school shooting incidents have prompted school authorities to annually spend $2.7 billion on-campus security products and services (Doffman, 2018).", isCitation: true, isSupportingDetail: true },
        { sentenceNumber: 3, text: "Facial recognition systems have now been sold to thousands of US schools, with vendors \"pitching the technology as an all-seeing shield against school shootings\" (Harwell, 2018, n.p).", isCitation: true, isSupportingDetail: true },
        { sentenceNumber: 4, text: "As well as purporting to identify unauthorised intruders, systems have been developed to make use of video object classification trained to detect gun-shaped objects, alongside more subtle forms of 'anomaly detection' such as students arriving at school in different-than-usual clothes, bags and other apparel (Harwell, 2018).", isCitation: true, isSupportingDetail: true },
        { sentenceNumber: 5, text: "These systems promise to give school authorities an ability to initially determine who is permitted onto a school campus, and then support the tracking of identified individuals around the school site." },
        { sentenceNumber: 6, text: "As the marketing for the SAFR school system reasons, the capacity to know where students and staff are means that 'schools can stay focused and better analyse potential threats' (SAFR, 2019).", isCitation: true }
      ]
    },
    {
      paragraphNumber: 3,
      sentences: [
        { sentenceNumber: 1, text: "Another application of facial recognition in schools is attendance monitoring – promising to put an end to the inevitable gaps and omissions that arise when human teachers are tasked with repeatedly conducting roll-calls of large student groups (Puthea et al., 2017).", isTopicSentence: true, isMainPoint: true, isCitation: true },
        { sentenceNumber: 2, text: "This application of facial recognition is proving popular in countries such as the UK and Australia where school shootings and unauthorised campus incursions are rare.", isSupportingDetail: true },
        { sentenceNumber: 3, text: "For example, the Australian 'Loop-Learn' facial recognition roll-call system has been marketed amidst estimates of saving up to 2.5 hours of teacher time per week.", isSupportingDetail: true },
        { sentenceNumber: 4, text: "Elsewhere, automated registration systems are also considered an effective means of overcoming problems of 'fake attendance' and 'proxies' – especially in countries such as India where fraudulent attendance is commonplace (Wagh et al., 2015).", isCitation: true, isSupportingDetail: true }
      ]
    },
    {
      paragraphNumber: 4,
      sentences: [
        { sentenceNumber: 1, text: "Beyond campus-based security and tracking physical bodies, facial recognition is also being used in a number of 'virtual learning' contexts.", isTopicSentence: true, isMainPoint: true },
        { sentenceNumber: 2, text: "For example, facial recognition systems are now being developed as a means of ensuring the integrity of various aspects of online courses.", isSupportingDetail: true },
        { sentenceNumber: 3, text: "This includes controlling access to online educational content (Montgomery & Marais, 2014), as well as using webcam-based facial recognition to authenticate online learners (i.e., confirming that the people engaging in online learning activities are actually who they claim to be) (Valera et al., 2015).", isCitation: true, isSupportingDetail: true },
        { sentenceNumber: 4, text: "Similarly, there is a growing interest in using facial recognition technology for so-called e-assessment security – i.e., verifying the identity of students taking computer-based tests and examinations, and confirming their continued presence during the whole examination period (Apampa et al., 2010; Hernández et al., 2008).", isCitation: true, isSupportingDetail: true }
      ]
    },
    {
      paragraphNumber: 5,
      sentences: [
        { sentenceNumber: 1, text: "Finally, there is a growing interest in facial detection techniques as an indicator of student 'engagement' and learning.", isTopicSentence: true, isMainPoint: true },
        { sentenceNumber: 2, text: "For example, research and development in this area have reported that detecting brief 'facial actions' can prove an accurate indicator of students' (non)engagement with online learning environments – highlighting episodes of boredom, confusion, delight, flow, frustration, and surprise (Dewan et al., 2019).", isCitation: true, isSupportingDetail: true },
        { sentenceNumber: 3, text: "Particularly insightful facial actions with regards to learning are reckoned to include brow-raising, eyelid tightening, and mouth dimpling (e.g., Grafsgaard et al., 2013).", isCitation: true, isSupportingDetail: true },
        { sentenceNumber: 4, text: "Elsewhere, it is claimed that 'facial microexpression states' (facial states lasting less than half a second) correlate strongly with conceptual learning, and 'could perhaps give us a glimpse into what learners [a]re thinking' (Liaw et al., 2014).", isCitation: true, isSupportingDetail: true },
        { sentenceNumber: 5, text: "All told, there is growing interest in the face as a 'continuous and non-intrusive way of…understand[ing] certain facets of the learner's current state of mind' (Dewan et al., 2019).", isCitation: true }
      ]
    }
  ]
};

// Unit 1.1: Recognizing Academic Paper Features
export const unit1_1: LearningUnit = {
  id: "w1-1-1",
  title: "Exploring Academic Article Structure",
  subtitle: "Recognize features of academic papers: citations, structure, key points",
  duration: "15 min",
  objectives: [
    "Identify in-text citations in an academic article",
    "Recognize the overall structure of an academic excerpt",
    "Locate topic sentences in each paragraph"
  ],
  slides: [
    {
      emoji: "📄",
      heading: "Welcome to Academic Reading",
      subheading: "Your Pre-course Writing uses an excerpt from this article",
      points: [
        "Today we'll read the **same article** you'll summarise for Task 1",
        "We'll learn to spot **citations** - how authors reference other work",
        "We'll identify **key points** in each paragraph",
        "This will help you write a better summary!"
      ],
      tip: "Understanding the structure helps you identify what's important to include in your summary."
    },
    {
      emoji: "📚",
      heading: "The Article: Facial Recognition in Schools",
      subheading: "Andrejevic & Selwyn (2020)",
      points: [
        "**Title:** Facial recognition technology in schools: critical questions and concerns",
        "**Authors:** Mark Andrejevic & Neil Selwyn",
        "**Published:** Learning, Media and Technology, 2020",
        "**Type:** Conceptual article (argues a position based on existing research)"
      ],
      tip: "Notice the title signals a CRITICAL stance - the authors have concerns about FRT."
    },
    {
      emoji: "🔍",
      heading: "What is an In-Text Citation?",
      subheading: "How authors acknowledge sources",
      points: [
        "Citations show where information comes from",
        "**Format:** (Author, Year) or Author (Year)",
        "Example: *\"...spend $2.7 billion on-campus security products\" **(Doffman, 2018)**",
        "Multiple authors: **(Andrejevic & Selwyn, 2020)** or **et al.** for 3+"
      ],
      examples: [
        { title: "Information-prominent", text: "Schools spend billions on security (Doffman, 2018)." },
        { title: "Author-prominent", text: "Harwell (2018) reports that vendors pitch FRT as 'an all-seeing shield'." }
      ],
      tip: "Count the citations in a paragraph - more citations = more supported claims!"
    },
    {
      emoji: "📖",
      heading: "Let's Read Paragraph 1",
      subheading: "Introduction to the topic",
      numberedText: [articleExcerpt.paragraphs[0]],
      tip: "This paragraph sets the CONTEXT. Notice there are no citations yet - the authors are framing the issue."
    },
    {
      emoji: "📖",
      heading: "Let's Read Paragraph 2",
      subheading: "First application: Campus Security",
      numberedText: [articleExcerpt.paragraphs[1]],
      tip: "Topic Sentence: Sentence 1 tells you what the paragraph is about. The rest provides evidence."
    },
    {
      emoji: "📖",
      heading: "Let's Read Paragraph 3",
      subheading: "Second application: Attendance Monitoring",
      numberedText: [articleExcerpt.paragraphs[2]],
      tip: "Notice the transition word 'Another' - it signals a new main point."
    }
  ],
  tasks: [
    {
      id: "w1-1-1-t1",
      type: "mc",
      question: "How many in-text citations are in Paragraph 2?",
      context: "Count all references in the format (Author, Year) in paragraph 2.",
      options: ["2 citations", "3 citations", "4 citations", "5 citations"],
      correctAnswer: 2,
      explanation: "There are 4 citations: (Doffman, 2018), (Harwell, 2018) appears twice, and (SAFR, 2019)."
    },
    {
      id: "w1-1-1-t2",
      type: "mc",
      question: "What is the main point of Paragraph 2?",
      options: [
        "Schools spend too much money on security",
        "Facial recognition is used for campus security",
        "School shootings are increasing in the US",
        "SAFR is the best security system"
      ],
      correctAnswer: 1,
      explanation: "The topic sentence clearly states: 'One prominent educational application of facial recognition technology is campus security.'"
    },
    {
      id: "w1-1-1-t3",
      type: "mc",
      question: "Which sentence in Paragraph 3 is the topic sentence?",
      options: [
        "Sentence 1 - introduces attendance monitoring",
        "Sentence 2 - mentions UK and Australia",
        "Sentence 3 - gives the Loop-Learn example",
        "Sentence 4 - discusses fake attendance"
      ],
      correctAnswer: 0,
      explanation: "Sentence 1 introduces the main idea (attendance monitoring) that the rest of the paragraph develops."
    },
    {
      id: "w1-1-1-t4",
      type: "highlight",
      question: "In Paragraph 2, which sentences provide EVIDENCE (supporting details)?",
      context: "Select all sentences that contain citations or specific examples.",
      targetParagraph: 2,
      targetSentences: [2, 3, 4, 6],
      correctAnswer: ["2", "3", "4", "6"],
      explanation: "Sentences 2, 3, 4, and 6 all contain citations that support the main claim about campus security."
    }
  ],
  moduleRef: "Pre-course Writing + Module 1"
};

// Unit 1.2: Paragraph-Level Analysis
export const unit1_2: LearningUnit = {
  id: "w1-1-2",
  title: "How Paragraphs Work",
  subtitle: "Explore sentence connections and distinguish main points from details",
  duration: "15 min",
  objectives: [
    "Understand how sentences connect within a paragraph",
    "Distinguish between main points and supporting details",
    "Identify transition signals between ideas"
  ],
  slides: [
    {
      emoji: "🔗",
      heading: "Paragraph Building Blocks",
      subheading: "How academic paragraphs are structured",
      points: [
        "**Topic Sentence:** States the main idea (usually first)",
        "**Supporting Details:** Evidence, examples, citations",
        "**Concluding/Linking Sentence:** Wraps up or transitions",
        "Each sentence has a **job** in the paragraph"
      ],
      tip: "When summarising, focus on TOPIC SENTENCES - they contain the main ideas."
    },
    {
      emoji: "🎯",
      heading: "Main Points vs. Supporting Details",
      subheading: "What to include in your summary",
      points: [
        "**Main Point:** The key argument or claim (INCLUDE in summary)",
        "**Supporting Detail:** Evidence that backs it up (usually SKIP in summary)",
        "**Example:** Statistics, quotes, case studies (usually SKIP)"
      ],
      examples: [
        { title: "Main Point", text: "Facial recognition is used for campus security." },
        { title: "Supporting Detail", text: "Schools spend $2.7 billion annually (Doffman, 2018)." }
      ],
      tip: "Your summary should capture MAIN POINTS, not every detail. That's how you fit 5 paragraphs into 300 words!"
    },
    {
      emoji: "↔️",
      heading: "Transition Signals",
      subheading: "How authors connect ideas",
      points: [
        "**Adding:** Another, Also, Furthermore, In addition",
        "**Contrasting:** However, While, Although, On the other hand",
        "**Examples:** For example, For instance, such as",
        "**Concluding:** Finally, In conclusion, All told"
      ],
      examples: [
        { title: "From the article", text: "'Another application...' signals a NEW main point" },
        { title: "From the article", text: "'For example...' signals SUPPORTING DETAIL" }
      ]
    },
    {
      emoji: "📖",
      heading: "Analysing Paragraph 4",
      subheading: "Virtual Learning Applications",
      numberedText: [articleExcerpt.paragraphs[3]],
      tip: "Notice 'Beyond' signals a shift from physical to virtual contexts."
    },
    {
      emoji: "📖",
      heading: "Analysing Paragraph 5",
      subheading: "Engagement and Learning Detection",
      numberedText: [articleExcerpt.paragraphs[4]],
      tip: "Notice 'Finally' signals the last main application being discussed."
    },
    {
      emoji: "📊",
      heading: "The Article's Structure",
      subheading: "4 Applications of FRT in Education",
      points: [
        "**Para 1:** Introduction - sets the context",
        "**Para 2:** Application 1 - Campus Security",
        "**Para 3:** Application 2 - Attendance Monitoring",
        "**Para 4:** Application 3 - Virtual Learning/Online Exams",
        "**Para 5:** Application 4 - Engagement Detection"
      ],
      tip: "For your summary: Capture each APPLICATION as a main point, skip the specific statistics."
    }
  ],
  tasks: [
    {
      id: "w1-1-2-t1",
      type: "mc",
      question: "In Paragraph 4, what transition word signals a new context?",
      options: ["Another", "Beyond", "For example", "Similarly"],
      correctAnswer: 1,
      explanation: "'Beyond' indicates moving from physical campus security to virtual/online contexts."
    },
    {
      id: "w1-1-2-t2",
      type: "mc",
      question: "Which of these from Paragraph 5 is a SUPPORTING DETAIL, not a main point?",
      options: [
        "There is growing interest in facial detection for engagement",
        "Detecting facial actions can indicate boredom or confusion",
        "Brow-raising and mouth dimpling indicate learning",
        "The face shows the learner's state of mind"
      ],
      correctAnswer: 2,
      explanation: "The specific facial actions (brow-raising, etc.) are examples that support the main point about detecting engagement."
    },
    {
      id: "w1-1-2-t3",
      type: "short-answer",
      question: "In ONE sentence, what is the main idea of Paragraph 4?",
      hints: ["Start with 'Facial recognition is also used for...'", "Focus on the virtual/online context"],
      wordLimit: 30,
      explanation: "Sample answer: 'Facial recognition is also used in virtual learning to verify student identity in online courses and exams.'"
    },
    {
      id: "w1-1-2-t4",
      type: "mc",
      question: "What are the FOUR main applications of FRT discussed in the article?",
      options: [
        "Security, Attendance, Online Learning, Engagement Detection",
        "Security, Discipline, Grading, Attendance",
        "Attendance, Online Exams, Security, Student Monitoring",
        "Virtual Learning, Physical Security, Emotion Analysis, Grading"
      ],
      correctAnswer: 0,
      explanation: "The four applications are: (1) Campus Security, (2) Attendance Monitoring, (3) Virtual Learning/Online Verification, (4) Engagement/Learning Detection."
    }
  ],
  moduleRef: "Pre-course Writing"
};

// Unit 1.3: Brainstorming for Argumentative Essay
export const unit1_3: LearningUnit = {
  id: "w1-1-3",
  title: "From Reading to Writing",
  subtitle: "Use the article to develop your argumentative essay",
  duration: "15 min",
  objectives: [
    "Extract ideas from the article for your essay",
    "Develop a clear position (for or against FRT in schools)",
    "Plan your argument structure"
  ],
  slides: [
    {
      emoji: "✍️",
      heading: "Task 2: Your Argumentative Essay",
      subheading: "Is it advisable for schools to adopt FRT on campus?",
      points: [
        "You must take a **position** (YES or NO)",
        "Use ideas from the article to **support** your argument",
        "300 words maximum",
        "You can add your own views and knowledge"
      ],
      tip: "The article provides EVIDENCE you can use - you don't need to do extra research!"
    },
    {
      emoji: "⚖️",
      heading: "Taking a Position",
      subheading: "What the article tells us",
      points: [
        "The article presents **four uses** of FRT in schools",
        "But notice the title: 'critical questions and **concerns**'",
        "The authors are **critical** of FRT adoption",
        "You can AGREE or DISAGREE with their concerns"
      ],
      examples: [
        { title: "PRO position", text: "FRT should be adopted because it enhances security and saves time." },
        { title: "CON position", text: "FRT should not be adopted because it raises privacy concerns." }
      ]
    },
    {
      emoji: "💡",
      heading: "Ideas FOR Adopting FRT",
      subheading: "Evidence from the article",
      points: [
        "**Security:** Can identify intruders and detect threats",
        "**Efficiency:** Saves 2.5 hours of teacher time per week on attendance",
        "**Integrity:** Verifies student identity in online exams",
        "**Learning:** Can detect when students are confused or bored"
      ],
      tip: "If you argue FOR FRT, use these benefits as your main points."
    },
    {
      emoji: "⚠️",
      heading: "Ideas AGAINST Adopting FRT",
      subheading: "Concerns raised in the article",
      points: [
        "**Privacy:** Constant surveillance of students",
        "**Normalisation:** Makes surveillance seem 'normal' for young people",
        "**Accuracy:** Relies on subtle facial movements that may not be reliable",
        "**Consent:** Students cannot easily opt out"
      ],
      tip: "If you argue AGAINST FRT, use these concerns as your main points."
    },
    {
      emoji: "📝",
      heading: "Essay Structure",
      subheading: "How to organise your 300 words",
      points: [
        "**Introduction (50-70 words):** Background + Your thesis (position)",
        "**Body Paragraph (150-180 words):** Your main argument with evidence",
        "**Conclusion (50-70 words):** Restate position + final thought"
      ],
      examples: [
        { title: "Thesis example (CON)", text: "This essay argues that schools should NOT adopt FRT due to privacy concerns." },
        { title: "Thesis example (PRO)", text: "This essay argues that FRT adoption in schools is advisable for enhancing security." }
      ]
    },
    {
      emoji: "🎯",
      heading: "Using the Article in Your Essay",
      subheading: "Remember to cite!",
      points: [
        "**Quote:** Use exact words in quotation marks + citation",
        "**Paraphrase:** Rewrite in your own words + citation",
        "**Reference:** Refer to findings + citation"
      ],
      examples: [
        { title: "Good citation", text: "According to Andrejevic and Selwyn (2020), schools are increasingly adopting surveillance technologies." },
        { title: "Without citation", text: "Schools are using more surveillance. ❌ (Needs a citation!)" }
      ],
      tip: "Every idea from the article needs a citation: (Andrejevic & Selwyn, 2020)"
    }
  ],
  tasks: [
    {
      id: "w1-1-3-t1",
      type: "mc",
      question: "What position do the article's authors (Andrejevic & Selwyn) take?",
      options: [
        "They strongly support FRT in schools",
        "They are neutral - just presenting facts",
        "They are critical and raise concerns about FRT",
        "They only discuss the benefits of FRT"
      ],
      correctAnswer: 2,
      explanation: "The title 'critical questions and concerns' reveals their critical stance toward FRT adoption."
    },
    {
      id: "w1-1-3-t2",
      type: "mc",
      question: "Which is a better thesis statement for your essay?",
      options: [
        "Facial recognition is interesting technology.",
        "This essay argues that FRT should not be adopted in schools due to privacy violations.",
        "Many schools use facial recognition these days.",
        "There are pros and cons to facial recognition."
      ],
      correctAnswer: 1,
      explanation: "A thesis must state your POSITION clearly. Option B clearly states the position (against) and reason (privacy)."
    },
    {
      id: "w1-1-3-t3",
      type: "paragraph",
      question: "Write a thesis statement for your essay. State your position (for or against FRT in schools) and give one reason.",
      hints: [
        "Start with 'This essay argues that...'",
        "Include your position: FRT SHOULD or SHOULD NOT be adopted",
        "Add one reason: because/due to..."
      ],
      wordLimit: 40
    },
    {
      id: "w1-1-3-t4",
      type: "short-answer",
      question: "List TWO pieces of evidence from the article you could use to support your position.",
      hints: [
        "Think about which application (security, attendance, online learning, engagement) supports your view",
        "Include the citation: (Andrejevic & Selwyn, 2020)"
      ],
      wordLimit: 60
    }
  ],
  moduleRef: "Pre-course Writing Task 2"
};

export const week1Hour1Units = [unit1_1, unit1_2, unit1_3];
