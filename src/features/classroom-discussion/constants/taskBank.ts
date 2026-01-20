/**
 * Preset task bank for Hour 3 practice sessions across all weeks.
 * Each week has its own set of tasks aligned with the curriculum.
 */

import type { Hour3Task } from '../types';

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

// Week 2: Citation & Paraphrasing Integration
export const WEEK2_HOUR3_TASKS: Hour3Task[] = [
  {
    id: "w2-citation-paraphrase-1",
    title: "Paraphrase with APA Citation",
    prompt: `Paraphrase the following sentence and add a proper APA 7th in-text citation:

"Research has shown that students who receive immediate feedback perform 23% better on subsequent tests" (Smith, 2023, p. 45).`,
    skillFocus: ["paraphrasing", "in-text-citation"],
    wordLimit: 50,
    rubricPoints: [
      "Effective paraphrase that changes structure",
      "Correct APA 7th in-text citation format",
      "Page number included appropriately"
    ]
  },
  {
    id: "w2-reference-entry-1",
    title: "Build a Reference Entry",
    prompt: `Write the complete APA 7th reference entry for:

Author: Maria Chen
Year: 2024
Title: Digital literacy in higher education
Journal: Educational Technology Review
Volume: 15, Issue 3
Pages: 45-62
DOI: 10.1234/etr.2024.0045`,
    skillFocus: ["end-of-text-citation", "APA-format"],
    wordLimit: 100,
    rubricPoints: [
      "Correct author format (Chen, M.)",
      "Correct title capitalization (sentence case)",
      "Proper italicization and punctuation",
      "DOI formatted correctly"
    ]
  },
  {
    id: "w2-citation-error-1",
    title: "Citation Error Detection",
    prompt: `Find and correct all errors in this reference entry:

Chen, Maria. (2024). Digital Literacy In Higher Education. Educational technology review, Vol. 15(3), pp. 45-62. doi:10.1234/etr.2024.0045

Rewrite the correct version.`,
    skillFocus: ["end-of-text-citation", "error-detection"],
    wordLimit: 100,
    rubricPoints: [
      "Identifies author name format error",
      "Identifies capitalization errors",
      "Identifies volume/page format errors",
      "Identifies DOI format error"
    ]
  },
  {
    id: "w2-integrated-citation",
    title: "Full Citation Integration",
    prompt: `You are writing about online learning. Paraphrase and cite the following, then write the reference entry:

"Online courses provide flexibility that allows students to balance work and study commitments more effectively" (Wong, 2023, p. 112).

Source: Wong, A. (2023). Flexible learning in the digital age. Journal of Higher Education, 28(2), 105-120. https://doi.org/10.5678/jhe.2023.028`,
    skillFocus: ["paraphrasing", "in-text-citation", "end-of-text-citation"],
    wordLimit: 150,
    rubricPoints: [
      "Effective paraphrase",
      "Correct in-text citation",
      "Correct reference entry format"
    ]
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
