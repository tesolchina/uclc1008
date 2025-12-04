import { useParams, Navigate } from "react-router-dom";
import { getWeekById, getWeekMetaById } from "@/data/uclc1008-weeks";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const WeekAssignmentPage = () => {
  const params = useParams();
  const id = Number(params.weekId);
  const week = Number.isNaN(id) ? undefined : getWeekById(id);
  const meta = Number.isNaN(id) ? undefined : getWeekMetaById(id);

  if (!week) {
    return <Navigate to="/" replace />;
  }

  if (!meta?.assignmentTagline) {
    return <Navigate to={`/week/${id}`} replace />;
  }

  return (
    <div className="space-y-6">
      <section className="hero-shell">
        <div className="hero-glow-orb" aria-hidden="true" />
        <div className="hero-inner">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="week-pill">{week.title}</span>
              <span className="hero-badge">Assignment</span>
              {meta.dateRange && <span className="hero-badge">{meta.dateRange}</span>}
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {meta.assignmentTagline}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              This is a dedicated page for the main assignment linked to {week.title}. You can use it to
              collect guidance, notes, or links related to this task.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Assignment details">
        <Card className="card-elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Assignment placeholder</CardTitle>
            <CardDescription>
              The core routing and structure for this assignment page are ready. You can now expand this
              section with full instructions, marking criteria, and any supporting resources.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">
            <p>
              For now, this page simply marks that an assessed task is linked to this week in the course
              schedule. Students can still rely on the main course information sheet or your LMS for the
              official brief.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default WeekAssignmentPage;
