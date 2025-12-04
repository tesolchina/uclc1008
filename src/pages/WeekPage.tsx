import { useParams, Navigate } from "react-router-dom";
import { getWeekById, getWeekMetaById } from "@/data/uclc1008-weeks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LessonAiTutor } from "@/components/LessonAiTutor";

export const WeekPage = () => {
  const params = useParams();
  const id = Number(params.weekId);
  const week = Number.isNaN(id) ? undefined : getWeekById(id);
  const meta = Number.isNaN(id) ? undefined : getWeekMetaById(id);

  if (!week) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6">
      <section className="hero-shell">
        <div className="hero-glow-orb" aria-hidden="true" />
        <div className="hero-inner">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="week-pill">{week.title}</span>
              <span className="hero-badge">Theme: {week.theme}</span>
              {meta?.dateRange && <span className="hero-badge">{meta.dateRange}</span>}
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              Self-access lesson for {week.title}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{week.overview}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">AI tutor for this week</CardTitle>
            <CardDescription>
              Open a dedicated chat window to ask questions about this week&apos;s lesson and your own writing.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">Open AI tutor</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>AI tutor for {week.title}</DialogTitle>
                  <DialogDescription>
                    Ask questions about the materials, your summaries, and your drafts for this week.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-2">
                  <LessonAiTutor
                    weekTitle={week.title}
                    theme={week.theme}
                    aiPromptHint={week.aiPromptHint}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Learning outcomes</CardTitle>
            <CardDescription>Focus on these outcomes as you work through the self-access tasks.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ul className="space-y-2 text-sm text-muted-foreground">
              {week.learningOutcomes.map((outcome) => (
                <li key={outcome} className="flex gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary/70" aria-hidden="true" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Core materials</CardTitle>
            <CardDescription>Complete these resources before moving on to independent practice.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {week.resources.map((res) => (
              <div
                key={res.title}
                className="flex items-start justify-between gap-3 rounded-xl bg-muted/60 px-3 py-2.5 text-sm"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-foreground">{res.title}</p>
                  {res.description ? (
                    <p className="text-xs text-muted-foreground">{res.description}</p>
                  ) : null}
                </div>
                <div className="flex flex-col items-end gap-1 text-right">
                  <Badge variant="outline" className="text-[10px] uppercase tracking-[0.16em]">
                    {res.type}
                  </Badge>
                  {res.duration ? (
                    <span className="text-[11px] text-muted-foreground">{res.duration}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Independent practice</CardTitle>
            <CardDescription>Use these tasks to stretch yourself after the core materials.</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <ol className="space-y-2 text-sm text-muted-foreground">
              {week.practiceTasks.map((task, index) => (
                <li key={task} className="flex gap-2">
                  <span className="mt-0.5 text-xs font-semibold text-primary/80">{index + 1}.</span>
                  <span>{task}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default WeekPage;
