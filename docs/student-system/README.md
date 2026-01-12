# Student Identification & Dashboard System

## Overview

This documentation describes a modular system for student identification and task management in educational applications. The system consists of three interconnected modules:

1. **Student ID Module** - Lightweight identification without email/password
2. **Student Dashboard Module** - Personal task list with assignments and progress
3. **Teacher Dashboard Module** - Student management and task assignment

## Design Principles

### Modular Architecture
- Each module is self-contained in its own feature folder
- Files are kept under 100 lines for maintainability
- Barrel exports (`index.ts`) provide clean public APIs
- Shared types enable cross-module communication

### File Structure Pattern
```
src/features/{module-name}/
├── README.md                 # Module documentation
├── index.ts                  # Barrel exports (public API)
├── types.ts                  # TypeScript interfaces
├── constants.ts              # Configuration values
├── context/                  # React context providers
├── hooks/                    # Custom React hooks
├── utils/                    # Pure utility functions
├── components/               # React components
└── pages/                    # Page-level components
```

## Quick Start

### 1. Student Registration
```tsx
import { useStudentId, RegistrationWizard } from '@/features/student-id';

function App() {
  const { isRegistered, studentId } = useStudentId();
  
  if (!isRegistered) {
    return <RegistrationWizard onComplete={() => navigate('/dashboard')} />;
  }
  
  return <MainApp studentId={studentId} />;
}
```

### 2. Accessing Student Dashboard
```tsx
import { StudentDashboardPage } from '@/features/student-dashboard';

// In your routes
<Route path="/dashboard" element={<StudentDashboardPage />} />
```

### 3. Teacher Task Assignment
```tsx
import { useAssignTasks } from '@/features/teacher-dashboard';

function TeacherView() {
  const { assignTask } = useAssignTasks();
  
  await assignTask({
    title: 'Complete Unit 1.1',
    targetType: 'section',
    targetSection: 'A01',
    linkedPage: '/week/1/unit/unit1_1',
    dueDate: new Date('2026-01-15')
  });
}
```

## Module Documentation

- [Student ID Module](./student-id-module.md)
- [Student Dashboard Module](./student-dashboard-module.md)
- [Teacher Dashboard Module](./teacher-dashboard-module.md)
- [Database Schema](./database-schema.md)
- [Integration Guide](./integration-guide.md)

## Reusability

This system is designed to be reusable across educational applications:

1. **Portable Modules**: Each feature folder can be copied to new projects
2. **Configurable**: Constants files allow easy customization
3. **Database Agnostic**: Hooks abstract data layer (easily swap Supabase for another backend)
4. **UI Agnostic**: Components use Tailwind/shadcn but can be restyled

## Security Model

- Students are identified by a memorable unique ID (no personal data required)
- RLS policies ensure students only see their own data
- Teachers can view students in their sections
- Admins have full access
