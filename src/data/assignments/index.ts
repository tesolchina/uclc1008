import { Assignment } from "../types";
import { aceDraft } from "./aceDraft";
import { aceFinal } from "./aceFinal";
import { academicWritingQuiz } from "./academicWritingQuiz";
import { aiReflection } from "./aiReflection";
import { craa } from "./craa";
import { peerEvaluation } from "./peerEvaluation";
import { preCourseWriting } from "./preCourseWriting";
import { referencingQuiz } from "./referencingQuiz";
import { reflectivePortfolio } from "./reflectivePortfolio";
import { classParticipation } from "./classParticipation";

export const courseAssignments: Assignment[] = [
  preCourseWriting,
  referencingQuiz,
  academicWritingQuiz,
  aceDraft,
  peerEvaluation,
  aceFinal,
  aiReflection,
  craa,
  reflectivePortfolio,
  classParticipation,
];

export const getAssignmentById = (id: string) => courseAssignments.find((a) => a.id === id);
export const getAssignmentsByWeek = (weekId: number) => courseAssignments.filter((a) => a.dueWeek === weekId);

