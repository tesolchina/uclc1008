import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  Target,
  TrendingUp,
  Calendar,
  ArrowRight
} from "lucide-react";
import { getWeekHours } from "@/data/hourContent";

interface StudentQuestion {
  id: string;
  week_number: number;
  hour_number: number | null;
  question: string;
  status: string;
  teacher_response: string | null;
  created_at: string;
}

interface TaskResponse {
  id: string;
  task_id: string;
  is_correct: boolean | null;
  score: number | null;
  submitted_at: string;
}

export default function StudentDashboard() {
  const { user, isLoading } = useAuth();
  const [studentId] = useState(() => localStorage.getItem("student_id") || "");
  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [responses, setResponses] = useState<TaskResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch student questions
        const { data: questionsData } = await supabase
          .from("student_questions")
          .select("*")
          .eq("student_id", studentId)
          .order("created_at", { ascending: false });

        if (questionsData) setQuestions(questionsData);

        // Fetch task responses
        const { data: responsesData } = await supabase
          .from("student_task_responses")
          .select("*")
          .eq("student_id", studentId)
          .order("submitted_at", { ascending: false });

        if (responsesData) setResponses(responsesData);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  // Calculate progress per week
  const weekProgress = [1, 2, 3, 4, 5].map(weekNum => {
    const weekHours = getWeekHours(weekNum);
    const totalTasks = weekHours.reduce((sum, h) => sum + h.tasks.length + (h.writingTask ? 1 : 0), 0);
    // This would need actual tracking - placeholder for now
    const completedTasks = 0;
    return {
      week: weekNum,
      total: totalTasks,
      completed: completedTasks,
      percentage: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    };
  });

  // Redirect to settings if not logged in
  if (!isLoading && !user && !studentId) {
    return <Navigate to="/settings" replace />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Dashboard</h1>
          <p className="text-sm text-muted-foreground">Student ID: {studentId}</p>
        </div>
        <Badge variant="outline" className="text-xs">
          <Calendar className="h-3 w-3 mr-1" />
          Weeks 1-5 • AWQ Prep
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tasks Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responses.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Questions Asked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questions.length}</div>
            <p className="text-xs text-muted-foreground">
              {questions.filter(q => q.status === "answered").length} answered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {responses.length > 0 
                ? Math.round((responses.filter(r => r.is_correct).length / responses.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Objective tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Week 1</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="progress">
        <TabsList>
          <TabsTrigger value="progress" className="gap-1">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="questions" className="gap-1">
            <MessageCircle className="h-4 w-4" />
            My Questions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {weekProgress.map(({ week, total, completed, percentage }) => (
                <div key={week} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/week/${week}`} 
                      className="font-medium text-sm hover:text-primary transition-colors"
                    >
                      Week {week}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {completed} / {total} tasks
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  <div className="flex gap-2">
                    {[1, 2, 3].map(hour => (
                      <Button 
                        key={hour} 
                        variant="outline" 
                        size="sm" 
                        asChild
                        className="text-xs h-7"
                      >
                        <Link to={`/week/${week}/hour/${hour}`}>
                          Hour {hour}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Skills Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Skills to Master for AWQ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { skill: "APA Citations", icon: "📚", status: "learning" },
                  { skill: "Paraphrasing", icon: "✏️", status: "learning" },
                  { skill: "Summarising", icon: "📝", status: "not-started" },
                  { skill: "Synthesising", icon: "🔗", status: "not-started" },
                  { skill: "Academic Tone", icon: "🎓", status: "learning" },
                  { skill: "AWQ Structure", icon: "📋", status: "not-started" },
                ].map(({ skill, icon, status }) => (
                  <div 
                    key={skill}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{icon}</span>
                      <span className="text-sm font-medium">{skill}</span>
                    </div>
                    <Badge 
                      variant={status === "mastered" ? "default" : status === "learning" ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      {status === "mastered" ? "✓" : status === "learning" ? "In Progress" : "Not Started"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Questions to Teacher</CardTitle>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No questions asked yet.</p>
                  <p className="text-xs mt-1">Use the "Ask Teacher" button during lessons.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {questions.map(q => (
                    <div key={q.id} className="p-3 rounded-lg border space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{q.question}</p>
                        <Badge 
                          variant={q.status === "answered" ? "default" : "secondary"}
                          className="text-xs shrink-0"
                        >
                          {q.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Week {q.week_number}{q.hour_number ? `, Hour ${q.hour_number}` : ""} • 
                        {new Date(q.created_at).toLocaleDateString()}
                      </p>
                      {q.teacher_response && (
                        <div className="mt-2 p-2 bg-primary/5 rounded text-sm">
                          <p className="text-xs font-medium text-primary mb-1">Teacher's Response:</p>
                          <p>{q.teacher_response}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}