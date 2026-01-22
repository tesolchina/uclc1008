/**
 * =============================================================================
 * AI LIVE CLASS - TASK PARSER
 * =============================================================================
 * 
 * Parses AI responses to extract dynamically generated tasks.
 * 
 * Tag Format:
 * - [MCQ: question | A. option | B. option | C. option | correct=A | explanation]
 * - [WRITING: prompt | wordLimit=50 | hint1 | hint2]
 * - [PARAGRAPH: prompt | wordLimit=150]
 * - [POLL: question | option1 | option2 | option3]
 * 
 * @module ai-live-class/utils/taskParser
 * @version 1.0.0
 * 
 * =============================================================================
 */

import type {
  GeneratedTask,
  MCQTask,
  WritingTask,
  ParagraphTask,
  PollTask,
  ParsedTask,
  TaskParseResult,
  TaskOption,
} from '../types/tasks';

// =============================================================================
// REGEX PATTERNS
// =============================================================================

/**
 * Pattern to match task tags in AI responses.
 * Matches: [MCQ: ...], [WRITING: ...], [PARAGRAPH: ...], [POLL: ...]
 */
const TASK_TAG_PATTERN = /\[(MCQ|WRITING|PARAGRAPH|POLL):\s*([^\]]+)\]/gi;

/**
 * Pattern to extract word limit from task content.
 */
const WORD_LIMIT_PATTERN = /wordLimit\s*=\s*(\d+)/i;

/**
 * Pattern to extract correct answer from MCQ.
 */
const CORRECT_ANSWER_PATTERN = /correct\s*=\s*([A-D])/i;

/**
 * Pattern to match MCQ options (A. option, B. option, etc.)
 */
const MCQ_OPTION_PATTERN = /([A-D])\.\s*([^|]+)/gi;

// =============================================================================
// PARSER FUNCTIONS
// =============================================================================

/**
 * Parses an AI message for task tags and extracts them.
 * 
 * @param content - The AI response content
 * @returns TaskParseResult with clean content and extracted tasks
 */
export function parseTasksFromMessage(content: string): TaskParseResult {
  const tasks: ParsedTask[] = [];
  let cleanContent = content;
  
  // Find all task tags
  let match;
  while ((match = TASK_TAG_PATTERN.exec(content)) !== null) {
    const [fullMatch, taskType, taskContent] = match;
    const type = taskType.toLowerCase() as 'mcq' | 'writing' | 'paragraph' | 'poll';
    
    try {
      const task = parseTaskContent(type, taskContent.trim());
      
      if (task) {
        tasks.push({
          task,
          startIndex: match.index,
          endIndex: match.index + fullMatch.length,
          rawTag: fullMatch,
        });
      }
    } catch (err) {
      console.warn('[taskParser] Error parsing task:', err);
    }
  }
  
  // Remove task tags from content for clean display
  tasks.forEach(({ rawTag }) => {
    cleanContent = cleanContent.replace(rawTag, '');
  });
  
  // Clean up extra whitespace
  cleanContent = cleanContent.replace(/\n{3,}/g, '\n\n').trim();
  
  return {
    cleanContent,
    tasks,
    hasTasks: tasks.length > 0,
  };
}

/**
 * Parses the content of a specific task type.
 */
function parseTaskContent(
  type: 'mcq' | 'writing' | 'paragraph' | 'poll',
  content: string
): GeneratedTask | null {
  const baseId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  
  switch (type) {
    case 'mcq':
      return parseMCQ(content, baseId, createdAt);
    case 'writing':
      return parseWriting(content, baseId, createdAt);
    case 'paragraph':
      return parseParagraph(content, baseId, createdAt);
    case 'poll':
      return parsePoll(content, baseId, createdAt);
    default:
      return null;
  }
}

/**
 * Parses MCQ task content.
 * Format: question | A. opt | B. opt | C. opt | D. opt | correct=A | explanation
 */
function parseMCQ(content: string, id: string, createdAt: string): MCQTask | null {
  const parts = content.split('|').map(p => p.trim());
  if (parts.length < 3) return null;
  
  const prompt = parts[0];
  const options: TaskOption[] = [];
  let correctOptionId: string | undefined;
  let explanation: string | undefined;
  
  // Extract options and metadata
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    
    // Check for correct answer marker
    const correctMatch = part.match(CORRECT_ANSWER_PATTERN);
    if (correctMatch) {
      correctOptionId = correctMatch[1].toUpperCase();
      continue;
    }
    
    // Check for option format (A. text)
    const optionMatch = part.match(/^([A-D])\.\s*(.+)$/i);
    if (optionMatch) {
      options.push({
        id: optionMatch[1].toUpperCase(),
        label: optionMatch[2].trim(),
        isCorrect: false,
      });
      continue;
    }
    
    // Otherwise might be explanation
    if (!optionMatch && !correctMatch && i === parts.length - 1) {
      explanation = part;
    }
  }
  
  // Mark correct option
  if (correctOptionId) {
    const correctOpt = options.find(o => o.id === correctOptionId);
    if (correctOpt) correctOpt.isCorrect = true;
  }
  
  if (options.length < 2) return null;
  
  return {
    id,
    type: 'mcq',
    prompt,
    options,
    correctOptionId,
    explanation,
    status: 'active',
    createdAt,
  };
}

/**
 * Parses writing task content.
 * Format: prompt | wordLimit=50 | hint1 | hint2
 */
function parseWriting(content: string, id: string, createdAt: string): WritingTask {
  const parts = content.split('|').map(p => p.trim());
  const prompt = parts[0];
  const hints: string[] = [];
  let wordLimit: number | undefined;
  
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const limitMatch = part.match(WORD_LIMIT_PATTERN);
    
    if (limitMatch) {
      wordLimit = parseInt(limitMatch[1], 10);
    } else if (part && !part.includes('=')) {
      hints.push(part);
    }
  }
  
  return {
    id,
    type: 'writing',
    prompt,
    wordLimit: wordLimit || 50,
    hints: hints.length > 0 ? hints : undefined,
    status: 'active',
    createdAt,
  };
}

/**
 * Parses paragraph task content.
 * Format: prompt | wordLimit=150
 */
function parseParagraph(content: string, id: string, createdAt: string): ParagraphTask {
  const parts = content.split('|').map(p => p.trim());
  const prompt = parts[0];
  let wordLimit: number | undefined;
  
  for (let i = 1; i < parts.length; i++) {
    const limitMatch = parts[i].match(WORD_LIMIT_PATTERN);
    if (limitMatch) {
      wordLimit = parseInt(limitMatch[1], 10);
    }
  }
  
  return {
    id,
    type: 'paragraph',
    prompt,
    wordLimit: wordLimit || 150,
    status: 'active',
    createdAt,
  };
}

/**
 * Parses poll task content.
 * Format: question | option1 | option2 | option3
 */
function parsePoll(content: string, id: string, createdAt: string): PollTask {
  const parts = content.split('|').map(p => p.trim());
  const prompt = parts[0];
  const options: TaskOption[] = [];
  
  for (let i = 1; i < parts.length; i++) {
    const label = parts[i];
    if (label) {
      options.push({
        id: String.fromCharCode(65 + (i - 1)), // A, B, C, ...
        label,
      });
    }
  }
  
  return {
    id,
    type: 'poll',
    prompt,
    options,
    status: 'active',
    createdAt,
  };
}

// =============================================================================
// TASK GENERATION PROMPTS
// =============================================================================

/**
 * Instruction to add to system prompt for task generation.
 */
export const TASK_GENERATION_INSTRUCTION = `
When the teacher asks you to generate a task or activity for students, use these special tags:

For Multiple Choice Questions:
[MCQ: Your question here | A. First option | B. Second option | C. Third option | D. Fourth option | correct=B | Explanation of the correct answer]

For Writing Tasks (short sentences):
[WRITING: Write a sentence that... | wordLimit=40 | Consider using synonyms | Focus on clarity]

For Paragraph Tasks (longer writing):
[PARAGRAPH: Write a paragraph explaining... | wordLimit=120]

For Quick Polls:
[POLL: What do you think about...? | Strongly agree | Somewhat agree | Neutral | Disagree]

You can generate tasks naturally during conversation when appropriate, or when the teacher explicitly requests one. Only use ONE task tag per response.
`.trim();

/**
 * Prompt template for requesting task generation.
 */
export function createTaskRequestPrompt(
  taskType: 'mcq' | 'writing' | 'paragraph' | 'poll',
  topic?: string,
  context?: string
): string {
  const typeNames = {
    mcq: 'a multiple choice question',
    writing: 'a short writing task',
    paragraph: 'a paragraph writing task',
    poll: 'a quick poll',
  };
  
  let prompt = `Please generate ${typeNames[taskType]}`;
  
  if (topic) {
    prompt += ` about \"${topic}\"`;
  }
  
  if (context) {
    prompt += `. Use this context: ${context}`;
  }
  
  prompt += '. Remember to use the appropriate task tag format.';
  
  return prompt;
}
