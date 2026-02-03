/**
 * HourQuickCheckMC - A wrapper for QuickCheckMC that automatically includes week/hour context.
 * 
 * This ensures all task responses are saved with proper week/hour/question identifiers
 * for accurate progress tracking on the dashboard.
 */

import { QuickCheckMC } from "./QuickCheckMC";

interface HourQuickCheckMCProps {
  weekNumber: number;
  hourNumber: number;
  questionNumber: number;
  question: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation?: string;
  taskId?: string; // Optional custom task ID
  enableAiFeedback?: boolean;
}

export function HourQuickCheckMC({
  weekNumber,
  hourNumber,
  questionNumber,
  question,
  options,
  correctAnswer,
  explanation,
  taskId,
  enableAiFeedback,
}: HourQuickCheckMCProps) {
  // Generate a unique question ID that includes week/hour context
  const questionId = taskId || `w${weekNumber}h${hourNumber}-q${questionNumber}`;

  return (
    <QuickCheckMC
      questionNumber={questionNumber}
      question={question}
      options={options}
      correctAnswer={correctAnswer}
      explanation={explanation}
      questionId={questionId}
      weekNumber={weekNumber}
      hourNumber={hourNumber}
      enableAiFeedback={enableAiFeedback}
    />
  );
}
