/**
 * =============================================================================
 * AI LIVE CLASS - TASK BANK SELECTOR
 * =============================================================================
 * 
 * Simple component for teachers to select tasks from the curriculum task library.
 * No AI generation - just selection from existing question bank.
 * 
 * @module ai-live-class/components/TaskBankSelector
 * @version 1.0.0
 * 
 * =============================================================================
 */

import { useState } from 'react';
import { Library, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { TaskLibrarySelector } from './TaskLibrarySelector';
import type { TaskLibraryItem } from '../types/tasks';

// =============================================================================
// PROPS
// =============================================================================

export interface TaskBankSelectorProps {
  /**
   * Callback when a library task is selected.
   */
  onSelectTask: (task: TaskLibraryItem) => void;
  
  /**
   * Whether the AI is currently generating/busy.
   */
  disabled?: boolean;
  
  /**
   * Optional class name.
   */
  className?: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TaskBankSelector({
  onSelectTask,
  disabled,
  className,
}: TaskBankSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelectTask = (task: TaskLibraryItem) => {
    onSelectTask(task);
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn("gap-2", className)}
          disabled={disabled}
        >
          <Library className="h-4 w-4" />
          Task Bank
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 p-3" 
        align="end"
        sideOffset={8}
      >
        <div className="space-y-3">
          <div>
            <h4 className="font-medium text-sm">Select from Question Bank</h4>
            <p className="text-xs text-muted-foreground">
              Choose a task to share with students
            </p>
          </div>
          
          <TaskLibrarySelector 
            onSelect={handleSelectTask}
            variant="full"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
