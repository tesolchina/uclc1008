import { Link } from "react-router-dom";
import { WeekData, WeekMeta, Assignment } from "@/data/types";
import { getAssignmentById } from "@/data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText, ChevronRight, Target, BookOpen, ArrowLeft, ArrowRight } from "lucide-react";
import { getWeekById } from "@/data";

// CILOs for the course
export const CILOs = [
  { id: 1, short: "Critical Reading", full: "Read academic texts critically and identify key arguments" },
  { id: 2, short: "Summary & Synthesis", full: "Summarise and synthesise information from multiple sources" },
  { id: 3, short: "Academic Writing", full: "Write academic texts with appropriate structure and tone" },
  { id: 4, short: "Citations", full: "Use proper citation and referencing conventions" },
  { id: 5, short: "AI Literacy", full: "Use AI tools responsibly and reflectively in academic work" },
];

// Map weeks to their primary CILOs
export const weekCILOMapping: Record<number, number[]> = {
  1: [1, 2],      // Reading & Summary
  2: [1, 3],      // Reading & Writing  
  3: [4, 3],      // Citations & Writing
  4: [2, 3],      // Synthesis & Writing
  5: [1, 2, 3, 4], // AWQ covers all
  6: [1, 3],      // ACE begins
  7: [3, 5],      // ACE + AI
  8: [3, 5],      // ACE + AI
  9: [3, 5],      // ACE final
  10: [1, 2, 3],  // CRAA begins
  11: [1, 2, 3],  // CRAA
  12: [1, 2, 3],  // CRAA
  13: [1, 2, 3, 4, 5], // Course wrap-up
};

// Brief descriptions linking weeks
export const weekConnections: Record<number, { before?: string; after?: string; bigPicture: string }> = {
  1: {
    after: "Next week you'll apply these reading strategies to identify thesis statements and build toward citation skills.",
    bigPicture: "This week establishes the foundation for all academic reading in UE1. The skills you learn here—analysing titles, decoding abstracts, and distinguishing claims from evidence—are essential for the AWQ in Week 5."
  },
  2: {
    before: "Building on Week 1's reading strategies...",
    after: "Week 3 will introduce citation mechanics to integrate sources into your writing.",
    bigPicture: "This week bridges reading and writing. You'll learn to identify thesis statements and topic sentences—the building blocks you'll use when writing your own summaries in the AWQ."
  },
  3: {
    before: "Now that you can identify key ideas...",
    after: "Week 4 combines paraphrasing with proper citations for integrated source use.",
    bigPicture: "Citation skills are worth 20% of your AWQ mark. This week gives you the mechanical accuracy you need to cite correctly under time pressure."
  },
  4: {
    before: "With citation skills in place...",
    after: "Week 5 is your AWQ—everything comes together.",
    bigPicture: "This is your synthesis week. You'll practice combining paraphrasing, citation, and summary skills that will be tested in the AWQ."
  },
  5: {
    before: "All your reading and writing skills are tested here.",
    after: "After AWQ, you'll apply similar skills to argumentation in ACE.",
    bigPicture: "The AWQ (15%) tests everything from Weeks 1-4: reading strategically, summarising accurately, citing correctly, and writing with academic tone."
  },
  6: {
    before: "AWQ complete! Now we shift to argumentation.",
    after: "Week 7 continues building your ACE draft with evidence integration.",
    bigPicture: "This week introduces the ACE (Argumentation Construction & Evaluation). You'll learn to construct arguments with claims, evidence, and warrants."
  },
  7: {
    before: "Building on argument structure...",
    after: "Week 8 focuses on counter-arguments and refutation.",
    bigPicture: "Deepen your argumentation skills by integrating AI tools responsibly. Learn to evaluate AI-generated content critically."
  },
  8: {
    before: "With argument basics in place...",
    after: "Week 9 is your ACE final submission.",
    bigPicture: "Master counter-arguments and refutation. These skills distinguish strong arguments from weak ones in your ACE."
  },
  9: {
    before: "Final ACE preparations.",
    after: "Week 10 begins the CRAA module.",
    bigPicture: "Submit your ACE Final (20%). This assessment tests your ability to construct and evaluate arguments using multiple sources."
  },
  10: {
    before: "ACE complete! Now we move to CRAA.",
    after: "Week 11 continues with rhetorical analysis techniques.",
    bigPicture: "The CRAA (Critical Reading & Argumentation Assessment) begins. Learn to analyze how authors construct persuasive texts."
  },
  11: {
    before: "Building on rhetorical foundations...",
    after: "Week 12 focuses on comparative analysis.",
    bigPicture: "Deepen your rhetorical analysis skills. Focus on identifying persuasive strategies and evaluating their effectiveness."
  },
  12: {
    before: "With analysis skills developed...",
    after: "Week 13 wraps up the course.",
    bigPicture: "Compare rhetorical strategies across texts. This comparative lens is essential for your CRAA success."
  },
  13: {
    before: "Final week of UE1.",
    bigPicture: "Course wrap-up and reflection. Review all five CILOs and prepare for your final assessments."
  },
};

interface HourCardProps {
  weekId: number;
  hour: number;
  title: string;
  theme: string;
  unitCount: number;
  label?: string;
}

const HourCard = ({ weekId, hour, title, theme, unitCount, label }: HourCardProps) => (
  <Link to={`/week/${weekId}/hour/${hour}`} className="block group">
    <Card className="h-full transition-all hover:border-primary/50 hover:shadow-md group-hover:bg-accent/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">{label || `Hour ${hour}`}</Badge>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <CardTitle className="text-base mt-2">{title}</CardTitle>
        <CardDescription className="text-xs">{theme}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <BookOpen className="h-3 w-3" />
          <span>{unitCount} learning units</span>
        </div>
      </CardContent>
    </Card>
  </Link>
);

const AssignmentBadge = ({ assignment, weekId }: { assignment: Assignment; weekId: number }) => (
  <Link 
    to={`/week/${weekId}/assignment/${assignment.id}`}
    className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/5 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
  >
    <FileText className="h-3 w-3" />
    {assignment.title} ({assignment.weight})
  </Link>
);

interface WeekOverviewProps {
  week: WeekData;
  meta?: WeekMeta;
  classHours?: { hour: number; title: string; theme: string; unitCount: number; label?: string }[];
}

export const WeekOverviewTemplate = ({ week, meta, classHours }: WeekOverviewProps) => {
  const id = week.id;
  const assignmentsDue = week.assignmentsDue?.map(getAssignmentById).filter(Boolean) as Assignment[] || [];
  const ciloIds = weekCILOMapping[id] || [];
  const connections = weekConnections[id] || { bigPicture: week.overview };
  
  // Default hours if not provided
  const hours = classHours || [
    { hour: 1, title: "Hour 1", theme: "Introduction", unitCount: 0 },
    { hour: 2, title: "Hour 2", theme: "Core Concepts", unitCount: 0 },
    { hour: 3, title: "Hour 3", theme: "Practice & Application", unitCount: 0 },
  ];

  const prevWeek = id > 1 ? getWeekById(id - 1) : null;
  const nextWeek = id < 13 ? getWeekById(id + 1) : null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="hero-shell">
        <div className="hero-glow-orb" aria-hidden="true" />
        <div className="hero-inner">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="week-pill">{week.title}</span>
              {meta?.dateRange && <span className="hero-badge">{meta.dateRange}</span>}
            </div>
            <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
              {week.theme}
            </h1>
            
            {/* Assignments Due */}
            {assignmentsDue.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {assignmentsDue.map((a) => (
                  <AssignmentBadge key={a.id} assignment={a} weekId={id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Big Picture Connection */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-medium">Why This Week Matters</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{connections.bigPicture}</p>
          
          {/* CILO Badges */}
          <div className="flex flex-wrap gap-2">
            {ciloIds.map((ciloId) => {
              const cilo = CILOs.find(c => c.id === ciloId);
              if (!cilo) return null;
              return (
                <span 
                  key={cilo.id}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                  title={cilo.full}
                >
                  CILO {cilo.id}: {cilo.short}
                </span>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 3 Hours at a Glance */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          This Week's Sessions
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {hours.slice(0, 3).map((ch) => (
            <HourCard 
              key={ch.hour}
              weekId={id}
              hour={ch.hour}
              title={ch.title}
              theme={ch.theme}
              unitCount={ch.unitCount}
              label={ch.label}
            />
          ))}
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between pt-4 border-t">
        {prevWeek ? (
          <Link to={`/week/${id - 1}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <p className="text-xs text-muted-foreground">Previous</p>
              <p className="font-medium">{prevWeek.title}: {prevWeek.theme}</p>
            </div>
          </Link>
        ) : <div />}
        
        {nextWeek ? (
          <Link to={`/week/${id + 1}`} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors text-right">
            <div>
              <p className="text-xs text-muted-foreground">Next</p>
              <p className="font-medium">{nextWeek.title}: {nextWeek.theme}</p>
            </div>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
};

export default WeekOverviewTemplate;
