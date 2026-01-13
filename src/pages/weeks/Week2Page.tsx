import { week2, week2Meta } from "@/data/weeks/week2";
import { WeekOverviewTemplate } from "./WeekOverviewTemplate";

const classHours = [
  { 
    hour: 1, 
    title: "In-Text Citations (APA 7th)", 
    theme: "Citing sources within summary writing",
    unitCount: 5
  },
  { 
    hour: 2, 
    title: "End-of-Text Citations (Reference List)", 
    theme: "Building APA 7th reference entries",
    unitCount: 5
  },
  { 
    hour: 3, 
    title: "Practice, Feedback & Reflection", 
    theme: "Practice → AI/Peer/Teacher Feedback → Reflect",
    unitCount: 3
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
