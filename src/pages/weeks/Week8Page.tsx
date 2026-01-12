import { week8, week8Meta } from "@/data/weeks/week8";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Counter-arguments", 
    theme: "Acknowledging opposing views",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Refutation Strategies", 
    theme: "Responding to counter-arguments effectively",
    unitCount: 3
  },
  { 
    hour: 3, 
    title: "ACE Revision", 
    theme: "Strengthening your argument",
    unitCount: 2
  },
];

const Week8Page = () => {
  return (
    <WeekOverviewTemplate 
      week={week8} 
      meta={week8Meta}
      classHours={classHours}
    />
  );
};

export default Week8Page;
