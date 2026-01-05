import { WeekData, WeekMeta } from "../types";

export const week1: WeekData = {
  id: 1,
  title: "Week 1",
  theme: "Introduction to Academic Journal Articles",
  overview:
    "This week introduces you to the basic structure of academic journal articles and the course requirements. You will learn how to identify key components of academic texts and understand different citation styles.",
  inClassActivities: [
    "Course orientation and syllabus overview",
    "Module 1: Activities 1.1, 1.2, 2.1",
    "Introduction to academic journal article structure",
  ],
  learningOutcomes: [
    "Understand the course structure and assessment requirements.",
    "Identify the main components of an academic journal article.",
    "Distinguish between empirical and conceptual articles.",
    "Recognise in-text citations and reference list formats.",
  ],
  resources: [
    {
      title: "Module 1: Components of academic journal articles (Part 1)",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "Flipped video 1: Citing Journal Articles in APA 7th Style",
      type: "video",
      duration: "12 min",
      url: "https://www.youtube.com/watch?v=JpT1YwNcV04",
    },
    {
      title: "Flipped video 2: Citing Secondary Sources in APA 7th Style",
      type: "video",
      duration: "10 min",
      url: "https://www.youtube.com/watch?v=qB6eFDNyz0E",
    },
  ],
  practiceTasks: [
    "Explore the course Moodle page and identify where each assessment is located.",
    "Read the first section of a provided journal article and label its main components (abstract, introduction, etc.).",
    "Open the AI tutor and ask a simple question about what makes a source 'academic'.",
  ],
  aiPromptHint:
    "You help first-year students understand the UCLC1008 course structure and the basic components of academic journal articles and citations.",
  skillsIntroduced: ["journal-structure", "citation-recognition", "secondary-citations"],
  skillsReinforced: [],
  assignmentsUpcoming: ["pre-course-writing", "referencing-quiz"],
  lessons: [
    {
      id: 1,
      title: "Introduction to Academic Journal Articles",
      examples: [],
      notes: [
        "Academic journal articles are peer-reviewed scholarly publications that advance knowledge in a field. For example, an empirical article like 'The Effects of Social Media on Adolescent Mental Health: A Longitudinal Study' reports original research with data collection and analysis, while a conceptual article like 'Rethinking Digital Citizenship in the Age of AI' develops theoretical frameworks and arguments without primary data collection.",
        "Empirical articles present original research findings based on data collection and analysis. They typically include methods, results, and discussion sections with quantitative or qualitative data.",
        "Conceptual articles focus on theoretical development, literature reviews, or philosophical arguments. For example, they might propose new models or critique existing theories without collecting primary data.",
        "Key components of academic articles include: abstract (concise summary, e.g., 150-250 words covering purpose, methods, findings), introduction (background and research purpose), literature review (summary of previous research), methodology (research design and procedures), results (findings from data analysis), discussion (interpretation of results), conclusion (implications and future directions), and references (complete list of cited sources).",
        "Citations follow specific styles like APA, MLA, or Chicago to give credit and allow readers to locate sources. For example, in APA 7th edition: (Smith, 2023) for parenthetical citations or Smith (2023) for narrative citations.",
        "Understanding article types helps determine relevance: read empirical articles for data-driven evidence, conceptual articles for theoretical frameworks and ideas."
      ],
      questions: [
        {
          question: "What is the main difference between empirical and conceptual academic articles?",
          type: "multiple-choice",
          options: [
            "Empirical articles use data and evidence, while conceptual articles focus on theory and ideas",
            "Empirical articles are shorter than conceptual articles",
            "Conceptual articles require peer review, empirical do not",
            "Both types are identical in structure and purpose"
          ],
          answer: "Empirical articles use data and evidence, while conceptual articles focus on theory and ideas",
          explanation: "Empirical articles report original research with data, while conceptual articles develop theories or review existing literature."
        },
        {
          question: "Which of the following is NOT a typical component of an academic journal article?",
          type: "multiple-choice",
          options: ["Abstract", "Introduction", "Methodology", "Product advertisements"],
          answer: "Product advertisements",
          explanation: "Academic articles focus on scholarly content, not commercial advertising."
        },
        {
          question: "True or False: All academic journal articles must include original research data.",
          type: "true-false",
          answer: "False",
          explanation: "Conceptual articles may not include original data but focus on theoretical development or literature synthesis."
        },
        {
          question: "What is the primary purpose of an article's abstract?",
          type: "multiple-choice",
          options: [
            "To provide detailed results and data tables",
            "To give a concise summary of the entire article",
            "To list all references used",
            "To advertise the journal"
          ],
          answer: "To give a concise summary of the entire article",
          explanation: "Abstracts summarize purpose, methods, findings, and implications in 150-250 words."
        },
        {
          question: "Which citation style is commonly used in social sciences and education?",
          type: "multiple-choice",
          options: ["MLA", "APA", "Chicago", "Harvard"],
          answer: "APA",
          explanation: "APA (American Psychological Association) style is widely used in social sciences, education, and psychology."
        },
        {
          question: "Explain the difference between empirical and conceptual articles with an example of each.",
          type: "short-answer",
          answer: "Empirical articles report original research data, e.g., 'A study of 500 students showing social media effects on grades.' Conceptual articles develop theories, e.g., 'A framework for understanding digital learning environments.'",
          explanation: "Demonstrates understanding of article types and their characteristics."
        },
        {
          question: "Why are citations important in academic writing?",
          type: "short-answer",
          answer: "Citations give credit to original authors, allow readers to verify sources, and demonstrate the writer's research.",
          explanation: "Citations maintain academic integrity and enable scholarly conversation."
        },
        {
          question: "True or False: Conceptual articles can include original data if the author chooses.",
          type: "true-false",
          answer: "False",
          explanation: "Conceptual articles typically focus on theory and synthesis rather than primary data collection."
        },
        {
          question: "What should you look for in an article's introduction to determine if it's relevant to your research?",
          type: "short-answer",
          answer: "The research purpose, research questions, and how the study addresses gaps in existing literature.",
          explanation: "Introductions establish the study's context and significance."
        },
        {
          question: "Identify whether this article title suggests an empirical or conceptual study: 'Building a Theoretical Model of Online Learning Motivation'",
          type: "multiple-choice",
          options: ["Empirical - it involves data collection", "Conceptual - it focuses on theory building", "Cannot determine from title alone", "Both empirical and conceptual"],
          answer: "Conceptual - it focuses on theory building",
          explanation: "The title indicates theoretical model development, typical of conceptual work."
        }
      ]
    },
    {
      id: 2,
      title: "Analyzing Titles and Abstracts",
      examples: [],
      notes: [
        "Article titles typically include: subject matter (what the article is about), context or scope (when/where/who), and author's stance or approach (how they address the topic). For example, 'The Impact of Remote Learning on Student Engagement During COVID-19: Evidence from Higher Education Institutions' shows subject (remote learning impact), context (COVID-19, higher education), and stance (evidence-based analysis).",
        "Abstracts provide a concise summary of the entire article, usually 150-250 words. They serve as a 'mini-version' of the full paper to help readers decide if it's worth reading.",
        "Effective abstracts include: background/purpose (why the research matters), methods (how the study was conducted), key findings (main results), and implications (what it means). For example, an abstract might state: 'This study examines social media's effect on academic performance. Survey data from 500 students shows negative correlation with GPA. Results suggest limiting social media use in study areas.'",
        "Reading abstracts helps determine if an article is relevant to your research question by quickly identifying the study's focus, methods, and conclusions.",
        "Abstracts can indicate article type: empirical abstracts mention data collection methods (surveys, experiments), while conceptual abstracts focus on theoretical development or literature synthesis.",
        "When analyzing titles, look for keywords that match your research interests and note the scope (local study vs global analysis)."
      ],
      questions: [
        {
          question: "Analyze this title: 'Digital Literacy Skills Among First-Year University Students: A Comparative Study of Traditional and Online Learners'. What is the author's stance?",
          type: "short-answer",
          answer: "Comparative analysis of traditional vs online learners",
          explanation: "The title indicates a comparative study examining differences between two groups of learners."
        },
        {
          question: "Which component is typically NOT included in a research article abstract?",
          type: "multiple-choice",
          options: ["Research purpose", "Methodology used", "Detailed results tables", "Key implications"],
          answer: "Detailed results tables",
          explanation: "Abstracts summarize key elements but don't include detailed data like full tables."
        },
        {
          question: "Write a brief abstract summary for an article about the benefits of peer tutoring in writing classes. Include purpose, methods, and findings.",
          type: "essay",
          explanation: "Practice condensing article information into abstract format, which is key for AWQ reading comprehension."
        },
        {
          question: "What are the three main components typically found in academic article titles?",
          type: "multiple-choice",
          options: [
            "Author name, journal name, publication date",
            "Subject matter, context/scope, author's stance",
            "Abstract, keywords, references",
            "Introduction, methods, conclusion"
          ],
          answer: "Subject matter, context/scope, author's stance",
          explanation: "Titles usually convey what (subject), when/where (context), and how (stance)."
        },
        {
          question: "True or False: Abstracts should include every detail from the full article.",
          type: "true-false",
          answer: "False",
          explanation: "Abstracts are concise summaries, not comprehensive retellings of the entire article."
        },
        {
          question: "How can reading an abstract help you decide whether to read the full article?",
          type: "short-answer",
          answer: "Abstracts show the study's purpose, methods, findings, and relevance to your research question.",
          explanation: "Abstracts provide enough information to assess if the article matches your needs."
        },
        {
          question: "Identify the subject matter in this title: 'The Role of Artificial Intelligence in Modern Education: Opportunities and Challenges'",
          type: "short-answer",
          answer: "The role of AI in education",
          explanation: "The subject matter is what the article is primarily about."
        },
        {
          question: "What makes an abstract effective for academic readers?",
          type: "multiple-choice",
          options: [
            "Using complex vocabulary to sound scholarly",
            "Including background, methods, findings, and implications clearly",
            "Being as long as possible to cover everything",
            "Focusing only on the results section"
          ],
          answer: "Including background, methods, findings, and implications clearly",
          explanation: "Effective abstracts provide a complete but concise overview of the article's key elements."
        },
        {
          question: "True or False: You can always tell if an article is empirical or conceptual just from the title.",
          type: "true-false",
          answer: "False",
          explanation: "While titles may suggest the approach, you often need the abstract or introduction to confirm the article type."
        },
        {
          question: "Write a sample abstract for a conceptual article about 'The Future of Online Learning Post-Pandemic'.",
          type: "essay",
          explanation: "Practice writing abstracts for different article types, which helps in understanding and creating academic summaries."
        }
      ]
    },
    {
      id: 3,
      title: "Understanding Article Structure and Reading Strategies",
      examples: [],
      notes: [
        "Section headings guide readers through the article's logical flow and argument development. For example, 'Literature Review' typically summarizes previous research and identifies gaps that the current study addresses.",
        "Topic sentences express the main idea of each paragraph and help with skimming. For example, 'Previous studies have shown that active learning improves student retention rates' introduces a paragraph about research on active learning.",
        "Purpose statements in introductions clarify what the article aims to achieve. For example, 'This article examines the effectiveness of flipped classrooms in enhancing student engagement' states the study's main goal.",
        "Effective reading strategies include: previewing section headings to understand the article's organization, reading the abstract first to assess relevance, noting topic sentences to follow the argument, and using headings to navigate to specific sections.",
        "Understanding article structure helps identify the author's main argument and supporting evidence. Common sections include Introduction (background and purpose), Literature Review (previous work), Methodology (research approach), Results (findings), Discussion (interpretation), and Conclusion (implications).",
        "Reading strategies for academic articles: 1) Read abstract for overview, 2) Scan headings and topic sentences, 3) Read introduction and conclusion for main points, 4) Focus on methods and results for empirical articles, 5) Note key citations and references."
      ],
      questions: [
        {
          question: "What is the function of topic sentences in academic paragraphs?",
          type: "multiple-choice",
          options: [
            "To provide detailed evidence",
            "To state the main idea of the paragraph",
            "To cite sources",
            "To transition to the next section"
          ],
          answer: "To state the main idea of the paragraph",
          explanation: "Topic sentences introduce the paragraph's main point and guide the reader."
        },
        {
          question: "Identify the topic sentence in this paragraph: 'Social media has transformed communication patterns among young adults. Studies show that daily usage exceeds 3 hours for most university students. This extensive use affects both social relationships and academic performance. However, some research suggests potential benefits for information sharing.'",
          type: "short-answer",
          answer: "Social media has transformed communication patterns among young adults.",
          explanation: "The first sentence introduces the paragraph's main topic about social media's impact."
        },
        {
          question: "True or False: Section headings in academic articles are only for decoration and don't affect meaning.",
          type: "true-false",
          answer: "False",
          explanation: "Headings provide structural cues that help readers understand the article's organization and argument flow."
        },
        {
          question: "What is a purpose statement in an academic article introduction?",
          type: "multiple-choice",
          options: [
            "A summary of the results",
            "A statement of what the article aims to achieve",
            "A list of references",
            "A description of the methodology"
          ],
          answer: "A statement of what the article aims to achieve",
          explanation: "Purpose statements clarify the article's goals and research questions."
        },
        {
          question: "Which reading strategy involves looking at section headings before reading the full text?",
          type: "multiple-choice",
          options: ["Skimming", "Scanning", "Previewing", "Intensive reading"],
          answer: "Previewing",
          explanation: "Previewing headings helps understand the article's structure and main topics."
        },
        {
          question: "Why are topic sentences important for academic reading?",
          type: "short-answer",
          answer: "They state the main idea of each paragraph, helping readers follow the author's argument and skim for relevant information.",
          explanation: "Topic sentences provide structure and guide comprehension."
        },
        {
          question: "True or False: All academic articles follow the exact same structure with identical section headings.",
          type: "true-false",
          answer: "False",
          explanation: "While there are common patterns, article structure can vary by field and journal requirements."
        },
        {
          question: "What should you do first when reading an academic article for research?",
          type: "multiple-choice",
          options: [
            "Read the entire article from beginning to end",
            "Read the abstract and scan headings",
            "Look at the references only",
            "Skip to the conclusion"
          ],
          answer: "Read the abstract and scan headings",
          explanation: "This helps assess relevance and understand the article's organization before deep reading."
        },
        {
          question: "Identify the purpose statement in this introduction excerpt: 'The rapid advancement of technology in education has created new challenges for teachers. This article examines how artificial intelligence can support personalized learning in classrooms.'",
          type: "short-answer",
          answer: "This article examines how artificial intelligence can support personalized learning in classrooms.",
          explanation: "The purpose statement clearly states what the article will investigate."
        },
        {
          question: "Describe a step-by-step reading strategy for academic articles.",
          type: "essay",
          explanation: "Practice articulating effective reading strategies, which is essential for academic success and assessments."
        }
      ]
    }
  ]
};

export const week1Meta: WeekMeta = {
  dateRange: "13-17 Jan 2026",
  assignmentTagline: "No assessments due – course orientation week",
  assignmentIds: [],
};
