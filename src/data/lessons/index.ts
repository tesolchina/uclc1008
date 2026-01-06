import { Lesson } from "../types";

// Week 1 Lessons
import { lesson1_1 } from "./lesson1-1";
import { lesson1_2 } from "./lesson1-2";
import { lesson1_3 } from "./lesson1-3";

// Week 2 Lessons
import { lesson2_1 } from "./lesson2-1";
import { lesson2_2 } from "./lesson2-2";

// Week 3 Lessons
import { lesson3_1 } from "./lesson3-1";
import { lesson3_2 } from "./lesson3-2";

// Week 4 Lessons
import { lesson4_1 } from "./lesson4-1";
import { lesson4_2 } from "./lesson4-2";

// Week 5 Lessons
import { lesson5_1 } from "./lesson5-1";
import { lesson5_2 } from "./lesson5-2";

// Week 6 Lessons
import { lesson6_1 } from "./lesson6-1";
import { lesson6_2 } from "./lesson6-2";

// Export individual lessons
export {
  lesson1_1, lesson1_2, lesson1_3,
  lesson2_1, lesson2_2,
  lesson3_1, lesson3_2,
  lesson4_1, lesson4_2,
  lesson5_1, lesson5_2,
  lesson6_1, lesson6_2,
};

// Lessons grouped by week
export const lessonsByWeek: Record<number, Lesson[]> = {
  1: [lesson1_1, lesson1_2, lesson1_3],
  2: [lesson2_1, lesson2_2],
  3: [lesson3_1, lesson3_2],
  4: [lesson4_1, lesson4_2],
  5: [lesson5_1, lesson5_2],
  6: [lesson6_1, lesson6_2],
};

// Get lesson by week and lesson number (e.g., getLessonById(1, 2) returns lesson 1.2)
export const getLessonById = (weekId: number, lessonNumber: number): Lesson | undefined => {
  const weekLessons = lessonsByWeek[weekId];
  if (!weekLessons) return undefined;
  return weekLessons.find(lesson => lesson.id === lessonNumber);
};

// Get all lessons for a week
export const getLessonsForWeek = (weekId: number): Lesson[] => {
  return lessonsByWeek[weekId] || [];
};

// Get lesson display ID (e.g., "1.2" for week 1, lesson 2)
export const getLessonDisplayId = (weekId: number, lessonNumber: number): string => {
  return `${weekId}.${lessonNumber}`;
};
