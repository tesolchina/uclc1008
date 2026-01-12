import { week6, week6Meta } from "@/data/weeks/week6";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Introduction to ACE", 
    theme: "Understanding argumentation structure",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Claims and Evidence", 
    theme: "Building arguments with support",
    unitCount: 3
  },
  { 
    hour: 3, 
    title: "ACE Draft Planning", 
    theme: "Outlining your argument",
    unitCount: 2
  },
];

const Week6Page = () => {
  return (
    <WeekOverviewTemplate 
      week={week6} 
      meta={week6Meta}
      classHours={classHours}
    />
  );
};

export default Week6Page;
