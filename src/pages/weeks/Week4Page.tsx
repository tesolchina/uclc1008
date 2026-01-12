import { week4, week4Meta } from "@/data/weeks/week4";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Paraphrasing Strategies", 
    theme: "Synonyms, word forms, sentence restructuring",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Avoiding Patchwriting", 
    theme: "Identifying and fixing inadequate paraphrasing",
    unitCount: 3
  },
  { 
    hour: 3, 
    title: "Integrated Citation + Paraphrase", 
    theme: "The citation sandwich technique",
    unitCount: 2
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
