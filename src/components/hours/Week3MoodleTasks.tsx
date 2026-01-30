/**
 * Week 3 Moodle Forum Tasks Component
 * Displays organized task links for Week 3 Hour 2 and Hour 3
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, PenLine, BookOpen, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoodleTask {
  id: number;
  title: string;
  url: string;
  skillFocus: string;
}

const WEEK3_HOUR1_TASKS: MoodleTask[] = [
  {
    id: 1,
    title: "Intro and concluding paragraph",
    url: "https://buelearning.hkbu.edu.hk/mod/forum/discuss.php?d=347214",
    skillFocus: "Summary Writing"
  },
  {
    id: 2,
    title: "Rewrite the middle part of the summary",
    url: "https://buelearning.hkbu.edu.hk/mod/forum/discuss.php?d=347213",
    skillFocus: "Summary Writing"
  },
];

const WEEK3_HOUR2_TASKS: MoodleTask[] = [
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

const WEEK3_HOUR3_TASKS: MoodleTask[] = [
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

interface Week3MoodleTasksProps {
  hourNumber: 2 | 3;
}

export function Week3MoodleTasks({ hourNumber }: Week3MoodleTasksProps) {
  // For Hour 2 and 3, we show all tasks organized by hour
  const allTasks = [
    { hour: 1, tasks: WEEK3_HOUR1_TASKS, title: "Hour 1: Summary Writing", icon: FileText },
    { hour: 2, tasks: WEEK3_HOUR2_TASKS, title: "Hour 2: AWQ Structure", icon: BookOpen },
    { hour: 3, tasks: WEEK3_HOUR3_TASKS, title: "Hour 3: Paraphrasing & Summarising", icon: PenLine },
  ];

  return (
    <section className="space-y-6">
      {/* Learning Goals */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Week 3 Learning Goals</CardTitle>
          </div>
          <CardDescription>Complete all 10 tasks in Moodle forums</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              Write effective summaries with intro and conclusion
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              Understand AWQ structure: purpose statements and topic sentences
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              Apply paraphrasing strategies to avoid plagiarism
            </li>
            <li className="flex items-start gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              Report source ideas without personal bias
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* All Tasks by Hour */}
      <Card className="border-2 border-blue-500/30 bg-blue-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Week 3 Moodle Tasks</CardTitle>
          </div>
          <CardDescription>
            Complete all 10 tasks in the Moodle forums. Click each task to open in a new tab.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {allTasks.map(({ hour, tasks, title, icon: Icon }) => (
            <div key={hour} className="space-y-3">
              <div className={cn(
                "flex items-center gap-2 pb-2 border-b",
                hourNumber === hour && "text-primary"
              )}>
                <Icon className="h-4 w-4" />
                <h3 className="font-medium text-sm">{title}</h3>
                {hourNumber === hour && (
                  <Badge variant="default" className="ml-auto text-xs">Current</Badge>
                )}
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
