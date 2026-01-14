import { week1, week1Meta } from "@/data/weeks/week1";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Reading with Purpose", 
    theme: "Scanning, skimming, and outlining academic texts",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Paraphrasing Fundamentals", 
    theme: "4 strategies for effective paraphrasing",
    unitCount: 4
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
