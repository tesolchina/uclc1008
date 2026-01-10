import { LearningUnit, NumberedParagraph } from "../types";

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

// =============================================================================
// UNIT 1.1: Discovering Academic Features (Every slide has a task)
// =============================================================================
export const unit1_1: LearningUnit = {
  id: "w1-1-1",
  title: "Discovering Academic Text Features",
  subtitle: "Explore the article and identify patterns in academic writing",
  duration: "20 min",
  objectives: [
    "Discover what makes academic writing different from everyday writing",
    "Identify recurring patterns in the text through observation",
    "Understand the purpose of these features"
  ],
  slides: [
    // SLIDE 1: Notice patterns in Para 2
    {
      emoji: "🔍",
      heading: "What Do You Notice?",
      subheading: "Read Paragraph 2 and spot any unusual patterns",
      numberedText: [articleExcerpt.paragraphs[1]],
    },
    // SLIDE 2: Apply to Para 3
    {
      emoji: "🎯",
      heading: "Apply: Find Citations in Paragraph 3",
      subheading: "Now look for the same pattern in another paragraph",
      numberedText: [articleExcerpt.paragraphs[2]],
    },
    // SLIDE 3: Why citations matter
    {
      emoji: "💡",
      heading: "Why Do Authors Use Citations?",
      subheading: "Think about the PURPOSE of this pattern",
      points: [
        "**Citations** show where information comes from",
        "Format: **(Author, Year)** or **Author (Year)**",
        "They prove the writer isn't making things up",
        "More citations = more evidence = stronger argument"
      ],
    },
    // SLIDE 4: Compare Para 1 vs Para 2
    {
      emoji: "⚖️",
      heading: "Compare: Why the Difference?",
      subheading: "Paragraph 1 has NO citations, but Paragraph 2 has many. Why?",
      numberedText: [articleExcerpt.paragraphs[0], articleExcerpt.paragraphs[1]],
    },
    // SLIDE 5: First sentences pattern
    {
      emoji: "🎬",
      heading: "First Sentences Are Special",
      subheading: "Read the first sentence of Paragraphs 2-5. What do they have in common?",
      points: [
        "**Para 2:** \"One prominent educational application... is campus security.\"",
        "**Para 3:** \"Another application... is attendance monitoring.\"",
        "**Para 4:** \"Beyond campus-based security... virtual learning contexts.\"",
        "**Para 5:** \"Finally, there is a growing interest in... engagement.\""
      ],
    },
    // SLIDE 6: Topic sentence concept
    {
      emoji: "💡",
      heading: "Discovery: Topic Sentences",
      subheading: "What is the job of a topic sentence?",
      points: [
        "**Topic Sentence** = Main idea of the paragraph",
        "Usually the **first sentence** (sometimes second)",
        "Contains the **topic** + **controlling idea**",
        "Everything else in the paragraph SUPPORTS this sentence"
      ],
    },
    // SLIDE 7: Apply - Find topic sentence in Para 4
    {
      emoji: "🎯",
      heading: "Apply: Find the Topic Sentence",
      subheading: "Which sentence is the topic sentence in Paragraph 4?",
      numberedText: [articleExcerpt.paragraphs[3]],
    }
  ],
  tasks: [
    // Task 1: matches Slide 1
    {
      id: "w1-1-1-t1",
      type: "mc",
      question: "What unusual pattern appears multiple times in Paragraph 2?",
      context: "Look for anything that stands out from normal writing.",
      options: [
        "Words in quotation marks",
        "Names with years in brackets like (Doffman, 2018)",
        "Numbers and statistics",
        "Words in italics"
      ],
      correctAnswer: 1,
      explanation: "You noticed the (Author, Year) pattern! These are called 'in-text citations' - there are 4 of them in this paragraph."
    },
    // Task 2: matches Slide 2
    {
      id: "w1-1-1-t2",
      type: "mc",
      question: "How many citations can you find in Paragraph 3?",
      context: "Look for the (Author, Year) pattern. Note: 'et al.' means 'and others'.",
      options: ["1 citation", "2 citations", "3 citations", "4 citations"],
      correctAnswer: 1,
      explanation: "There are 2 citations: (Puthea et al., 2017) and (Wagh et al., 2015)."
    },
    // Task 3: matches Slide 3
    {
      id: "w1-1-1-t3",
      type: "short-answer",
      question: "In your own words, why do academic writers use citations?",
      hints: ["Think about credibility and evidence"],
      wordLimit: 30,
      explanation: "Sample answer: Citations show readers where information comes from and prove the writer has done research to support their claims."
    },
    // Task 4: matches Slide 4
    {
      id: "w1-1-1-t4",
      type: "mc",
      question: "Paragraph 1 has NO citations, but Paragraph 2 has 4. Why?",
      context: "Think about what each paragraph is doing.",
      options: [
        "The author forgot to add citations to Paragraph 1",
        "Paragraph 1 sets context; Paragraph 2 presents evidence",
        "Citations are only needed every other paragraph",
        "Paragraph 1 is opinion, Paragraph 2 is fact"
      ],
      correctAnswer: 1,
      explanation: "Paragraph 1 introduces the TOPIC and sets CONTEXT. Paragraph 2 makes CLAIMS that need evidence, so it uses citations."
    },
    // Task 5: matches Slide 5
    {
      id: "w1-1-1-t5",
      type: "mc",
      question: "What do the first sentences of Paragraphs 2-5 have in common?",
      options: [
        "They all have citations",
        "They all introduce a different application of FRT",
        "They all use similar length",
        "They all mention schools"
      ],
      correctAnswer: 1,
      explanation: "Each first sentence introduces a DIFFERENT APPLICATION: security, attendance, virtual learning, and engagement detection."
    },
    // Task 6: matches Slide 6
    {
      id: "w1-1-1-t6",
      type: "fill-blank",
      question: "Complete: The first sentence of a paragraph that states the main idea is called a ______ sentence.",
      correctAnswer: "topic",
      explanation: "The TOPIC SENTENCE tells readers what the paragraph will be about. It's usually the first sentence."
    },
    // Task 7: matches Slide 7
    {
      id: "w1-1-1-t7",
      type: "mc",
      question: "Which sentence is the topic sentence in Paragraph 4?",
      context: "The topic sentence states what the whole paragraph is about.",
      options: [
        "Sentence 1 - introduces virtual learning applications",
        "Sentence 2 - gives an example about online courses",
        "Sentence 3 - explains access control",
        "Sentence 4 - discusses e-assessment"
      ],
      correctAnswer: 0,
      explanation: "Sentence 1 introduces the MAIN IDEA (FRT in virtual learning). Sentences 2-4 give EXAMPLES and DETAILS that support this."
    }
  ],
  moduleRef: "Pre-course Writing"
};

// =============================================================================
// UNIT 1.2: Understanding Paragraph Structure (Every slide has a task)
// =============================================================================
export const unit1_2: LearningUnit = {
  id: "w1-1-2",
  title: "How Paragraphs Work",
  subtitle: "Discover how sentences connect to build an argument",
  duration: "20 min",
  objectives: [
    "Distinguish between main points and supporting details",
    "Understand how evidence supports claims",
    "Identify transition signals between ideas"
  ],
  slides: [
    // SLIDE 1: Main point vs supporting detail intro
    {
      emoji: "📊",
      heading: "Main Points vs. Supporting Details",
      subheading: "Not all sentences are equally important. Read and identify.",
      numberedText: [articleExcerpt.paragraphs[1]],
    },
    // SLIDE 2: Specific claim question
    {
      emoji: "⚖️",
      heading: "Is This a Main Point or Supporting Detail?",
      subheading: "Think about whether this makes a claim or provides evidence",
      points: [
        "**Sentence 2:** 'Schools annually spend $2.7 billion on security' (Doffman, 2018)"
      ],
    },
    // SLIDE 3: Apply to Paragraph 5
    {
      emoji: "🎯",
      heading: "Practice: Paragraph 5",
      subheading: "Identify the main point vs. supporting details",
      numberedText: [articleExcerpt.paragraphs[4]],
    },
    // SLIDE 4: Transition words observation
    {
      emoji: "🔗",
      heading: "How Do Paragraphs Connect?",
      subheading: "Notice the first words of each paragraph",
      points: [
        "Para 2: \"**One** prominent application...\"",
        "Para 3: \"**Another** application...\"",
        "Para 4: \"**Beyond** campus-based security...\"",
        "Para 5: \"**Finally**, there is growing interest...\""
      ],
    },
    // SLIDE 5: What does 'Another' signal?
    {
      emoji: "🤔",
      heading: "What Does 'Another' Tell Us?",
      subheading: "Think about what this transition word signals",
      points: [
        "Paragraph 3 starts: 'Another application of facial recognition...'",
        "What relationship does 'Another' show with Paragraph 2?"
      ],
    },
    // SLIDE 6: What does 'Finally' signal?
    {
      emoji: "🏁",
      heading: "What Does 'Finally' Signal?",
      subheading: "Think about the purpose of this transition word",
      points: [
        "Paragraph 5 starts: 'Finally, there is a growing interest...'",
        "Why did the author use 'Finally' here?"
      ],
    },
    // SLIDE 7: The big picture
    {
      emoji: "🏗️",
      heading: "The Big Picture",
      subheading: "Now you can see the whole article structure",
      points: [
        "**Paragraph 1:** Introduction - sets the context",
        "**Paragraph 2:** Application 1 - Campus Security",
        "**Paragraph 3:** Application 2 - Attendance Monitoring",
        "**Paragraph 4:** Application 3 - Virtual Learning/Online Exams",
        "**Paragraph 5:** Application 4 - Engagement Detection"
      ],
    },
    // SLIDE 8: Summary sentence practice
    {
      emoji: "📝",
      heading: "Practice: Summarise Paragraph 4",
      subheading: "Can you express the main idea in one sentence?",
      numberedText: [articleExcerpt.paragraphs[3]],
    }
  ],
  tasks: [
    // Task 1: matches Slide 1
    {
      id: "w1-1-2-t1",
      type: "mc",
      question: "In Paragraph 2, which sentence is the MAIN POINT (claim)?",
      context: "The main point is what the author is arguing - not evidence or examples.",
      options: [
        "Sentence 1: 'One prominent application... is campus security.'",
        "Sentence 2: 'Schools spend $2.7 billion' (Doffman, 2018)",
        "Sentence 3: 'Systems sold to thousands of schools' (Harwell, 2018)",
        "Sentence 6: 'SAFR system reasons...' (SAFR, 2019)"
      ],
      correctAnswer: 0,
      explanation: "Sentence 1 is the CLAIM - it states the main point. Sentences 2-6 provide EVIDENCE (with citations) to support this claim."
    },
    // Task 2: matches Slide 2
    {
      id: "w1-1-2-t2",
      type: "mc",
      question: "Sentence 2 says schools 'annually spend $2.7 billion' on security. Is this a main point or supporting detail?",
      options: [
        "Main Point - it's an important fact",
        "Supporting Detail - it's evidence for the main point",
        "Neither - it's just background information",
        "Both - facts are always main points"
      ],
      correctAnswer: 1,
      explanation: "The $2.7 billion statistic is EVIDENCE (supporting detail) that proves the main point about FRT being used for security. Notice the citation!"
    },
    // Task 3: matches Slide 3
    {
      id: "w1-1-2-t3",
      type: "mc",
      question: "In Paragraph 5, which sentence is the main point?",
      context: "Main Point makes the general claim. Details give specific evidence.",
      options: [
        "Sentence 1: 'Growing interest in facial detection for engagement'",
        "Sentence 2: 'Detecting facial actions indicates engagement'",
        "Sentence 3: 'Brow-raising and mouth dimpling indicate learning'",
        "Sentence 5: 'The face as a way to understand learner's mind'"
      ],
      correctAnswer: 0,
      explanation: "Sentence 1 states the general claim (interest in engagement detection). Sentences 2-5 provide specific evidence and examples."
    },
    // Task 4: matches Slide 4
    {
      id: "w1-1-2-t4",
      type: "short-answer",
      question: "What pattern do you notice in the first words of Paragraphs 2-5?",
      hints: ["One, Another, Beyond, Finally", "Think about what these words do"],
      wordLimit: 25,
      explanation: "These transition words signal a LIST of different applications, with 'Finally' showing we've reached the last one."
    },
    // Task 5: matches Slide 5
    {
      id: "w1-1-2-t5",
      type: "mc",
      question: "What does the transition word 'Another' in Paragraph 3 tell you?",
      options: [
        "The author is contradicting the previous paragraph",
        "The author is adding a second example of the same point",
        "The author is introducing a new application of FRT",
        "The author is concluding the argument"
      ],
      correctAnswer: 2,
      explanation: "'Another application' signals the author is adding a NEW main point - a different application of FRT (attendance monitoring)."
    },
    // Task 6: matches Slide 6
    {
      id: "w1-1-2-t6",
      type: "mc",
      question: "What does the word 'Finally' in Paragraph 5 signal?",
      options: [
        "The author is about to give the most important point",
        "The author is presenting the last application in the list",
        "The author is disagreeing with previous points",
        "The author is starting a new topic"
      ],
      correctAnswer: 1,
      explanation: "'Finally' signals the LAST item in a list. After 'One', 'Another', and 'Beyond', 'Finally' tells us this is the last application."
    },
    // Task 7: matches Slide 7
    {
      id: "w1-1-2-t7",
      type: "mc",
      question: "How many MAIN APPLICATIONS of FRT does the article discuss?",
      options: [
        "2 applications",
        "3 applications",
        "4 applications",
        "5 applications"
      ],
      correctAnswer: 2,
      explanation: "The article discusses 4 applications: (1) Campus Security, (2) Attendance Monitoring, (3) Virtual Learning/Online Exams, (4) Engagement Detection."
    },
    // Task 8: matches Slide 8
    {
      id: "w1-1-2-t8",
      type: "short-answer",
      question: "In ONE sentence, summarise what Paragraph 4 is about.",
      hints: ["Start with: 'Facial recognition is also used for...'", "Focus on the virtual/online context"],
      wordLimit: 25,
      explanation: "Sample: 'Facial recognition is also used to verify student identity in online courses and exams.'"
    }
  ],
  moduleRef: "Pre-course Writing"
};

// =============================================================================
// UNIT 1.3: From Reading to Writing (Every slide has a task)
// =============================================================================
export const unit1_3: LearningUnit = {
  id: "w1-1-3",
  title: "From Reading to Writing",
  subtitle: "Use what you've learned to plan your Pre-course Writing",
  duration: "15 min",
  objectives: [
    "Extract key ideas for your summary (Task 1)",
    "Develop a position for your argument (Task 2)",
    "Understand the difference between summary and argument"
  ],
  slides: [
    // SLIDE 1: What 4 applications?
    {
      emoji: "✍️",
      heading: "Your Pre-course Writing",
      subheading: "You need to summarise the 4 applications of FRT",
      points: [
        "**Task 1: Summary** (300 words) - What does the article say?",
        "**Task 2: Argument** (300 words) - What do YOU think?",
        "Both tasks use the same article",
        "You now know how to identify the main points!"
      ],
    },
    // SLIDE 2: Write summary sentence for Campus Security
    {
      emoji: "📝",
      heading: "Practice: Summarise Application 1",
      subheading: "Write one sentence about Campus Security",
      numberedText: [articleExcerpt.paragraphs[1]],
    },
    // SLIDE 3: Initial position - before seeing arguments
    {
      emoji: "🤔",
      heading: "Your Initial Position",
      subheading: "Before seeing all the arguments, what do you think about FRT in schools?",
      points: [
        "Is it advisable for schools to adopt FRT?",
        "Don't overthink - go with your gut feeling",
        "There's no 'correct' answer here"
      ],
    },
    // SLIDE 4: Arguments FOR FRT
    {
      emoji: "✅",
      heading: "Arguments FOR FRT in Schools",
      subheading: "If you SUPPORT FRT, which evidence would you use?",
      points: [
        "**Security:** Can identify intruders and prevent shootings",
        "**Efficiency:** Saves teacher time on attendance (2.5 hrs/week)",
        "**Academic Integrity:** Prevents cheating in online exams",
        "**Engagement:** Can help teachers identify struggling students"
      ],
    },
    // SLIDE 5: Arguments AGAINST FRT
    {
      emoji: "❌",
      heading: "Arguments AGAINST FRT in Schools",
      subheading: "If you OPPOSE FRT, which evidence would you use?",
      points: [
        "**Privacy:** Constant surveillance of students",
        "**Normalisation:** Children grow up accepting being watched",
        "**Accuracy Issues:** Technology can make mistakes (false positives)",
        "**Trust:** Damages relationship between students and teachers"
      ],
    },
    // SLIDE 6: What does the title suggest?
    {
      emoji: "📖",
      heading: "What Does the Title Tell Us?",
      subheading: "Facial recognition technology in schools: critical questions and concerns",
      points: [
        "Authors choose titles carefully",
        "What do the words 'critical' and 'concerns' suggest?",
        "Does this hint at the authors' position?"
      ],
    },
    // SLIDE 7: Write your position statement
    {
      emoji: "⚖️",
      heading: "Your Position Statement",
      subheading: "Now write your argument thesis",
      points: [
        "Start with: 'Schools should/should not adopt FRT because...'",
        "Be clear about your stance",
        "Give 2-3 reasons"
      ],
    },
    // SLIDE 8: Summary vs Argument difference
    {
      emoji: "🚀",
      heading: "Summary vs. Argument",
      subheading: "Make sure you understand the difference before writing",
      points: [
        "**Summary (Task 1):** Report what the ARTICLE says",
        "**Argument (Task 2):** Express YOUR position with evidence",
        "Summary = objective, Argument = your opinion"
      ],
    }
  ],
  tasks: [
    // Task 1: matches Slide 1
    {
      id: "w1-1-3-t1",
      type: "mc",
      question: "What are the 4 applications of FRT discussed in the article?",
      options: [
        "Security, Attendance, Grading, Discipline",
        "Security, Attendance, Online Verification, Engagement Detection",
        "Attendance, Exams, Homework Tracking, Behavior Monitoring",
        "Security, Biometrics, Testing, Student Tracking"
      ],
      correctAnswer: 1,
      explanation: "The 4 applications are: (1) Campus Security, (2) Attendance Monitoring, (3) Online Learning/Exam Verification, (4) Engagement/Learning Detection."
    },
    // Task 2: matches Slide 2
    {
      id: "w1-1-3-t2",
      type: "short-answer",
      question: "Write ONE sentence summarising Campus Security (Application 1).",
      hints: ["Don't include statistics", "Focus on the main purpose"],
      wordLimit: 30,
      explanation: "Sample: 'One application of facial recognition in schools is campus security, which helps identify intruders and track individuals on school grounds.'"
    },
    // Task 3: matches Slide 3
    {
      id: "w1-1-3-t3",
      type: "mc",
      question: "What is your initial position on FRT in schools?",
      options: [
        "Strongly support - safety is the priority",
        "Slightly support - with some reservations",
        "Slightly oppose - there are too many concerns",
        "Strongly oppose - privacy is more important"
      ],
      correctAnswer: 0, // No correct answer - it's opinion
      explanation: "There's no 'correct' answer! The key is to have a clear position and support it with evidence from the article."
    },
    // Task 4: matches Slide 4
    {
      id: "w1-1-3-t4",
      type: "mc",
      question: "If you SUPPORT FRT, which evidence from the article would you use?",
      options: [
        "The technology can detect gun-shaped objects (Harwell, 2018)",
        "Students grow up normalised to surveillance",
        "The technology might have accuracy problems",
        "Privacy is a major concern"
      ],
      correctAnswer: 0,
      explanation: "The gun detection capability is EVIDENCE for security benefits. The other options are arguments AGAINST FRT."
    },
    // Task 5: matches Slide 5
    {
      id: "w1-1-3-t5",
      type: "mc",
      question: "If you OPPOSE FRT, what would be your strongest argument from the article?",
      options: [
        "It saves teacher time on attendance",
        "It can verify student identity in online exams",
        "It normalises surveillance of young people",
        "It helps detect engaged students"
      ],
      correctAnswer: 2,
      explanation: "The 'normalisation of surveillance' is mentioned in Paragraph 1 and is a strong AGAINST argument about long-term effects on children."
    },
    // Task 6: matches Slide 6
    {
      id: "w1-1-3-t6",
      type: "mc",
      question: "What does the article's TITLE suggest about the authors' view?",
      context: "Title: 'Facial recognition technology in schools: critical questions and concerns'",
      options: [
        "The authors are neutral and balanced",
        "The authors strongly support FRT",
        "The authors have concerns about FRT",
        "The authors don't take a position"
      ],
      correctAnswer: 2,
      explanation: "The words 'critical questions' and 'concerns' in the title signal the authors are skeptical about FRT in schools."
    },
    // Task 7: matches Slide 7
    {
      id: "w1-1-3-t7",
      type: "short-answer",
      question: "Write your position statement for Task 2 (your argument essay).",
      hints: ["Start with: 'Schools should/should not adopt FRT because...'", "Be clear about your stance"],
      wordLimit: 40,
      explanation: "Sample: 'Schools should not adopt facial recognition technology because it normalises surveillance, raises serious privacy concerns, and damages trust between students and educators.'"
    },
    // Task 8: matches Slide 8
    {
      id: "w1-1-3-t8",
      type: "mc",
      question: "What's the difference between your Task 1 (summary) and Task 2 (argument)?",
      options: [
        "Task 1 is your opinion; Task 2 is what the article says",
        "Task 1 is what the article says; Task 2 is your opinion + evidence",
        "Both tasks are about your personal opinion",
        "Both tasks are about summarising the article"
      ],
      correctAnswer: 1,
      explanation: "Task 1 (summary) = report what the ARTICLE says. Task 2 (argument) = express YOUR position using evidence from the article."
    }
  ],
  moduleRef: "Pre-course Writing"
};

// Export all units for Week 1 Hour 1
export const week1Hour1Units: LearningUnit[] = [unit1_1, unit1_2, unit1_3];
