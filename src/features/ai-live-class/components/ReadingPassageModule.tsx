/**
 * =============================================================================
 * AI LIVE CLASS - READING PASSAGE MODULE
 * =============================================================================
 * 
 * A toggleable module that displays reading material for students.
 * Teachers can show/hide and update the content in real-time.
 * 
 * @module ai-live-class/components/ReadingPassageModule
 * @version 1.0.0
 * 
 * =============================================================================
 */

import { useState } from 'react';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  X,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

// =============================================================================
// PROPS
// =============================================================================

export interface ReadingPassageModuleProps {
  /**
   * The reading content to display.
   */
  content: string;
  
  /**
   * Optional title for the passage.
   */
  title?: string;
  
  /**
   * Whether the module is visible.
   */
  isVisible: boolean;
  
  /**
   * Callback to close/hide the module.
   */
  onClose?: () => void;
  
  /**
   * Whether this is the teacher view (shows close button).
   */
  isTeacher?: boolean;
  
  /**
   * Optional class name.
   */
  className?: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function ReadingPassageModule({
  content,
  title = 'Reading Passage',
  isVisible,
  onClose,
  isTeacher = false,
  className,
}: ReadingPassageModuleProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isFullHeight, setIsFullHeight] = useState(false);
  
  if (!isVisible || !content) {
    return null;
  }
  
  return (
    <Card className={cn(
      "border-primary/30 bg-primary/5 transition-all duration-300",
      isFullHeight ? "flex-1" : "max-h-64",
      className
    )}>
      <CardHeader className="flex-shrink-0 py-2 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <BookOpen className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsFullHeight(!isFullHeight)}
            >
              {isFullHeight ? (
                <Minimize2 className="h-3 w-3" />
              ) : (
                <Maximize2 className="h-3 w-3" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </Button>
            
            {isTeacher && onClose && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={onClose}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 px-4 pb-4">
          <ScrollArea className={cn(
            "pr-4",
            isFullHeight ? "h-[calc(100%-2rem)]" : "max-h-40"
          )}>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {content.split('\n').map((paragraph, i) => (
                paragraph.trim() ? (
                  <p key={i} className="text-sm leading-relaxed mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ) : null
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}

// =============================================================================
// STUDENT VERSION (Simpler, no close button)
// =============================================================================

export interface StudentReadingPassageProps {
  content: string;
  title?: string;
  className?: string;
}

export function StudentReadingPassage({
  content,
  title = 'Reading Passage',
  className,
}: StudentReadingPassageProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  if (!content) {
    return null;
  }
  
  return (
    <Card className={cn(
      "border-primary/30 bg-primary/5",
      className
    )}>
      <CardHeader className="flex-shrink-0 py-2 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <BookOpen className="h-4 w-4 text-primary" />
            {title}
          </CardTitle>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0 px-4 pb-4">
          <ScrollArea className="max-h-48 pr-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {content.split('\n').map((paragraph, i) => (
                paragraph.trim() ? (
                  <p key={i} className="text-sm leading-relaxed mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ) : null
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
