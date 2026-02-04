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
    title: "AWQ Writing Practice", 
    theme: "12-step guided writing with AI feedback",
    unitCount: 4
  },
  { 
    hour: 3, 
    title: "AWQ Review & Feedback", 
    theme: "OCR-based handwritten summary review",
    unitCount: 3
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
