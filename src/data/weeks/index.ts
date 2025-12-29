import { WeekData, WeekMeta, Skill } from "../types";
import { getSkillById } from "../skills";

import { week1, week1Meta } from "./week1";
import { week2, week2Meta } from "./week2";
import { week3, week3Meta } from "./week3";
import { week4, week4Meta } from "./week4";
import { week5, week5Meta } from "./week5";
import { week6, week6Meta } from "./week6";
import { week7, week7Meta } from "./week7";
import { week8, week8Meta } from "./week8";
import { week9, week9Meta } from "./week9";
import { week10, week10Meta } from "./week10";
import { week11, week11Meta } from "./week11";
import { week12, week12Meta } from "./week12";
import { week13, week13Meta } from "./week13";

export const weeks: WeekData[] = [
  week1,
  week2,
  week3,
  week4,
  week5,
  week6,
  week7,
  week8,
  week9,
  week10,
  week11,
  week12,
  week13,
];

export const weeksMeta: Record<number, WeekMeta> = {
  1: week1Meta,
  2: week2Meta,
  3: week3Meta,
  4: week4Meta,
  5: week5Meta,
  6: week6Meta,
  7: week7Meta,
  8: week8Meta,
  9: week9Meta,
  10: week10Meta,
  11: week11Meta,
  12: week12Meta,
  13: week13Meta,
};

export const getWeekById = (id: number) => weeks.find((week) => week.id === id);
export const getWeekMetaById = (id: number) => weeksMeta[id];

export const getSkillsForWeek = (weekId: number) => {
  const week = getWeekById(weekId);
  if (!week) return { introduced: [], reinforced: [] };
  return {
    introduced: week.skillsIntroduced.map(getSkillById).filter(Boolean) as Skill[],
    reinforced: week.skillsReinforced.map(getSkillById).filter(Boolean) as Skill[],
  };
};

// Re-export individual weeks for direct access
export {
  week1, week1Meta,
  week2, week2Meta,
  week3, week3Meta,
  week4, week4Meta,
  week5, week5Meta,
  week6, week6Meta,
  week7, week7Meta,
  week8, week8Meta,
  week9, week9Meta,
  week10, week10Meta,
  week11, week11Meta,
  week12, week12Meta,
  week13, week13Meta,
};
