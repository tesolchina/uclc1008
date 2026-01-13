# Hour 1 Lesson Design: Skimming, Scanning & Outlining Academic Texts

## Overview

Week 1, Hour 1 is designed to introduce foundational reading and outlining skills essential for engaging with academic journal articles. The lesson uses the Andrejevic & Selwyn (2020) article on facial recognition technology in schools as the primary practice material.

## Learning Goals

By the end of this hour, students will:
1. Apply **skimming** techniques to quickly understand the main idea and structure of academic texts
2. Use **scanning** strategies to locate specific information efficiently
3. Create **macro-level outlines** to map the overall structure of an academic paper
4. Develop **micro-level outlines** to analyze paragraph structure (topic sentences, supporting details, conclusions)
5. Understand how outlining skills connect to writing effective summaries

## Lesson Structure

### Part 1: Course Introduction
- **Format**: Link to Course Overview page
- **Purpose**: Students review syllabus, policies, assessments, and CILOs
- **Time**: 5-10 minutes self-paced review

### Part 2: Skimming & Scanning
- **Format**: Collapsible section with definitions + interactive practice
- **Content**:
  - Definition and techniques for **skimming** (getting the gist quickly)
  - Definition and techniques for **scanning** (finding specific information)
  - Link to the practice article (Andrejevic & Selwyn, 2020)
- **Practice Tasks (Q1-Q7)**: 7 multiple-choice questions testing scanning skills
  - Q1: Locating journal name
  - Q2: Finding author affiliations
  - Q3: Identifying publication year
  - Q4: Finding DOI
  - Q5: Identifying funding sources
  - Q6: Locating conflict of interest
  - Q7: Finding authors' academic background

### Part 3a: Macro-Level Outlining
- **Format**: Collapsible section with explanation + practice
- **Content**:
  - Explanation of macro-level outlining (mapping the overall paper structure)
  - Exercise to identify sections of Article B excerpt
  - Demonstration of how to create a structural outline
- **Practice Tasks (Q8-Q10)**: 3 multiple-choice questions on paper structure
  - Q8: Identifying introduction section
  - Q9: Locating the thesis/main argument
  - Q10: Understanding the purpose of different sections
- **Narration Writing Task**: Students write their own macro-level outline of the excerpt

### Part 3b: Micro-Level Outlining
- **Format**: Collapsible section with demonstration + practice
- **Content**:
  - Explanation of micro-level outlining (paragraph-level structure)
  - Color-coded demonstration paragraph showing:
    - Topic sentence (green highlight)
    - Supporting details (blue highlight)
    - Concluding thought (amber highlight)
  - Detailed outline breakdown of the demonstration paragraph
  - Connection to summary writing (hint box)
- **Practice Feature**:
  - Dropdown selector with 5 different paragraphs from the article
  - Each paragraph addresses different aspects (problematising FRT, challenging FRT, dehumanising nature, gender/race issues, conclusion)
  - Students create micro-level outline in textarea
  - **AI Feedback**: Automated feedback on student outlines with disclaimer about consulting teachers

## Task Types

| Task Type | Count | Description |
|-----------|-------|-------------|
| Multiple Choice | 10 | Scanning (7) + Structure (3) |
| Writing Tasks | 2 | Macro outline narration + Micro outline practice |
| **Total** | **12** | Progress tracked and saved locally |

## Data Persistence

### For All Users:
- Progress saved to localStorage (browser-specific)
- Warning before leaving page with unsaved work
- Download report as Markdown file option

### For Logged-in Users:
- Student responses saved to Supabase `student_task_responses` table
- AI chat interactions logged for review
- Progress synced across devices

### For Guest Users:
- Prompt to register for cross-device progress sync
- Link to `/auth` for registration

## AI Integration

### AI Feedback on Writing Tasks
- Uses `chat` edge function with Supabase
- System prompt configured for concise, critical academic feedback
- 2-3 sentence feedback limit
- Focus on: topic sentence identification, supporting detail specificity, structure clarity
- Disclaimer: "AI feedback may contain errors. Always consult your teacher for authoritative guidance."

### AI Tutor
- Available via "Ask Teacher" button
- Context-aware with week/hour information
- Responses logged for dashboard review

## Dashboard Integration

### Student Dashboard (`/my-progress`)
- View submitted questions and teacher responses
- Track task completion across weeks
- View AI chat history and responses

### Teacher Dashboard (`/teacher-dashboard`)
- View all student questions with context
- Respond to pending questions
- Track student progress and submissions
- View student AI interactions and written responses

## Source Material

**Primary Article**:
- Mark Andrejevic & Neil Selwyn (2020). Facial recognition technology in schools: critical questions and concerns. *Learning, Media and Technology*, 45:2, 115-128.
- DOI: 10.1080/17439884.2020.1686014

## Technical Implementation

### Components Used:
- `CollapsibleSection` - For expandable lesson parts
- `QuickCheckMC` - For multiple choice questions
- `WritingTaskWithFeedback` - Custom component with AI integration
- `MicroLevelPractice` - Custom component with paragraph selector
- `AskQuestionButton` - For student-teacher Q&A

### State Management:
- `useState` for local component state
- `localStorage` for progress persistence
- Supabase for authenticated user data

### Files:
- `/src/pages/HourPage.tsx` - Main page component
- `/src/data/hourContent.ts` - Hour metadata and goals
- `/supabase/functions/chat/index.ts` - AI feedback function
