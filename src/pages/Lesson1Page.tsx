import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, LogIn, BookOpen, Target, Clock } from "lucide-react";
import { LessonContentEnhanced } from "@/components/lessons/LessonContentEnhanced";
import { useAuth } from "@/contexts/AuthContext";
import { useLessonProgress, useSaveLessonProgress } from "@/hooks/useLessonProgress";
import { Badge } from "@/components/ui/badge";

// Lesson 1 content - Anatomy of an Article
const lesson1Data = {
  lessonId: 'week1-lesson1',
  weekId: 1,
  lessonNumber: 1,
  title: 'Anatomy of an Article',
  leadInNotes: {
    title: 'Understanding Academic Article Structure',
    content: `In this lesson, you'll learn to quickly identify the type and stance of academic articles before diving into detailed reading. This strategic approach saves time and improves comprehension.

Academic articles come in two main types:
• **Empirical articles** are based on observed and measured phenomena. They include sections like Methods, Results, and Discussion. Look for phrases like "data was collected" or "participants were recruited."
• **Conceptual articles** focus on ideas, theories, or frameworks without collecting original data. They often build arguments using existing literature and theoretical analysis.

The title of an article often reveals the author's stance. Words like "challenging," "questioning," or "problematic" suggest a critical view, while "supporting," "benefits," or "potential" indicate a positive perspective.

Understanding these distinctions helps you set appropriate expectations before reading and locate key information more efficiently.`,
    keyConcepts: ['Empirical vs Conceptual', 'Title Analysis', 'Author Stance', 'Abstract Moves', 'Strategic Reading']
  },
  mcQuestions: [
    {
      id: 'mc1',
      question: 'Which type of article would include a "Methods" section describing data collection procedures?',
      options: [
        'Conceptual article',
        'Empirical article', 
        'Literature review only',
        'Opinion editorial'
      ],
      correctIndex: 1,
      explanation: 'Empirical articles are based on observed and measured phenomena, so they include Methods sections describing how data was collected and analyzed.'
    },
    {
      id: 'mc2',
      question: 'The title "Challenging the adoption of AI in education" suggests the author\'s stance is:',
      options: [
        'Supportive and enthusiastic',
        'Neutral and balanced',
        'Critical or questioning',
        'Purely descriptive'
      ],
      correctIndex: 2,
      explanation: 'The word "Challenging" indicates the author will question or criticize AI adoption, showing a critical stance toward the topic.'
    },
    {
      id: 'mc3',
      question: 'Which phrase typically signals the "Gap" move in an abstract?',
      options: [
        'This study examined...',
        'However, little attention has been paid to...',
        'Results indicate that...',
        'The findings suggest...'
      ],
      correctIndex: 1,
      explanation: '"However" and "little attention" are signpost phrases that indicate what\'s missing in existing research—the gap that the study addresses.'
    },
    {
      id: 'mc4',
      question: 'An abstract contains "This paper argues that..." and discusses theories without mentioning surveys or experiments. This is likely:',
      options: [
        'An empirical study',
        'A conceptual article',
        'An experimental report',
        'A case study'
      ],
      correctIndex: 1,
      explanation: 'The phrase "This paper argues" and the absence of data collection methods indicate a conceptual article that builds arguments through theoretical analysis.'
    },
    {
      id: 'mc5',
      question: 'What is the PRIMARY benefit of analyzing the title and abstract before reading an article in full?',
      options: [
        'It helps you memorize the content faster',
        'It allows you to skip the methodology section',
        'It helps you set expectations and read strategically',
        'It eliminates the need to read the conclusion'
      ],
      correctIndex: 2,
      explanation: 'Analyzing titles and abstracts first helps you understand the article\'s type, stance, and structure, allowing you to read more efficiently and locate key information faster.'
    }
  ],
  openEndedTasks: [
    {
      id: 'oe1',
      title: 'Title Analysis Practice',
      instruction: 'Read the title "Supporting schools to implement face recognition systems: A guide for administrators." What stance do you predict the author will take? Identify the specific keywords that helped you make this prediction.',
      samplePrompt: 'Consider words that indicate positive/negative attitudes...',
      wordLimit: 150
    },
    {
      id: 'oe2',
      title: 'Article Type Identification',
      instruction: 'Why is it important to identify whether an article is empirical or conceptual BEFORE reading it in detail? Explain how this knowledge affects your reading strategy.',
      samplePrompt: 'Think about what sections you would expect in each type...',
      wordLimit: 150
    },
    {
      id: 'oe3',
      title: 'Abstract Structure Analysis',
      instruction: 'Consider this abstract excerpt: "While facial recognition technology (FRT) has gained attention in education, little research examines student perspectives. This study surveyed 500 students..." Identify the moves present (Context, Gap, Purpose, Method) and explain how you recognized each one.',
      samplePrompt: 'Look for signpost words and phrases that indicate each move...',
      wordLimit: 200
    }
  ]
};

const Lesson1Page = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const { data: progress } = useLessonProgress(lesson1Data.lessonId);
  const saveMutation = useSaveLessonProgress(lesson1Data.lessonId);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <section className="hero-shell">
        <div className="hero-glow-orb" aria-hidden="true" />
        <div className="hero-inner">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="week-pill">Week 1</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                Lesson 1 of 3
              </Badge>
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {lesson1Data.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Learn to identify article types, analyze titles for author stance, and decode abstract structure for efficient reading.
            </p>
            
            {/* Lesson objectives */}
            <div className="flex flex-wrap gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4 text-primary" />
                <span>5 Practice Questions</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 text-green-500" />
                <span>3 Writing Tasks</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>~30 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auth prompt */}
      {!isAuthenticated && (
        <Alert className="border-primary/20 bg-primary/5">
          <LogIn className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Sign in to save your progress and get personalized AI feedback.</span>
            <Button size="sm" variant="outline" onClick={login}>
              Sign In with HKBU
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Lesson Content */}
      <LessonContentEnhanced
        lessonId={lesson1Data.lessonId}
        weekId={lesson1Data.weekId}
        lessonNumber={lesson1Data.lessonNumber}
        title={lesson1Data.title}
        leadInNotes={lesson1Data.leadInNotes}
        mcQuestions={lesson1Data.mcQuestions}
        openEndedTasks={lesson1Data.openEndedTasks}
        savedProgress={progress ? {
          mcAnswers: (progress.mc_answers as Record<string, number>) || {},
          openEndedResponses: ((progress.open_ended_responses as any[])?.map(r => ({
            taskId: r.taskId || r.questionId,
            response: r.response,
            aiFeedback: r.aiFeedback || r.feedback
          }))) || [],
          reflection: progress.reflection || '',
        } : undefined}
        onSaveProgress={(progressData) => {
          if (isAuthenticated) {
            saveMutation.mutate(progressData);
          }
        }}
      />

      {/* Navigation */}
      <Card className="card-elevated">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => navigate('/week/1')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Week 1
            </Button>
            <Button onClick={() => navigate('/week/1/lesson/2')}>
              Next: Reading with Purpose
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Lesson1Page;
