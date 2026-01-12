import { week3, week3Meta } from "@/data/weeks/week3";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Paraphrasing vs Summarizing", 
    theme: "Understanding the difference and when to use each skill",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "5 Paraphrasing Strategies", 
    theme: "Synonyms, word forms, voice, structure, combining",
    unitCount: 4
  },
  { 
    hour: 3, 
    title: "Summarizing from Abstracts", 
    theme: "The Slasher Method: claims vs evidence",
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
