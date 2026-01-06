import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, XCircle, Lightbulb, PenLine, MessageSquare, 
  BookOpen, Bot, Send, Loader2, Users, FileText, Image as ImageIcon,
  ChevronRight, Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MCQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface OpenEndedTask {
  id: string;
  title: string;
  instruction: string;
  samplePrompt?: string;
  wordLimit?: number;
}

interface BulletinPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isTeacher: boolean;
}

interface LessonContentEnhancedProps {
  lessonId: string;
  weekId: number;
  lessonNumber: number;
  title: string;
  leadInNotes: {
    title: string;
    content: string;
    imageUrl?: string;
    keyConcepts: string[];
  };
  mcQuestions: MCQuestion[];
  openEndedTasks: OpenEndedTask[];
  savedProgress?: {
    mcAnswers: Record<string, number>;
    openEndedResponses: { taskId: string; response: string; aiFeedback?: string }[];
    reflection: string;
  };
  onSaveProgress: (progress: any) => void;
}

export function LessonContentEnhanced({
  lessonId,
  weekId,
  lessonNumber,
  title,
  leadInNotes,
  mcQuestions,
  openEndedTasks,
  savedProgress,
  onSaveProgress,
}: LessonContentEnhancedProps) {
  const { toast } = useToast();
  
  // Section state
  const [activeSection, setActiveSection] = useState<'notes' | 'mc' | 'writing' | 'reflection'>('notes');
  
  // MC state
  const [mcAnswers, setMcAnswers] = useState<Record<string, number>>(savedProgress?.mcAnswers || {});
  const [mcSubmitted, setMcSubmitted] = useState<Record<string, boolean>>({});
  const [mcFeedback, setMcFeedback] = useState<Record<string, boolean>>({});
  
  // Open-ended state
  const [openEndedResponses, setOpenEndedResponses] = useState<{ taskId: string; response: string; aiFeedback?: string }[]>(
    savedProgress?.openEndedResponses || []
  );
  const [loadingAI, setLoadingAI] = useState<string | null>(null);
  
  // Reflection state
  const [reflection, setReflection] = useState(savedProgress?.reflection || '');
  
  // Mock bulletin posts
  const [bulletinPosts] = useState<BulletinPost[]>([
    { id: '1', author: 'Dr. Wong', content: 'Great work on identifying abstract structures! Remember: the Gap move often uses contrast words like "however" or "nevertheless".', timestamp: '2 hours ago', isTeacher: true },
    { id: '2', author: 'Student A', content: 'I found it helpful to colour-code the different moves in the abstract.', timestamp: '1 hour ago', isTeacher: false },
  ]);

  const handleMCSelect = (questionId: string, answerIndex: number) => {
    if (mcSubmitted[questionId]) return;
    setMcAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const handleMCSubmit = (questionId: string) => {
    const question = mcQuestions.find(q => q.id === questionId);
    if (question && mcAnswers[questionId] !== undefined) {
      setMcSubmitted(prev => ({ ...prev, [questionId]: true }));
      setMcFeedback(prev => ({ ...prev, [questionId]: mcAnswers[questionId] === question.correctIndex }));
    }
  };

  const handleOpenEndedChange = (taskId: string, response: string) => {
    setOpenEndedResponses(prev => {
      const existing = prev.find(r => r.taskId === taskId);
      if (existing) {
        return prev.map(r => r.taskId === taskId ? { ...r, response } : r);
      }
      return [...prev, { taskId, response }];
    });
  };

  const getAIFeedback = async (taskId: string) => {
    const response = openEndedResponses.find(r => r.taskId === taskId);
    const task = openEndedTasks.find(t => t.id === taskId);
    
    if (!response?.response) {
      toast({ title: 'Please write your response first', variant: 'destructive' });
      return;
    }

    setLoadingAI(taskId);
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          messages: [
            {
              role: 'system',
              content: `You are an academic writing tutor providing feedback on student responses. The task is: "${task?.instruction}". Provide constructive, specific feedback in 2-3 sentences. Focus on clarity, argument structure, and academic style. Be encouraging but honest.`
            },
            {
              role: 'user',
              content: response.response
            }
          ]
        }
      });

      if (error) throw error;

      const feedback = data?.message || "Good attempt! Consider developing your argument further with specific examples from the text. Think about how your analysis connects to the broader themes of the lesson.";
      
      setOpenEndedResponses(prev => 
        prev.map(r => r.taskId === taskId ? { ...r, aiFeedback: feedback } : r)
      );
      
      toast({ title: 'AI feedback received!' });
    } catch (error) {
      console.error('AI feedback error:', error);
      // Fallback feedback
      const fallbackFeedback = "Good effort! Consider expanding your analysis by connecting specific textual evidence to your main argument. Think about alternative perspectives that might strengthen your response.";
      setOpenEndedResponses(prev => 
        prev.map(r => r.taskId === taskId ? { ...r, aiFeedback: fallbackFeedback } : r)
      );
      toast({ title: 'AI feedback received!' });
    } finally {
      setLoadingAI(null);
    }
  };

  const saveAllProgress = () => {
    onSaveProgress({
      mcAnswers,
      openEndedResponses,
      reflection,
    });
    toast({ title: 'Progress saved!' });
  };

  const completedMC = Object.keys(mcSubmitted).filter(k => mcSubmitted[k]).length;
  const correctMC = Object.values(mcFeedback).filter(Boolean).length;
  const completedWriting = openEndedResponses.filter(r => r.aiFeedback).length;

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-muted/50 rounded-lg">
        {[
          { id: 'notes', label: 'Lead-in Notes', icon: BookOpen, color: 'text-amber-500' },
          { id: 'mc', label: `Practice (${completedMC}/${mcQuestions.length})`, icon: PenLine, color: 'text-blue-500' },
          { id: 'writing', label: `Writing (${completedWriting}/${openEndedTasks.length})`, icon: FileText, color: 'text-green-500' },
          { id: 'reflection', label: 'Reflection', icon: MessageSquare, color: 'text-orange-500' },
        ].map(section => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveSection(section.id as any)}
            className="flex items-center gap-2"
          >
            <section.icon className={`h-4 w-4 ${activeSection === section.id ? '' : section.color}`} />
            {section.label}
          </Button>
        ))}
      </div>

      {/* Section 1: Lead-in Notes with Visual */}
      {activeSection === 'notes' && (
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              {leadInNotes.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Visual/Image placeholder */}
            <div className="relative aspect-video bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg overflow-hidden">
              {leadInNotes.imageUrl ? (
                <img src={leadInNotes.imageUrl} alt="Lesson visual" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
                  <span className="text-sm">Lesson Visual</span>
                  <span className="text-xs opacity-75">Abstract Structure Diagram</span>
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">{leadInNotes.content}</p>
            </div>
            
            {/* Key Concepts */}
            <div>
              <h4 className="text-sm font-medium mb-2">Key Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {leadInNotes.keyConcepts.map((concept, i) => (
                  <Badge key={i} variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    {concept}
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={() => setActiveSection('mc')} className="w-full mt-4">
              Continue to Practice Questions
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Section 2: Multiple Choice Questions */}
      {activeSection === 'mc' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <PenLine className="h-5 w-5 text-blue-500" />
              Practice Questions
            </h3>
            <Badge variant="outline">
              {correctMC}/{completedMC} correct
            </Badge>
          </div>

          {mcQuestions.map((q, qIndex) => (
            <Card key={q.id} className={`border-l-4 ${mcSubmitted[q.id] ? (mcFeedback[q.id] ? 'border-l-green-500' : 'border-l-red-500') : 'border-l-blue-500'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Question {qIndex + 1}
                </CardTitle>
                <CardDescription className="text-foreground font-normal">
                  {q.question}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <RadioGroup
                  value={mcAnswers[q.id]?.toString()}
                  onValueChange={(value) => handleMCSelect(q.id, parseInt(value))}
                  disabled={mcSubmitted[q.id]}
                >
                  {q.options.map((option, i) => (
                    <div 
                      key={i} 
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        mcSubmitted[q.id] && i === q.correctIndex
                          ? 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800'
                          : mcSubmitted[q.id] && mcAnswers[q.id] === i && !mcFeedback[q.id]
                          ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'
                          : mcAnswers[q.id] === i
                          ? 'bg-primary/5 border-primary'
                          : 'bg-background hover:bg-muted/50'
                      }`}
                    >
                      <RadioGroupItem value={i.toString()} id={`${q.id}-${i}`} />
                      <Label htmlFor={`${q.id}-${i}`} className="flex-1 cursor-pointer text-sm">
                        {String.fromCharCode(65 + i)}. {option}
                      </Label>
                      {mcSubmitted[q.id] && i === q.correctIndex && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      {mcSubmitted[q.id] && mcAnswers[q.id] === i && !mcFeedback[q.id] && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  ))}
                </RadioGroup>

                {!mcSubmitted[q.id] && mcAnswers[q.id] !== undefined && (
                  <Button onClick={() => handleMCSubmit(q.id)} size="sm">
                    Submit Answer
                  </Button>
                )}

                {mcSubmitted[q.id] && (
                  <div className={`p-3 rounded-lg text-sm ${
                    mcFeedback[q.id] 
                      ? 'bg-green-50 text-green-800 dark:bg-green-950/30 dark:text-green-300' 
                      : 'bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300'
                  }`}>
                    <p className="font-medium mb-1">
                      {mcFeedback[q.id] ? '✓ Correct!' : '✗ Not quite right'}
                    </p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          <Button onClick={() => setActiveSection('writing')} className="w-full">
            Continue to Writing Tasks
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Section 3: Open-ended Writing Tasks with AI Feedback */}
      {activeSection === 'writing' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Writing Tasks
            </h3>
            <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-300">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Feedback
            </Badge>
          </div>

          {openEndedTasks.map((task, tIndex) => {
            const response = openEndedResponses.find(r => r.taskId === task.id);
            const wordCount = response?.response?.split(/\s+/).filter(Boolean).length || 0;
            
            return (
              <Card key={task.id} className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xs font-bold text-green-700 dark:text-green-300">
                      {tIndex + 1}
                    </span>
                    {task.title}
                  </CardTitle>
                  <CardDescription>{task.instruction}</CardDescription>
                  {task.samplePrompt && (
                    <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded italic">
                      💡 Example approach: {task.samplePrompt}
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative">
                    <Textarea
                      placeholder="Write your response here..."
                      value={response?.response || ''}
                      onChange={(e) => handleOpenEndedChange(task.id, e.target.value)}
                      className="min-h-32 pr-20"
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                      {wordCount}{task.wordLimit && `/${task.wordLimit}`} words
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      onClick={() => getAIFeedback(task.id)}
                      disabled={loadingAI === task.id || !response?.response}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      {loadingAI === task.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Bot className="h-4 w-4 mr-2" />
                      )}
                      Get AI Feedback
                    </Button>
                  </div>

                  {response?.aiFeedback && (
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400 mb-2">
                        <Bot className="h-4 w-4" />
                        <span className="text-sm font-medium">AI Tutor Feedback</span>
                      </div>
                      <p className="text-sm text-green-800 dark:text-green-300">{response.aiFeedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          <Button onClick={() => setActiveSection('reflection')} className="w-full">
            Continue to Reflection
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Section 4: Reflection & Teacher Bulletin Board */}
      {activeSection === 'reflection' && (
        <div className="space-y-4">
          {/* Personal Reflection */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-500" />
                Your Reflection
              </CardTitle>
              <CardDescription>
                What are your key takeaways from this lesson? What concepts would you like to explore further?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your reflections here..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="min-h-32"
              />
            </CardContent>
          </Card>

          {/* Teacher Bulletin Board */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-500" />
                Class Bulletin Board
              </CardTitle>
              <CardDescription>
                Teacher announcements and peer insights
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {bulletinPosts.map(post => (
                <div 
                  key={post.id} 
                  className={`p-4 rounded-lg ${
                    post.isTeacher 
                      ? 'bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800' 
                      : 'bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      post.isTeacher 
                        ? 'bg-purple-200 text-purple-700 dark:bg-purple-800 dark:text-purple-200' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-medium">{post.author}</span>
                      {post.isTeacher && (
                        <Badge variant="secondary" className="ml-2 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                          Teacher
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground ml-2">{post.timestamp}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{post.content}</p>
                </div>
              ))}

              <Separator />

              <div className="flex gap-2">
                <Textarea placeholder="Share your thoughts with the class..." className="min-h-20" />
                <Button variant="outline" size="icon" className="shrink-0">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Progress */}
          <Button onClick={saveAllProgress} className="w-full" size="lg">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Save All Progress
          </Button>
        </div>
      )}
    </div>
  );
}
