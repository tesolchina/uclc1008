import { week3, week3Meta } from "@/data/weeks/week3";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "The Art of Summarising", 
    theme: "Claims vs Evidence, Neutrality, The 'Delete' Method",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Synthesis & Outlining", 
    theme: "Combining sources thematically, The Synthesis Grid",
    unitCount: 4
  },
  { 
    hour: 3, 
    title: "AWQ Structure Prep", 
    theme: "3-Part Structure, Thesis Statements, Topic Sentences",
    unitCount: 3
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
