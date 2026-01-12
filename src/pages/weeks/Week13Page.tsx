import { week13, week13Meta } from "@/data/weeks/week13";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "Course Review", 
    theme: "Reflecting on all five CILOs",
    unitCount: 2
  },
  { 
    hour: 2, 
    title: "Final Preparations", 
    theme: "CRAA submission and portfolio completion",
    unitCount: 2
  },
  { 
    hour: 3, 
    title: "Course Wrap-up", 
    theme: "Celebration and next steps",
    unitCount: 1
  },
];

const Week13Page = () => {
  return (
    <WeekOverviewTemplate 
      week={week13} 
      meta={week13Meta}
      classHours={classHours}
    />
  );
};

export default Week13Page;
