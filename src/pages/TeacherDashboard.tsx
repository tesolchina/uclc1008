import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MessageCircle, 
  Users, 
  CheckCircle2, 
  Clock,
  Send,
  RefreshCw,
  Loader2,
  FileText,
  StickyNote,
  ClipboardList,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  MessageSquarePlus,
  NotebookPen,
  Save
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface StudentQuestion {
  id: string;
  student_id: string;
  week_number: number;
  hour_number: number | null;
  question: string;
  context: string | null;
  status: string;
  teacher_response: string | null;
  created_at: string;
}

interface StudentResponse {
  id: string;
  student_id: string;
  question_key: string | null;
  response: string;
  is_correct: boolean | null;
  ai_feedback: string | null;
  submitted_at: string;
}

interface WritingDraft {
  id: string;
  student_id: string;
  task_key: string;
  content: string;
  ai_feedback: string | null;
  version: number;
  is_submitted: boolean;
  created_at: string;
}

interface ParagraphNote {
  id: string;
  student_id: string;
  paragraph_key: string;
  notes: string;
  updated_at: string;
}

interface TeacherStudentNote {
  id: string;
  teacher_id: string;
  student_id: string;
  notes: string;
  updated_at: string;
}

interface TaskFeedback {
  id: string;
  teacher_id: string;
  student_id: string;
  task_key: string;
  response_id: string | null;
  comment: string;
  created_at: string;
}

interface StudentSummary {
  student_id: string;
  mcResponses: number;
  mcCorrect: number;
  writingDrafts: number;
  submittedDrafts: number;
  notes: number;
  questions: number;
  lastActive: string;
}

export default function TeacherDashboard() {
  const { user, isTeacher, isAdmin } = useAuth();
  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [studentResponses, setStudentResponses] = useState<StudentResponse[]>([]);
  const [writingDrafts, setWritingDrafts] = useState<WritingDraft[]>([]);
  const [paragraphNotes, setParagraphNotes] = useState<ParagraphNote[]>([]);
  const [teacherNotes, setTeacherNotes] = useState<TeacherStudentNote[]>([]);
  const [taskFeedback, setTaskFeedback] = useState<TaskFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<Record<string, string>>({});
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  
  // Notes & feedback state
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackTarget, setFeedbackTarget] = useState<{ studentId: string; taskKey: string; responseId?: string } | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [savingFeedback, setSavingFeedback] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [questionsRes, responsesRes, draftsRes, notesRes, teacherNotesRes, feedbackRes] = await Promise.all([
        supabase
          .from("student_questions")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("student_task_responses")
          .select("*")
          .order("submitted_at", { ascending: false })
          .limit(500),
        supabase
          .from("writing_drafts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(500),
        supabase
          .from("paragraph_notes")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(500),
        supabase
          .from("teacher_student_notes")
          .select("*")
          .order("updated_at", { ascending: false }),
        supabase
          .from("task_feedback")
          .select("*")
          .order("created_at", { ascending: false })
      ]);

      if (questionsRes.error) throw questionsRes.error;
      setQuestions(questionsRes.data || []);
      setStudentResponses(responsesRes.data || []);
      setWritingDrafts(draftsRes.data || []);
      setParagraphNotes(notesRes.data || []);
      setTeacherNotes(teacherNotesRes.data || []);
      setTaskFeedback(feedbackRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel("teacher-dashboard-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "student_questions" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "student_task_responses" }, () => fetchData())
      .on("postgres_changes", { event: "*", schema: "public", table: "writing_drafts" }, () => fetchData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Build student summaries
  const studentSummaries: StudentSummary[] = (() => {
    const allStudentIds = new Set([
      ...studentResponses.map(r => r.student_id),
      ...writingDrafts.map(d => d.student_id),
      ...paragraphNotes.map(n => n.student_id),
      ...questions.map(q => q.student_id)
    ]);

    return Array.from(allStudentIds).map(studentId => {
      const studentMc = studentResponses.filter(r => r.student_id === studentId);
      const studentDrafts = writingDrafts.filter(d => d.student_id === studentId);
      const studentNotes = paragraphNotes.filter(n => n.student_id === studentId);
      const studentQuestions = questions.filter(q => q.student_id === studentId);

      const allDates = [
        ...studentMc.map(r => new Date(r.submitted_at)),
        ...studentDrafts.map(d => new Date(d.created_at)),
        ...studentNotes.map(n => new Date(n.updated_at)),
        ...studentQuestions.map(q => new Date(q.created_at))
      ];
      const lastActive = allDates.length > 0 
        ? new Date(Math.max(...allDates.map(d => d.getTime()))).toISOString()
        : "";

      return {
        student_id: studentId,
        mcResponses: studentMc.length,
        mcCorrect: studentMc.filter(r => r.is_correct).length,
        writingDrafts: studentDrafts.length,
        submittedDrafts: studentDrafts.filter(d => d.is_submitted).length,
        notes: studentNotes.length,
        questions: studentQuestions.length,
        lastActive
      };
    }).sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime());
  })();

  // Get teacher's note for a student
  const getTeacherNote = (studentId: string) => {
    return teacherNotes.find(n => n.student_id === studentId);
  };

  // Get feedback for a response
  const getFeedbackForResponse = (responseId: string) => {
    return taskFeedback.filter(f => f.response_id === responseId);
  };

  // Parse task key to get week/hour info
  const parseTaskKey = (taskKey: string | null): { week: number; hour: number } | null => {
    if (!taskKey) return null;
    const match = taskKey.match(/week(\d+)[_-]hour(\d+)/i) || taskKey.match(/w(\d+)[_-]?h(\d+)/i);
    if (match) return { week: parseInt(match[1]), hour: parseInt(match[2]) };
    return null;
  };

  // Try to get week/hour from response JSON (for old data that doesn't have it in the key)
  const getTaskLinkFromResponse = (response: StudentResponse): { week: number; hour: number } | null => {
    // First try the question_key
    const fromKey = parseTaskKey(response.question_key);
    if (fromKey) return fromKey;
    
    // Try parsing the response JSON for weekNumber/hourNumber
    try {
      const parsed = JSON.parse(response.response);
      if (parsed.weekNumber && parsed.hourNumber) {
        return { week: parsed.weekNumber, hour: parsed.hourNumber };
      }
    } catch {}
    
    return null;
  };

  const handleRespond = async (questionId: string) => {
    const response = responseText[questionId];
    if (!response?.trim()) {
      toast.error("Please enter a response");
      return;
    }

    setResponding(questionId);
    try {
      const { error } = await supabase
        .from("student_questions")
        .update({
          teacher_response: response.trim(),
          status: "answered",
          responded_by: user?.id,
          responded_at: new Date().toISOString(),
        })
        .eq("id", questionId);

      if (error) throw error;
      toast.success("Response sent!");
      setResponseText(prev => ({ ...prev, [questionId]: "" }));
      fetchData();
    } catch (err) {
      console.error("Error responding:", err);
      toast.error("Failed to send response");
    } finally {
      setResponding(null);
    }
  };

  const handleDismiss = async (questionId: string) => {
    try {
      const { error } = await supabase
        .from("student_questions")
        .update({ status: "dismissed" })
        .eq("id", questionId);

      if (error) throw error;
      toast.success("Question dismissed");
      fetchData();
    } catch (err) {
      console.error("Error dismissing:", err);
      toast.error("Failed to dismiss question");
    }
  };

  const handleSaveTeacherNote = async (studentId: string) => {
    if (!user?.id) return;
    setSavingNote(true);
    try {
      const existing = getTeacherNote(studentId);
      if (existing) {
        const { error } = await supabase
          .from("teacher_student_notes")
          .update({ notes: noteText })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("teacher_student_notes")
          .insert({ teacher_id: user.id, student_id: studentId, notes: noteText });
        if (error) throw error;
      }
      toast.success("Note saved");
      setEditingNote(null);
      fetchData();
    } catch (err) {
      console.error("Error saving note:", err);
      toast.error("Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };

  const handleAddFeedback = async () => {
    if (!user?.id || !feedbackTarget || !feedbackText.trim()) return;
    setSavingFeedback(true);
    try {
      const { error } = await supabase
        .from("task_feedback")
        .insert({
          teacher_id: user.id,
          student_id: feedbackTarget.studentId,
          task_key: feedbackTarget.taskKey,
          response_id: feedbackTarget.responseId || null,
          comment: feedbackText.trim()
        });
      if (error) throw error;
      toast.success("Feedback added - student can now view it");
      setFeedbackDialogOpen(false);
      setFeedbackText("");
      setFeedbackTarget(null);
      fetchData();
    } catch (err) {
      console.error("Error adding feedback:", err);
      toast.error("Failed to add feedback");
    } finally {
      setSavingFeedback(false);
    }
  };

  const openFeedbackDialog = (studentId: string, taskKey: string, responseId?: string) => {
    setFeedbackTarget({ studentId, taskKey, responseId });
    setFeedbackText("");
    setFeedbackDialogOpen(true);
  };

  if (!isTeacher && !isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">This dashboard is for teachers only.</p>
      </div>
    );
  }

  const pendingQuestions = questions.filter(q => q.status === "pending");

  // Student detail view
  if (selectedStudent) {
    const studentMc = studentResponses.filter(r => r.student_id === selectedStudent);
    const studentDrafts = writingDrafts.filter(d => d.student_id === selectedStudent);
    const studentNotes = paragraphNotes.filter(n => n.student_id === selectedStudent);
    const studentQuestions = questions.filter(q => q.student_id === selectedStudent);
    const teacherNote = getTeacherNote(selectedStudent);
    const studentFeedback = taskFeedback.filter(f => f.student_id === selectedStudent);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedStudent(null)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to List
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Student: {selectedStudent}</h1>
            <p className="text-sm text-muted-foreground">Detailed progress view</p>
          </div>
        </div>

        {/* Teacher's Private Notes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <NotebookPen className="h-4 w-4" />
              My Notes (Private)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingNote === selectedStudent ? (
              <div className="space-y-2">
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Write private notes about this student..."
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleSaveTeacherNote(selectedStudent)} disabled={savingNote}>
                    {savingNote ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
                    Save
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setEditingNote(null)}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div>
                {teacherNote?.notes ? (
                  <p className="text-sm whitespace-pre-wrap mb-2">{teacherNote.notes}</p>
                ) : (
                  <p className="text-sm text-muted-foreground mb-2">No notes yet</p>
                )}
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => { setEditingNote(selectedStudent); setNoteText(teacherNote?.notes || ""); }}
                >
                  {teacherNote?.notes ? "Edit Notes" : "Add Notes"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">MC Responses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentMc.length}</div>
              <p className="text-xs text-muted-foreground">{studentMc.filter(r => r.is_correct).length} correct</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Writing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentDrafts.length}</div>
              <p className="text-xs text-muted-foreground">{studentDrafts.filter(d => d.is_submitted).length} submitted</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentNotes.length}</div>
              <p className="text-xs text-muted-foreground">paragraphs annotated</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Feedback Given</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{studentFeedback.length}</div>
              <p className="text-xs text-muted-foreground">comments</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="mc">
          <TabsList>
            <TabsTrigger value="mc">MC Responses ({studentMc.length})</TabsTrigger>
            <TabsTrigger value="writing">Writing ({studentDrafts.length})</TabsTrigger>
            <TabsTrigger value="notes">Notes ({studentNotes.length})</TabsTrigger>
            <TabsTrigger value="questions">Questions ({studentQuestions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="mc" className="space-y-3 mt-4">
            {studentMc.length === 0 ? (
              <Card><CardContent className="py-6 text-center text-muted-foreground">No MC responses</CardContent></Card>
            ) : studentMc.map(r => {
              let parsed: { question?: string; attempts?: string[] } = {};
              try { parsed = JSON.parse(r.response); } catch {}
              const taskInfo = getTaskLinkFromResponse(r);
              const responseFeedback = getFeedbackForResponse(r.id);
              
              return (
                <Card key={r.id}>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-medium">{parsed.question || r.question_key || 'Task'}</p>
                          {taskInfo && (
                            <Link 
                              to={`/week/${taskInfo.week}/hour/${taskInfo.hour}`}
                              className="text-xs text-primary hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View Task
                            </Link>
                          )}
                        </div>
                        {parsed.attempts && <p className="text-xs text-muted-foreground">Answers: {parsed.attempts.join(' → ')}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={r.is_correct ? "default" : "destructive"}>
                          {r.is_correct ? "Correct" : "Incorrect"}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => openFeedbackDialog(selectedStudent, r.question_key || 'mc', r.id)}
                        >
                          <MessageSquarePlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">{new Date(r.submitted_at).toLocaleString()}</p>
                    
                    {responseFeedback.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {responseFeedback.map(f => (
                          <div key={f.id} className="p-2 bg-green-500/10 rounded text-sm">
                            <p className="text-xs font-medium text-green-700 mb-1">Your Feedback:</p>
                            <p className="text-muted-foreground">{f.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="writing" className="space-y-3 mt-4">
            {studentDrafts.length === 0 ? (
              <Card><CardContent className="py-6 text-center text-muted-foreground">No writing drafts</CardContent></Card>
            ) : studentDrafts.map(d => {
              const taskInfo = parseTaskKey(d.task_key);
              const draftFeedback = taskFeedback.filter(f => f.task_key === d.task_key && f.student_id === d.student_id);
              
              return (
                <Card key={d.id}>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{d.task_key} • Version {d.version}</p>
                        {taskInfo && (
                          <Link 
                            to={`/week/${taskInfo.week}/hour/${taskInfo.hour}`}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Task
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={d.is_submitted ? "default" : "secondary"}>
                          {d.is_submitted ? "Submitted" : "Draft"}
                        </Badge>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => openFeedbackDialog(selectedStudent, d.task_key, d.id)}
                        >
                          <MessageSquarePlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm bg-muted/50 p-2 rounded whitespace-pre-wrap">{d.content}</p>
                    {d.ai_feedback && (
                      <div className="p-2 bg-blue-500/10 rounded text-sm">
                        <p className="text-xs font-medium text-blue-700 mb-1">AI Feedback:</p>
                        <p className="text-muted-foreground">{d.ai_feedback}</p>
                      </div>
                    )}
                    {draftFeedback.length > 0 && (
                      <div className="space-y-1">
                        {draftFeedback.map(f => (
                          <div key={f.id} className="p-2 bg-green-500/10 rounded text-sm">
                            <p className="text-xs font-medium text-green-700 mb-1">Your Feedback:</p>
                            <p className="text-muted-foreground">{f.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">{new Date(d.created_at).toLocaleString()}</p>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="notes" className="space-y-3 mt-4">
            {studentNotes.length === 0 ? (
              <Card><CardContent className="py-6 text-center text-muted-foreground">No notes taken</CardContent></Card>
            ) : studentNotes.map(n => {
              const taskInfo = parseTaskKey(n.paragraph_key);
              return (
                <Card key={n.id}>
                  <CardContent className="pt-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground font-medium">{n.paragraph_key}</p>
                      {taskInfo && (
                        <Link 
                          to={`/week/${taskInfo.week}/hour/${taskInfo.hour}`}
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </Link>
                      )}
                    </div>
                    <p className="text-sm bg-muted/50 p-2 rounded">{n.notes}</p>
                    <p className="text-xs text-muted-foreground">{new Date(n.updated_at).toLocaleString()}</p>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="questions" className="space-y-3 mt-4">
            {studentQuestions.length === 0 ? (
              <Card><CardContent className="py-6 text-center text-muted-foreground">No questions asked</CardContent></Card>
            ) : studentQuestions.map(q => (
              <Card key={q.id}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{q.question}</p>
                      <Link 
                        to={`/week/${q.week_number}/hour/${q.hour_number || 1}`}
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Week {q.week_number}.{q.hour_number || 1}
                      </Link>
                    </div>
                    <Badge variant={q.status === "answered" ? "default" : q.status === "pending" ? "secondary" : "outline"}>
                      {q.status}
                    </Badge>
                  </div>
                  {q.teacher_response && (
                    <div className="p-2 bg-primary/5 rounded">
                      <p className="text-xs font-medium text-primary mb-1">Response:</p>
                      <p className="text-sm">{q.teacher_response}</p>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">{new Date(q.created_at).toLocaleString()}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Feedback Dialog */}
        <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Feedback for Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This feedback will be visible to the student: <strong>{feedbackTarget?.studentId}</strong>
              </p>
              <Textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Write your feedback..."
                className="min-h-[120px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setFeedbackDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddFeedback} disabled={savingFeedback || !feedbackText.trim()}>
                  {savingFeedback ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                  Send Feedback
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Main view: student list
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage students and monitor progress</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentSummaries.length}</div>
            <p className="text-xs text-muted-foreground">unique students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              MC Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentResponses.length}</div>
            <p className="text-xs text-muted-foreground">total submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Writing Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{writingDrafts.length}</div>
            <p className="text-xs text-muted-foreground">{writingDrafts.filter(d => d.is_submitted).length} submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingQuestions.length}</div>
            <p className="text-xs text-muted-foreground">awaiting response</p>
          </CardContent>
        </Card>
      </div>

      {/* Student List */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Users className="h-5 w-5" />
          Students ({studentSummaries.length})
        </h2>
        
        {loading ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Loading students...</p>
            </CardContent>
          </Card>
        ) : studentSummaries.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No student activity yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {studentSummaries.map(student => {
              const totalActivities = student.mcResponses + student.writingDrafts + student.notes;
              const mcAccuracy = student.mcResponses > 0 
                ? Math.round((student.mcCorrect / student.mcResponses) * 100) 
                : 0;
              const hasTeacherNote = !!getTeacherNote(student.student_id);
              
              return (
                <Card 
                  key={student.student_id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedStudent(student.student_id)}
                >
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium truncate">{student.student_id}</span>
                          {hasTeacherNote && (
                            <Badge variant="outline" className="text-xs gap-1">
                              <NotebookPen className="h-3 w-3" />
                              Notes
                            </Badge>
                          )}
                          {student.questions > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {student.questions} question{student.questions > 1 ? 's' : ''}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ClipboardList className="h-3 w-3" />
                            {student.mcResponses} MC ({mcAccuracy}% correct)
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {student.writingDrafts} drafts ({student.submittedDrafts} submitted)
                          </span>
                          <span className="flex items-center gap-1">
                            <StickyNote className="h-3 w-3" />
                            {student.notes} notes
                          </span>
                        </div>
                        
                        {totalActivities > 0 && (
                          <div className="mt-2">
                            <Progress value={Math.min(totalActivities * 10, 100)} className="h-1.5" />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 ml-4">
                        <div className="text-right text-xs text-muted-foreground">
                          {student.lastActive && (
                            <span>Last active: {new Date(student.lastActive).toLocaleDateString()}</span>
                          )}
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending Questions Section */}
      {pendingQuestions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Pending Questions ({pendingQuestions.length})
          </h2>
          <div className="space-y-3">
            {pendingQuestions.map(q => (
              <Card key={q.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="font-medium">{q.question}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Link 
                          to={`/week/${q.week_number}/hour/${q.hour_number || 1}`}
                          className="text-primary hover:underline flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="h-3 w-3" />
                          Week {q.week_number}.{q.hour_number || 1}
                        </Link>
                        <span 
                          className="cursor-pointer hover:underline"
                          onClick={(e) => { e.stopPropagation(); setSelectedStudent(q.student_id); }}
                        >
                          Student: {q.student_id}
                        </span>
                        <span>{new Date(q.created_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {q.context && (
                    <p className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      Context: {q.context}
                    </p>
                  )}

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Type your response..."
                      value={responseText[q.id] || ""}
                      onChange={(e) => setResponseText(prev => ({ ...prev, [q.id]: e.target.value }))}
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleRespond(q.id)}
                        disabled={responding === q.id || !responseText[q.id]?.trim()}
                      >
                        {responding === q.id ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4 mr-1" />
                        )}
                        Send Response
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDismiss(q.id)}
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
