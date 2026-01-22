/**
 * Preset task bank for Hour 3 practice sessions across all weeks.
 * Each week has its own set of tasks aligned with the curriculum.
 */

import type { Hour3Task, TaskExcerpt } from '../types';

// FRT Article excerpts for Week 2 tasks
const FRT_EXCERPT_FULL = `Facial recognition technology (FRT) is increasingly being adopted by schools in a variety of ways. In the US, school shooting incidents have prompted school authorities to invest heavily in security systems. The US school security industry is estimated to be currently valued at $2.7 billion, with thousands of schools having purchased some form of facial recognition system. Vendors are pitching the technology as an all-seeing shield protecting schools and students from mass-shootings and other violent incidents.

Beyond these security applications, FRT is being used in schools to automate time-consuming administrative tasks. For example, some schools use the technology to monitor attendance — with students' faces being scanned upon entry to their schools, as well as when entering individual classrooms. Similarly, FRT is being used by schools offering online courses to verify student identities while they are completing assessments.

A fourth emerging application is the use of FRT in schools to monitor student engagement and wellbeing. The technology is being promoted to schools as a means of gaining insight into student emotional states and engagement in learning. Some software claims to be able to infer students' moods from their facial expressions — labelling them as happy, sad, angry, surprised, scared or neutral.`;

const FRT_EXCERPT_PREVIEW = "Facial recognition technology (FRT) is increasingly being adopted by schools in a variety of ways. In the US, school shooting incidents have prompted school authorities to invest heavily in security systems...";

const FRT_APPLICATIONS_EXCERPT: TaskExcerpt = {
  label: "Andrejevic & Selwyn (2020) – FRT Applications in Schools",
  preview: FRT_EXCERPT_PREVIEW,
  full: FRT_EXCERPT_FULL
};

const FRT_SECURITY_EXCERPT: TaskExcerpt = {
  label: "Andrejevic & Selwyn (2020) – Security Marketing",
  preview: "Vendors are pitching the technology as an all-seeing shield protecting schools and students from mass-shootings...",
  full: `In the US, school shooting incidents have prompted school authorities to invest heavily in security systems. The US school security industry is estimated to be currently valued at $2.7 billion, with thousands of schools having purchased some form of facial recognition system. Vendors are pitching the technology as an all-seeing shield protecting schools and students from mass-shootings and other violent incidents.

Note: The phrase "pitching the technology as" indicates this is a marketing claim by vendors, not a proven capability. The authors are reporting what vendors say, not endorsing these claims.`
};

// Week 1: Basic Paraphrasing & Reading Strategies
export const WEEK1_HOUR3_TASKS: Hour3Task[] = [
  {
    id: "w1-paraphrase-basics-1",
    title: "Basic Paraphrasing Practice",
    prompt: `Paraphrase the following sentence using at least 2 strategies (synonym replacement, sentence restructuring, or voice change):

"Against this contentious background, then, we need to consider how these technologies are being applied to the specific context of education."`,
    skillFocus: ["paraphrasing", "synonym-replacement", "sentence-structure"],
    wordLimit: 50,
    rubricPoints: [
      "Uses at least 2 paraphrasing strategies",
      "Preserves the original meaning",
      "Does not copy key phrases verbatim"
    ]
  },
  {
    id: "w1-paraphrase-basics-2",
    title: "Identify Paraphrasing Strategies",
    prompt: `Read the original and paraphrased versions below. Identify which strategies were used:

Original: "The rapid development of artificial intelligence has transformed many industries."

Paraphrase: "Many sectors have been revolutionized by the swift advancement of AI technology."

List the strategies you can identify.`,
    skillFocus: ["paraphrasing", "analysis"],
    wordLimit: 100,
    rubricPoints: [
      "Identifies synonym replacement",
      "Identifies sentence restructuring",
      "Explains each strategy clearly"
    ]
  },
  {
    id: "w1-reading-purpose",
    title: "Reading with Purpose",
    prompt: `You need to find information about "the benefits of online learning for university students" from an academic article.

Which sections of a typical academic article would you prioritize reading first, and why? List at least 3 sections in order of priority.`,
    skillFocus: ["reading-strategies", "skimming", "scanning"],
    wordLimit: 80,
    rubricPoints: [
      "Identifies relevant sections (Abstract, Introduction, Conclusion)",
      "Provides logical reasoning",
      "Demonstrates understanding of article structure"
    ]
  }
];

// Week 2: Pre-course Writing Feedback Practice
// Tasks aligned with common issues found in student summaries
export const WEEK2_HOUR3_TASKS: Hour3Task[] = [
  // Summary Accuracy tasks
  {
    id: "w2-summary-coverage",
    title: "Complete Coverage Check",
    prompt: `The FRT article describes FOUR main applications. A student's summary says:

"Facial recognition technology is used in schools for security, monitoring attendance, and verifying student identity in online courses."

What is MISSING from this summary? Write 2-3 sentences describing the missing application and why it matters.`,
    skillFocus: ["summary-accuracy", "completeness"],
    wordLimit: 60,
    rubricPoints: [
      "Identifies the missing application (engagement detection/emotion monitoring)",
      "Explains what this application involves",
      "Understands why comprehensive coverage matters"
    ],
    excerpts: [FRT_APPLICATIONS_EXCERPT]
  },
  {
    id: "w2-personal-opinion",
    title: "Remove Personal Opinion",
    prompt: `This summary sentence contains personal opinion. Identify the problem and rewrite it as a neutral summary:

"FRT is clearly beneficial for schools as it can reduce school shooting incidents and help teachers save valuable time on administrative tasks."

Rewrite WITHOUT personal evaluation while keeping the factual content.`,
    skillFocus: ["summary-accuracy", "objectivity"],
    wordLimit: 50,
    rubricPoints: [
      "Identifies 'clearly beneficial' as personal evaluation",
      "Rewrites in neutral, descriptive language",
      "Preserves the factual claims from the source"
    ],
    excerpts: [FRT_APPLICATIONS_EXCERPT]
  },
  // Paraphrasing tasks
  {
    id: "w2-patchwriting",
    title: "Fix Patchwriting",
    prompt: `This is patchwriting (not acceptable paraphrasing):

Original: "school shooting incidents have prompted school authorities to invest heavily in security systems"
Student: "school shooting events have caused school authorities to invest significantly in security systems"

The student only changed 3 words. Rewrite with COMPLETE paraphrasing (different structure AND vocabulary).`,
    skillFocus: ["paraphrasing", "restructuring"],
    wordLimit: 40,
    rubricPoints: [
      "Changes sentence structure completely",
      "Uses different vocabulary throughout",
      "Preserves the original meaning accurately"
    ],
    excerpts: [{
      label: "Andrejevic & Selwyn (2020) – Original Sentence",
      preview: "school shooting incidents have prompted school authorities to invest heavily in security systems",
      full: `Original sentence in context:

"In the US, school shooting incidents have prompted school authorities to invest heavily in security systems. The US school security industry is estimated to be currently valued at $2.7 billion, with thousands of schools having purchased some form of facial recognition system."

Key meaning to preserve:
• Cause: school shootings in the US
• Effect: schools spending lots of money on security
• This is describing a factual trend, not making a judgment`
    }]
  },
  {
    id: "w2-preserve-nuance",
    title: "Preserve Nuance",
    prompt: `The source says vendors are "pitching the technology as an all-seeing shield."

A student paraphrased this as: "FRT can prevent all school shootings."

What is WRONG with this paraphrase? Write 2-3 sentences explaining the problem, then write a better paraphrase that preserves the nuance.`,
    skillFocus: ["paraphrasing", "meaning-preservation"],
    wordLimit: 80,
    rubricPoints: [
      "Identifies that original describes marketing claims, not proven effectiveness",
      "Explains the difference between 'pitched as' and 'can prevent'",
      "Writes a paraphrase that preserves the marketing/claim language"
    ],
    excerpts: [FRT_SECURITY_EXCERPT]
  },
  // Academic Tone tasks
  {
    id: "w2-formal-language",
    title: "Fix Informal Language",
    prompt: `Rewrite these informal sentences in academic style:

1. "FRT is a really big deal in schools nowadays."
2. "What's more, it can also be used for taking attendance."
3. "A lot of schools are using this tech."

Write all three sentences in formal academic English.`,
    skillFocus: ["academic-tone", "formal-register"],
    wordLimit: 60,
    rubricPoints: [
      "Replaces 'really big deal' with formal expression",
      "Replaces 'What's more' with academic transition",
      "Replaces 'a lot of' and 'tech' with precise language"
    ],
    excerpts: [{
      label: "Academic vs Informal Language Guide",
      preview: "Academic writing avoids casual expressions, contractions, and vague quantifiers...",
      full: `Academic Writing Conventions:

AVOID → USE INSTEAD
• "really big deal" → "significant development" / "increasingly prevalent"
• "What's more" → "Furthermore" / "Additionally" / "Moreover"
• "a lot of" → "many" / "numerous" / "a significant number of"
• "tech" → "technology"
• "nowadays" → "currently" / "in recent years"

Academic writing should be:
• Precise (avoid vague words like "stuff", "things", "a lot")
• Formal (avoid contractions and casual expressions)
• Objective (avoid emotional language)`
    }]
  },
  {
    id: "w2-thesis-statement",
    title: "Write a Clear Thesis",
    prompt: `This is a weak thesis statement for a summary of the FRT article:

"The article talks about some questions and concerns about facial recognition technology being used in schools."

Write a BETTER thesis statement that:
- Names the source authors (Andrejevic & Selwyn, 2020)
- Clearly identifies the four main applications covered`,
    skillFocus: ["academic-tone", "thesis-writing"],
    wordLimit: 50,
    rubricPoints: [
      "Includes author citation",
      "Mentions all four applications or states the number",
      "Uses clear, specific language"
    ],
    excerpts: [FRT_APPLICATIONS_EXCERPT, {
      label: "Strong Thesis Statement Examples",
      preview: "A thesis statement should clearly identify the source, main topic, and scope...",
      full: `Strong Thesis Statement Formula for Summaries:

[Author(s)] ([Year]) [verb: examine/discuss/analyze/explore] [main topic], focusing on [specific aspects].

Example patterns:
• "Andrejevic and Selwyn (2020) examine four applications of facial recognition technology in schools: security, attendance monitoring, identity verification, and engagement tracking."

• "According to Andrejevic and Selwyn (2020), FRT is being implemented in educational settings for four distinct purposes..."

Weak patterns to AVOID:
• "The article talks about..." (too vague)
• "This paper is about..." (doesn't name authors)
• "Some questions and concerns..." (imprecise)`
    }]
  },
  // Citation tasks
  {
    id: "w2-add-citations",
    title: "Add Missing Citations",
    prompt: `This paragraph has NO citations. Add appropriate APA 7th citations:

"Facial recognition systems have been sold to thousands of US schools. These systems are marketed as protection against threats like school shootings. The US school security industry is valued at $2.7 billion."

All information comes from: Andrejevic & Selwyn (2020)

Rewrite with proper in-text citations.`,
    skillFocus: ["in-text-citation", "APA-format"],
    wordLimit: 80,
    rubricPoints: [
      "Adds citation appropriately (not after every sentence)",
      "Uses correct APA format (& in parentheses, 'and' in text)",
      "Places citation in correct position"
    ],
    excerpts: [{
      label: "APA 7th In-Text Citation Rules",
      preview: "Use '&' in parenthetical citations, 'and' in narrative citations...",
      full: `APA 7th Edition In-Text Citation Guide:

PARENTHETICAL (citation at end):
• (Andrejevic & Selwyn, 2020)
• Use ampersand (&) between authors

NARRATIVE (authors in sentence):
• Andrejevic and Selwyn (2020) argue that...
• Use "and" (not &) between authors

PLACEMENT:
• Don't cite after every sentence if information comes from same source
• Place citation at the end of the relevant passage
• For direct quotes: include page number (p. 45) or (para. 3)

EXAMPLE:
"Schools have invested heavily in security technology. The US school security industry is valued at $2.7 billion (Andrejevic & Selwyn, 2020)."`
    }]
  },
  {
    id: "w2-fix-citation-errors",
    title: "Fix Citation Errors",
    prompt: `Find and fix ALL errors in these citations:

1. "(Andrejevic & Selwyn, 2020) FRT is used in schools."
2. "According to Andrejevic & Selwyn (2020), schools use FRT."
3. "Mark Andrejevic and Selwyn(2020) describe FRT applications."

Rewrite each citation correctly and explain what was wrong.`,
    skillFocus: ["in-text-citation", "error-detection"],
    wordLimit: 120,
    rubricPoints: [
      "Fixes citation placement (should come after information)",
      "Fixes & vs 'and' usage (use 'and' in signal phrases)",
      "Fixes author name format (no first names, add space before parentheses)"
    ],
    excerpts: [{
      label: "Common APA Citation Errors",
      preview: "Frequent mistakes include wrong placement, mixing & and 'and', using first names...",
      full: `Common APA In-Text Citation Errors:

ERROR 1: Citation before the information
❌ "(Smith, 2020) The study found..."
✓ "The study found... (Smith, 2020)."
✓ "Smith (2020) found that..."

ERROR 2: Using & in narrative citations
❌ "According to Smith & Jones (2020)..."
✓ "According to Smith and Jones (2020)..."
(Use & only inside parentheses)

ERROR 3: Including first names
❌ "John Smith (2020) argues..."
✓ "Smith (2020) argues..."
(Use last names only)

ERROR 4: Missing space before year
❌ "Smith(2020)"
✓ "Smith (2020)"

ERROR 5: Wrong punctuation
❌ "(Smith; 2020)"
✓ "(Smith, 2020)"`
    }]
  }
];

// Week 3: Summarizing Skills
export const WEEK3_HOUR3_TASKS: Hour3Task[] = [
  {
    id: "w3-summary-practice-1",
    title: "Summarize a Paragraph",
    prompt: `Summarize the following paragraph in 2-3 sentences:

"The integration of artificial intelligence in educational settings has sparked considerable debate among educators and policymakers. Proponents argue that AI-powered tools can provide personalized learning experiences, immediate feedback, and reduce teacher workload. However, critics raise concerns about data privacy, the potential for algorithmic bias, and the risk of diminishing human interaction in learning environments. Despite these concerns, many institutions are piloting AI-assisted learning programs."`,
    skillFocus: ["summarizing", "main-idea-identification"],
    wordLimit: 60,
    rubricPoints: [
      "Captures the main topic (AI in education)",
      "Includes key perspectives (benefits and concerns)",
      "Maintains objectivity",
      "Within word limit"
    ]
  },
  {
    id: "w3-main-idea",
    title: "Identify Main Ideas",
    prompt: `Read the paragraph below and identify: (1) the main idea, (2) two supporting points, and (3) one example or detail.

"Effective time management is crucial for academic success. Students who plan their study schedules tend to achieve higher grades and report lower stress levels. Key strategies include breaking large tasks into smaller chunks, using calendars or apps to track deadlines, and allocating specific time blocks for focused study. For instance, the Pomodoro Technique—working in 25-minute intervals with short breaks—has proven particularly effective for maintaining concentration."`,
    skillFocus: ["reading-comprehension", "main-idea-identification"],
    wordLimit: 100,
    rubricPoints: [
      "Correctly identifies main idea",
      "Lists relevant supporting points",
      "Identifies specific example"
    ]
  }
];

// Week 4: Synthesizing Skills
export const WEEK4_HOUR3_TASKS: Hour3Task[] = [
  {
    id: "w4-synthesis-basic",
    title: "Synthesize Two Sources",
    prompt: `Combine the ideas from these two sources into a single paragraph:

Source A (Lee, 2022): "Students who engage in collaborative learning show improved critical thinking skills."

Source B (Park, 2023): "Group projects help students develop communication and teamwork abilities essential for the workplace."

Write a synthesized paragraph that integrates both ideas with proper citations.`,
    skillFocus: ["synthesizing", "integration", "citation"],
    wordLimit: 80,
    rubricPoints: [
      "Integrates both sources coherently",
      "Uses appropriate linking language",
      "Maintains proper citation format",
      "Shows relationship between ideas"
    ]
  },
  {
    id: "w4-synthesis-contrast",
    title: "Synthesize Contrasting Views",
    prompt: `Synthesize these contrasting views into a balanced paragraph:

Source A (Kim, 2021): "Online learning offers greater accessibility and flexibility for students."

Source B (Chen, 2022): "Traditional classroom learning provides better social interaction and immediate feedback."

Present both perspectives fairly with proper citations.`,
    skillFocus: ["synthesizing", "contrast", "academic-balance"],
    wordLimit: 100,
    rubricPoints: [
      "Presents both views fairly",
      "Uses contrast language effectively",
      "Maintains academic tone",
      "Proper citation format"
    ]
  }
];

// Week 5: AWQ Preparation
export const WEEK5_HOUR3_TASKS: Hour3Task[] = [
  {
    id: "w5-awq-practice-1",
    title: "AWQ-Style Response",
    prompt: `Practice an AWQ-style response. Read the prompt and write a complete answer:

Topic: "The role of technology in education"
Task: Summarize the main arguments for and against increased technology use in classrooms, synthesizing information from at least two perspectives.

(For this practice, you may create hypothetical sources to cite.)`,
    skillFocus: ["awq-format", "synthesis", "academic-writing"],
    wordLimit: 200,
    rubricPoints: [
      "Clear introduction of topic",
      "Balanced presentation of perspectives",
      "Proper synthesis with citations",
      "Logical organization"
    ]
  },
  {
    id: "w5-timed-practice",
    title: "Timed Paraphrase & Cite",
    prompt: `Complete this task within 5 minutes:

Paraphrase and cite the following passage, then identify the paraphrasing strategies you used:

"Higher education institutions are increasingly adopting hybrid learning models that combine online and face-to-face instruction" (Zhang, 2024, p. 78).`,
    skillFocus: ["speed-practice", "paraphrasing", "citation"],
    wordLimit: 100,
    rubricPoints: [
      "Completed within time limit",
      "Accurate paraphrase",
      "Correct citation",
      "Strategies identified"
    ]
  }
];

// Placeholder for weeks 6-13 (to be expanded)
export const WEEK6_HOUR3_TASKS: Hour3Task[] = [];
export const WEEK7_HOUR3_TASKS: Hour3Task[] = [];
export const WEEK8_HOUR3_TASKS: Hour3Task[] = [];
export const WEEK9_HOUR3_TASKS: Hour3Task[] = [];
export const WEEK10_HOUR3_TASKS: Hour3Task[] = [];
export const WEEK11_HOUR3_TASKS: Hour3Task[] = [];
export const WEEK12_HOUR3_TASKS: Hour3Task[] = [];
export const WEEK13_HOUR3_TASKS: Hour3Task[] = [];

// Master task map
export const HOUR3_TASKS: Record<number, Hour3Task[]> = {
  1: WEEK1_HOUR3_TASKS,
  2: WEEK2_HOUR3_TASKS,
  3: WEEK3_HOUR3_TASKS,
  4: WEEK4_HOUR3_TASKS,
  5: WEEK5_HOUR3_TASKS,
  6: WEEK6_HOUR3_TASKS,
  7: WEEK7_HOUR3_TASKS,
  8: WEEK8_HOUR3_TASKS,
  9: WEEK9_HOUR3_TASKS,
  10: WEEK10_HOUR3_TASKS,
  11: WEEK11_HOUR3_TASKS,
  12: WEEK12_HOUR3_TASKS,
  13: WEEK13_HOUR3_TASKS,
};

/**
 * Get tasks for a specific week's Hour 3
 */
export function getHour3Tasks(weekNumber: number): Hour3Task[] {
  return HOUR3_TASKS[weekNumber] || [];
}

/**
 * Get a specific task by ID
 */
export function getTaskById(taskId: string): Hour3Task | undefined {
  for (const tasks of Object.values(HOUR3_TASKS)) {
    const found = tasks.find(t => t.id === taskId);
    if (found) return found;
  }
  return undefined;
}
