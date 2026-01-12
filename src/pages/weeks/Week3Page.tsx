import { week3, week3Meta } from "@/data/weeks/week3";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "APA 7th Citation Mastery", 
    theme: "Author-prominent vs information-prominent citations",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Reporting Verbs", 
    theme: "Neutral, strong, and evidential verbs for citations",
    unitCount: 3
  },
  { 
    hour: 3, 
    title: "Citation Practice", 
    theme: "Integrating citations into academic writing",
    unitCount: 2
  },
];

const Week3Page = () => {
  return (
    <WeekOverviewTemplate 
      week={week3} 
      meta={week3Meta}
      classHours={classHours}
    />
  );
};

export default Week3Page;
