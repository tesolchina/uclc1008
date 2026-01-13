/**
 * LectureOutline Component
 * 
 * Main outline component showing all sections with progress tracking.
 * Syncs with live session for real-time position updates.
 */

import { useState, useMemo, useEffect } from 'react';
import { List, ChevronDown, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SectionCard } from './SectionCard';
import { OutlineProgress } from './OutlineProgress';
import type { LectureOutlineProps, AgendaSectionEnhanced } from '../types';
import { parseDuration, generateSectionId } from '../constants';

interface Props extends LectureOutlineProps {
  behaviorGoal?: string;
  onNotesChange?: (sectionId: string, notes: string) => void;
  sectionNotes?: Record<string, string>;
}

export function LectureOutline({
  weekNumber,
  hourNumber,
  sections,
  currentIndex = 0,
  completedIndices = [],
  isLive = false,
  isTeacher = false,
  onSectionClick,
  className,
  behaviorGoal,
  onNotesChange,
  sectionNotes = {},
}: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([currentIndex]));

  // Auto-expand current section when it changes
  useEffect(() => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.add(currentIndex);
      return next;
    });
  }, [currentIndex]);

  // Ensure sections have IDs
  const sectionsWithIds: AgendaSectionEnhanced[] = useMemo(() => {
    return sections.map((section, index) => ({
      ...section,
      id: section.id || generateSectionId(index, section.title),
    }));
  }, [sections]);

  // Calculate total and elapsed time
  const { totalMinutes, elapsedMinutes } = useMemo(() => {
    let total = 0;
    let elapsed = 0;

    sectionsWithIds.forEach((section, index) => {
      const duration = parseDuration(section.duration);
      total += duration;
      if (completedIndices.includes(index)) {
        elapsed += duration;
      } else if (index === currentIndex) {
        elapsed += duration / 2; // Assume halfway through current
      }
    });

    return { totalMinutes: total, elapsedMinutes: Math.round(elapsed) };
  }, [sectionsWithIds, completedIndices, currentIndex]);

  const toggleSection = (index: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleSectionClick = (index: number) => {
    if (onSectionClick && (isTeacher || completedIndices.includes(index))) {
      onSectionClick(index);
    }
  };

  return (
    <div className={cn('rounded-lg border bg-card', className)}>
      {/* Header */}
      <Collapsible open={!isCollapsed} onOpenChange={(open) => setIsCollapsed(!open)}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2">
              <List className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">Lecture Outline</span>
              {isLive && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 border border-green-500/30">
                  LIVE
                </span>
              )}
            </div>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-3 pb-3 space-y-3">
            {/* Behavior Goal */}
            {behaviorGoal && (
              <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-amber-700 dark:text-amber-400">Today's Habit Goal</p>
                    <p className="text-xs text-amber-800 dark:text-amber-300">{behaviorGoal}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Progress */}
            <OutlineProgress
              totalSections={sectionsWithIds.length}
              completedCount={completedIndices.length}
              currentIndex={currentIndex}
              totalMinutes={totalMinutes}
              elapsedMinutes={elapsedMinutes}
            />

            {/* Sections List */}
            <ScrollArea className="max-h-[400px]">
              <div className="space-y-2 pr-2">
                {sectionsWithIds.map((section, index) => (
                  <SectionCard
                    key={section.id}
                    section={section}
                    index={index}
                    isCurrent={index === currentIndex}
                    isCompleted={completedIndices.includes(index)}
                    isUpcoming={index > currentIndex && !completedIndices.includes(index)}
                    isExpanded={expandedSections.has(index)}
                    onToggle={() => toggleSection(index)}
                    onClick={
                      isTeacher || completedIndices.includes(index)
                        ? () => handleSectionClick(index)
                        : undefined
                    }
                    notes={sectionNotes[section.id]}
                    onNotesChange={
                      onNotesChange && !isTeacher
                        ? (notes) => onNotesChange(section.id, notes)
                        : undefined
                    }
                  />
                ))}
              </div>
            </ScrollArea>

            {/* Week/Hour Reference */}
            <div className="text-xs text-center text-muted-foreground pt-2 border-t">
              Week {weekNumber} • Hour {hourNumber}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
