import { week2, week2Meta } from "@/data/weeks/week2";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Reading Conceptual Articles", 
    theme: "Argument-driven structure, thesis identification",
    unitCount: 3
  },
  { 
    hour: 2, 
    title: "Thesis Statements & Topic Sentences", 
    theme: "Locating and analyzing controlling ideas",
    unitCount: 3
  },
  { 
    hour: 3, 
    title: "Mapping Article Structure", 
    theme: "Paragraph functions, evidence organization",
    unitCount: 2
  },
];

const Week2Page = () => {
  return (
    <WeekOverviewTemplate 
      week={week2} 
      meta={week2Meta}
      classHours={classHours}
    />
  );
};

export default Week2Page;
