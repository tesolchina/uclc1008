import { week4, week4Meta } from "@/data/weeks/week4";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";
import { Week4AdHocNotes } from "@/components/Week4AdHocNotes";

const classHours = [
  { 
    hour: 1, 
    title: "AI Agent Demo", 
    theme: "Learning with AI Agents for AWQ Prep",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "On-Paper AWQ Practice", 
    theme: "Timed practice session with OCR-based review",
    unitCount: 4,
    label: "Hour 2-3"
  },
];

const Week4Page = () => {
  return (
    <div className="space-y-6">
      <WeekOverviewTemplate 
        week={week4} 
        meta={week4Meta}
        classHours={classHours}
      />
      <Week4AdHocNotes />
    </div>
  );
};

export default Week4Page;
