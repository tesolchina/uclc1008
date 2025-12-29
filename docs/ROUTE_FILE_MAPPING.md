# Route to File Mapping

This document maps website routes to their corresponding source code files.

---

## Pages & Routes

| Route | Page Component | Data Source |
|-------|---------------|-------------|
| `/` | `src/pages/Index.tsx` | - |
| `/week/:weekId` | `src/pages/WeekPage.tsx` | `src/data/uclc1008-weeks.ts` |
| `/week/:weekId/assignment/:assignmentId` | `src/pages/WeekAssignmentPage.tsx` | `src/data/uclc1008-weeks.ts` |
| `/staff` | `src/pages/Staff.tsx` | Supabase database |
| `*` (404) | `src/pages/NotFound.tsx` | - |

---

## Week Pages

| URL Example | Week ID | Data Location |
|-------------|---------|---------------|
| `/week/1` | 1 | `src/data/uclc1008-weeks.ts` → `weeksData[0]` |
| `/week/2` | 2 | `src/data/uclc1008-weeks.ts` → `weeksData[1]` |
| `/week/3` | 3 | `src/data/uclc1008-weeks.ts` → `weeksData[2]` |
| ... | ... | ... |

---

## Assignment Pages

| URL Example | Assignment ID | Data Location |
|-------------|---------------|---------------|
| `/week/2/assignment/pre-course-writing` | `pre-course-writing` | `src/data/uclc1008-weeks.ts` → `courseAssignments` |
| `/week/3/assignment/referencing-quiz` | `referencing-quiz` | `src/data/uclc1008-weeks.ts` → `courseAssignments` |
| `/week/6/assignment/academic-writing-quiz` | `academic-writing-quiz` | `src/data/uclc1008-weeks.ts` → `courseAssignments` |
| `/week/9/assignment/ace-draft` | `ace-draft` | `src/data/uclc1008-weeks.ts` → `courseAssignments` |
| `/week/10/assignment/ace-final` | `ace-final` | `src/data/uclc1008-weeks.ts` → `courseAssignments` |
| `/week/13/assignment/craa` | `craa` | `src/data/uclc1008-weeks.ts` → `courseAssignments` |
| `/week/14/assignment/reflective-portfolio` | `reflective-portfolio` | `src/data/uclc1008-weeks.ts` → `courseAssignments` |

---

## Key Source Files

### Core Data
| File | Purpose |
|------|---------|
| `src/data/uclc1008-weeks.ts` | Contains all week data, assignments, skills, and metadata |

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
WeekPage.tsx calls getWeekById(2)
       ↓
uclc1008-weeks.ts returns weeksData[1]
       ↓
WeekPage.tsx renders the week content
```

```
User visits /week/2/assignment/pre-course-writing
       ↓
App.tsx routes to WeekAssignmentPage.tsx
       ↓
WeekAssignmentPage.tsx calls getAssignmentById("pre-course-writing")
       ↓
uclc1008-weeks.ts returns courseAssignments.find(a => a.id === "pre-course-writing")
       ↓
WeekAssignmentPage.tsx renders the assignment details
```

---

## How to Add New Content

### Adding a New Week
1. Edit `src/data/uclc1008-weeks.ts`
2. Add entry to `weeksData` array
3. Add entry to `weeksMeta` array (optional)

### Adding a New Assignment
1. Edit `src/data/uclc1008-weeks.ts`
2. Add entry to `courseAssignments` array
3. Reference assignment ID in the relevant week's `assignmentsDue` or `assignmentsUpcoming` array

### Adding a New Skill
1. Edit `src/data/uclc1008-weeks.ts`
2. Add entry to `courseSkills` array
3. Reference skill ID in assignments' `skillsAssessed` array
