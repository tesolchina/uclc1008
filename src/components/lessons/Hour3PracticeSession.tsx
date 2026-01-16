import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LessonAiTutor from "@/components/LessonAiTutor";
import { 
  BookOpen, 
  Search, 
  FileText,
  Target,
  GraduationCap,
  MessageSquare
} from "lucide-react";

interface Hour3PracticeSessionProps {
  weekNumber: number;
  studentId: string;
  onComplete?: () => void;
}

// Themes from Hours 1 & 2 that students can review with AI tutor
const REVIEW_THEMES = [
  {
    id: "skimming",
    title: "Skimming Techniques",
    hour: 1,
    icon: BookOpen,
    description: "Reading quickly for main ideas, structure, and overview",
    aiPrompt: `You are an expert tutor helping a student review skimming techniques for academic reading.

Key concepts the student learned:
- Skimming is reading quickly to get the main idea and overall structure
- Focus on headings, subheadings, first and last sentences of paragraphs
- Look for topic sentences and keywords
- Understand the gist without reading every word
- Used with Article A (Hong et al., 2022) about facial recognition in schools

Help the student understand and apply skimming strategies. Ask them questions to check understanding. Give examples from academic articles. Be encouraging and supportive.`
  },
  {
    id: "scanning",
    title: "Scanning Techniques", 
    hour: 1,
    icon: Search,
    description: "Finding specific information quickly in a text",
    aiPrompt: `You are an expert tutor helping a student review scanning techniques for academic reading.

Key concepts the student learned:
- Scanning is searching for specific information (names, dates, numbers, statistics)
- Move eyes quickly over text looking for keywords
- Use text features like bold, italics, headings, and tables
- Practice finding: sample size (380 participants), p-values (p<.001), Likert scales
- Used with Article A (Hong et al., 2022)

Help the student master scanning. Ask them to practice finding specific types of information. Give tips for efficient scanning. Be encouraging.`
  },
  {
    id: "imrad",
    title: "IMRaD Structure",
    hour: 2,
    icon: FileText,
    description: "Understanding the structure of empirical research papers",
    aiPrompt: `You are an expert tutor helping a student review the IMRaD structure of empirical research papers.

Key concepts the student learned:
- IMRaD = Introduction, Methods, Results, and Discussion
- Introduction: background, research gap, purpose/thesis
- Methods: participants, procedures, instruments, data analysis
- Results: findings, statistics, tables/figures
- Discussion: interpretation, implications, limitations, future research
- Used with Article A (Hong et al., 2022) as an example of IMRaD

Help the student understand each section's purpose. Ask them what information they'd find in each section. Be patient and supportive.`
  },
  {
    id: "article-types",
    title: "Empirical vs Conceptual Papers",
    hour: 2,
    icon: Target,
    description: "Distinguishing between data-driven and argument-driven papers",
    aiPrompt: `You are an expert tutor helping a student review the difference between empirical and conceptual papers.

Key concepts the student learned:
- Empirical papers: based on data collection and analysis, follow IMRaD structure
- Conceptual papers: based on reasoning and argument, no original data collection
- Empirical papers have Methods and Results sections
- Conceptual papers develop theoretical frameworks or analyze existing literature
- Article A (Hong et al., 2022) is empirical (survey data from 380 participants)

Help the student distinguish between these types. Give examples and ask them to identify paper types. Be encouraging.`
  },
  {
    id: "abstract-analysis",
    title: "Abstract & Title Analysis",
    hour: 1,
    icon: GraduationCap,
    description: "Extracting key information from titles and abstracts",
    aiPrompt: `You are an expert tutor helping a student review how to analyze academic titles and abstracts.

Key concepts the student learned:
- Titles often reveal: Subject Matter, Context, and Author Stance
- Abstracts contain: background, purpose, methods, results, conclusions
- The "gist" (main point) is usually in the first few sentences
- Purpose statements often use phrases like "This study aims to..." or "The purpose of..."
- Practice with Article A title and abstract

Help the student extract key information from titles and abstracts. Ask them to identify components. Be supportive.`
  }
];

export function Hour3PracticeSession({ weekNumber, studentId, onComplete }: Hour3PracticeSessionProps) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"tabs" | "dropdown">("tabs");

  const selectedThemeData = REVIEW_THEMES.find(t => t.id === selectedTheme);

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
                Select a topic from Hours 1 & 2 to review with your AI tutor
              </CardDescription>
            </div>
            <Badge variant="secondary">{REVIEW_THEMES.length} topics available</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Theme Selection - Tabs for desktop, Dropdown for mobile */}
      <div className="hidden md:block">
        <Tabs value={selectedTheme || ""} onValueChange={setSelectedTheme}>
          <TabsList className="grid w-full grid-cols-5 h-auto">
            {REVIEW_THEMES.map(theme => {
              const Icon = theme.icon;
              return (
                <TabsTrigger 
                  key={theme.id} 
                  value={theme.id}
                  className="flex flex-col items-center gap-1 py-3 px-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs text-center leading-tight">{theme.title}</span>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    Hour {theme.hour}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {REVIEW_THEMES.map(theme => (
            <TabsContent key={theme.id} value={theme.id} className="mt-4">
              <ThemeAiTutor 
                theme={theme} 
                weekNumber={weekNumber}
                studentId={studentId}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Mobile: Dropdown selection */}
      <div className="md:hidden space-y-4">
        <Select value={selectedTheme || ""} onValueChange={setSelectedTheme}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a topic to review..." />
          </SelectTrigger>
          <SelectContent>
            {REVIEW_THEMES.map(theme => {
              const Icon = theme.icon;
              return (
                <SelectItem key={theme.id} value={theme.id}>
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{theme.title}</span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      Hour {theme.hour}
                    </Badge>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>

        {selectedThemeData && (
          <ThemeAiTutor 
            theme={selectedThemeData} 
            weekNumber={weekNumber}
            studentId={studentId}
          />
        )}
      </div>

      {/* Empty state when no theme selected (desktop) */}
      {!selectedTheme && (
        <Card className="hidden md:block">
          <CardContent className="py-12 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Select a topic above to start reviewing</p>
            <p className="text-sm mt-2">
              Your AI tutor will help you consolidate what you learned in Hours 1 & 2
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Component for individual theme AI tutor
interface ThemeAiTutorProps {
  theme: typeof REVIEW_THEMES[0];
  weekNumber: number;
  studentId: string;
}

function ThemeAiTutor({ theme, weekNumber, studentId }: ThemeAiTutorProps) {
  const Icon = theme.icon;
  
  return (
    <div className="space-y-4">
      {/* Theme info card */}
      <Card className="bg-muted/30">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base">{theme.title}</CardTitle>
              <CardDescription className="text-sm">{theme.description}</CardDescription>
            </div>
            <Badge variant="secondary" className="ml-auto">From Hour {theme.hour}</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* AI Tutor Chat */}
      <LessonAiTutor
        weekTitle={`Week ${weekNumber} Review: ${theme.title}`}
        theme={theme.title}
        aiPromptHint={theme.aiPrompt}
        weekNumber={weekNumber}
        hourNumber={3}
        contextKey={`w${weekNumber}h3-${theme.id}`}
      />
    </div>
  );
}

export default Hour3PracticeSession;
