/**
 * SectionCard Component
 * 
 * Displays an individual section in the lecture outline.
 * Shows status, activities, key takeaway, and optional notes.
 */

import { useState } from 'react';
import { CheckCircle2, PlayCircle, Circle, ChevronDown, ChevronRight, Clock, Lightbulb, StickyNote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { SectionCardProps } from '../types';
import { LECTURE_CONFIG } from '../constants';

export function SectionCard({
  section,
  index,
  isCurrent,
  isCompleted,
  isUpcoming,
  isExpanded,
  onToggle,
  onClick,
  notes,
  onNotesChange,
}: SectionCardProps) {
  const [localNotes, setLocalNotes] = useState(notes || '');
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const handleNotesBlur = () => {
    if (onNotesChange && localNotes !== notes) {
      onNotesChange(localNotes);
    }
  };

  const sectionType = section.type || 'concept';
  const typeColor = LECTURE_CONFIG.sectionTypeColors[sectionType];

  return (
    <div
      className={cn(
        'rounded-lg border transition-all duration-200',
        isCurrent && 'ring-2 ring-primary shadow-md bg-primary/5',
        isCompleted && !isCurrent && 'bg-muted/30 border-muted',
        isUpcoming && 'opacity-60',
        onClick && 'cursor-pointer hover:bg-muted/50'
      )}
      onClick={onClick}
    >
      {/* Header */}
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div className="flex items-start gap-3 p-3">
            {/* Status Icon */}
            <div className="shrink-0 mt-0.5">
              {isCompleted ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : isCurrent ? (
                <PlayCircle className="h-5 w-5 text-primary animate-pulse" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground/50" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-sm">{section.title}</span>
                {section.type && (
                  <span className={cn('text-xs px-1.5 py-0.5 rounded border', typeColor)}>
                    {LECTURE_CONFIG.sectionTypeLabels[sectionType]}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{section.duration}</span>
                <span>•</span>
                <span>{section.activities.length} activities</span>
              </div>
            </div>

            {/* Expand/Collapse */}
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-3 pb-3 pt-0 space-y-3 border-t mt-1">
            {/* Activities */}
            <ul className="text-xs text-muted-foreground space-y-1 mt-3">
              {section.activities.map((activity, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>{activity}</span>
                </li>
              ))}
            </ul>

            {/* Key Takeaway (shown when completed) */}
            {isCompleted && section.keyTakeaway && (
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Key Takeaway</p>
                    <p className="text-xs text-amber-800 dark:text-amber-300">{section.keyTakeaway}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Student Notes */}
            {onNotesChange && (
              <Collapsible open={isNotesOpen} onOpenChange={setIsNotesOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-7 text-xs">
                    <StickyNote className="h-3 w-3" />
                    {localNotes ? 'Edit notes' : 'Add notes'}
                    {isNotesOpen ? <ChevronDown className="h-3 w-3 ml-auto" /> : <ChevronRight className="h-3 w-3 ml-auto" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Textarea
                    value={localNotes}
                    onChange={(e) => setLocalNotes(e.target.value)}
                    onBlur={handleNotesBlur}
                    placeholder="Add your notes for this section..."
                    className="text-xs min-h-[60px] mt-2"
                  />
                </CollapsibleContent>
              </Collapsible>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
