import { WeekData, WeekMeta } from "../types";

export const week4: WeekData = {
  id: 4,
  title: "Week 4",
  theme: "Summarising Skills & AI Workshop 1",
  overview:
    "Consolidate paraphrasing and synthesising while exploring AI tools for precise, ethical academic reading and writing.",
  inClassActivities: [
    "Module 2: Summarising skills",
    "AI Workshop 1: AI Tools for Academic English – Precision in Reading & Writing and Ethical Considerations (1-hour)",
  ],
  learningOutcomes: [
    "Combine information from more than one source into a short synthetic paragraph.",
    "Explain the risks and benefits of using AI tools in academic work.",
    "Apply AI literacy principles when checking your own drafts.",
  ],
  resources: [
    {
      title: "Module 2: Summarising, paraphrasing & synthesising – integration tasks",
      type: "reading",
      duration: "20 min",
    },
    {
      title: "AI Workshop 1: AI tools for academic English (precision & ethics)",
      type: "video",
      duration: "60 min",
    },
    {
      title: "AI use reflection notes",
      type: "practice",
    },
  ],
  practiceTasks: [
    "Write a short synthetic paragraph that combines ideas from two short readings.",
    "Try using an AI tool to check clarity and grammar, then record how you changed the text.",
    "Ask the AI tutor to help you explain why your final version is still your own work.",
  ],
  aiPromptHint:
    "You help students use AI tools as careful reading and editing partners while maintaining academic integrity.",
  skillsIntroduced: ["synthesising", "ai-editing"],
  skillsReinforced: ["summarising", "paraphrasing", "ai-ethics"],
  assignmentsUpcoming: ["academic-writing-quiz"],
  lessons: [
    {
      id: 1,
      title: "Effective Summarising Techniques",
      examples: [
        "Original text: 'Climate change is causing rising sea levels due to melting glaciers and thermal expansion of seawater. This threatens coastal communities worldwide.' Summary: 'Rising sea levels from climate change endanger coastal areas.'",
        "Original text: 'The study found that students who participated in peer tutoring showed significant improvement in math scores, with an average increase of 15 points compared to the control group.' Summary: 'Peer tutoring improved students' math scores by 15 points on average.'",
        "Original text: 'Artificial intelligence has transformed healthcare by enabling faster diagnoses, personalized treatment plans, and predictive analytics for patient outcomes.' Summary: 'AI revolutionizes healthcare through quicker diagnoses, tailored treatments, and outcome predictions.'"
      ],
      notes: [
        "Summarising involves condensing the main ideas of a text while preserving its essential meaning. For example, a 500-word article about climate change can be summarized in 50-75 words focusing on key causes, effects, and implications.",
        "Key steps in summarising: 1) Read the text carefully, 2) Identify main ideas and supporting details, 3) Eliminate redundant information, 4) Use your own words, 5) Check that the summary captures the original meaning.",
        "Effective summaries maintain objectivity and avoid personal opinions. For instance, instead of 'This terrible policy will ruin the economy,' summarize as 'The policy may negatively impact economic growth.'",
        "Summaries should be proportional - major ideas get more space than minor details. Example: In a text about education reform, devote more words to core changes than to implementation timeline.",
        "Use signal words to show relationships between ideas in summaries, such as 'however,' 'therefore,' 'in addition,' to maintain the logical flow of the original text.",
        "Practice summarising by first outlining the text's structure, then writing a concise version that a reader could understand without reading the original."
      ],
      questions: [
        {
          question: "What is the primary goal of summarising an academic text?",
          type: "multiple-choice",
          options: [
            "To copy the text word-for-word",
            "To condense main ideas while preserving meaning",
            "To add personal opinions to the text",
            "To make the text longer"
          ],
          answer: "To condense main ideas while preserving meaning",
          explanation: "Summarising captures essential information in fewer words without losing the original meaning."
        },
        {
          question: "True or False: A good summary should include every detail from the original text.",
          type: "true-false",
          answer: "False",
          explanation: "Summaries eliminate redundant and minor details, focusing only on main ideas."
        },
        {
          question: "Which of the following is a key step in the summarising process?",
          type: "multiple-choice",
          options: [
            "Adding your own opinions",
            "Identifying main ideas and supporting details",
            "Copying sentences directly",
            "Making the text longer"
          ],
          answer: "Identifying main ideas and supporting details",
          explanation: "This step helps determine what to include and what to omit in the summary."
        },
        {
          question: "Why should summaries maintain objectivity?",
          type: "multiple-choice",
          options: [
            "To make them more interesting",
            "To avoid introducing bias or personal opinions",
            "To include more details",
            "To change the original meaning"
          ],
          answer: "To avoid introducing bias or personal opinions",
          explanation: "Objective summaries accurately represent the source without adding subjective interpretations."
        },
        {
          question: "What is meant by 'proportional' in summarising?",
          type: "multiple-choice",
          options: [
            "Making the summary the same length as the original",
            "Giving more space to major ideas than minor details",
            "Including equal space for all ideas",
            "Focusing only on the introduction"
          ],
          answer: "Giving more space to major ideas than minor details",
          explanation: "Major concepts should receive more emphasis than supporting details in summaries."
        },
        {
          question: "Why are signal words important in summaries?",
          type: "multiple-choice",
          options: [
            "They make the summary longer",
            "They show relationships between ideas",
            "They replace main ideas",
            "They add personal opinions"
          ],
          answer: "They show relationships between ideas",
          explanation: "Words like 'however' and 'therefore' maintain the logical flow of the original text."
        },
        {
          question: "True or False: Summaries should be written in your own words.",
          type: "true-false",
          answer: "True",
          explanation: "Paraphrasing prevents plagiarism and demonstrates understanding of the content."
        },
        {
          question: "What should you check after writing a summary?",
          type: "multiple-choice",
          options: [
            "That it includes all minor details",
            "That it captures the original meaning",
            "That it adds new information",
            "That it changes the topic"
          ],
          answer: "That it captures the original meaning",
          explanation: "The summary must accurately represent the source's main ideas."
        },
        {
          question: "Which text would be most appropriate for summarising practice?",
          type: "multiple-choice",
          options: [
            "A personal diary entry",
            "A 500-word academic article",
            "A shopping list",
            "A social media post"
          ],
          answer: "A 500-word academic article",
          explanation: "Academic texts provide complex ideas suitable for summarising practice."
        },
        {
          question: "What is the typical length ratio for a summary compared to the original text?",
          type: "multiple-choice",
          options: [
            "Twice as long",
            "The same length",
            "One-quarter to one-third as long",
            "Three times as long"
          ],
          answer: "One-quarter to one-third as long",
          explanation: "Summaries condense information while retaining essential meaning."
        }
      ]
    },
    {
      id: 2,
      title: "Synthesising Information from Multiple Sources",
      examples: [
        "Source A: 'Exercise improves cardiovascular health.' Source B: 'Regular physical activity reduces stress.' Synthesis: 'Exercise benefits both physical health through improved cardiovascular function and mental health by reducing stress levels.'",
        "Source A: 'Social media increases connectivity.' Source B: 'Excessive social media use leads to anxiety.' Synthesis: 'While social media enhances connectivity, excessive use can contribute to anxiety, requiring balanced usage.'",
        "Source A: 'Remote work improves productivity.' Source B: 'Remote work can cause isolation.' Synthesis: 'Remote work boosts productivity but may lead to social isolation, suggesting the need for virtual team-building strategies.'"
      ],
      notes: [
        "Synthesis combines information from multiple sources to create new understanding. For example, combining research on diet and exercise creates comprehensive health recommendations.",
        "Steps for synthesis: 1) Read all sources, 2) Identify common themes, 3) Note contradictions, 4) Find connections, 5) Create unified narrative.",
        "Use citations when synthesising to show which ideas come from which sources. Example: 'Studies show that diet affects health (Smith, 2023) and exercise complements these effects (Johnson, 2024).'",
        "Synthesis requires critical thinking to resolve conflicting information. For instance, if one source claims 'coffee is harmful' and another 'coffee is beneficial,' synthesize as 'moderate coffee consumption may be beneficial despite some risks.'",
        "Effective synthesis creates value beyond individual sources by showing relationships and implications.",
        "Practice synthesis by creating mind maps connecting ideas from different texts, then writing integrated paragraphs."
      ],
      questions: [
        {
          question: "What is the main purpose of synthesising information from multiple sources?",
          type: "multiple-choice",
          options: [
            "To copy information directly",
            "To create new understanding by combining ideas",
            "To find contradictions only",
            "To summarize each source separately"
          ],
          answer: "To create new understanding by combining ideas",
          explanation: "Synthesis integrates information to form comprehensive insights beyond individual sources."
        },
        {
          question: "True or False: Synthesis can only occur when sources agree completely.",
          type: "true-false",
          answer: "False",
          explanation: "Synthesis often involves resolving contradictions and finding balanced perspectives."
        },
        {
          question: "Which step comes first in the synthesis process?",
          type: "multiple-choice",
          options: [
            "Writing the unified narrative",
            "Reading all sources carefully",
            "Creating citations",
            "Finding contradictions"
          ],
          answer: "Reading all sources carefully",
          explanation: "Understanding all sources is essential before identifying connections."
        },
        {
          question: "Why are citations important in synthesis?",
          type: "multiple-choice",
          options: [
            "To make the text longer",
            "To show which ideas come from which sources",
            "To avoid reading the sources",
            "To replace the synthesis"
          ],
          answer: "To show which ideas come from which sources",
          explanation: "Citations give credit and allow readers to verify information."
        },
        {
          question: "What should you do when sources present conflicting information?",
          type: "multiple-choice",
          options: [
            "Ignore one source",
            "Use critical thinking to find balance",
            "Copy both without comment",
            "Create your own opinion"
          ],
          answer: "Use critical thinking to find balance",
          explanation: "Synthesis requires evaluating evidence and presenting nuanced views."
        },
        {
          question: "True or False: Effective synthesis adds value beyond individual sources.",
          type: "true-false",
          answer: "True",
          explanation: "Synthesis creates new insights by showing relationships and implications."
        },
        {
          question: "What tool can help with synthesis practice?",
          type: "multiple-choice",
          options: [
            "Direct copying",
            "Mind maps connecting ideas",
            "Ignoring connections",
            "Single-source summaries"
          ],
          answer: "Mind maps connecting ideas",
          explanation: "Mind maps help visualize relationships between concepts from different sources."
        },
        {
          question: "Which of the following is an example of synthesis?",
          type: "multiple-choice",
          options: [
            "Source A says X. Source B says Y.",
            "Combining X and Y to show how they relate",
            "Summarizing Source A only",
            "Quoting Source B directly"
          ],
          answer: "Combining X and Y to show how they relate",
          explanation: "Synthesis integrates information rather than presenting it separately."
        },
        {
          question: "What makes synthesis different from summarising?",
          type: "multiple-choice",
          options: [
            "Synthesis uses only one source",
            "Synthesis combines multiple sources",
            "Summarising creates new understanding",
            "Both are identical"
          ],
          answer: "Synthesis combines multiple sources",
          explanation: "While summarising condenses one text, synthesis integrates multiple texts."
        },
        {
          question: "True or False: Synthesis always requires agreeing with all sources.",
          type: "true-false",
          answer: "False",
          explanation: "Synthesis can acknowledge disagreements while finding balanced perspectives."
        }
      ]
    },
    {
      id: 3,
      title: "Ethical Use of AI Tools in Academic Writing",
      examples: [
        "Using AI for grammar checking: Original: 'The study show that students learn better with interactive methods.' AI suggestion: 'The study shows that students learn better with interactive methods.' Student decision: Keep the change as it corrects grammar without changing meaning.",
        "Using AI for clarity: Original: 'The methodology utilized a mixed-methods approach incorporating both quantitative and qualitative data collection techniques.' AI suggestion: 'The study used a mixed-methods approach with both quantitative and qualitative data.' Student decision: Accept to improve readability while ensuring accuracy.",
        "Using AI for structure: AI suggests an outline for an essay. Student uses the outline but writes all content themselves, ensuring the final work reflects their own understanding."
      ],
      notes: [
        "AI tools can help with grammar, clarity, and structure, but students must understand and approve all changes. For example, use AI to check for passive voice, then decide if active voice improves the text.",
        "Ethical AI use requires maintaining academic integrity - AI should assist, not replace, your thinking and writing. Example: Ask AI 'How can I improve this paragraph?' rather than 'Write this paragraph for me.'",
        "Benefits of AI: faster editing, consistency checking, style suggestions. Risks: over-reliance, plagiarism if not properly attributed, loss of learning opportunity.",
        "Always review AI suggestions critically. For instance, if AI suggests changing 'data shows' to 'data show,' verify the subject-verb agreement yourself.",
        "Document AI use in reflections to demonstrate learning. Example: 'I used Grammarly to check spelling, then manually verified suggestions to ensure they didn't change my intended meaning.'",
        "AI literacy includes understanding limitations - AI may miss context-specific errors or cultural nuances in academic writing."
      ],
      questions: [
        {
          question: "What is the primary ethical consideration when using AI in academic writing?",
          type: "multiple-choice",
          options: [
            "Making writing faster",
            "Maintaining academic integrity",
            "Avoiding all technology",
            "Using AI for all writing tasks"
          ],
          answer: "Maintaining academic integrity",
          explanation: "AI should assist learning, not replace the student's own work and understanding."
        },
        {
          question: "True or False: AI tools can completely replace human writing in academic work.",
          type: "true-false",
          answer: "False",
          explanation: "AI should assist, not replace, the student's thinking and writing process."
        },
        {
          question: "Which of the following is an ethical way to use AI?",
          type: "multiple-choice",
          options: [
            "Asking AI to write your entire essay",
            "Using AI to check grammar and then reviewing changes",
            "Copying AI-generated text without citation",
            "Ignoring AI suggestions completely"
          ],
          answer: "Using AI to check grammar and then reviewing changes",
          explanation: "This approach uses AI as a tool while maintaining control over the content."
        },
        {
          question: "Why should students review AI suggestions critically?",
          type: "multiple-choice",
          options: [
            "AI is always wrong",
            "AI may miss context or make inappropriate changes",
            "To make writing slower",
            "AI suggestions are final"
          ],
          answer: "AI may miss context or make inappropriate changes",
          explanation: "AI lacks human understanding of nuance, context, and academic conventions."
        },
        {
          question: "What is a benefit of using AI tools in academic writing?",
          type: "multiple-choice",
          options: [
            "Replacing all thinking",
            "Faster editing and consistency checking",
            "Avoiding learning",
            "Creating plagiarism"
          ],
          answer: "Faster editing and consistency checking",
          explanation: "AI can help with mechanical aspects, freeing time for content development."
        },
        {
          question: "True or False: Students should document their use of AI tools.",
          type: "true-false",
          answer: "True",
          explanation: "Documentation demonstrates learning and responsible AI use."
        },
        {
          question: "What is AI literacy in academic writing?",
          type: "multiple-choice",
          options: [
            "Using AI for everything",
            "Understanding AI limitations and ethical use",
            "Avoiding AI completely",
            "Treating AI as infallible"
          ],
          answer: "Understanding AI limitations and ethical use",
          explanation: "AI literacy involves knowing when and how to use AI appropriately."
        },
        {
          question: "Which question demonstrates ethical AI use?",
          type: "multiple-choice",
          options: [
            "'Write my essay for me'",
            "'How can I improve this paragraph?'",
            "'Give me the answers to this quiz'",
            "'Do all my work'"
          ],
          answer: "'How can I improve this paragraph?'",
          explanation: "This asks for guidance rather than complete work, promoting learning."
        },
        {
          question: "True or False: AI can detect all errors in academic writing.",
          type: "true-false",
          answer: "False",
          explanation: "AI may miss contextual, cultural, or discipline-specific issues."
        },
        {
          question: "What should students do if AI suggests an inappropriate change?",
          type: "multiple-choice",
          options: [
            "Accept it anyway",
            "Reject it and use their own judgment",
            "Ignore all AI suggestions",
            "Use AI for everything instead"
          ],
          answer: "Reject it and use their own judgment",
          explanation: "Students must evaluate suggestions and maintain control over their work."
        }
      ]
    }
  ]
};

export const week4Meta: WeekMeta = {
  dateRange: "3-7 Feb 2026",
  assignmentTagline: "Prepare for Academic Writing Quiz",
  assignmentIds: [],
};
