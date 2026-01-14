import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ClipboardList
} from "lucide-react";
import { toast } from "sonner";

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

export default function TeacherDashboard() {
  const { user, isTeacher, isAdmin } = useAuth();
  const [questions, setQuestions] = useState<StudentQuestion[]>([]);
  const [studentResponses, setStudentResponses] = useState<StudentResponse[]>([]);
  const [writingDrafts, setWritingDrafts] = useState<WritingDraft[]>([]);
  const [paragraphNotes, setParagraphNotes] = useState<ParagraphNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<Record<string, string>>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [questionsRes, responsesRes, draftsRes, notesRes] = await Promise.all([
        supabase
          .from("student_questions")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("student_task_responses")
          .select("*")
          .order("submitted_at", { ascending: false })
          .limit(100),
        supabase
          .from("writing_drafts")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(100),
        supabase
          .from("paragraph_notes")
          .select("*")
          .order("updated_at", { ascending: false })
          .limit(100)
      ]);

      if (questionsRes.error) throw questionsRes.error;
      setQuestions(questionsRes.data || []);
      setStudentResponses(responsesRes.data || []);
      setWritingDrafts(draftsRes.data || []);
      setParagraphNotes(notesRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("student-questions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "student_questions" },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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

  if (!isTeacher && !isAdmin) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
        <p className="text-muted-foreground">This dashboard is for teachers only.</p>
      </div>
    );
  }

  const pendingQuestions = questions.filter(q => q.status === "pending");
  const answeredQuestions = questions.filter(q => q.status === "answered");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Teacher Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage student questions and monitor progress</p>
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
              <ClipboardList className="h-4 w-4" />
              MC Responses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentResponses.length}</div>
            <p className="text-xs text-muted-foreground">Quiz answers submitted</p>
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
            <p className="text-xs text-muted-foreground">Writing submissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <StickyNote className="h-4 w-4" />
              Student Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paragraphNotes.length}</div>
            <p className="text-xs text-muted-foreground">Notes taken</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set([
                ...studentResponses.map(r => r.student_id),
                ...writingDrafts.map(d => d.student_id),
                ...paragraphNotes.map(n => n.student_id)
              ]).size}
            </div>
            <p className="text-xs text-muted-foreground">Unique students</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="responses">
        <TabsList className="flex-wrap">
          <TabsTrigger value="responses" className="gap-1">
            <ClipboardList className="h-4 w-4" />
            MC Responses ({studentResponses.length})
          </TabsTrigger>
          <TabsTrigger value="drafts" className="gap-1">
            <FileText className="h-4 w-4" />
            Writing ({writingDrafts.length})
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-1">
            <StickyNote className="h-4 w-4" />
            Notes ({paragraphNotes.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-1">
            <Clock className="h-4 w-4" />
            Questions ({pendingQuestions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingQuestions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No pending questions</p>
              </CardContent>
            </Card>
          ) : (
            pendingQuestions.map(q => (
              <Card key={q.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="font-medium">{q.question}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          Week {q.week_number}{q.hour_number ? `.${q.hour_number}` : ""}
                        </Badge>
                        <span>Student: {q.student_id}</span>
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
            ))
          )}
        </TabsContent>

        <TabsContent value="answered" className="space-y-4">
          {answeredQuestions.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <CheckCircle2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No answered questions yet</p>
              </CardContent>
            </Card>
          ) : (
            answeredQuestions.map(q => (
              <Card key={q.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <p className="font-medium">{q.question}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          Week {q.week_number}{q.hour_number ? `.${q.hour_number}` : ""}
                        </Badge>
                        <span>Student: {q.student_id}</span>
                      </div>
                    </div>
                    <Badge className="shrink-0">Answered</Badge>
                  </div>
                  
                  {q.teacher_response && (
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-xs font-medium text-primary mb-1">Your Response:</p>
                      <p className="text-sm">{q.teacher_response}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          {studentResponses.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No student work submitted yet</p>
              </CardContent>
            </Card>
          ) : (
            studentResponses.map(r => {
              // Parse the response JSON
              let parsedResponse: { question?: string; notes?: string; attempts?: string[] } = {};
              try {
                parsedResponse = JSON.parse(r.response);
              } catch {}
              
              return (
              <Card key={r.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <p className="text-xs text-muted-foreground">
                        Student: {r.student_id} • {parsedResponse.question || r.question_key || 'Task'}
                      </p>
                      {parsedResponse.attempts && (
                        <p className="text-sm">Answers: {parsedResponse.attempts.join(' → ')}</p>
                      )}
                      {parsedResponse.notes && (
                        <p className="text-sm bg-muted/50 p-2 rounded mt-1">{parsedResponse.notes}</p>
                      )}
                    </div>
                    <Badge 
                      variant={r.is_correct ? "default" : r.is_correct === false ? "destructive" : "secondary"}
                      className="shrink-0"
                    >
                      {r.is_correct ? "Correct" : r.is_correct === false ? "Incorrect" : "Written"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Submitted: {new Date(r.submitted_at).toLocaleString()}
                  </p>
                  {r.ai_feedback && (
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <p className="text-xs font-medium text-blue-700 mb-1">AI Feedback Given:</p>
                      <p className="text-sm text-muted-foreground">{r.ai_feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              );
            })
          )}
        </TabsContent>

        {/* Writing Drafts Tab */}
        <TabsContent value="drafts" className="space-y-4">
          {writingDrafts.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No writing drafts submitted yet</p>
              </CardContent>
            </Card>
          ) : (
            writingDrafts.map(d => (
              <Card key={d.id}>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <p className="text-xs text-muted-foreground">
                        Student: {d.student_id} • {d.task_key} • Version {d.version}
                      </p>
                      <p className="text-sm bg-muted/50 p-2 rounded whitespace-pre-wrap">{d.content}</p>
                    </div>
                    <Badge variant={d.is_submitted ? "default" : "secondary"} className="shrink-0">
                      {d.is_submitted ? "Submitted" : "Draft"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created: {new Date(d.created_at).toLocaleString()}
                  </p>
                  {d.ai_feedback && (
                    <div className="p-3 bg-blue-500/10 rounded-lg">
                      <p className="text-xs font-medium text-blue-700 mb-1">AI Feedback:</p>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{d.ai_feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Paragraph Notes Tab */}
        <TabsContent value="notes" className="space-y-4">
          {paragraphNotes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                <StickyNote className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No student notes taken yet</p>
              </CardContent>
            </Card>
          ) : (
            paragraphNotes.map(n => (
              <Card key={n.id}>
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1">
                      <p className="text-xs text-muted-foreground">
                        Student: {n.student_id} • Paragraph: {n.paragraph_key}
                      </p>
                      <p className="text-sm bg-muted/50 p-2 rounded whitespace-pre-wrap">{n.notes}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Updated: {new Date(n.updated_at).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}