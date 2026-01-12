import { week12, week12Meta } from "@/data/weeks/week12";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Comparative Analysis", 
    theme: "Comparing rhetorical strategies across texts",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Synthesis in CRAA", 
    theme: "Connecting insights from multiple sources",
    unitCount: 3
  },
  { 
    hour: 3, 
    title: "CRAA Revision", 
    theme: "Refining your critical analysis",
    unitCount: 2
  },
];

const Week12Page = () => {
  return (
    <WeekOverviewTemplate 
      week={week12} 
      meta={week12Meta}
      classHours={classHours}
    />
  );
};

export default Week12Page;
