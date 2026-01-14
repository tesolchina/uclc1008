# Auth Feature Module

This module contains all authentication-related functionality, organized by user type.

## Structure

```
src/features/auth/
├── context/         # AuthProvider and useAuth hook
├── hooks/           # Reusable auth hooks
├── utils/           # Validation, error handling, student ID utilities
├── components/      # Shared auth components
├── teacher/         # Teacher-specific auth UI
├── student/         # Student-specific auth UI
└── admin/           # Admin-specific auth guards
```

## Usage

### Basic Auth

```tsx
import { useAuth, AuthProvider } from '@/features/auth';

// In App.tsx
<AuthProvider>
  <App />
</AuthProvider>

// In components
const { user, isAuthenticated, signIn, signOut } = useAuth();
```

### Role-based Access

```tsx
import { RoleGuard } from '@/features/auth';

<RoleGuard allowedRoles={['teacher', 'admin']}>
  <TeacherDashboard />
</RoleGuard>
```

### Student ID Management

```tsx
import { useStudentId } from '@/features/auth';

const { studentId, isLoggedIn, login, logout } = useStudentId();
```

## Components

- **RoleSelector**: Initial role selection (Teacher/Student)
- **TeacherAuthPage**: Teacher sign-in/sign-up forms
- **StudentAuthPage**: Student registration/login wizard
- **RoleGuard**: Route protection by role
- **UserMenu**: User avatar dropdown menu

## Key Files

- `types.ts`: TypeScript interfaces
- `constants.ts`: Configuration values
- `utils/validation.ts`: Zod schemas for form validation
- `utils/studentId.ts`: Student ID generation and storage
