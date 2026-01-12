import { week10, week10Meta } from "@/data/weeks/week10";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Introduction to CRAA", 
    theme: "Critical reading and rhetorical analysis",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Rhetorical Strategies", 
    theme: "Ethos, pathos, logos identification",
    unitCount: 3
  },
  { 
    hour: 3, 
    title: "CRAA Planning", 
    theme: "Selecting texts and focus areas",
    unitCount: 2
  },
];

const Week10Page = () => {
  return (
    <WeekOverviewTemplate 
      week={week10} 
      meta={week10Meta}
      classHours={classHours}
    />
  );
};

export default Week10Page;
