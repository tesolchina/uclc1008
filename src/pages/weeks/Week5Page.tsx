import { week5, week5Meta } from "@/data/weeks/week5";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Argument Construction", 
    theme: "Building claims, evidence, and warrants (topic to be updated)",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Argument Evaluation", 
    theme: "Assessing argument strength and validity (topic to be updated)",
    unitCount: 3
  },
  { 
    hour: 3, 
    title: "AWQ Assessment", 
    theme: "Academic Writing Quiz (15%)",
    unitCount: 1
  },
];

const Week5Page = () => {
  return (
    <WeekOverviewTemplate 
      week={week5} 
      meta={week5Meta}
      classHours={classHours}
    />
  );
};

export default Week5Page;
