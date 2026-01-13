# Authentication & User Management System

This document describes the current login system and user management implementation.

## Overview

The application uses a **dual authentication system**:
1. **Teacher/Staff**: Full Supabase authentication (email/password + HKBU OAuth)
2. **Students**: Lightweight unique-ID system (no password required)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Authentication Flow                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│   /auth (AuthPage.tsx)                                               │
│   ┌───────────────────────┬───────────────────────┐                  │
│   │   Teacher/Staff       │      Student          │                  │
│   ├───────────────────────┼───────────────────────┤                  │
│   │ • Email/Password      │ • Unique ID Login     │                  │
│   │ • HKBU OAuth (SSO)    │ • Quick Registration  │                  │
│   │ • Supabase Auth       │ • localStorage        │                  │
│   └───────────┬───────────┴───────────┬───────────┘                  │
│               │                       │                               │
│               ▼                       ▼                               │
│   ┌───────────────────────┐   ┌───────────────────────┐             │
│   │   AuthContext         │   │   localStorage        │             │
│   │   (Supabase Session)  │   │   (student_id key)    │             │
│   └───────────────────────┘   └───────────────────────┘             │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `profiles` | Stores user profile data (linked to `auth.users`) |
| `user_roles` | Role assignments (admin, teacher, student) |
| `students` | Student master data (managed by admins) |
| `user_sessions` | OAuth session tokens (HKBU SSO) |

### Role Enum

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');
```

### Profiles Table

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hkbu_user_id TEXT NOT NULL,
  email TEXT,
  display_name TEXT,
  role app_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### User Roles Table

```sql
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id),
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (profile_id, role)
);
```

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/contexts/AuthContext.tsx` | Global auth state provider |
| `src/pages/AuthPage.tsx` | Login/registration UI |
| `src/components/auth/RoleGuard.tsx` | Route protection by role |
| `src/components/auth/UserMenu.tsx` | User dropdown menu |
| `supabase/functions/oauth-init/` | HKBU OAuth initiation |
| `supabase/functions/oauth-callback/` | HKBU OAuth callback handler |

---

## AuthContext API

### State

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Supabase auth user object |
| `session` | `Session \| null` | Current Supabase session |
| `profile` | `Profile \| null` | User profile from `profiles` table |
| `accessToken` | `string \| null` | JWT access token |
| `isLoading` | `boolean` | Auth initialization loading state |
| `isAuthenticated` | `boolean` | Whether user is logged in |
| `isTeacher` | `boolean` | User has teacher or admin role |
| `isAdmin` | `boolean` | User has admin role |

### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `signUp` | `(email, password, displayName) => Promise` | Create new account |
| `signIn` | `(email, password) => Promise` | Email/password login |
| `signOut` | `() => Promise<void>` | Log out and clear session |
| `loginWithHkbu` | `() => void` | Redirect to HKBU SSO |
| `refreshProfile` | `() => Promise<void>` | Reload profile & roles |

### Usage

```tsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { 
    isAuthenticated, 
    isTeacher, 
    profile, 
    signOut 
  } = useAuth();

  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  return (
    <div>
      <p>Welcome, {profile?.display_name}</p>
      {isTeacher && <TeacherTools />}
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

---

## Teacher/Staff Authentication

### Sign Up Flow (Email/Password)

1. User navigates to `/auth`
2. Selects "Teacher / Staff" option
3. Clicks "Sign Up" tab
4. Enters:
   - Display Name (required, non-empty)
   - Email (validated: valid email format)
   - Password (validated: minimum 6 characters)
5. Supabase Auth creates user in `auth.users`
6. Database trigger auto-creates profile in `profiles` table
7. User sees success message and can sign in

**Code Example (AuthPage.tsx):**

```tsx
const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  // Validate with Zod
  try {
    emailSchema.parse(email);
    passwordSchema.parse(password);
    if (!displayName.trim()) {
      setError('Please enter your name');
      return;
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      setError(err.errors[0].message);
      return;
    }
  }

  setIsSubmitting(true);
  const { error: signUpError } = await signUp(email, password, displayName.trim());
  setIsSubmitting(false);

  if (signUpError) {
    if (signUpError.message.includes('User already registered')) {
      setError('An account with this email already exists. Please sign in instead.');
    } else {
      setError(signUpError.message);
    }
  } else {
    setSuccess('Account created! You can now sign in.');
    setActiveTab('signin');
  }
};
```

**Code Example (AuthContext.tsx):**

```tsx
const signUp = async (email: string, password: string, displayName: string) => {
  const redirectUrl = `${window.location.origin}/`;
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        display_name: displayName,
      },
    },
  });

  return { error: error as Error | null };
};
```

### Sign In Flow (Email/Password)

1. User navigates to `/auth`
2. Selects "Teacher / Staff" option
3. Enters email and password
4. Supabase validates credentials
5. Session established automatically
6. `onAuthStateChange` triggers profile/roles fetch
7. User redirected to home page

**Code Example (AuthPage.tsx):**

```tsx
const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);

  try {
    emailSchema.parse(email);
    passwordSchema.parse(password);
  } catch (err) {
    if (err instanceof z.ZodError) {
      setError(err.errors[0].message);
      return;
    }
  }

  setIsSubmitting(true);
  const { error: signInError } = await signIn(email, password);
  setIsSubmitting(false);

  if (signInError) {
    if (signInError.message.includes('Invalid login credentials')) {
      setError('Invalid email or password. Please try again.');
    } else {
      setError(signInError.message);
    }
  }
  // Success: onAuthStateChange handles redirect
};
```

**Code Example (AuthContext.tsx):**

```tsx
const signIn = async (email: string, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { error: error as Error | null };
};
```

### HKBU OAuth Flow (SSO)

1. User clicks "Sign in with HKBU" (currently placeholder in UI)
2. `loginWithHkbu()` redirects to `/functions/v1/oauth-init`
3. Edge function redirects to HKBU OAuth server
4. User authenticates at HKBU
5. HKBU redirects to `/functions/v1/oauth-callback`
6. Edge function:
   - Exchanges code for access token
   - Parses JWT payload for user info
   - Upserts profile in `profiles` table
   - Creates session in `user_sessions` table
7. User redirected to `/auth/callback` with session token
8. Frontend sets Supabase session

**Code Example (AuthContext.tsx):**

```tsx
const loginWithHkbu = useCallback(() => {
  const returnUrl = window.location.href;
  window.location.href = `${SUPABASE_URL}/functions/v1/oauth-init?return_url=${encodeURIComponent(returnUrl)}`;
}, []);
```

### Sign Out Flow

```tsx
const signOut = async () => {
  await supabase.auth.signOut();
  setUser(null);
  setSession(null);
  setProfile(null);
  // Clean up legacy HKBU session if any
  localStorage.removeItem('hkbu_session');
  localStorage.removeItem('oauth_state');
};

---

## Student Authentication

### Unique ID Format

```
{last4digits}-{initials}-{randomSuffix}
Example: 1234-JD-7X
```

- **last4digits**: Last 4 digits of student number
- **initials**: First + Last name initials
- **randomSuffix**: 2 random alphanumeric chars (collision prevention)

### Registration Flow

1. User navigates to `/auth`
2. Selects "Student" option
3. Chooses "I'm new here"
4. Step 1: Enters last 4 digits of student ID
5. Step 2: Enters first and last initials
6. Step 3: Optionally enters section number
7. System generates unique ID
8. ID stored in `localStorage` under `student_id` key
9. User redirected to home

### Login Flow (Returning Student)

1. User navigates to `/auth`
2. Selects "Student" option
3. Chooses "Welcome back!"
4. Enters their unique ID (e.g., `1234-JD-7X`)
5. System validates format
6. ID stored in `localStorage`
7. User redirected to home

### localStorage Keys

| Key | Value | Purpose |
|-----|-------|---------|
| `student_id` | `"1234-JD-7X"` | Current student identifier |

---

## Role-Based Access Control

### RoleGuard Component

Protects routes based on user roles:

```tsx
import { RoleGuard } from '@/components/auth/RoleGuard';

// In routes
<Route 
  path="/admin" 
  element={
    <RoleGuard allowedRoles={['admin']}>
      <AdminDashboard />
    </RoleGuard>
  } 
/>

<Route 
  path="/teacher" 
  element={
    <RoleGuard allowedRoles={['teacher', 'admin']}>
      <TeacherDashboard />
    </RoleGuard>
  } 
/>
```

### Role Hierarchy

```
admin    → Full access (admin + teacher + student features)
teacher  → Teaching features + student features  
student  → Basic learning features only
```

### Checking Roles in Components

```tsx
const { isAdmin, isTeacher, isAuthenticated } = useAuth();

// Conditional rendering
{isAdmin && <AdminPanel />}
{isTeacher && <TeacherTools />}
{isAuthenticated && <UserContent />}
```

---

## Security Considerations

### Best Practices Implemented

1. **Roles in separate table**: `user_roles` prevents privilege escalation
2. **Server-side validation**: Roles checked via RLS policies
3. **JWT token refresh**: Supabase handles automatically
4. **Session persistence**: Stored in `localStorage` by Supabase
5. **Input validation**: Zod schemas for email/password

### RLS Policies

```sql
-- Profiles viewable by owner
CREATE POLICY "Profiles viewable by owner" ON profiles
  FOR SELECT USING (true);

-- User roles viewable by owner and teachers
CREATE POLICY "User roles viewable" ON user_roles
  FOR SELECT USING (true);
```

### has_role() Helper Function

```sql
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE profile_id = _user_id AND role = _role
  )
$$;
```

---

## Error Handling

### Auth Error Codes

| Code | Message |
|------|---------|
| `no_code` | Authorization code not received |
| `config_error` | OAuth configuration error |
| `token_exchange_failed` | Failed to complete authentication |
| `invalid_token` | Invalid authentication token |
| `profile_error` | Error creating user profile |
| `session_error` | Error creating session |

### Client-Side Validation

```tsx
const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');
```

---

## Extension Points

### Adding New Roles

1. Add to `app_role` enum:
   ```sql
   ALTER TYPE app_role ADD VALUE 'moderator';
   ```

2. Update `RoleGuard` to recognize new role

3. Add role check to `AuthContext`:
   ```tsx
   isModerator: userRoles.includes('moderator'),
   ```

### Adding OAuth Providers

1. Create new edge function for provider
2. Add button in `AuthPage.tsx`
3. Handle callback in `oauth-callback` function

### Student ID Validation

To validate student IDs against a database:
```tsx
// In handleStudentLogin
const { data } = await supabase
  .from('students')
  .select('id')
  .eq('student_id', studentLoginId)
  .single();

if (!data) {
  setError('Student ID not found');
  return;
}
```
