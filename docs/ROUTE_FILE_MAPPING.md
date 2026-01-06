# Route to File Mapping

This document maps website routes to their corresponding source code files.

---

## Pages & Routes

| Route | Page Component | Data Source |
|-------|---------------|-------------|
| `/` | `src/pages/Index.tsx` | - |
| `/auth` | `src/pages/AuthPage.tsx` | - |
| `/auth/callback` | `src/pages/AuthCallback.tsx` | - |
| `/assessment` | `src/pages/AssessmentPage.tsx` | - |
| `/week/1` | `src/pages/Week1Page.tsx` | `src/data/weeks/week1.ts` |
| `/week/:weekId` | `src/pages/WeekPage.tsx` | `src/data/weeks/` |
| `/week/2/assignment/pre-course-writing` | `src/pages/PreCourseWritingPage.tsx` | `src/data/assignments/preCourseWriting.ts` |
| `/week/:weekId/assignment/:assignmentId` | `src/pages/WeekAssignmentPage.tsx` | `src/data/assignments/` |
| `/week/1/lesson/1` | `src/pages/Lesson1Page.tsx` | - |
| `/week/:weekId/lesson/:lessonId` | `src/pages/LessonPage.tsx` | Supabase database |
| `/staff` | `src/pages/Staff.tsx` | Supabase database |
| `*` (404) | `src/pages/NotFound.tsx` | - |

---

## Week Pages

| URL Example | Week ID | Data Location |
|-------------|---------|---------------|
| `/week/1` | 1 | `src/data/weeks/week1.ts` |
| `/week/2` | 2 | `src/data/weeks/week2.ts` |
| `/week/3` | 3 | `src/data/weeks/week3.ts` |
| `/week/4` | 4 | `src/data/weeks/week4.ts` |
| `/week/5` | 5 | `src/data/weeks/week5.ts` |
| `/week/6` | 6 | `src/data/weeks/week6.ts` |
| `/week/7` | 7 | `src/data/weeks/week7.ts` |
| `/week/8` | 8 | `src/data/weeks/week8.ts` |
| `/week/9` | 9 | `src/data/weeks/week9.ts` |
| `/week/10` | 10 | `src/data/weeks/week10.ts` |
| `/week/11` | 11 | `src/data/weeks/week11.ts` |
| `/week/12` | 12 | `src/data/weeks/week12.ts` |
| `/week/13` | 13 | `src/data/weeks/week13.ts` |

---

## Assignment Pages

| URL Example | Assignment ID | Data Location |
|-------------|---------------|---------------|
| `/week/2/assignment/pre-course-writing` | `pre-course-writing` | `src/data/assignments.ts` |
| `/week/3/assignment/referencing-quiz` | `referencing-quiz` | `src/data/assignments.ts` |
| `/week/6/assignment/academic-writing-quiz` | `academic-writing-quiz` | `src/data/assignments.ts` |
| `/week/9/assignment/ace-draft` | `ace-draft` | `src/data/assignments.ts` |
| `/week/10/assignment/ace-final` | `ace-final` | `src/data/assignments.ts` |
| `/week/13/assignment/craa` | `craa` | `src/data/assignments.ts` |
| `/week/14/assignment/reflective-portfolio` | `reflective-portfolio` | `src/data/assignments.ts` |

---

## Key Source Files

### Core Data Structure
| File | Purpose |
|------|---------|
| `src/data/index.ts` | Main export file - re-exports all data |
| `src/data/types.ts` | TypeScript type definitions |
| `src/data/skills.ts` | Course skills data and getSkillById() |
| `src/data/assignments.ts` | Course assignments data and getAssignmentById() |
| `src/data/weeks/index.ts` | Week aggregation, getWeekById(), getWeekMetaById() |

### Individual Week Files
| File | Purpose |
|------|---------|
| `src/data/weeks/week1.ts` | Week 1 data and metadata |
| `src/data/weeks/week2.ts` | Week 2 data and metadata |
| `src/data/weeks/week3.ts` | Week 3 data and metadata |
| ... | ... |
| `src/data/weeks/week13.ts` | Week 13 data and metadata |

### Layout Components
| File | Purpose |
|------|---------|
| `src/components/layout/AppLayout.tsx` | Main app layout with sidebar provider |
| `src/components/layout/AppSidebar.tsx` | Navigation sidebar component |

### UI Components
| File | Purpose |
|------|---------|
| `src/components/LessonAiTutor.tsx` | AI tutor chat component |
| `src/components/NavLink.tsx` | Active navigation link component |

### Planning Documents (Raw Materials)
| File | Purpose |
|------|---------|
| `materials/Week1-5_AWQ/week1.md` | Week 1 lesson plan |
| `materials/Week1-5_AWQ/week2.md` | Week 2 lesson plan |
| `materials/Week1-5_AWQ/week3.md` | Week 3 lesson plan |
| `materials/Week1-5_AWQ/week4.md` | Week 4 lesson plan |
| `materials/Week1-5_AWQ/week5.md` | Week 5 lesson plan |
| `materials/week6-9_ACE/plan.md` | Weeks 6-9 ACE module plan |
| `materials/week10-13_CRAA/plan.md` | Weeks 10-13 CRAA module plan |

---

## Data Flow

```
User visits /week/2
       ↓
App.tsx routes to WeekPage.tsx
       ↓
WeekPage.tsx imports { getWeekById } from "@/data"
       ↓
src/data/index.ts re-exports from src/data/weeks/index.ts
       ↓
src/data/weeks/index.ts returns week2 from week2.ts
       ↓
WeekPage.tsx renders the week content
```

```
User visits /week/2/assignment/pre-course-writing
       ↓
App.tsx routes to WeekAssignmentPage.tsx
       ↓
WeekAssignmentPage.tsx imports { getAssignmentById } from "@/data"
       ↓
src/data/index.ts re-exports from src/data/assignments.ts
       ↓
src/data/assignments.ts returns the matching assignment
       ↓
WeekAssignmentPage.tsx renders the assignment details
```

---

## How to Add New Content

### Adding a New Week
1. Create `src/data/weeks/weekN.ts` with WeekData and WeekMeta exports
2. Import and add to `src/data/weeks/index.ts`:
   - Add to `weeks` array
   - Add to `weeksMeta` record
   - Add to re-exports

### Adding a New Assignment
1. Edit `src/data/assignments.ts`
2. Add entry to `courseAssignments` array
3. Reference assignment ID in the relevant week's `assignmentsDue` or `assignmentsUpcoming` array
4. Add assignment ID to the week's `weekMeta.assignmentIds`

### Adding a New Skill
1. Edit `src/data/skills.ts`
2. Add entry to `courseSkills` array
3. Reference skill ID in weeks' `skillsIntroduced` or `skillsReinforced` arrays
4. Reference skill ID in assignments' `skillsAssessed` array
