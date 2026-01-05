import { WeekData, WeekMeta } from "../types";

export const week3: WeekData = {
  id: 3,
  title: "Week 3",
  theme: "Summarising & Paraphrasing Skills (continued)",
  overview:
    "Deepen your summarising and paraphrasing skills in preparation for the Referencing Quiz.",
  inClassActivities: [
    "Module 1: Activity 5.1",
    "Module 2: Activities 1.1, 1.2, 1.3 (continued)",
  ],
  learningOutcomes: [
    "Summarise short academic passages accurately and concisely.",
    "Paraphrase ideas while maintaining original meaning and citation information.",
    "Recognise common referencing formats that may appear in the quiz.",
  ],
  resources: [
    {
      title: "Module 2: Summarising, paraphrasing & synthesising skills – practice set",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "Referencing patterns in sample texts",
      type: "reading",
      duration: "15 min",
    },
    {
      title: "Referencing Quiz preparation checklist",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Complete a short set of paraphrasing exercises using provided extracts.",
    "Write one-paragraph summaries for two short sections of an article and add correct in-text citations.",
    "Use the AI tutor to check whether your citation style and paraphrasing are suitable for the quiz.",
  ],
  aiPromptHint:
    "You help students practise summarising and paraphrasing with correct in-text citations so they feel prepared for the Referencing Quiz.",
  skillsIntroduced: ["apa-referencing"],
  skillsReinforced: ["summarising", "paraphrasing", "citation-recognition", "secondary-citations"],
  assignmentsDue: ["referencing-quiz"],
  lessons: [
    {
      id: 1,
      title: "Advanced Paraphrasing Techniques",
      examples: [
        "Original: 'Social media platforms have revolutionized communication by allowing instant sharing of information across geographical boundaries.' Paraphrase: 'Communication has been transformed by social media, which enables people to exchange information immediately regardless of location.'",
        "Original: 'The study found that students who participated in peer tutoring showed significant improvement in their writing skills.' Paraphrase: 'Research indicated that learners involved in mutual teaching programs demonstrated notable gains in their composition abilities.'",
        "Original: 'Climate change poses serious threats to biodiversity in coastal ecosystems.' Paraphrase: 'Alterations in global weather patterns present major dangers to the variety of life forms in seaside environments.'"
      ],
      notes: [
        "Paraphrasing involves restating ideas in your own words while maintaining the original meaning and academic tone. For example, change 'The research demonstrates clear evidence of correlation' to 'The study shows a definite relationship exists'.",
        "Use synonyms strategically but avoid changing technical terms unless you explain them. For instance, 'photosynthesis' should remain 'photosynthesis' unless you're teaching basic biology concepts.",
        "Change sentence structure when paraphrasing: convert active voice to passive, combine sentences, or break complex sentences into simpler ones. Example: Original (active): 'Researchers conducted experiments.' Paraphrase (passive): 'Experiments were conducted by researchers.'",
        "Always cite the source when paraphrasing to avoid plagiarism. Use formats like (Smith, 2023) or Smith (2023) states that... depending on APA style guidelines.",
        "Check your paraphrase against the original to ensure you haven't accidentally copied phrases or changed the meaning. Read both versions aloud to verify clarity and accuracy.",
        "Practice paraphrasing helps develop deeper understanding of texts and improves your academic writing vocabulary."
      ],
      questions: [
        {
          question: "Which of the following is the best paraphrase of: 'The implementation of technology in classrooms has dramatically improved student engagement.'",
          type: "multiple-choice",
          options: [
            "Technology has been implemented in classrooms, leading to better student engagement.",
            "The use of technology in educational settings has significantly enhanced student participation.",
            "Classrooms now use technology to make students more engaged.",
            "Technology implementation has improved engagement dramatically."
          ],
          answer: "The use of technology in educational settings has significantly enhanced student participation.",
          explanation: "This paraphrase uses different words and structure while maintaining the original meaning."
        },
        {
          question: "True or False: When paraphrasing, you should always change every single word to synonyms.",
          type: "true-false",
          answer: "False",
          explanation: "Technical terms and key concepts should remain unchanged; focus on rephrasing the overall structure."
        },
        {
          question: "Paraphrase this sentence: 'Artificial intelligence applications in education are expanding rapidly.' Include a proper APA citation.",
          type: "short-answer",
          answer: "The use of AI in educational contexts is growing quickly (Smith, 2023).",
          explanation: "Demonstrates paraphrasing skills with correct citation format."
        },
        {
          question: "What is the main purpose of paraphrasing in academic writing?",
          type: "multiple-choice",
          options: [
            "To make text shorter",
            "To demonstrate understanding of source material",
            "To avoid using citations",
            "To change the original meaning"
          ],
          answer: "To demonstrate understanding of source material",
          explanation: "Paraphrasing shows comprehension and allows integration of ideas without direct quotation."
        },
        {
          question: "Identify the error in this paraphrase: Original: 'The survey revealed that 70% of participants preferred online learning.' Paraphrase: 'The study showed that most respondents liked distance education.'",
          type: "multiple-choice",
          options: [
            "Changed meaning from specific percentage to vague 'most'",
            "Used different words",
            "Maintained academic tone",
            "No error - it's a good paraphrase"
          ],
          answer: "Changed meaning from specific percentage to vague 'most'",
          explanation: "Paraphrases must preserve specific details and quantitative information."
        },
        {
          question: "When should you use direct quotation instead of paraphrasing?",
          type: "short-answer",
          answer: "When the original wording is particularly eloquent, technical, or when exact reproduction is necessary.",
          explanation: "Direct quotes preserve original language for emphasis or precision."
        },
        {
          question: "True or False: Paraphrasing requires citation just like direct quotations.",
          type: "true-false",
          answer: "True",
          explanation: "All borrowed ideas, whether paraphrased or quoted, must be cited to avoid plagiarism."
        },
        {
          question: "Rewrite this paraphrase to improve it: 'The researchers discovered that social media affects sleep patterns negatively.' (Original: 'Studies show social media usage disrupts sleep cycles.')",
          type: "short-answer",
          answer: "Research indicates that social media negatively impacts sleep patterns.",
          explanation: "Improved version uses more precise academic language and maintains original meaning."
        },
        {
          question: "Which of these paraphrases best maintains the original meaning: 'The policy change resulted in immediate improvements.'",
          type: "multiple-choice",
          options: [
            "The alteration in policy led to instant betterments.",
            "The policy change caused quick enhancements.",
            "The modification of policy brought about rapid advancements.",
            "All of the above are equally good."
          ],
          answer: "The policy change caused quick enhancements.",
          explanation: "This version preserves the cause-effect relationship and timing without being awkward."
        },
        {
          question: "Explain why changing sentence structure is important when paraphrasing.",
          type: "short-answer",
          answer: "Changing structure avoids copying the original author's phrasing and demonstrates deeper understanding of the content.",
          explanation: "Structural changes show comprehension beyond surface-level word substitution."
        }
      ]
    },
    {
      id: 2,
      title: "Effective Summarizing Strategies",
      examples: [
        "Original text: 'Climate change is causing rising sea levels due to melting glaciers and thermal expansion of seawater. This threatens coastal communities worldwide, leading to increased flooding and erosion. Adaptation strategies include building sea walls and relocating populations.' Summary: 'Rising sea levels from climate change threaten coastal areas through flooding and erosion, requiring adaptation measures like infrastructure and relocation.'",
        "Original text: 'The study examined the impact of social media on academic performance among university students. Researchers surveyed 500 participants and found that excessive social media use correlated with lower GPA scores. However, moderate use showed no significant negative effects.' Summary: 'A study of 500 university students found that excessive social media use negatively affects GPA, while moderate use has no significant impact.'",
        "Original text: 'Artificial intelligence is transforming education by providing personalized learning experiences. AI systems can adapt content to individual student needs, offer instant feedback, and identify learning gaps. However, concerns about data privacy and algorithmic bias remain.' Summary: 'AI enhances education through personalized learning and feedback but raises privacy and bias concerns.'"
      ],
      notes: [
        "Summaries should be concise, typically 1/3 to 1/4 the length of the original text. For example, summarize a 300-word paragraph in 75-100 words.",
        "Include only the main ideas and key supporting details, omitting examples, anecdotes, and minor points. Example: From a detailed article about online learning, summarize as 'Online education offers flexibility but requires self-discipline.'",
        "Maintain neutral, objective tone and avoid adding personal opinions. Use the author's original perspective without bias.",
        "Use your own words and sentence structure, but preserve technical terms and specific data. For instance, keep percentages, dates, and proper nouns unchanged.",
        "Structure summaries logically: begin with the main idea, include key supporting points, and end with conclusions or implications.",
        "Always cite the source of summarized material using appropriate APA format, such as (Johnson & Smith, 2023)."
      ],
      questions: [
        {
          question: "What is the ideal length for a summary compared to the original text?",
          type: "multiple-choice",
          options: [
            "Same length as original",
            "Twice as long",
            "1/3 to 1/4 the original length",
            "As short as possible (1-2 sentences)"
          ],
          answer: "1/3 to 1/4 the original length",
          explanation: "Summaries condense information while retaining essential points."
        },
        {
          question: "True or False: Summaries should include every detail from the original text.",
          type: "true-false",
          answer: "False",
          explanation: "Summaries focus on main ideas, omitting minor details and examples."
        },
        {
          question: "Summarize this paragraph in 2-3 sentences: 'Mobile technology has revolutionized communication globally. Smartphones enable instant messaging, video calls, and social networking across continents. However, this connectivity comes with challenges including privacy concerns and reduced face-to-face interactions.'",
          type: "essay",
          explanation: "Practice condensing information while maintaining key points and citation readiness."
        },
        {
          question: "Which element should you ALWAYS include in an academic summary?",
          type: "multiple-choice",
          options: [
            "Your personal opinion",
            "Every example from the original",
            "A citation to the source",
            "Technical jargon explanations"
          ],
          answer: "A citation to the source",
          explanation: "Citations give credit and allow readers to locate the original source."
        },
        {
          question: "Identify what makes this a poor summary: 'The article talks about many things like technology, education, and some studies. It has interesting points and the author seems knowledgeable.'",
          type: "multiple-choice",
          options: [
            "Too long",
            "Includes personal opinion",
            "Lacks specific details",
            "All of the above"
          ],
          answer: "All of the above",
          explanation: "Good summaries are objective, concise, and include specific main points."
        },
        {
          question: "When summarizing, you should prioritize including:",
          type: "multiple-choice",
          options: [
            "The author's writing style",
            "Main ideas and key evidence",
            "Every statistic mentioned",
            "Background anecdotes"
          ],
          answer: "Main ideas and key evidence",
          explanation: "Focus on core content that supports the author's main arguments."
        },
        {
          question: "True or False: Summaries can be written in the first person.",
          type: "true-false",
          answer: "False",
          explanation: "Academic summaries maintain objective, third-person perspective."
        },
        {
          question: "What should you do if the original text contains conflicting evidence?",
          type: "short-answer",
          answer: "Present both sides fairly without adding bias or choosing sides.",
          explanation: "Summaries must remain objective and represent the source accurately."
        },
        {
          question: "Which of these is the best summary of: 'Research shows that exercise improves mental health, reduces stress, and enhances cognitive function.'",
          type: "multiple-choice",
          options: [
            "Exercise is good for you in many ways.",
            "Studies indicate exercise benefits mental health, decreases stress, and boosts brain function.",
            "The article discusses exercise and its effects on the body and mind.",
            "Exercise research shows various positive outcomes."
          ],
          answer: "Studies indicate exercise benefits mental health, decreases stress, and boosts brain function.",
          explanation: "This summary captures all key points concisely using parallel structure."
        },
        {
          question: "Why is it important to maintain the original author's perspective in a summary?",
          type: "short-answer",
          answer: "To avoid introducing bias and to accurately represent the source material's viewpoint.",
          explanation: "Summaries should reflect the original intent and conclusions without distortion."
        }
      ]
    },
    {
      id: 3,
      title: "Citation Integration in Summaries and Paraphrases",
      examples: [
        "Paraphrase with citation: According to Johnson (2023), social media platforms have transformed communication patterns globally. OR: Social media has revolutionized global communication (Johnson, 2023).",
        "Summary with citation: Research indicates that online learning offers flexibility but requires strong self-regulation skills (Smith & Brown, 2022).",
        "Secondary citation: As noted by Taylor (2021, as cited in Williams, 2023), artificial intelligence will reshape educational practices."
      ],
      notes: [
        "In-text citations appear immediately after paraphrased or summarized material. For example: 'Online education provides flexible scheduling options (Johnson, 2023).'",
        "Use 'et al.' for sources with three or more authors after the first citation: (Smith et al., 2022).",
        "Page numbers are required for direct quotations but optional for paraphrases and summaries, though recommended for specific claims: (Johnson, 2023, p. 45).",
        "Secondary citations credit the original source when you read about it in another author's work: Freud's theory of the id (as cited in Brown, 2023).",
        "Narrative citations integrate the author's name into the sentence: Smith (2023) argues that... Parenthetical citations place the reference in parentheses: ...has been shown (Smith, 2023).",
        "Multiple sources supporting the same point can be cited together: Several studies confirm this trend (Johnson, 2022; Smith, 2023; Williams, 2024).",
        "Always check your reference list format matches your in-text citations for consistency."
      ],
      questions: [
        {
          question: "Which citation format is correct for a source with two authors?",
          type: "multiple-choice",
          options: [
            "(Smith and Johnson, 2023)",
            "(Smith & Johnson, 2023)",
            "(Smith et al., 2023)",
            "(Smith, Johnson, 2023)"
          ],
          answer: "(Smith & Johnson, 2023)",
          explanation: "APA uses '&' in parenthetical citations and 'and' in narrative citations."
        },
        {
          question: "True or False: Page numbers are always required in APA citations.",
          type: "true-false",
          answer: "False",
          explanation: "Page numbers are required for direct quotes but optional for paraphrases and summaries."
        },
        {
          question: "How would you cite a secondary source where you read about Smith's 2020 work in Johnson's 2023 article?",
          type: "short-answer",
          answer: "Smith's theory (as cited in Johnson, 2023)",
          explanation: "Secondary citations credit both the original and the source where you found it."
        },
        {
          question: "What is the difference between narrative and parenthetical citations?",
          type: "multiple-choice",
          options: [
            "Narrative citations are longer",
            "Parenthetical citations integrate the author name into the sentence",
            "Narrative citations go at the end of paragraphs",
            "There is no difference"
          ],
          answer: "Parenthetical citations integrate the author name into the sentence",
          explanation: "Actually, narrative citations integrate the name (Smith (2023) states...), parenthetical use parentheses ((Smith, 2023))."
        },
        {
          question: "When should you use 'et al.' in citations?",
          type: "multiple-choice",
          options: [
            "For all sources with multiple authors",
            "Only for sources with three or more authors",
            "Never in APA style",
            "Only for secondary sources"
          ],
          answer: "Only for sources with three or more authors",
          explanation: "List all authors for sources with 1-2 authors; use et al. for 3+."
        },
        {
          question: "Correct this citation error: 'According to research (Smith 2023), online learning is effective.'",
          type: "short-answer",
          answer: "According to research (Smith, 2023), online learning is effective.",
          explanation: "APA requires comma between author and year in parenthetical citations."
        },
        {
          question: "True or False: You can cite multiple sources in one parenthetical citation.",
          type: "true-false",
          answer: "True",
          explanation: "Multiple sources can be cited together: (Smith, 2022; Johnson, 2023)."
        },
        {
          question: "What information should be included in a complete APA in-text citation?",
          type: "multiple-choice",
          options: [
            "Author name, year, page number, journal name",
            "Author name and year (page number for quotes)",
            "Full reference list entry",
            "Author name, title, publisher"
          ],
          answer: "Author name and year (page number for quotes)",
          explanation: "Basic APA citations include author and year; page numbers for direct quotes."
        },
        {
          question: "Identify the correct way to cite this paraphrase: Johnson argues that technology enhances learning outcomes.",
          type: "multiple-choice",
          options: [
            "Johnson argues that technology enhances learning outcomes (2023).",
            "Johnson (2023) argues that technology enhances learning outcomes.",
            "Johnson argues that 'technology enhances learning outcomes' (2023).",
            "Both A and B are correct"
          ],
          answer: "Both A and B are correct",
          explanation: "Both narrative and parenthetical formats are acceptable for paraphrases."
        },
        {
          question: "Why is proper citation important in academic summaries and paraphrases?",
          type: "short-answer",
          answer: "To give credit to original authors, avoid plagiarism, and allow readers to locate sources.",
          explanation: "Citations maintain academic integrity and enable verification of information."
        }
      ]
    }
  ]
};

export const week3Meta: WeekMeta = {
  dateRange: "27-31 Jan 2026",
  assignmentTagline: "Referencing Quiz due 30 Jan",
  assignmentIds: ["referencing-quiz"],
};
