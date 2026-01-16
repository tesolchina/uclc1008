import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Star, 
  RefreshCw, 
  Save, 
  MessageSquare,
  LucideIcon,
  CheckCircle2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TutorReportViewProps {
  report: any;
  topicTitle: string;
  topicIcon: LucideIcon;
  studentId: string;
  onBack: () => void;
  onRetry: () => void;
}

export function TutorReportView({
  report,
  topicTitle,
  topicIcon: Icon,
  studentId,
  onBack,
  onRetry
}: TutorReportViewProps) {
  const [studentNotes, setStudentNotes] = useState(report?.student_notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setStudentNotes(report?.student_notes || "");
    setHasChanges(false);
  }, [report]);

  const handleNotesChange = (value: string) => {
    setStudentNotes(value);
    setHasChanges(value !== (report?.student_notes || ""));
  };

  const handleSaveNotes = async () => {
    if (!report?.id) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("ai_tutor_reports")
        .update({ student_notes: studentNotes })
        .eq("id", report.id);

      if (error) throw error;
      
      setHasChanges(false);
      toast.success("Notes saved!");
    } catch (error) {
      console.error("Error saving notes:", error);
      toast.error("Failed to save notes");
    } finally {
      setIsSaving(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-6 w-6 text-yellow-500 fill-yellow-500" />
        );
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <div key={i} className="relative">
            <Star className="h-6 w-6 text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star key={i} className="h-6 w-6 text-gray-300" />
        );
      }
    }
    return stars;
  };

  if (!report) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No report available yet.</p>
            <Button className="mt-4" onClick={onRetry}>
              Start Session
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const performanceData = report.performance_data || {};

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card>
        <CardHeader className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">{topicTitle}</CardTitle>
                <p className="text-xs text-muted-foreground">Performance Report</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Session
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Star Rating Card */}
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
        <CardContent className="py-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Your Performance</p>
            <div className="flex justify-center gap-1 mb-2">
              {renderStars(report.star_rating)}
            </div>
            <p className="text-2xl font-bold">{report.star_rating} / 5</p>
            <p className="text-sm text-muted-foreground mt-1">
              {report.tasks_completed} of {report.tasks_total} tasks completed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Qualitative Report */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            AI Tutor Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {report.qualitative_report}
          </p>

          {/* Task Breakdown */}
          {performanceData.scores && performanceData.scores.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium mb-2">Task Breakdown:</p>
              <div className="flex gap-2 flex-wrap">
                {performanceData.scores.map((score: number, i: number) => (
                  <Badge 
                    key={i} 
                    variant={score >= 2 ? "default" : "secondary"}
                  >
                    Level {i + 1}: {score}/3
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Notes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              My Notes & Reflections
            </CardTitle>
            {hasChanges && (
              <Button 
                size="sm" 
                onClick={handleSaveNotes}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
          <CardDescription>
            Add your own notes about what you learned or want to review
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={studentNotes}
            onChange={e => handleNotesChange(e.target.value)}
            placeholder="Write your reflections here..."
            className="min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Teacher Comment (if exists) */}
      {report.teacher_comment && (
        <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              Teacher's Comment
            </CardTitle>
            {report.commented_at && (
              <CardDescription>
                {new Date(report.commented_at).toLocaleDateString()}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm">{report.teacher_comment}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
