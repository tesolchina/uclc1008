/**
 * @fileoverview MicroLevelPractice component for paragraph analysis exercises.
 * 
 * This component allows students to:
 * - Select a paragraph from the source text
 * - Analyze it using a micro-level outlining approach
 * - Get AI feedback on their analysis
 */

import { useState } from "react";
import { PenLine } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WritingPracticeWithHistory } from "@/components/tasks";
import { PRACTICE_PARAGRAPHS } from "@/data/hours";

// ============================================================================
// Types
// ============================================================================

interface MicroLevelPracticeProps {
  /** Callback when task is completed */
  onComplete: (taskId: string) => void;
  /** Student ID for tracking and saving */
  studentId?: string;
}

// ============================================================================
// Component
// ============================================================================

/**
 * Micro-level practice component with paragraph selector and AI feedback.
 * 
 * Students select a paragraph from the source text and create a 
 * micro-level outline identifying:
 * - Topic sentence
 * - Supporting details
 * - Concluding thought
 * 
 * @example
 * <MicroLevelPractice
 *   onComplete={(id) => markTaskComplete(id)}
 *   studentId="student123"
 * />
 */
export function MicroLevelPractice({ onComplete, studentId }: MicroLevelPracticeProps) {
  const [selectedParagraph, setSelectedParagraph] = useState(PRACTICE_PARAGRAPHS[0].id);
  
  // Find the currently selected paragraph
  const currentParagraph = PRACTICE_PARAGRAPHS.find(p => p.id === selectedParagraph) 
    || PRACTICE_PARAGRAPHS[0];

  return (
    <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/30 space-y-4">
      {/* Section header */}
      <h4 className="font-medium text-sm flex items-center gap-2">
        <PenLine className="h-4 w-4 text-indigo-600" />
        Your Turn: Analyze a Paragraph
      </h4>
      
      {/* Paragraph selector dropdown */}
      <div className="space-y-2">
        <label className="text-xs font-medium text-indigo-700">
          Choose a paragraph to analyze:
        </label>
        <Select value={selectedParagraph} onValueChange={setSelectedParagraph}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue placeholder="Select a paragraph" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50">
            {PRACTICE_PARAGRAPHS.map((para) => (
              <SelectItem key={para.id} value={para.id}>
                {para.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Display selected paragraph */}
      <div className="p-3 rounded bg-background border text-sm">
        <p className="font-medium text-xs text-indigo-600 mb-2">
          {currentParagraph.label}:
        </p>
        <p className="text-muted-foreground leading-relaxed">
          "{currentParagraph.text}"
        </p>
      </div>
      
      {/* Writing area with AI feedback and autosave */}
      <WritingPracticeWithHistory
        taskKey={`w1h1-micro-outline-${selectedParagraph}`}
        title="Create a Micro-Level Outline"
        instructions="Identify the topic sentence, supporting details, and concluding thought for the paragraph above."
        exampleFormat="Topic Sentence: [main idea]&#10;Supporting Details:&#10;• [detail 1]&#10;• [detail 2]&#10;Concluding Thought: [wrap-up]"
        placeholder={"Topic Sentence:\n...\n\nSupporting Details:\n• ...\n• ...\n\nConcluding Thought:\n..."}
        studentId={studentId}
        className="bg-transparent border-0 p-0"
      />
    </div>
  );
}
