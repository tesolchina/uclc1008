import { week4, week4Meta } from "@/data/weeks/week4";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Listing vs Synthesis", 
    theme: "Why synthesis matters for AWQ success",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Synthesis Relationships", 
    theme: "Agreement, contrast, elaboration with connectives",
    unitCount: 4
  },
  { 
    hour: 3, 
    title: "AWQ Structure & Practice", 
    theme: "3-paragraph model and sample analysis",
    unitCount: 3
  },
];

const Week4Page = () => {
  return (
    <WeekOverviewTemplate 
      week={week4} 
      meta={week4Meta}
      classHours={classHours}
    />
  );
};

export default Week4Page;
