import { week3, week3Meta } from "@/data/weeks/week3";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "The Art of Summarising", 
    theme: "Claims vs Evidence, Neutrality, The 'Delete' Method",
    unitCount: 2
  },
  { 
    hour: 2, 
    title: "AWQ Skills: Structure, Paraphrasing & Summarising", 
    theme: "Purpose statements, topic sentences, paraphrasing strategies, avoiding plagiarism",
    unitCount: 10,
    label: "Hour 2-3"
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
