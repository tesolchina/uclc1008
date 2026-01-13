/**
 * Lecture Mode Constants
 * 
 * Configurable constants for the lecture outline system.
 */

export const LECTURE_CONFIG = {
  /** Default section type colors */
  sectionTypeColors: {
    intro: 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-300',
    concept: 'bg-purple-500/10 border-purple-500/30 text-purple-700 dark:text-purple-300',
    practice: 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-300',
    discussion: 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300',
    'wrap-up': 'bg-slate-500/10 border-slate-500/30 text-slate-700 dark:text-slate-300',
  },

  /** Section type labels */
  sectionTypeLabels: {
    intro: 'Introduction',
    concept: 'Concept',
    practice: 'Practice',
    discussion: 'Discussion',
    'wrap-up': 'Wrap-up',
  },

  /** Icons for section states */
  sectionStateIcons: {
    completed: 'CheckCircle2',
    current: 'PlayCircle',
    upcoming: 'Circle',
  },

  /** Outline collapse behavior */
  outline: {
    defaultCollapsed: false,
    collapseOnMobile: true,
    showKeyTakeawayOnComplete: true,
    allowStudentNavigation: true,
  },

  /** Progress tracking */
  progress: {
    autoMarkVisited: true,
    persistNotes: true,
    syncInterval: 5000, // ms
  },
} as const;

/** Parse duration string to minutes */
export function parseDuration(duration: string): number {
  const match = duration.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/** Format minutes to display string */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/** Generate section ID from index and title */
export function generateSectionId(index: number, title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `section-${index}-${slug}`;
}
