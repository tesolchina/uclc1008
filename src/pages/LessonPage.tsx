import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getWeekById, getWeekMetaById } from "@/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, HelpCircle } from "lucide-react";

const LessonPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const weekId = Number(params.weekId);
  const lessonId = Number(params.lessonId);
  const week = Number.isNaN(weekId) ? undefined : getWeekById(weekId);
  const lesson = week?.lessons?.find(l => l.id === lessonId);

  const [questionStates, setQuestionStates] = useState(
    lesson?.questions.map(() => ({ submitted: false, userAnswer: "", isCorrect: false })) || []
  );

  if (!week || !lesson) {
    return <Navigate to={`/week/${weekId}`} replace />;
  }

  const handleSubmit = (index: number, userAnswer: string) => {
    const question = lesson.questions[index];
    let isCorrect = false;
    if (question.type === "multiple-choice" || question.type === "true-false") {
      isCorrect = userAnswer === question.answer;
    }
    // For open-ended, we'll show the answer anyway
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
              <span className="hero-badge">Lesson {lesson.id}</span>
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {lesson.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Part of {week.theme}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        {/* Study Notes */}
        {lesson.notes.length > 0 && (
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Study Notes</CardTitle>
              <CardDescription>Review these notes and examples before attempting the questions.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4 text-sm text-muted-foreground">
                {lesson.notes.map((note, i) => (
                  <div key={i} className="space-y-2">
                    <p>{note}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Practice Questions */}
        {lesson.questions.length > 0 && (
          <Card className="card-elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Practice Questions</CardTitle>
              <CardDescription>Attempt each question, then submit to see the answer and explanation.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              {lesson.questions.map((q, i) => {
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
                const nextLessonId = lesson.id + 1;
                if (nextLessonId <= 3) {
                  navigate(`/week/${weekId}/lesson/${nextLessonId}`);
                } else {
                  navigate(`/week/${weekId}`);
                }
              }}>
                {lesson.id < 3 ? 'Next Lesson' : 'Back to Week'}
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