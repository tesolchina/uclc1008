import { week9, week9Meta } from "@/data/weeks/week9";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "ACE Final Preparation", 
    theme: "Final revision checklist",
    unitCount: 2
  },
  { 
    hour: 2, 
    title: "AI Reflection", 
    theme: "Documenting your AI use process",
    unitCount: 2
  },
  { 
    hour: 3, 
    title: "ACE Final Submission", 
    theme: "ACE Final (20%)",
    unitCount: 1
  },
];

const Week9Page = () => {
  return (
    <WeekOverviewTemplate 
      week={week9} 
      meta={week9Meta}
      classHours={classHours}
    />
  );
};

export default Week9Page;
