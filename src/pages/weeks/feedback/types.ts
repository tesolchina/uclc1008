import { ReactNode } from "react";

export interface RubricProblem {
  title: string;
  example: string;
  suggestion: string;
}

export interface RubricStrength {
  title: string;
  example: string;
}

export interface RubricCategory {
  id: string;
  title: string;
  icon: ReactNode;
  rubricDescription: string;
  commonProblems: RubricProblem[];
  strengths: RubricStrength[];
}
