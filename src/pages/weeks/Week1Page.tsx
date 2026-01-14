import { week1, week1Meta } from "@/data/weeks/week1";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Skimming, Scanning & Outlining Academic Texts", 
    theme: "Strategic Reading for Academic Articles",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Paraphrasing Fundamentals", 
    theme: "4 Core Strategies with AI-Guided Practice",
    unitCount: 4
  },
  { 
    hour: 3, 
    title: "Practice, Feedback & Reflection", 
    theme: "Consolidate Week 1 Skills Through Guided Practice",
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
