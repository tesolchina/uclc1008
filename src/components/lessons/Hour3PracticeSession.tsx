import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Search, 
  FileText,
  PenLine,
  AlertTriangle,
  MessageSquare,
  Star,
  ChevronRight
} from "lucide-react";
import { SmartAiTutor } from "./SmartAiTutor";
import { TutorReportView } from "./TutorReportView";
import { supabase } from "@/integrations/supabase/client";

interface Hour3PracticeSessionProps {
  weekNumber: number;
  studentId: string;
  onComplete?: () => void;
}

// Topics derived from Hour 1 and Hour 2 content
const REVIEW_TOPICS = [
  {
    id: "skimming",
    title: "Skimming Techniques",
    hour: 1,
    icon: BookOpen,
    description: "Reading quickly for main ideas and structure",
  },
  {
    id: "scanning",
    title: "Scanning Techniques", 
    hour: 1,
    icon: Search,
    description: "Finding specific information quickly",
  },
  {
    id: "imrad",
    title: "IMRaD Structure",
    hour: 1,
    icon: FileText,
    description: "Understanding empirical paper structure",
  },
  {
    id: "paraphrasing",
    title: "Paraphrasing Strategies",
    hour: 2,
    icon: PenLine,
    description: "4 strategies for restating ideas",
  },
  {
    id: "patchwriting",
    title: "Avoiding Patchwriting",
    hour: 2,
    icon: AlertTriangle,
    description: "Recognizing and avoiding plagiarism",
  }
];

interface TopicReport {
  id: string;
  star_rating: number;
  qualitative_report: string;
  student_notes: string | null;
  teacher_comment: string | null;
  created_at: string;
}

export function Hour3PracticeSession({ weekNumber, studentId, onComplete }: Hour3PracticeSessionProps) {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"topics" | "tutor" | "report">("topics");
  const [reports, setReports] = useState<Record<string, TopicReport>>({});
  const [currentReport, setCurrentReport] = useState<TopicReport | null>(null);

  // Load existing reports for this student
  useEffect(() => {
    loadReports();
  }, [studentId, weekNumber]);

  const loadReports = async () => {
    const { data, error } = await supabase
      .from("ai_tutor_reports")
      .select("*")
      .eq("student_id", studentId)
      .eq("week_number", weekNumber)
      .eq("hour_number", 3);

    if (data) {
      const reportMap: Record<string, TopicReport> = {};
      data.forEach((r: any) => {
        reportMap[r.topic_id] = r;
      });
      setReports(reportMap);
    }
  };

  const handleStartTutor = (topicId: string) => {
    setSelectedTopic(topicId);
    setViewMode("tutor");
  };

  const handleViewReport = (topicId: string) => {
    setSelectedTopic(topicId);
    setCurrentReport(reports[topicId] || null);
    setViewMode("report");
  };

  const handleTutorComplete = (report: TopicReport) => {
    setReports(prev => ({ ...prev, [selectedTopic!]: report }));
    setCurrentReport(report);
    setViewMode("report");
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    setCurrentReport(null);
    setViewMode("topics");
    loadReports(); // Refresh reports
  };

  const selectedTopicData = REVIEW_TOPICS.find(t => t.id === selectedTopic);
  const completedCount = Object.keys(reports).length;

  // View: Topic selection
  if (viewMode === "topics") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  AI Tutor Review Session
                </CardTitle>
                <CardDescription>
                  Select a topic to be tested by your AI tutor. Each session has 3 progressively challenging tasks.
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">
                {completedCount}/{REVIEW_TOPICS.length} completed
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Topic Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {REVIEW_TOPICS.map(topic => {
            const Icon = topic.icon;
            const report = reports[topic.id];
            const hasReport = !!report;

            return (
              <Card 
                key={topic.id} 
                className={`transition-all hover:shadow-md ${hasReport ? 'border-green-200 bg-green-50/30' : ''}`}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${hasReport ? 'bg-green-100' : 'bg-primary/10'}`}>
                        <Icon className={`h-5 w-5 ${hasReport ? 'text-green-600' : 'text-primary'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{topic.title}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1">
                          Hour {topic.hour}
                        </Badge>
                      </div>
                    </div>
                    {hasReport && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{report.star_rating}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{topic.description}</p>
                  
                  <div className="flex gap-2">
                    {hasReport ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleViewReport(topic.id)}
                        >
                          View Report
                        </Button>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleStartTutor(topic.id)}
                        >
                          Retry
                        </Button>
                      </>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => handleStartTutor(topic.id)}
                      >
                        Start Session
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // View: AI Tutor Session
  if (viewMode === "tutor" && selectedTopic && selectedTopicData) {
    return (
      <SmartAiTutor
        topicId={selectedTopic}
        topicTitle={selectedTopicData.title}
        topicIcon={selectedTopicData.icon}
        weekNumber={weekNumber}
        hourNumber={3}
        studentId={studentId}
        onComplete={handleTutorComplete}
        onBack={handleBackToTopics}
      />
    );
  }

  // View: Report
  if (viewMode === "report" && selectedTopic && selectedTopicData) {
    return (
      <TutorReportView
        report={currentReport}
        topicTitle={selectedTopicData.title}
        topicIcon={selectedTopicData.icon}
        studentId={studentId}
        onBack={handleBackToTopics}
        onRetry={() => handleStartTutor(selectedTopic)}
      />
    );
  }

  return null;
}

export default Hour3PracticeSession;
