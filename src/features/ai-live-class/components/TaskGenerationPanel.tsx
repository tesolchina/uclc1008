/**
 * =============================================================================
 * AI LIVE CLASS - TASK GENERATION PANEL
 * =============================================================================
 * 
 * Panel for teachers to request task generation from the AI or select
 * from the curriculum task library.
 * 
 * @module ai-live-class/components/TaskGenerationPanel
 * @version 1.0.0
 * 
 * =============================================================================
 */

import { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  PenLine, 
  MessageSquare, 
  BarChart3,
  ChevronDown,
  Library,
  Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { TaskLibrarySelector } from './TaskLibrarySelector';
import { createTaskRequestPrompt } from '../utils/taskParser';
import type { TaskLibraryItem, GeneratedTaskType } from '../types/tasks';

// =============================================================================
// PROPS
// =============================================================================

export interface TaskGenerationPanelProps {
  /**
   * Callback to send a task request prompt to the AI.
   */
  onRequestTask: (prompt: string) => void;
  
  /**
   * Callback when a library task is selected.
   */
  onSelectLibraryTask: (task: TaskLibraryItem) => void;
  
  /**
   * Whether the AI is currently generating.
   */
  isGenerating?: boolean;
  
  /**
   * Optional current topic for context.
   */
  currentTopic?: string;
  
  /**
   * Optional class name.
   */
  className?: string;
}

// =============================================================================
// TASK TYPE OPTIONS
// =============================================================================

const TASK_TYPE_OPTIONS: {
  id: GeneratedTaskType;
  label: string;
  description: string;
  icon: typeof CheckCircle2;
  color: string;
}[] = [
  {
    id: 'mcq',
    label: 'Multiple Choice',
    description: 'Generate a question with options',
    icon: CheckCircle2,
    color: 'text-primary',
  },
  {
    id: 'writing',
    label: 'Short Writing',
    description: 'Sentence-level writing task',
    icon: PenLine,
    color: 'text-emerald-600',
  },
  {
    id: 'paragraph',
    label: 'Paragraph',
    description: 'Longer form writing task',
    icon: MessageSquare,
    color: 'text-violet-600',
  },
  {
    id: 'poll',
    label: 'Quick Poll',
    description: 'Gather student opinions',
    icon: BarChart3,
    color: 'text-amber-600',
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function TaskGenerationPanel({
  onRequestTask,
  onSelectLibraryTask,
  isGenerating,
  currentTopic,
  className,
}: TaskGenerationPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'generate' | 'library'>('generate');
  const [selectedType, setSelectedType] = useState<GeneratedTaskType | null>(null);
  const [customContext, setCustomContext] = useState('');
  
  const handleGenerateTask = () => {
    if (!selectedType) return;
    
    const prompt = createTaskRequestPrompt(
      selectedType,
      currentTopic || undefined,
      customContext.trim() || undefined
    );
    
    onRequestTask(prompt);
    setIsOpen(false);
    setSelectedType(null);
    setCustomContext('');
  };
  
  const handleSelectLibraryTask = (task: TaskLibraryItem) => {
    onSelectLibraryTask(task);
    setIsOpen(false);
  };
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={cn("gap-2", className)}
          disabled={isGenerating}
        >
          <Wand2 className="h-4 w-4" />
          Generate Task
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 p-0" 
        align="end"
        sideOffset={8}
      >
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'generate' | 'library')}>
          <div className="border-b px-3 pt-3">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="generate" className="gap-2">
                <Sparkles className="h-4 w-4" />
                AI Generate
              </TabsTrigger>
              <TabsTrigger value="library" className="gap-2">
                <Library className="h-4 w-4" />
                Task Library
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* AI Generate Tab */}
          <TabsContent value="generate" className="p-3 space-y-4 m-0">
            <div>
              <p className="text-sm font-medium mb-2">Select task type:</p>
              <div className="grid grid-cols-2 gap-2">
                {TASK_TYPE_OPTIONS.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedType === option.id;
                  
                  return (
                    <button
                      key={option.id}
                      onClick={() => setSelectedType(option.id)}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all",
                        "hover:border-primary/50 hover:bg-primary/5",
                        isSelected && "border-primary bg-primary/10 ring-1 ring-primary"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 mb-1", option.color)} />
                      <p className="text-sm font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Additional context (optional):
              </label>
              <Textarea
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="Add specific topic, text excerpt, or instructions..."
                rows={2}
                className="resize-none text-sm"
              />
            </div>
            
            {currentTopic && (
              <p className="text-xs text-muted-foreground">
                Task will be related to: <strong>{currentTopic}</strong>
              </p>
            )}
            
            <Button 
              onClick={handleGenerateTask}
              disabled={!selectedType || isGenerating}
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate {selectedType ? TASK_TYPE_OPTIONS.find(o => o.id === selectedType)?.label : 'Task'}
            </Button>
          </TabsContent>
          
          {/* Library Tab */}
          <TabsContent value="library" className="p-3 m-0">
            <TaskLibrarySelector 
              onSelect={handleSelectLibraryTask}
              variant="full"
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
