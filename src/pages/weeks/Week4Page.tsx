import { week4, week4Meta } from "@/data/weeks/week4";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Synthesizing Multiple Sources", 
    theme: "Listing vs synthesis; agreement, contrast, elaboration",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "AWQ Structure & Thesis Writing", 
    theme: "3-paragraph model and sample analysis",
    unitCount: 4
  },
  { 
    hour: 3, 
    title: "Introduction to Argument Construction", 
    theme: "Topic to be updated",
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
