import { week7, week7Meta } from "@/data/weeks/week7";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Evidence Integration", 
    theme: "Weaving sources into your argument",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "AI in Academic Writing", 
    theme: "Responsible AI use and critical evaluation",
    unitCount: 3
  },
  { 
    hour: 3, 
    title: "ACE Draft Development", 
    theme: "Building your draft with feedback",
    unitCount: 2
  },
];

const Week7Page = () => {
  return (
    <WeekOverviewTemplate 
      week={week7} 
      meta={week7Meta}
      classHours={classHours}
    />
  );
};

export default Week7Page;
