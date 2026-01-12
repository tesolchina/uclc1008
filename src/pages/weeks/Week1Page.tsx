import { week1, week1Meta } from "@/data/weeks/week1";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Strategic Reading Foundations", 
    theme: "Title analysis, skimming & scanning techniques",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Decoding Abstracts & IMRaD", 
    theme: "Abstract structure, empirical vs conceptual papers",
    unitCount: 3
  },
  { 
    hour: 3, 
    title: "Claims vs Evidence", 
    theme: "Topic sentences, distinguishing what to keep vs skip",
    unitCount: 2
  },
];

const Week1Page = () => {
  return (
    <WeekOverviewTemplate 
      week={week1} 
      meta={week1Meta}
      classHours={classHours}
    />
  );
};

export default Week1Page;
