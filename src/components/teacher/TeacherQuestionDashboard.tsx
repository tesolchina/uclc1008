import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/features/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Eye, 
  EyeOff, 
  BarChart3, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Users,
  Loader2,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface QuestionStats {
  questionKey: string;
  question: string;
  totalAttempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  teacherAttempted: boolean;
  teacherCorrect: boolean | null;
}

interface TeacherQuestionDashboardProps {
  weekNumber: number;
  hourNumber: number;
}

export function TeacherQuestionDashboard({ weekNumber, hourNumber }: TeacherQuestionDashboardProps) {
  const { profile, isTeacher, isAdmin, studentId } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [questionStats, setQuestionStats] = useState<QuestionStats[]>([]);
  
  // Teacher's student ID could be their profile hkbu_user_id or stored studentId
  const teacherStudentId = profile?.hkbu_user_id || studentId;

  const fetchStats = async () => {
    if (!isOpen) return;
    
    setIsLoading(true);
    try {
      // Fetch all responses for this week/hour
      const prefix = `week${weekNumber}-hour${hourNumber}`;
      
      const { data: responses, error } = await supabase
        .from("student_task_responses")
        .select("question_key, student_id, is_correct, response")
        .like("question_key", `${prefix}%`);
      
      if (error) throw error;
      
      // Group by question
      const statsMap = new Map<string, QuestionStats>();
      
      (responses || []).forEach(r => {
        const key = r.question_key || "";
        if (!statsMap.has(key)) {
          // Extract question text from response JSON if available
          let questionText = key.replace(prefix + "-", "").replace(/-/g, " ");
          try {
            const responseData = JSON.parse(r.response as string);
            if (responseData.question) {
              questionText = responseData.question;
            }
          } catch {}
          
          statsMap.set(key, {
            questionKey: key,
            question: questionText,
            totalAttempts: 0,
            correctAttempts: 0,
            incorrectAttempts: 0,
            teacherAttempted: false,
            teacherCorrect: null,
          });
        }
        
        const stat = statsMap.get(key)!;
        stat.totalAttempts++;
        
        if (r.is_correct === true) {
          stat.correctAttempts++;
        } else if (r.is_correct === false) {
          stat.incorrectAttempts++;
        }
        
        // Check if this is the teacher's response
        if (teacherStudentId && r.student_id === teacherStudentId) {
          stat.teacherAttempted = true;
          stat.teacherCorrect = r.is_correct;
        }
      });
      
      // Sort by question key
      const sortedStats = Array.from(statsMap.values()).sort((a, b) => 
        a.questionKey.localeCompare(b.questionKey)
      );
      
      setQuestionStats(sortedStats);
    } catch (err) {
      console.error("Error fetching stats:", err);
      toast.error("Failed to load question stats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
    }
  }, [isOpen, weekNumber, hourNumber]);

  const handleResetMyAttempts = async () => {
    if (!teacherStudentId) {
      toast.error("No student ID found to reset");
      return;
    }
    
    setIsResetting(true);
    try {
      const prefix = `week${weekNumber}-hour${hourNumber}`;
      
      // Delete teacher's responses from database
      const { error: dbError } = await supabase
        .from("student_task_responses")
        .delete()
        .eq("student_id", teacherStudentId)
        .like("question_key", `${prefix}%`);
      
      if (dbError) throw dbError;
      
      // Clear localStorage progress
      const progressKey = `ue1_progress_w${weekNumber}h${hourNumber}`;
      localStorage.removeItem(progressKey);
      
      toast.success("Your attempts have been reset. Refresh the page to see the changes.");
      
      // Refresh stats
      await fetchStats();
    } catch (err) {
      console.error("Error resetting attempts:", err);
      toast.error("Failed to reset attempts");
    } finally {
      setIsResetting(false);
    }
  };

  // Only show for teachers/admins
  if (!isTeacher && !isAdmin) {
    return null;
  }

  const totalQuestions = questionStats.length;
  const teacherAttempted = questionStats.filter(q => q.teacherAttempted).length;
  const teacherCorrect = questionStats.filter(q => q.teacherCorrect === true).length;
  const avgCorrectRate = totalQuestions > 0 
    ? Math.round(questionStats.reduce((sum, q) => 
        sum + (q.totalAttempts > 0 ? (q.correctAttempts / q.totalAttempts) * 100 : 0), 0) / totalQuestions)
    : 0;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-4">
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full justify-between gap-2 text-muted-foreground hover:text-foreground"
        >
          <span className="flex items-center gap-2">
            {isOpen ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <BarChart3 className="h-4 w-4" />
            Teacher Dashboard
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4">
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-amber-600" />
                  Question Stats Dashboard
                </CardTitle>
                <CardDescription>
                  Week {weekNumber} Hour {hourNumber} • For teachers only
                </CardDescription>
              </div>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={isResetting || teacherAttempted === 0}
                  >
                    {isResetting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <RotateCcw className="h-4 w-4 mr-1" />
                    )}
                    Reset My Attempts
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset Your Attempts?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will delete all your question attempts for Week {weekNumber} Hour {hourNumber}. 
                      You'll need to refresh the page to see the reset questions. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetMyAttempts}>
                      Yes, Reset My Attempts
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
              </div>
            ) : (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg bg-background border">
                    <p className="text-xs text-muted-foreground">Total Questions</p>
                    <p className="text-xl font-semibold">{totalQuestions}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background border">
                    <p className="text-xs text-muted-foreground">Avg Correct Rate</p>
                    <p className="text-xl font-semibold">{avgCorrectRate}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background border">
                    <p className="text-xs text-muted-foreground">My Attempts</p>
                    <p className="text-xl font-semibold">{teacherAttempted}/{totalQuestions}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-background border">
                    <p className="text-xs text-muted-foreground">My Correct</p>
                    <p className="text-xl font-semibold text-green-600">{teacherCorrect}</p>
                  </div>
                </div>
                
                {/* Question List */}
                {questionStats.length > 0 ? (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Question Details
                    </h4>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {questionStats.map((stat, idx) => (
                        <div 
                          key={stat.questionKey}
                          className="p-3 rounded-lg bg-background border text-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                Q{idx + 1}: {stat.question.length > 60 
                                  ? stat.question.substring(0, 60) + "..." 
                                  : stat.question}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {stat.totalAttempts} attempts
                                </span>
                                <span className="flex items-center gap-1 text-green-600">
                                  <CheckCircle2 className="h-3 w-3" />
                                  {stat.correctAttempts} correct
                                </span>
                                {stat.incorrectAttempts > 0 && (
                                  <span className="flex items-center gap-1 text-red-600">
                                    <XCircle className="h-3 w-3" />
                                    {stat.incorrectAttempts} wrong
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Teacher status */}
                            <div className="shrink-0">
                              {stat.teacherAttempted ? (
                                stat.teacherCorrect ? (
                                  <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />
                                    Done
                                  </Badge>
                                ) : (
                                  <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30">
                                    <XCircle className="h-3 w-3 mr-1" />
                                    Wrong
                                  </Badge>
                                )
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                  Not tried
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          {/* Correct rate bar */}
                          <div className="mt-2">
                            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 transition-all"
                                style={{ 
                                  width: stat.totalAttempts > 0 
                                    ? `${(stat.correctAttempts / stat.totalAttempts) * 100}%` 
                                    : "0%" 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No question data available yet for this hour.
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
