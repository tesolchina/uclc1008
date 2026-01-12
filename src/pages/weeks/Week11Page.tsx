import { week11, week11Meta } from "@/data/weeks/week11";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Analyzing Persuasive Techniques", 
    theme: "Deep dive into rhetorical devices",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Evidence Evaluation", 
    theme: "Assessing source credibility",
    unitCount: 3
  },
  { 
    hour: 3, 
    title: "CRAA Development", 
    theme: "Building your analysis",
    unitCount: 2
  },
];

const Week11Page = () => {
  return (
    <WeekOverviewTemplate 
      week={week11} 
      meta={week11Meta}
      classHours={classHours}
    />
  );
};

export default Week11Page;
