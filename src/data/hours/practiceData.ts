/**
 * @fileoverview Practice paragraph data for Week 1-2 exercises.
 * 
 * These paragraphs are excerpts from the main source text (FRT in Education)
 * and are used for micro-level analysis and paraphrasing practice.
 * 
 * IMPORTANT: These paragraphs MUST match the Source Text content for consistency.
 */

import type { ConceptOption } from '@/components/tasks';

// ============================================================================
// Practice Paragraphs
// ============================================================================

/**
 * Paragraphs from the FRT (Facial Recognition Technology) source text
 * used for micro-level outlining and paraphrasing exercises.
 */
export const PRACTICE_PARAGRAPHS = [
  {
    id: "para1",
    label: "Paragraph 1: FRT in Education Context",
    text: "Against this contentious background, then, we need to consider how these technologies are being applied to the specific context of education. While rarely foregrounded in debates about facial recognition in society, the school sector is one of the public settings where this technology is beginning to be taken up and implemented at scale. This is perhaps not surprising given, on the one hand, the role played by the classroom in the development of monitoring and disciplinary practices and, on the other, the increasing normalisation of surveillance in the name of protecting and securing young people."
  },
  {
    id: "para2",
    label: "Paragraph 2: Campus Security",
    text: "One prominent educational application of facial recognition technology is campus security. This form of facial recognition is most prevalent in the US, where school shooting incidents have prompted school authorities to annually spend $2.7 billion on-campus security products and services (Doffman, 2018). Facial recognition systems have now been sold to thousands of US schools, with vendors 'pitching the technology as an all-seeing shield against school shootings' (Harwell, 2018, n.p). As well as purporting to identify unauthorised intruders, systems have been developed to make use of video object classification trained to detect gun-shaped objects, alongside more subtle forms of 'anomaly detection' such as students arriving at school in different-than-usual clothes, bags and other apparel (Harwell, 2018)."
  },
  {
    id: "para3",
    label: "Paragraph 3: Attendance Monitoring",
    text: "Another application of facial recognition in schools is attendance monitoring – promising to put an end to the inevitable gaps and omissions that arise when human teachers are tasked with repeatedly conducting roll-calls of large student groups (Puthea et al., 2017). This application of facial recognition is proving popular in countries such as the UK and Australia where school shootings and unauthorised campus incursions are rare. For example, the Australian 'Loop-Learn' facial recognition roll-call system has been marketed amidst estimates of saving up to 2.5 hours of teacher time per week."
  },
  {
    id: "para4",
    label: "Paragraph 4: Virtual Learning",
    text: "Beyond campus-based security and tracking physical bodies, facial recognition is also being used in a number of 'virtual learning' contexts. For example, facial recognition systems are now being developed as a means of ensuring the integrity of various aspects of online courses. This includes controlling access to online educational content (Montgomery & Marais, 2014), as well as using webcam-based facial recognition to authenticate online learners (Valera et al., 2015). Similarly, there is a growing interest in using facial recognition technology for so-called e-assessment security."
  },
  {
    id: "para5",
    label: "Paragraph 5: Engagement Detection",
    text: "Finally, there is a growing interest in facial detection techniques as an indicator of student 'engagement' and learning. For example, research and development in this area have reported that detecting brief 'facial actions' can prove an accurate indicator of students' (non)engagement with online learning environments – highlighting episodes of boredom, confusion, delight, flow, frustration, and surprise (Dewan et al., 2019). Particularly insightful facial actions with regards to learning are reckoned to include brow-raising, eyelid tightening, and mouth dimpling."
  },
  {
    id: "para6",
    label: "Paragraph 6: Future of Facial Learning Detection",
    text: "These largely experimental developments have led some educationalists to enthusiastically anticipate facial learning detection being deployed on a mass scale. As Timms (2016, p. 712) reasons, it might soon be possible to gain a 'real-time' sense of which groups of students are in a 'productive state' and other instances 'where the overall activity is not productive'. The promise of customisation that characterises the development of automated learning systems encourages their incorporation into student learning interfaces."
  }
];

// ============================================================================
// Concept Options for Different Task Types
// ============================================================================

/**
 * Paraphrasing strategy options for technique identification tasks
 */
export const PARAPHRASING_STRATEGIES: ConceptOption[] = [
  { 
    id: "synonyms", 
    label: "Synonym Replacement", 
    description: "Replace words with similar-meaning words", 
    example: "introduced → implemented" 
  },
  { 
    id: "wordforms", 
    label: "Word Form Changes", 
    description: "Change word forms (verb → noun, adjective → adverb)", 
    example: "impacts → impact" 
  },
  { 
    id: "voice", 
    label: "Active ↔ Passive Voice", 
    description: "Switch between active and passive voice", 
    example: "Researchers collected → Data was collected" 
  },
  { 
    id: "structure", 
    label: "Sentence Structure", 
    description: "Reorder, combine, or split sentences", 
    example: "Because X, Y → Y resulted from X" 
  }
];

/**
 * Academic Writing Quiz skill categories
 */
export const AWQ_SKILLS: ConceptOption[] = [
  { 
    id: "paraphrasing", 
    label: "Paraphrasing Skills", 
    description: "Restating ideas in your own words while keeping meaning" 
  },
  { 
    id: "summarizing", 
    label: "Summarizing Skills", 
    description: "Condensing main ideas in shorter form" 
  },
  { 
    id: "critical-thinking", 
    label: "Critical Thinking", 
    description: "Analyzing and evaluating ideas, not just repeating" 
  },
  { 
    id: "comprehension", 
    label: "Reading Comprehension", 
    description: "Understanding complex academic texts accurately" 
  }
];

/**
 * Citation type concepts for Week 2 citation skills
 */
export const CITATION_CONCEPTS: ConceptOption[] = [
  { 
    id: "author-prominent", 
    label: "Author-Prominent Citation", 
    description: "Author name is part of the sentence", 
    example: "Hong et al. (2022) argue that..." 
  },
  { 
    id: "info-prominent", 
    label: "Info-Prominent Citation", 
    description: "Focus on information, author in parentheses", 
    example: "...according to research (Hong et al., 2022)" 
  },
  { 
    id: "secondary-source", 
    label: "Secondary Source Citation", 
    description: "Citing through another source", 
    example: "(Smith, 2018, as cited in Jones, 2020)" 
  }
];

/**
 * Outlining concepts for structural analysis tasks
 */
export const OUTLINING_CONCEPTS: ConceptOption[] = [
  { 
    id: "topic-sentence", 
    label: "Topic Sentence", 
    description: "Identify the main idea of each paragraph" 
  },
  { 
    id: "logical-flow", 
    label: "Logical Flow", 
    description: "How ideas progress from one section to another" 
  },
  { 
    id: "structural-patterns", 
    label: "Structural Patterns", 
    description: "Recognize patterns like problem-solution, cause-effect" 
  },
  { 
    id: "transitions", 
    label: "Transitions", 
    description: "Words/phrases connecting ideas between paragraphs" 
  }
];

/**
 * Reading strategy concepts for skimming and scanning
 */
export const SKIMMING_SCANNING_CONCEPTS: ConceptOption[] = [
  { 
    id: "skimming", 
    label: "Skimming", 
    description: "Reading quickly for overall meaning and structure" 
  },
  { 
    id: "scanning", 
    label: "Scanning", 
    description: "Searching for specific information quickly" 
  },
  { 
    id: "headings", 
    label: "Using Headings", 
    description: "Leveraging titles and headers to understand structure" 
  },
  { 
    id: "first-last", 
    label: "First/Last Sentences", 
    description: "Reading opening and closing sentences of paragraphs" 
  }
];

// ============================================================================
// Task Count Constants
// ============================================================================

/**
 * Total task counts per hour for progress calculation.
 * Week 1 Hour 1 has 10 MC questions + 2 writing tasks = 12 total tasks
 */
export const HOUR_TASK_COUNTS: Record<string, number> = {
  'w1h1': 12,  // Week 1 Hour 1: 10 MC + 2 writing
  'w1h2': 8,   // Week 1 Hour 2
  'w2h1': 10,  // Week 2 Hour 1
  'w2h2': 8,   // Week 2 Hour 2
};

/**
 * Get total task count for a specific week/hour
 */
export function getHourTaskCount(weekNumber: number, hourNumber: number): number {
  const key = `w${weekNumber}h${hourNumber}`;
  return HOUR_TASK_COUNTS[key] || 0;
}

// ============================================================================
// Progress Storage Utilities
// ============================================================================

/**
 * Generate localStorage key for progress storage
 */
export function getProgressKey(weekNumber: number, hourNumber: number): string {
  return `ue1_progress_w${weekNumber}h${hourNumber}`;
}

/**
 * Load saved progress from localStorage
 */
export function loadProgress(weekNumber: number, hourNumber: number): string[] {
  const key = getProgressKey(weekNumber, hourNumber);
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.completedTasks || [];
    }
  } catch (e) {
    console.error("Error loading progress:", e);
  }
  return [];
}

/**
 * Save progress to localStorage
 */
export function saveProgress(weekNumber: number, hourNumber: number, completedTasks: string[]): void {
  const key = getProgressKey(weekNumber, hourNumber);
  try {
    localStorage.setItem(key, JSON.stringify({
      completedTasks,
      savedAt: new Date().toISOString()
    }));
  } catch (e) {
    console.error("Error saving progress:", e);
  }
}
