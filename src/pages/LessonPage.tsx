import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getWeekById } from "@/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, HelpCircle, ArrowLeft, ArrowRight, Loader2, LogIn } from "lucide-react";
import { useLesson } from "@/hooks/useLessons";
import { useLessonProgress, useSaveLessonProgress } from "@/hooks/useLessonProgress";
import { LessonContent } from "@/components/lessons/LessonContent";
import { useAuth } from "@/contexts/AuthContext";

// Sample lesson content data - in production this would come from a database
const lessonContentData: Record<string, {
  notes: string[];
  keyConcepts: string[];
  mcQuestions: { id: string; question: string; options: string[]; correctIndex: number; explanation: string }[];
  fillBlankQuestions: { id: string; sentence: string; blanks: { position: number; answer: string }[] }[];
  openEndedQuestions: { id: string; question: string; hints?: string[] }[];
}> = {
  // Week 1, Lesson 1: Anatomy of an Article
  default_1_1: {
    notes: [
      "Academic articles come in two main types: Empirical (based on data) and Conceptual (based on ideas/theory)",
      "You can often predict an article's stance by analyzing the title keywords",
      "Abstracts follow a predictable structure: Context → Gap → Purpose → Method → Results → Conclusion",
      "Reading strategically (titles and abstracts first) saves time and improves comprehension"
    ],
    keyConcepts: ["Empirical vs Conceptual", "Title Analysis", "Abstract Moves", "Stance Prediction"],
    mcQuestions: [
      {
        id: "mc1",
        question: "Which type of article would include a 'Methods' section describing data collection?",
        options: ["Conceptual article", "Empirical article", "Literature review", "Opinion piece"],
        correctIndex: 1,
        explanation: "Empirical articles are based on observed and measured phenomena, so they include Methods sections describing how data was collected."
      },
      {
        id: "mc2",
        question: "The title 'Challenging the adoption of AI in education' suggests the author's stance is:",
        options: ["Supportive", "Neutral", "Critical/Doubting", "Descriptive"],
        correctIndex: 2,
        explanation: "The word 'Challenging' indicates the author will question or criticize AI adoption, showing a critical stance."
      },
      {
        id: "mc3",
        question: "Which phrase typically signals the 'Gap' move in an abstract?",
        options: ["This study examined...", "However, little attention has been paid to...", "Results indicate that...", "In conclusion..."],
        correctIndex: 1,
        explanation: "'However' and 'little attention' are signpost phrases that indicate what's missing in existing research - the gap."
      }
    ],
    fillBlankQuestions: [
      {
        id: "fb1",
        sentence: "An abstract that includes phrases like 'Data was collected' and 'Results indicated' is likely from a(n) ____ article, while one that says 'This paper argues' is likely from a(n) ____ article.",
        blanks: [{ position: 0, answer: "empirical" }, { position: 1, answer: "conceptual" }]
      }
    ],
    openEndedQuestions: [
      {
        id: "oe1",
        question: "Read the title 'Supporting schools to use face recognition systems'. What stance do you predict the author will take? What keywords helped you decide?",
        hints: ["Look for positive/negative keywords", "Consider the verb choice"]
      },
      {
        id: "oe2",
        question: "Why is it important to identify whether an article is empirical or conceptual before reading it in detail?",
        hints: ["Think about structure expectations", "Consider what kind of evidence you'll find"]
      }
    ]
  },
  // Week 1, Lesson 2: Reading with Purpose
  default_1_2: {
    notes: [
      "Section headings act as a roadmap revealing both Context and Stance",
      "Topic sentences (usually first or second sentence) summarize each paragraph's main idea",
      "The Topic Sentence formula: Topic + Controlling Idea",
      "Distinguish between Claims (arguments) and Evidence (supporting data)",
      "For the AWQ, summarize Claims, not specific data points"
    ],
    keyConcepts: ["Section Headings", "Topic Sentences", "Claims vs Evidence", "Controlling Ideas"],
    mcQuestions: [
      {
        id: "mc1",
        question: "A topic sentence typically appears in which position in a paragraph?",
        options: ["Last sentence", "First or second sentence", "Middle of the paragraph", "It varies randomly"],
        correctIndex: 1,
        explanation: "Topic sentences are typically the first or second sentence, setting up the paragraph's main idea."
      },
      {
        id: "mc2",
        question: "'The average score was 3.919 out of 5' is an example of:",
        options: ["A claim", "Evidence", "A topic sentence", "A thesis statement"],
        correctIndex: 1,
        explanation: "Specific numerical data is evidence used to support claims, not the claim itself."
      }
    ],
    fillBlankQuestions: [
      {
        id: "fb1",
        sentence: "In the topic sentence 'Another point of concern is the inescapability of facial monitoring', the ____ is 'facial monitoring' and the ____ is 'inescapability (a concern)'.",
        blanks: [{ position: 0, answer: "topic" }, { position: 1, answer: "controlling idea" }]
      }
    ],
    openEndedQuestions: [
      {
        id: "oe1",
        question: "Find a topic sentence in an article you've read recently. Identify the Topic and the Controlling Idea.",
        hints: ["Look at the first sentence of body paragraphs", "What is being discussed? What is said about it?"]
      },
      {
        id: "oe2",
        question: "Why should you summarize claims rather than specific evidence in the AWQ?",
        hints: ["Consider word limits", "Think about what captures the author's argument"]
      }
    ]
  },
  // Week 1, Lesson 3: Abstract Analysis Lab
  default_1_3: {
    notes: [
      "Signpost words help you identify moves: 'However' (Gap), 'This study examined' (Purpose), 'Results indicate' (Findings)",
      "The abstract is a mini-version of the whole paper",
      "You can predict article content and stance from the abstract alone",
      "Colour-coding different moves helps visualize abstract structure"
    ],
    keyConcepts: ["Signpost Words", "Abstract Moves", "Prediction Skills", "Colour Coding"],
    mcQuestions: [
      {
        id: "mc1",
        question: "Which signpost phrase typically introduces the Purpose move?",
        options: ["A great deal of attention...", "This study examined...", "Therefore...", "Traditionally..."],
        correctIndex: 1,
        explanation: "'This study examined' directly states what the research does - the purpose."
      },
      {
        id: "mc2",
        question: "If an abstract contains 'Results indicate that...' but no mention of surveys or experiments, it's likely:",
        options: ["An empirical article", "A conceptual article", "Missing information", "A book review"],
        correctIndex: 1,
        explanation: "Conceptual articles can have 'results' in the sense of arguments/conclusions, but they don't collect original data."
      }
    ],
    fillBlankQuestions: [
      {
        id: "fb1",
        sentence: "The phrase 'Nonetheless, there has been little attention paid to...' signals the ____ move, while 'The results suggest that...' signals the ____ move.",
        blanks: [{ position: 0, answer: "gap" }, { position: 1, answer: "conclusion" }]
      }
    ],
    openEndedQuestions: [
      {
        id: "oe1",
        question: "Practice: Read an abstract and label each sentence with its move (Context, Gap, Purpose, Method, Results, Conclusion). Write out your analysis.",
        hints: ["Look for signpost words", "Some sentences may combine moves"]
      },
      {
        id: "oe2",
        question: "Based on the abstract 'This article contends that facial recognition raises critical questions...', predict: Will this article use statistics? What kind of evidence will it use instead?",
        hints: ["'contends' suggests argumentation", "Think about conceptual vs empirical"]
      }
    ]
  }
};

const LessonPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const weekId = Number(params.weekId);
  const lessonIdParam = params.lessonId;
  
  // Check if it's a UUID (database lesson) or a number (legacy lesson)
  const isDbLesson = lessonIdParam && lessonIdParam.includes('-');
  
  const week = Number.isNaN(weekId) ? undefined : getWeekById(weekId);
  const legacyLessonId = !isDbLesson ? Number(lessonIdParam) : null;
  const legacyLesson = legacyLessonId ? week?.lessons?.find(l => l.id === legacyLessonId) : null;
  
  // Fetch database lesson
  const { data: dbLesson, isLoading: lessonLoading } = useLesson(isDbLesson ? lessonIdParam! : '');
  const { data: progress } = useLessonProgress(isDbLesson ? lessonIdParam! : '');
  const saveMutation = useSaveLessonProgress(isDbLesson ? lessonIdParam! : '');

  const [questionStates, setQuestionStates] = useState(
    legacyLesson?.questions.map(() => ({ submitted: false, userAnswer: "", isCorrect: false })) || []
  );

  if (!week) {
    return <Navigate to="/" replace />;
  }

  if (lessonLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle database lesson
  if (isDbLesson && dbLesson) {
    const contentKey = `default_${dbLesson.week_id}_${dbLesson.lesson_number}`;
    const content = lessonContentData[contentKey] || lessonContentData.default_1_1;

    return (
      <div className="space-y-6">
        <section className="hero-shell">
          <div className="hero-glow-orb" aria-hidden="true" />
          <div className="hero-inner">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="week-pill">Week {dbLesson.week_id}</span>
                <span className="hero-badge">Lesson {dbLesson.lesson_number}</span>
              </div>
              <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                {dbLesson.title}
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                {dbLesson.description}
              </p>
            </div>
          </div>
        </section>

        {!isAuthenticated && (
          <Alert>
            <LogIn className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Sign in to save your progress and get personalized AI feedback.</span>
              <Button size="sm" variant="outline" onClick={login}>
                Sign In
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <LessonContent
          lessonId={dbLesson.id}
          notes={content.notes}
          keyConcepts={content.keyConcepts}
          mcQuestions={content.mcQuestions}
          fillBlankQuestions={content.fillBlankQuestions}
          openEndedQuestions={content.openEndedQuestions}
          savedProgress={progress ? {
            mcAnswers: progress.mc_answers,
            fillBlankAnswers: progress.fill_blank_answers,
            openEndedResponses: progress.open_ended_responses,
            reflection: progress.reflection || '',
          } : undefined}
          onSaveProgress={(progressData) => {
            if (isAuthenticated) {
              saveMutation.mutate(progressData);
            }
          }}
        />

        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => navigate(`/week/${weekId}`)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Week
              </Button>
              {dbLesson.lesson_number < 3 && (
                <Button onClick={() => {
                  // Navigate to next lesson - would need to fetch next lesson ID
                  navigate(`/week/${weekId}`);
                }}>
                  Next Lesson
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle legacy lesson (fallback for non-DB lessons)
  if (!legacyLesson) {
    return <Navigate to={`/week/${weekId}`} replace />;
  }

  const handleSubmit = (index: number, userAnswer: string) => {
    const question = legacyLesson.questions[index];
    let isCorrect = false;
    if (question.type === "multiple-choice" || question.type === "true-false") {
      isCorrect = userAnswer === question.answer;
    }
    setQuestionStates(prev => prev.map((state, i) =>
      i === index ? { submitted: true, userAnswer, isCorrect } : state
    ));
  };

  return (
    <div className="space-y-6">
      <section className="hero-shell">
        <div className="hero-glow-orb" aria-hidden="true" />
        <div className="hero-inner">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="week-pill">{week.title}</span>
              <span className="hero-badge">Lesson {legacyLesson.id}</span>
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {legacyLesson.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Part of {week.theme}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {legacyLesson.notes.length > 0 && (
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Study Notes</CardTitle>
              <CardDescription>Review these notes and examples before attempting the questions.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4 text-sm text-muted-foreground">
                {legacyLesson.notes.map((note, i) => (
                  <div key={i} className="space-y-2">
                    <p>{note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {legacyLesson.questions.length > 0 && (
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Practice Questions</CardTitle>
              <CardDescription>Attempt each question, then submit to see the answer and explanation.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              {legacyLesson.questions.map((q, i) => {
                const state = questionStates[i];
                return (
                  <div key={i} className="space-y-3 border-b pb-4 last:border-b-0">
                    <p className="font-medium text-sm">{i + 1}. {q.question}</p>
                    {!state.submitted ? (
                      <QuestionForm
                        question={q}
                        onSubmit={(answer) => handleSubmit(i, answer)}
                      />
                    ) : (
                      <AnswerDisplay
                        question={q}
                        userAnswer={state.userAnswer}
                        isCorrect={state.isCorrect}
                      />
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <Card className="card-elevated">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => window.history.back()}>
                Back to Week
              </Button>
              <Button onClick={() => {
                const nextLessonId = legacyLesson.id + 1;
                if (nextLessonId <= 3) {
                  navigate(`/week/${weekId}/lesson/${nextLessonId}`);
                } else {
                  navigate(`/week/${weekId}`);
                }
              }}>
                {legacyLesson.id < 3 ? 'Next Lesson' : 'Back to Week'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

const QuestionForm = ({ question, onSubmit }: { question: any, onSubmit: (answer: string) => void }) => {
  const [answer, setAnswer] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answer);
  };

  if (question.type === "multiple-choice" && question.options) {
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        {question.options.map((option: string, j: number) => (
          <label key={j} className="flex items-center gap-2">
            <input
              type="radio"
              name="mc"
              value={option}
              checked={answer === option}
              onChange={(e) => setAnswer(e.target.value)}
              className="text-primary"
            />
            <span className="text-sm">{String.fromCharCode(65 + j)}. {option}</span>
          </label>
        ))}
        <Button type="submit" size="sm" disabled={!answer}>Submit Answer</Button>
      </form>
    );
  }

  if (question.type === "true-false") {
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="tf"
              value="True"
              checked={answer === "True"}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <span>True</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="tf"
              value="False"
              checked={answer === "False"}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <span>False</span>
          </label>
        </div>
        <Button type="submit" size="sm" disabled={!answer}>Submit Answer</Button>
      </form>
    );
  }

  if (question.type === "short-answer") {
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer"
        />
        <Button type="submit" size="sm" disabled={!answer.trim()}>Submit Answer</Button>
      </form>
    );
  }

  if (question.type === "essay") {
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your essay answer"
          rows={4}
        />
        <Button type="submit" size="sm" disabled={!answer.trim()}>Submit Answer</Button>
      </form>
    );
  }

  return null;
};

const AnswerDisplay = ({ question, userAnswer, isCorrect }: { question: any, userAnswer: string, isCorrect?: boolean }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {question.type === "multiple-choice" || question.type === "true-false" ? (
          isCorrect ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )
        ) : (
          <HelpCircle className="h-4 w-4 text-blue-600" />
        )}
        <span className="text-sm font-medium">
          {question.type === "multiple-choice" || question.type === "true-false"
            ? (isCorrect ? "Correct!" : "Incorrect")
            : "Your Answer Submitted"}
        </span>
      </div>
      {question.type !== "multiple-choice" && question.type !== "true-false" && (
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-3 border">
          <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Your Answer:</p>
          <p className="text-sm text-blue-700 dark:text-blue-300">{userAnswer}</p>
        </div>
      )}
      <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-3 border border-green-200 dark:border-green-800">
        <p className="text-sm font-medium text-green-800 dark:text-green-200">
          {question.type === "multiple-choice" || question.type === "true-false" ? "Correct Answer:" : "Model Answer:"}
        </p>
        <p className="text-sm text-green-700 dark:text-green-300">{question.answer}</p>
        {question.explanation && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">{question.explanation}</p>
        )}
      </div>
    </div>
  );
};

export default LessonPage;