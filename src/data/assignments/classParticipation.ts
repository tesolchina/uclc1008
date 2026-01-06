import { Assignment } from "../types";

export const classParticipation: Assignment = {
  id: "class-participation",
  title: "Class Participation",
  weight: "5%",
  dueWeek: 13,
  type: "participation",
  description: "Students’ participation and involvement in in- and out-of-class activities throughout the whole semester.",
  requirements: [
    "Attendance in all scheduled classes",
    "Active involvement in in-class activities",
    "Completion of out-of-class activities",
  ],
  skillsAssessed: ["academic-communication"],
  detailedInfo: {
    exactDueDate: "Whole Semester",
    submissionMethod: "Instructor Observation",
    gradingCriteria: [
      "Attendance & Punctuality",
      "Engagement in Discussions",
      "Completion of Preparatory Tasks",
    ],
  },
};

