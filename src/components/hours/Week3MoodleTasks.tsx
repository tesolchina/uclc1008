/**
 * Week 3 Moodle Forum Tasks Component
 * Displays organized task links for Week 3 Hour 2-3 (merged)
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, PenLine, BookOpen, CheckCircle2, Target } from "lucide-react";

interface MoodleTask {
  id: number;
  title: string;
  url: string;
  skillFocus: string;
}

const WEEK3_STRUCTURE_TASKS: MoodleTask[] = [
  {
    id: 3,
    title: "Purpose statement",
    url: "https://buelearning.hkbu.edu.hk/mod/forum/discuss.php?d=348078",
    skillFocus: "AWQ Structure"
  },
  {
    id: 4,
    title: "Section headings and argument structure",
    url: "https://buelearning.hkbu.edu.hk/mod/forum/discuss.php?d=348079",
    skillFocus: "AWQ Structure"
  },
  {
    id: 5,
    title: "Topic sentences and support",
    url: "https://buelearning.hkbu.edu.hk/mod/forum/discuss.php?d=348080",
    skillFocus: "AWQ Structure"
  },
];

const WEEK3_PARAPHRASE_TASKS: MoodleTask[] = [
  {
    id: 6,
    title: "Paraphrasing strategies (synonyms, word form, voice)",
    url: "https://buelearning.hkbu.edu.hk/mod/forum/discuss.php?d=348082",
    skillFocus: "Paraphrasing"
  },
  {
    id: 7,
    title: "Avoiding plagiarism when paraphrasing",
    url: "https://buelearning.hkbu.edu.hk/mod/forum/discuss.php?d=348083",
    skillFocus: "Paraphrasing"
  },
];

const WEEK3_SUMMARISE_TASKS: MoodleTask[] = [
  {
    id: 8,
    title: "Summarising (key points, own words)",
    url: "https://buelearning.hkbu.edu.hk/mod/forum/discuss.php?d=348084",
    skillFocus: "Summarising"
  },
  {
    id: 9,
    title: "No personal bias (report sources only)",
    url: "https://buelearning.hkbu.edu.hk/mod/forum/discuss.php?d=348085",
    skillFocus: "Summarising"
  },
  {
    id: 10,
    title: "Main-idea coverage (Article A and Article B)",
    url: "https://buelearning.hkbu.edu.hk/mod/forum/discuss.php?d=348087",
    skillFocus: "Summarising"
  },
];

interface TaskCardProps {
  task: MoodleTask;
}

function TaskCard({ task }: TaskCardProps) {
  return (
    <a
      href={task.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
          {task.id}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm group-hover:text-primary transition-colors">
            {task.title}
          </p>
          <Badge variant="secondary" className="mt-1 text-xs">
            {task.skillFocus}
          </Badge>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0 mt-1" />
      </div>
    </a>
  );
}

export function Week3MoodleTasks() {
  const taskSections = [
    { 
      title: "Part 1: AWQ Structure", 
      tasks: WEEK3_STRUCTURE_TASKS, 
      icon: BookOpen,
      description: "Purpose statements, headings, and topic sentences"
    },
    { 
      title: "Part 2: Paraphrasing", 
      tasks: WEEK3_PARAPHRASE_TASKS, 
      icon: PenLine,
      description: "Strategies and avoiding plagiarism"
    },
    { 
      title: "Part 3: Summarising", 
      tasks: WEEK3_SUMMARISE_TASKS, 
      icon: FileText,
      description: "Key points, neutrality, and coverage"
    },
  ];

  return (
    <section className="space-y-6">
      {/* Learning Goals */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Learning Goals</CardTitle>
          </div>
          <CardDescription>What you'll achieve in Hour 2-3</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              Write clear purpose statements and effective topic sentences
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              Apply paraphrasing strategies (synonyms, word forms, voice changes)
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              Avoid plagiarism through proper paraphrasing techniques
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              Summarise sources without personal bias, covering main ideas
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* All Tasks by Section */}
      <Card className="border-2 border-blue-500/30 bg-blue-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Hour 2-3: Moodle Forum Tasks</CardTitle>
          </div>
          <CardDescription>
            Complete Tasks 3-10 in the Moodle forums. Click each task to open in a new tab.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {taskSections.map(({ title, tasks, icon: Icon, description }) => (
            <div key={title} className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b">
                <Icon className="h-4 w-4 text-primary" />
                <div>
                  <h3 className="font-medium text-sm">{title}</h3>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
              </div>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
