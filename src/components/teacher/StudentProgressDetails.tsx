import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, FileText, StickyNote, ClipboardList } from 'lucide-react';
import { StudentProgressPieChart } from './StudentProgressPieChart';

interface StudentResponse {
  question_key: string | null;
  is_correct: boolean | null;
  submitted_at: string;
}

interface WritingDraft {
  task_key: string;
  is_submitted: boolean;
}

interface ParagraphNote {
  paragraph_key: string;
  notes: string;
}

interface StudentProgressDetailsProps {
  studentId: string;
  responses: StudentResponse[];
  drafts: WritingDraft[];
  notes: ParagraphNote[];
}

// Parse task key to get week number
const parseWeekFromKey = (key: string | null): number | null => {
  if (!key) return null;
  const match = key.match(/week(\d+)/i) || key.match(/w(\d+)/i);
  return match ? parseInt(match[1]) : null;
};

export function StudentProgressDetails({
  studentId,
  responses,
  drafts,
  notes,
}: StudentProgressDetailsProps) {
  // Calculate progress per week
  const weekProgress = useMemo(() => {
    return [1, 2, 3, 4, 5].map(weekNum => {
      // Count completed MC tasks for this week
      const weekResponses = responses.filter(r => parseWeekFromKey(r.question_key) === weekNum);
      const correctResponses = weekResponses.filter(r => r.is_correct === true).length;
      
      // Count writing drafts
      const weekDrafts = drafts.filter(d => parseWeekFromKey(d.task_key) === weekNum);
      const submittedDrafts = weekDrafts.filter(d => d.is_submitted).length;
      
      // Count notes
      const weekNotes = notes.filter(n => parseWeekFromKey(n.paragraph_key) === weekNum);
      const completedNotes = weekNotes.filter(n => n.notes.trim().length > 0).length;
      
      // Estimate totals (adjust based on actual curriculum)
      // Assuming ~3 hours per week, ~5 MC tasks per hour, 1 writing task per hour, 6 notes per hour
      const estimatedMcTotal = 15;
      const estimatedWritingTotal = 3;
      const estimatedNotesTotal = 18;
      
      const total = estimatedMcTotal + estimatedWritingTotal + estimatedNotesTotal;
      const completed = Math.min(weekResponses.length, estimatedMcTotal) + 
                       Math.min(submittedDrafts, estimatedWritingTotal) + 
                       Math.min(completedNotes, estimatedNotesTotal);
      
      return {
        week: weekNum,
        completed,
        total,
        percentage: total > 0 ? (completed / total) * 100 : 0,
        breakdown: {
          mc: { completed: weekResponses.length, correct: correctResponses, total: estimatedMcTotal },
          writing: { completed: weekDrafts.length, submitted: submittedDrafts, total: estimatedWritingTotal },
          notes: { completed: completedNotes, total: estimatedNotesTotal },
        },
      };
    });
  }, [responses, drafts, notes]);

  return (
    <div className="space-y-4 mt-4 pl-4 border-l-2 border-muted">
      <div className="flex items-start gap-4">
        <StudentProgressPieChart weekProgress={weekProgress} size="md" />
        <div className="flex-1 grid grid-cols-5 gap-2">
          {weekProgress.map(wp => (
            <div key={wp.week} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Week {wp.week}</span>
                <span className="text-xs text-muted-foreground">{Math.round(wp.percentage)}%</span>
              </div>
              <Progress value={wp.percentage} className="h-1.5" />
              <div className="space-y-0.5 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <ClipboardList className="h-2.5 w-2.5" />
                  {wp.breakdown.mc.completed}/{wp.breakdown.mc.total}
                  <span className="text-green-600">({wp.breakdown.mc.correct} ✓)</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-2.5 w-2.5" />
                  {wp.breakdown.writing.submitted}/{wp.breakdown.writing.total}
                </div>
                <div className="flex items-center gap-1">
                  <StickyNote className="h-2.5 w-2.5" />
                  {wp.breakdown.notes.completed}/{wp.breakdown.notes.total}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
