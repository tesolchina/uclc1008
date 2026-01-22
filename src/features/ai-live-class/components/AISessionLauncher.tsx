/**
 * =============================================================================
 * AI LIVE CLASS - SESSION LAUNCHER COMPONENT
 * =============================================================================
 * 
 * A reusable component for teachers to start AI Live Class sessions.
 * Can be embedded in any week/hour page or standalone context.
 * 
 * @module ai-live-class/components/AISessionLauncher
 * @version 1.0.0
 * 
 * FEATURES:
 * - Topic input with suggestions based on week content
 * - Optional material/task selection
 * - Session creation with unique join code
 * - Compact or expanded display modes
 * 
 * USAGE:
 * ```tsx
 * // Basic usage - embed in any page
 * <AISessionLauncher 
 *   teacherId={user.id}
 *   weekNumber={2}
 *   onSessionCreated={(session) => navigate(`/ai-class/${session.id}`)}
 * />
 * 
 * // Compact mode for sidebars
 * <AISessionLauncher 
 *   teacherId={user.id}
 *   variant="compact"
 * />
 * ```
 * 
 * =============================================================================
 */

import { useState, useCallback } from 'react';
import { Play, Users, Sparkles, MessageSquare, ChevronDown, ChevronUp, Settings2, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useTeacherAISession } from '../hooks/useTeacherAISession';
import { DEFAULT_PROMPTS } from '../constants';
import type { AILiveSession, CreateSessionOptions } from '../types';

// =============================================================================
// PROMPT TEMPLATES
// =============================================================================

/**
 * Pre-configured prompt templates for common use cases.
 */
const PROMPT_TEMPLATES = {
  general: {
    label: 'General Academic',
    description: 'Broad academic discussion on any topic',
    prompt: DEFAULT_PROMPTS.ACADEMIC_GENERAL,
  },
  writing: {
    label: 'Academic Writing',
    description: 'Focus on writing skills, citations, structure',
    prompt: DEFAULT_PROMPTS.ACADEMIC_WRITING,
  },
  analysis: {
    label: 'Critical Analysis',
    description: 'Analyze arguments, evaluate sources',
    prompt: DEFAULT_PROMPTS.CRITICAL_ANALYSIS,
  },
  custom: {
    label: 'Custom',
    description: 'Write your own system prompt',
    prompt: '',
  },
} as const;

type PromptTemplateKey = keyof typeof PROMPT_TEMPLATES;

// =============================================================================
// COMPONENT PROPS INTERFACE
// =============================================================================

/**
 * Props for the AISessionLauncher component.
 */
export interface AISessionLauncherProps {
  /**
   * The teacher's user ID.
   * Required for session creation.
   */
  teacherId: string;

  /**
   * Optional week number for context.
   * Used to suggest relevant topics.
   */
  weekNumber?: number;

  /**
   * Optional hour number for context.
   */
  hourNumber?: number;

  /**
   * Display variant.
   * - 'default': Full card with all options
   * - 'compact': Minimal button that expands
   * - 'inline': No card wrapper, just the form
   */
  variant?: 'default' | 'compact' | 'inline';

  /**
   * Callback when session is created successfully.
   * Receives the new session data.
   */
  onSessionCreated?: (session: AILiveSession) => void;

  /**
   * Custom placeholder for the topic input.
   */
  topicPlaceholder?: string;

  /**
   * Suggested topics to display as quick-select chips.
   */
  suggestedTopics?: string[];

  /**
   * Additional CSS classes for the container.
   */
  className?: string;

  /**
   * Whether the launcher is disabled.
   */
  disabled?: boolean;
}

// =============================================================================
// DEFAULT SUGGESTED TOPICS BY WEEK
// =============================================================================

/**
 * Default topic suggestions based on week number.
 * These align with the course curriculum.
 */
const getDefaultTopics = (weekNumber?: number): string[] => {
  const topicsByWeek: Record<number, string[]> = {
    1: ['Skimming & Scanning', 'Reading Strategies', 'Main Idea Identification'],
    2: ['APA Citation Format', 'In-Text Citations', 'Reference Lists'],
    3: ['Paraphrasing Skills', 'Summarising Techniques', 'Academic Writing Style'],
    4: ['Synthesis Skills', 'Comparing Sources', 'Building Arguments'],
    5: ['AWQ Preparation', 'Timed Writing Practice', 'Exam Strategies'],
  };

  if (weekNumber && topicsByWeek[weekNumber]) {
    return topicsByWeek[weekNumber];
  }

  // Default topics for any week
  return ['Academic Writing', 'Research Skills', 'Critical Reading', 'Q&A Session'];
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

/**
 * AISessionLauncher - Reusable session creation component.
 * 
 * Teachers can use this to start AI Live Class sessions from anywhere
 * in the platform. The component handles:
 * - Session creation with unique codes
 * - Topic selection (custom or suggested)
 * - Optional description for context
 * - Week/hour metadata attachment
 * 
 * @example
 * ```tsx
 * // In a week page
 * function Week2Hour3Page() {
 *   const { user, isTeacher } = useAuth();
 *   
 *   return (
 *     <div>
 *       <h1>Week 2 - Hour 3</h1>
 *       
 *       {isTeacher && (
 *         <AISessionLauncher
 *           teacherId={user.id}
 *           weekNumber={2}
 *           hourNumber={3}
 *           onSessionCreated={(session) => {
 *             // Redirect to session view or show dashboard
 *             console.log('Session started:', session.session_code);
 *           }}
 *         />
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function AISessionLauncher({
  teacherId,
  weekNumber,
  hourNumber,
  variant = 'default',
  onSessionCreated,
  topicPlaceholder = 'e.g., APA Citation Practice',
  suggestedTopics,
  className = '',
  disabled = false,
}: AISessionLauncherProps) {
  // ---------------------------------------------------------------------------
  // STATE
  // ---------------------------------------------------------------------------

  /**
   * The topic for the new session.
   */
  const [topic, setTopic] = useState('');

  /**
   * Optional description for additional context.
   */
  const [description, setDescription] = useState('');

  /**
   * Selected prompt template.
   */
  const [promptTemplate, setPromptTemplate] = useState<PromptTemplateKey>('general');

  /**
   * Custom system prompt (used when template is 'custom' or edited).
   */
  const [customPrompt, setCustomPrompt] = useState('');

  /**
   * Additional context to inject into the prompt.
   */
  const [additionalContext, setAdditionalContext] = useState('');

  /**
   * Whether the advanced options are expanded.
   */
  const [showAdvanced, setShowAdvanced] = useState(false);

  /**
   * Whether the compact launcher is expanded.
   */
  const [isExpanded, setIsExpanded] = useState(false);

  // ---------------------------------------------------------------------------
  // HOOKS
  // ---------------------------------------------------------------------------

  /**
   * Teacher session hook for creating sessions.
   */
  const { session, createSession, isLoading } = useTeacherAISession({
    teacherId,
  });

  // ---------------------------------------------------------------------------
  // COMPUTED VALUES
  // ---------------------------------------------------------------------------

  /**
   * Topics to suggest based on week or custom list.
   */
  const topics = suggestedTopics || getDefaultTopics(weekNumber);

  /**
   * Whether a session already exists.
   */
  const hasActiveSession = !!session;

  // ---------------------------------------------------------------------------
  // HANDLERS
  // ---------------------------------------------------------------------------

  /**
   * Handles topic chip selection.
   */
  const handleTopicSelect = useCallback((selectedTopic: string) => {
    setTopic(selectedTopic);
  }, []);

  /**
   * Handles session creation.
   */
  const handleCreateSession = useCallback(async () => {
    if (!topic.trim()) {
      return;
    }

    // Build the system prompt based on template or custom
    let finalSystemPrompt = promptTemplate === 'custom' 
      ? customPrompt 
      : PROMPT_TEMPLATES[promptTemplate].prompt;
    
    // Append additional context if provided
    if (additionalContext.trim()) {
      finalSystemPrompt += `\n\n## Additional Context\n${additionalContext.trim()}`;
    }

    const options: CreateSessionOptions = {
      topic: topic.trim(),
      description: description.trim() || undefined,
      weekNumber,
      systemPrompt: finalSystemPrompt || undefined,
    };

    const success = await createSession(options);

    if (success && onSessionCreated) {
      // Wait for session state to update
      setTimeout(() => {
        // Re-check session from hook
      }, 100);
    }
  }, [topic, description, weekNumber, promptTemplate, customPrompt, additionalContext, createSession, onSessionCreated]);

  // ---------------------------------------------------------------------------
  // COMPACT VARIANT
  // ---------------------------------------------------------------------------

  if (variant === 'compact') {
    return (
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-between ${className}`}
            disabled={disabled || hasActiveSession}
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Start AI Live Class
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4">
          {/* Render the inline form */}
          <AISessionLauncherForm
            topic={topic}
            setTopic={setTopic}
            description={description}
            setDescription={setDescription}
            promptTemplate={promptTemplate}
            setPromptTemplate={setPromptTemplate}
            customPrompt={customPrompt}
            setCustomPrompt={setCustomPrompt}
            additionalContext={additionalContext}
            setAdditionalContext={setAdditionalContext}
            topics={topics}
            onTopicSelect={handleTopicSelect}
            onCreateSession={handleCreateSession}
            isLoading={isLoading}
            disabled={disabled}
            topicPlaceholder={topicPlaceholder}
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
          />
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // ---------------------------------------------------------------------------
  // INLINE VARIANT
  // ---------------------------------------------------------------------------

  if (variant === 'inline') {
    return (
      <div className={className}>
        <AISessionLauncherForm
          topic={topic}
          setTopic={setTopic}
          description={description}
          setDescription={setDescription}
          promptTemplate={promptTemplate}
          setPromptTemplate={setPromptTemplate}
          customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
          additionalContext={additionalContext}
          setAdditionalContext={setAdditionalContext}
          topics={topics}
          onTopicSelect={handleTopicSelect}
          onCreateSession={handleCreateSession}
          isLoading={isLoading}
          disabled={disabled}
          topicPlaceholder={topicPlaceholder}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // DEFAULT VARIANT (FULL CARD)
  // ---------------------------------------------------------------------------

  return (
    <Card className={`border-primary/30 bg-gradient-to-br from-primary/5 to-transparent ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Start AI Live Class
        </CardTitle>
        <CardDescription>
          Launch a moderated AI discussion. Students can join with a code and submit questions.
          {weekNumber && (
            <Badge variant="outline" className="ml-2">
              Week {weekNumber}{hourNumber ? ` Hour ${hourNumber}` : ''}
            </Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AISessionLauncherForm
          topic={topic}
          setTopic={setTopic}
          description={description}
          setDescription={setDescription}
          promptTemplate={promptTemplate}
          setPromptTemplate={setPromptTemplate}
          customPrompt={customPrompt}
          setCustomPrompt={setCustomPrompt}
          additionalContext={additionalContext}
          setAdditionalContext={setAdditionalContext}
          topics={topics}
          onTopicSelect={handleTopicSelect}
          onCreateSession={handleCreateSession}
          isLoading={isLoading}
          disabled={disabled || hasActiveSession}
          topicPlaceholder={topicPlaceholder}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
        />
        
        {/* Info text */}
        <p className="text-xs text-muted-foreground text-center mt-4">
          Students will join using the session code displayed after creation
        </p>
      </CardContent>
    </Card>
  );
}

// =============================================================================
// INTERNAL FORM COMPONENT
// =============================================================================

/**
 * Props for the internal form component.
 */
interface AISessionLauncherFormProps {
  topic: string;
  setTopic: (topic: string) => void;
  description: string;
  setDescription: (description: string) => void;
  promptTemplate: PromptTemplateKey;
  setPromptTemplate: (template: PromptTemplateKey) => void;
  customPrompt: string;
  setCustomPrompt: (prompt: string) => void;
  additionalContext: string;
  setAdditionalContext: (context: string) => void;
  topics: string[];
  onTopicSelect: (topic: string) => void;
  onCreateSession: () => Promise<void>;
  isLoading: boolean;
  disabled: boolean;
  topicPlaceholder: string;
  showAdvanced: boolean;
  setShowAdvanced: (show: boolean) => void;
}

/**
 * Internal form component for session creation.
 * Extracted to avoid duplication across variants.
 */
function AISessionLauncherForm({
  topic,
  setTopic,
  description,
  setDescription,
  promptTemplate,
  setPromptTemplate,
  customPrompt,
  setCustomPrompt,
  additionalContext,
  setAdditionalContext,
  topics,
  onTopicSelect,
  onCreateSession,
  isLoading,
  disabled,
  topicPlaceholder,
  showAdvanced,
  setShowAdvanced,
}: AISessionLauncherFormProps) {
  return (
    <div className="space-y-4">
      {/* Topic input */}
      <div className="space-y-2">
        <Label htmlFor="session-topic">Topic *</Label>
        <Input
          id="session-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={topicPlaceholder}
          disabled={disabled}
        />
      </div>

      {/* Topic suggestions */}
      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <Badge
            key={t}
            variant={topic === t ? 'default' : 'outline'}
            className="cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={() => !disabled && onTopicSelect(t)}
          >
            {t}
          </Badge>
        ))}
      </div>

      {/* Advanced options toggle */}
      <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
            <Settings2 className="h-4 w-4 mr-2" />
            {showAdvanced ? 'Hide' : 'Show'} AI Configuration
            {showAdvanced ? (
              <ChevronUp className="h-4 w-4 ml-2" />
            ) : (
              <ChevronDown className="h-4 w-4 ml-2" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 space-y-4">
          {/* Tabs for Basic vs Custom */}
          <Tabs defaultValue="templates" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
            </TabsList>
            
            <TabsContent value="templates" className="space-y-4 mt-4">
              {/* Prompt Template Selection */}
              <div className="space-y-2">
                <Label>AI Behavior Template</Label>
                <Select 
                  value={promptTemplate} 
                  onValueChange={(v) => setPromptTemplate(v as PromptTemplateKey)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PROMPT_TEMPLATES).filter(([key]) => key !== 'custom').map(([key, template]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex flex-col items-start">
                          <span>{template.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {promptTemplate !== 'custom' && (
                  <p className="text-xs text-muted-foreground">
                    {PROMPT_TEMPLATES[promptTemplate].description}
                  </p>
                )}
              </div>
              
              {/* Additional Context */}
              <div className="space-y-2">
                <Label htmlFor="additional-context">
                  <FileText className="h-4 w-4 inline mr-1" />
                  Additional Context (optional)
                </Label>
                <Textarea
                  id="additional-context"
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="Paste lecture notes, article excerpts, or specific instructions for this session..."
                  rows={4}
                  disabled={disabled}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  This context will be included in the AI's system prompt.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4 mt-4">
              {/* Custom System Prompt */}
              <div className="space-y-2">
                <Label htmlFor="custom-prompt">Custom System Prompt</Label>
                <Textarea
                  id="custom-prompt"
                  value={customPrompt}
                  onChange={(e) => {
                    setCustomPrompt(e.target.value);
                    setPromptTemplate('custom');
                  }}
                  placeholder="You are an AI tutor specializing in academic English. Your role is to..."
                  rows={6}
                  disabled={disabled}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Define exactly how the AI should behave during this session.
                </p>
              </div>
              
              {/* Quick Insert Buttons */}
              <div className="space-y-2">
                <Label className="text-xs">Quick insert from template:</Label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PROMPT_TEMPLATES).filter(([key]) => key !== 'custom').map(([key, template]) => (
                    <Badge
                      key={key}
                      variant="outline"
                      className="cursor-pointer hover:bg-muted transition-colors text-xs"
                      onClick={() => {
                        setCustomPrompt(template.prompt);
                        setPromptTemplate('custom');
                      }}
                    >
                      {template.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Description for students */}
          <div className="space-y-2">
            <Label htmlFor="session-description">Session Description (optional)</Label>
            <Textarea
              id="session-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description students will see when joining..."
              rows={2}
              disabled={disabled}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Create button */}
      <Button
        onClick={onCreateSession}
        disabled={isLoading || disabled || !topic.trim()}
        className="w-full"
        size="lg"
      >
        <Play className="h-4 w-4 mr-2" />
        {isLoading ? 'Creating...' : 'Create Session'}
      </Button>
    </div>
  );
}

export default AISessionLauncher;
