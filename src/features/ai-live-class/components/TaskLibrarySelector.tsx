/**
 * =============================================================================
 * AI LIVE CLASS - TASK LIBRARY SELECTOR
 * =============================================================================
 * 
 * Week-filtered selector for pre-existing open-ended tasks from the curriculum.
 * Teachers can browse and select tasks to incorporate into live AI sessions.
 * 
 * @module ai-live-class/components/TaskLibrarySelector
 * @version 1.0.0
 * 
 * =============================================================================
 */

import { useState, useMemo } from 'react';
import { 
  Library, 
  ChevronDown, 
  PenLine, 
  FileText,
  Check,
  Search,
  BookOpen
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { TaskLibraryItem } from '../types/tasks';

// Import task banks
import { 
  WEEK1_HOUR3_TASKS, 
  WEEK2_HOUR3_TASKS 
} from '@/features/classroom-discussion/constants/taskBank';

// =============================================================================
// PROPS
// =============================================================================

export interface TaskLibrarySelectorProps {
  /**
   * Callback when a task is selected.
   */
  onSelect: (task: TaskLibraryItem) => void;
  
  /**
   * Optional class name for styling.
   */
  className?: string;
  
  /**
   * Whether to show as a compact dropdown.
   */
  variant?: 'full' | 'compact';
}

// =============================================================================
// TASK CONVERSION
// =============================================================================

/**
 * Converts Hour3Task from taskBank to TaskLibraryItem.
 */
function convertToLibraryItem(task: {
  id: string;
  title: string;
  prompt: string;
  skillFocus?: string[];
  wordLimit?: number;
  context?: string;
  excerpts?: { label: string; preview: string; full: string }[];
  rubricPoints?: string[];
  sampleAnswer?: string;
}, weekNumber: number): TaskLibraryItem {
  return {
    id: task.id,
    title: task.title,
    prompt: task.prompt,
    type: task.wordLimit && task.wordLimit > 80 ? 'paragraph' : 'writing',
    weekNumber,
    skillFocus: task.skillFocus,
    wordLimit: task.wordLimit,
    context: task.context,
    excerpts: task.excerpts,
    rubricPoints: task.rubricPoints,
    sampleAnswer: task.sampleAnswer,
  };
}

// =============================================================================
// BUILD LIBRARY
// =============================================================================

const TASK_LIBRARY: TaskLibraryItem[] = [
  ...WEEK1_HOUR3_TASKS.map(t => convertToLibraryItem(t, 1)),
  ...WEEK2_HOUR3_TASKS.map(t => convertToLibraryItem(t, 2)),
];

// Group by week for display
const WEEKS_AVAILABLE = [...new Set(TASK_LIBRARY.map(t => t.weekNumber))].sort();

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TaskLibrarySelector({
  onSelect,
  className,
  variant = 'full',
}: TaskLibrarySelectorProps) {
  const [selectedWeek, setSelectedWeek] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  
  // Filter tasks
  const filteredTasks = useMemo(() => {
    let tasks = TASK_LIBRARY;
    
    if (selectedWeek !== 'all') {
      tasks = tasks.filter(t => t.weekNumber === parseInt(selectedWeek, 10));
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      tasks = tasks.filter(t => 
        t.title.toLowerCase().includes(query) ||
        t.prompt.toLowerCase().includes(query) ||
        t.skillFocus?.some(s => s.toLowerCase().includes(query))
      );
    }
    
    return tasks;
  }, [selectedWeek, searchQuery]);
  
  // Group by week for display
  const tasksByWeek = useMemo(() => {
    const grouped: Record<number, TaskLibraryItem[]> = {};
    filteredTasks.forEach(task => {
      if (!grouped[task.weekNumber]) {
        grouped[task.weekNumber] = [];
      }
      grouped[task.weekNumber].push(task);
    });
    return grouped;
  }, [filteredTasks]);
  
  if (variant === 'compact') {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span className="flex items-center gap-2">
              <Library className="h-4 w-4" />
              Select from Task Library
            </span>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              isOpen && "rotate-180"
            )} />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <Card>
            <CardContent className="p-3">
              <TaskList 
                tasks={filteredTasks}
                tasksByWeek={tasksByWeek}
                selectedWeek={selectedWeek}
                setSelectedWeek={setSelectedWeek}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onSelect={(task) => {
                  onSelect(task);
                  setIsOpen(false);
                }}
              />
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Library className="h-5 w-5 text-primary" />
          Task Library
          <Badge variant="secondary" className="ml-auto">
            {TASK_LIBRARY.length} tasks
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <TaskList 
          tasks={filteredTasks}
          tasksByWeek={tasksByWeek}
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelect={onSelect}
        />
      </CardContent>
    </Card>
  );
}

// =============================================================================
// TASK LIST COMPONENT
// =============================================================================

interface TaskListProps {
  tasks: TaskLibraryItem[];
  tasksByWeek: Record<number, TaskLibraryItem[]>;
  selectedWeek: string;
  setSelectedWeek: (week: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelect: (task: TaskLibraryItem) => void;
}

function TaskList({
  tasks,
  tasksByWeek,
  selectedWeek,
  setSelectedWeek,
  searchQuery,
  setSearchQuery,
  onSelect,
}: TaskListProps) {
  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex gap-2">
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Weeks</SelectItem>
            {WEEKS_AVAILABLE.map(week => (
              <SelectItem key={week} value={String(week)}>
                Week {week}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="pl-8"
          />
        </div>
      </div>
      
      {/* Task List */}
      <ScrollArea className="h-64">
        {tasks.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tasks found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(tasksByWeek).map(([week, weekTasks]) => (
              <div key={week} className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Week {week}
                </h4>
                <div className="space-y-1.5">
                  {weekTasks.map(task => (
                    <TaskItem 
                      key={task.id} 
                      task={task} 
                      onSelect={() => onSelect(task)} 
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

// =============================================================================
// TASK ITEM COMPONENT
// =============================================================================

interface TaskItemProps {
  task: TaskLibraryItem;
  onSelect: () => void;
}

function TaskItem({ task, onSelect }: TaskItemProps) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left p-3 rounded-lg border bg-card",
        "hover:border-primary/50 hover:bg-primary/5 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-primary/50"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "p-1.5 rounded",
          task.type === 'writing' && "bg-emerald-500/10 text-emerald-600",
          task.type === 'paragraph' && "bg-violet-500/10 text-violet-600"
        )}>
          {task.type === 'writing' ? (
            <PenLine className="h-4 w-4" />
          ) : (
            <FileText className="h-4 w-4" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm truncate">{task.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {task.prompt}
          </p>
          
          {task.skillFocus && task.skillFocus.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.skillFocus.slice(0, 2).map(skill => (
                <Badge key={skill} variant="outline" className="text-[10px] px-1.5 py-0">
                  {skill}
                </Badge>
              ))}
              {task.skillFocus.length > 2 && (
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  +{task.skillFocus.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <Check className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </button>
  );
}
