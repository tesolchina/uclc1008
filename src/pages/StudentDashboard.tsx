import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { StudentTaskProgress } from "@/components/student/StudentTaskProgress";
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  MessageCircle, 
  Target,
  TrendingUp,
  Calendar,
  ArrowRight,
  FileText,
  Download,
  PenLine,
  Sparkles,
  ChevronDown,
  ScanText,
  Copy,
  ExternalLink
} from "lucide-react";
import { copyToClipboard, downloadMarkdown } from "@/features/ocr-module/utils/downloadMarkdown";
import { getWeekHours } from "@/data/hourContent";

interface AiChatHistory {
  id: string;
  assignment_key: string;
  context_type: string | null;
  week_number: number | null;
  hour_number: number | null;
  messages: unknown; // JSON type from database
  updated_at: string;
}

interface AiTutorReport {
  id: string;
  week_number: number;
  hour_number: number;
  topic_id: string;
  star_rating: number;
  qualitative_report: string;
  student_notes: string | null;
  teacher_comment: string | null;
  created_at: string;
}

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
  question_key: string | null;
  response: string;
  is_correct: boolean | null;
  score: number | null;
  ai_feedback: string | null;
  submitted_at: string;
}

interface WritingDraft {
  id: string;
  task_key: string;
  content: string;
  ai_feedback: string | null;
  version: number;
  is_submitted: boolean;
  created_at: string;
}

interface ParagraphNote {
  id: string;
  paragraph_key: string;
  notes: string;
}

interface OCRRecord {
  id: string;
  student_id: string;
  title: string | null;
  extracted_text: string;
  image_count: number;
  created_at: string;
  updated_at: string;
}

export default function StudentDashboard() {
  const { isLoading, isAuthenticated, studentId, isStudent } = useAuth();
  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [responses, setResponses] = useState<TaskResponse[]>([]);
  const [writingDrafts, setWritingDrafts] = useState<WritingDraft[]>([]);
  const [paragraphNotes, setParagraphNotes] = useState<ParagraphNote[]>([]);
  const [aiChats, setAiChats] = useState<AiChatHistory[]>([]);
  const [aiTutorReports, setAiTutorReports] = useState<AiTutorReport[]>([]);
  const [ocrRecords, setOcrRecords] = useState<OCRRecord[]>([]);
  const [expandedChats, setExpandedChats] = useState<Set<string>>(new Set());
  const [expandedOcrRecords, setExpandedOcrRecords] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset all state when studentId changes
    setQuestions([]);
    setResponses([]);
    setWritingDrafts([]);
    setParagraphNotes([]);
    setAiChats([]);
    setAiTutorReports([]);
    setOcrRecords([]);
    setLoading(true);

    const fetchData = async () => {
      if (!studentId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all data in parallel
        const [questionsRes, responsesRes, draftsRes, notesRes, chatsRes, tutorReportsRes, ocrRecordsRes] = await Promise.all([
          supabase
            .from("student_questions")
            .select("*")
            .eq("student_id", studentId)
            .order("created_at", { ascending: false }),
          supabase
            .from("student_task_responses")
            .select("*")
            .eq("student_id", studentId)
            .order("submitted_at", { ascending: false }),
          supabase
            .from("writing_drafts")
            .select("*")
            .eq("student_id", studentId)
            .order("created_at", { ascending: false }),
          supabase
            .from("paragraph_notes")
            .select("*")
            .eq("student_id", studentId),
          supabase
            .from("assignment_chat_history")
            .select("*")
            .eq("student_id", studentId)
            .order("updated_at", { ascending: false }),
          supabase
            .from("ai_tutor_reports")
            .select("*")
            .eq("student_id", studentId)
            .order("created_at", { ascending: false }),
          supabase
            .from("student_ocr_records")
            .select("*")
            .eq("student_id", studentId)
            .order("created_at", { ascending: false })
        ]);

        if (questionsRes.data) setQuestions(questionsRes.data);
        if (responsesRes.data) setResponses(responsesRes.data);
        if (draftsRes.data) setWritingDrafts(draftsRes.data as WritingDraft[]);
        if (notesRes.data) setParagraphNotes(notesRes.data as ParagraphNote[]);
        if (chatsRes.data) setAiChats(chatsRes.data as AiChatHistory[]);
        if (tutorReportsRes.data) setAiTutorReports(tutorReportsRes.data as AiTutorReport[]);
        if (ocrRecordsRes.data) setOcrRecords(ocrRecordsRes.data as OCRRecord[]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentId]);

  // Helper to extract week/hour from task keys like "w1h1-macro-structure" or "w1h1-p1"
  const parseTaskKey = (key: string): { week: number; hour: number } | null => {
    const match = key.match(/w(\d+)h(\d+)/);
    if (match) {
      return { week: parseInt(match[1]), hour: parseInt(match[2]) };
    }
    return null;
  };

  // Calculate progress per week including all task types
  const weekProgress = [1, 2, 3, 4, 5].map(weekNum => {
    const weekHours = getWeekHours(weekNum);
    
    // Count total expected tasks
    const totalMcTasks = weekHours.reduce((sum, h) => sum + h.tasks.length, 0);
    const totalWritingTasks = weekHours.reduce((sum, h) => sum + (h.writingTask ? 1 : 0), 0);
    // Assume 6 paragraphs per hour for notes (can be adjusted)
    const totalParagraphNotes = weekHours.length * 6;
    
    const totalTasks = totalMcTasks + totalWritingTasks + totalParagraphNotes;
    
    // Count completed tasks for this week
    const completedMcTasks = responses.filter(r => {
      const parsed = parseTaskKey(r.question_key || "");
      return parsed && parsed.week === weekNum;
    }).length;
    
    const completedWritingTasks = writingDrafts.filter(d => {
      const parsed = parseTaskKey(d.task_key);
      return parsed && parsed.week === weekNum && d.is_submitted;
    }).length;
    
    const completedParagraphNotes = paragraphNotes.filter(n => {
      const parsed = parseTaskKey(n.paragraph_key);
      return parsed && parsed.week === weekNum && n.notes.trim().length > 0;
    }).length;
    
    const completedTasks = completedMcTasks + completedWritingTasks + completedParagraphNotes;
    
    return {
      week: weekNum,
      total: totalTasks,
      completed: completedTasks,
      percentage: totalTasks > 0 ? Math.min(100, (completedTasks / totalTasks) * 100) : 0,
      breakdown: {
        mc: { completed: completedMcTasks, total: totalMcTasks },
        writing: { completed: completedWritingTasks, total: totalWritingTasks },
        notes: { completed: completedParagraphNotes, total: totalParagraphNotes }
      }
    };
  });

  // Redirect to auth if not logged in
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth" replace />;
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
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">MC Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{responses.length}</div>
            <p className="text-xs text-muted-foreground">
              {responses.filter(r => r.is_correct).length} correct
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Writing Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{writingDrafts.length}</div>
            <p className="text-xs text-muted-foreground">
              {writingDrafts.filter(d => d.ai_feedback).length} with feedback
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">AI Tutor Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{aiTutorReports.length}</div>
            <p className="text-xs text-muted-foreground">
              {aiTutorReports.length > 0 ? `Avg ★${(aiTutorReports.reduce((sum, r) => sum + r.star_rating, 0) / aiTutorReports.length).toFixed(1)}` : 'No sessions'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Notes Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paragraphNotes.filter(n => n.notes.trim()).length}</div>
            <p className="text-xs text-muted-foreground">Paragraphs annotated</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">MC Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {responses.filter(r => r.is_correct !== null).length > 0 
                ? Math.round((responses.filter(r => r.is_correct === true).length / responses.filter(r => r.is_correct !== null).length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Objective tasks</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{questions.length}</div>
            <p className="text-xs text-muted-foreground">
              {questions.filter(q => q.status === "answered").length} answered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="all-tasks">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all-tasks" className="gap-1">
            <Target className="h-4 w-4" />
            All Tasks
          </TabsTrigger>
          <TabsTrigger value="progress" className="gap-1">
            <TrendingUp className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="writing" className="gap-1">
            <PenLine className="h-4 w-4" />
            Writing Tasks
          </TabsTrigger>
          <TabsTrigger value="questions" className="gap-1">
            <MessageCircle className="h-4 w-4" />
            Questions
          </TabsTrigger>
          <TabsTrigger value="responses" className="gap-1">
            <BookOpen className="h-4 w-4" />
            MC Responses
          </TabsTrigger>
          <TabsTrigger value="ai-tutor" className="gap-1">
            <Sparkles className="h-4 w-4" />
            AI Tutor ({aiTutorReports.length})
          </TabsTrigger>
          <TabsTrigger value="ai-chats" className="gap-1">
            <MessageCircle className="h-4 w-4" />
            AI Chats
          </TabsTrigger>
          <TabsTrigger value="ocr-records" className="gap-1">
            <ScanText className="h-4 w-4" />
            OCR Records ({ocrRecords.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all-tasks" className="space-y-4 mt-4">
          <StudentTaskProgress
            responses={responses}
            writingDrafts={writingDrafts}
            paragraphNotes={paragraphNotes}
          />
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          {/* Weekly Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Progress</CardTitle>
              <p className="text-xs text-muted-foreground">
                Tracks MC questions, writing tasks, and paragraph notes
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {weekProgress.map(({ week, total, completed, percentage, breakdown }) => (
                <div key={week} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/week/${week}`} 
                      className="font-medium text-sm hover:text-primary transition-colors"
                    >
                      Week {week}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {completed} / {total} activities
                    </span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                  
                  {/* Breakdown by type */}
                  <div className="flex flex-wrap gap-3 text-xs">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/10 text-blue-700">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>MC: {breakdown.mc.completed}/{breakdown.mc.total}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/10 text-purple-700">
                      <PenLine className="h-3 w-3" />
                      <span>Writing: {breakdown.writing.completed}/{breakdown.writing.total}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-green-500/10 text-green-700">
                      <FileText className="h-3 w-3" />
                      <span>Notes: {breakdown.notes.completed}/{breakdown.notes.total}</span>
                    </div>
                  </div>
                  
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

        {/* Writing Tasks Tab */}
        <TabsContent value="writing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Writing Tasks & AI Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {writingDrafts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <PenLine className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No writing tasks submitted yet.</p>
                  <p className="text-xs mt-1">Complete writing exercises during lessons to see your drafts here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {writingDrafts.map(draft => {
                    const parsed = parseTaskKey(draft.task_key);
                    return (
                      <div key={draft.id} className="p-3 rounded-lg border space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 flex-1">
                            <p className="text-xs text-muted-foreground font-medium">
                              {draft.task_key}
                              {parsed && ` (Week ${parsed.week}, Hour ${parsed.hour})`}
                            </p>
                            <p className="text-sm bg-muted/50 p-2 rounded line-clamp-3">
                              {draft.content}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs shrink-0">
                            v{draft.version}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(draft.created_at).toLocaleString()}
                        </p>
                        {draft.ai_feedback && (
                          <div className="mt-2 p-2 bg-blue-500/10 rounded text-sm">
                            <p className="text-xs font-medium text-blue-700 mb-1">AI Feedback:</p>
                            <p className="text-muted-foreground">{draft.ai_feedback}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
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

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">My Submitted Responses & AI Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              {responses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No responses submitted yet.</p>
                  <p className="text-xs mt-1">Complete tasks during lessons to see your history here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {responses.map(r => {
                    // Parse the response JSON to get question info
                    let parsedResponse: { question?: string; notes?: string; attempts?: string[] } = {};
                    try {
                      parsedResponse = JSON.parse(r.response);
                    } catch {}
                    
                    return (
                    <div key={r.id} className="p-3 rounded-lg border space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1">
                          <p className="text-xs text-muted-foreground font-medium">
                            {parsedResponse.question || r.question_key || 'Question'}
                          </p>
                          {parsedResponse.notes && (
                            <p className="text-sm bg-muted/50 p-2 rounded">{parsedResponse.notes}</p>
                          )}
                          {parsedResponse.attempts && (
                            <p className="text-xs text-muted-foreground">
                              Attempts: {parsedResponse.attempts.join(' → ')}
                            </p>
                          )}
                        </div>
                        <Badge 
                          variant={r.is_correct ? "default" : r.is_correct === false ? "destructive" : "secondary"}
                          className="text-xs shrink-0"
                        >
                          {r.is_correct ? "Correct" : r.is_correct === false ? "Incorrect" : "Submitted"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {new Date(r.submitted_at).toLocaleString()}
                        {r.score !== null && ` • Score: ${r.score}`}
                      </p>
                      {r.ai_feedback && (
                        <div className="mt-2 p-2 bg-blue-500/10 rounded text-sm">
                          <p className="text-xs font-medium text-blue-700 mb-1">AI Feedback:</p>
                          <p className="text-muted-foreground">{r.ai_feedback}</p>
                        </div>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Tutor Reports Tab */}
        <TabsContent value="ai-tutor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                My AI Tutor Practice Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {aiTutorReports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No AI tutor sessions yet.</p>
                  <p className="text-xs mt-1">Complete Week 1 Hour 3 AI practice sessions to see reports here.</p>
                  <Button size="sm" asChild className="mt-3">
                    <Link to="/week/1/hour/3">Go to Week 1 Hour 3</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {aiTutorReports.map(report => (
                    <div key={report.id} className="p-4 rounded-lg border space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <p className="font-medium text-sm capitalize">
                            {report.topic_id.replace(/-/g, ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Week {report.week_number} Hour {report.hour_number} • {new Date(report.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100">
                          {'★'.repeat(report.star_rating)}{'☆'.repeat(5 - report.star_rating)}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-muted/50 rounded text-sm">
                        <p className="text-xs font-medium text-muted-foreground mb-1">AI Assessment:</p>
                        <p>{report.qualitative_report}</p>
                      </div>

                      {report.student_notes && (
                        <div className="p-3 bg-blue-500/10 rounded text-sm">
                          <p className="text-xs font-medium text-blue-700 mb-1">Your Notes:</p>
                          <p>{report.student_notes}</p>
                        </div>
                      )}

                      {report.teacher_comment && (
                        <div className="p-3 bg-green-500/10 rounded text-sm">
                          <p className="text-xs font-medium text-green-700 mb-1">Teacher Feedback:</p>
                          <p>{report.teacher_comment}</p>
                        </div>
                      )}

                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/week/${report.week_number}/hour/${report.hour_number}`}>
                          Retry Practice
                          <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Chats Tab */}
        <TabsContent value="ai-chats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                My AI Tutor Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {aiChats.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No AI conversations yet.</p>
                  <p className="text-xs mt-1">Chat with the AI tutor during lessons to see your history here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {aiChats.map(chat => {
                    const messages = Array.isArray(chat.messages) ? chat.messages as { role: string; content: string }[] : [];
                    const isExpanded = expandedChats.has(chat.id);
                    const toggleExpand = () => {
                      setExpandedChats(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(chat.id)) {
                          newSet.delete(chat.id);
                        } else {
                          newSet.add(chat.id);
                        }
                        return newSet;
                      });
                    };

                    return (
                      <Collapsible key={chat.id} open={isExpanded} onOpenChange={toggleExpand}>
                        <div className="p-3 rounded-lg border space-y-2">
                          <CollapsibleTrigger className="w-full">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1 text-left">
                                <p className="text-sm font-medium flex items-center gap-2">
                                  {chat.context_type === 'lesson' && chat.week_number && chat.hour_number
                                    ? `Week ${chat.week_number} Hour ${chat.hour_number} Tutor`
                                    : chat.assignment_key}
                                  <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {messages.length} messages • {new Date(chat.updated_at).toLocaleString()}
                                </p>
                              </div>
                              <Badge variant="secondary" className="text-xs shrink-0">
                                {chat.context_type || 'chat'}
                              </Badge>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="mt-3 space-y-2 pt-3 border-t">
                              {messages.map((msg, idx) => (
                                <div key={idx} className={`p-2 rounded text-sm ${msg.role === 'user' ? 'bg-primary/10' : 'bg-muted/50'}`}>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">
                                    {msg.role === 'user' ? 'You' : 'AI Tutor'}
                                  </p>
                                  <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* OCR Records Tab */}
        <TabsContent value="ocr-records" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Saved OCR Extractions</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/ocr">
                    <ScanText className="h-4 w-4 mr-2" />
                    New Extraction
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {ocrRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ScanText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No OCR extractions saved yet.</p>
                  <p className="text-xs mt-1">Use the OCR Tool to extract text from handwritten images.</p>
                  <Button variant="link" asChild className="mt-2">
                    <Link to="/ocr">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Go to OCR Tool
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {ocrRecords.map((record) => {
                    const isExpanded = expandedOcrRecords.has(record.id);
                    const toggleExpand = () => {
                      setExpandedOcrRecords(prev => {
                        const newSet = new Set(prev);
                        if (newSet.has(record.id)) {
                          newSet.delete(record.id);
                        } else {
                          newSet.add(record.id);
                        }
                        return newSet;
                      });
                    };
                    const wordCount = record.extracted_text.trim() ? record.extracted_text.trim().split(/\s+/).length : 0;
                    
                    return (
                      <Collapsible key={record.id} open={isExpanded} onOpenChange={toggleExpand}>
                        <div className="p-3 rounded-lg border space-y-2">
                          <CollapsibleTrigger className="w-full">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1 text-left">
                                <p className="text-sm font-medium flex items-center gap-2">
                                  {record.title || 'Untitled Extraction'}
                                  <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {wordCount} words • {record.image_count} {record.image_count === 1 ? 'image' : 'images'} • {new Date(record.created_at).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="mt-3 space-y-3 pt-3 border-t">
                              <div className="p-3 rounded bg-muted/50 text-sm whitespace-pre-wrap font-mono max-h-80 overflow-y-auto">
                                {record.extracted_text}
                              </div>
                              <div className="flex flex-wrap gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    copyToClipboard(record.extracted_text);
                                  }}
                                >
                                  <Copy className="h-4 w-4 mr-1" />
                                  Copy Text
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    downloadMarkdown(record.extracted_text, record.title || undefined);
                                  }}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Download
                                </Button>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}