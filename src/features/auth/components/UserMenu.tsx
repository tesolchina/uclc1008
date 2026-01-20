import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogIn, LogOut, GraduationCap, BookOpen, Settings, Shield, RefreshCw, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateTeacherStudentId } from '@/components/teacher/TeacherStudentModeSwitch';
import { toast } from 'sonner';

export function UserMenu() {
  const { 
    user, profile, studentId, isAuthenticated, isLoading,
    userRoles, activeRole, setActiveRole, signOut,
    loginAsStudent, logoutStudent
  } = useAuth();
  const navigate = useNavigate();

  // Generate teacher's student ID for student mode
  const teacherStudentId = user?.id ? generateTeacherStudentId(user.id) : null;
  const isInStudentMode = !!studentId && studentId === teacherStudentId;

  if (isLoading) {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    );
  }

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email;
  const initials = displayName
    ?.split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || user?.email?.[0]?.toUpperCase() || 'U';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleToggleStudentMode = () => {
    if (!teacherStudentId) return;
    
    if (isInStudentMode) {
      logoutStudent();
      toast.success('Switched back to teacher mode');
    } else {
      loginAsStudent(teacherStudentId);
      toast.success('Switched to student mode - your progress will be tracked separately');
    }
  };

  // Check if user has multiple roles
  const hasMultipleRoles = userRoles.length > 1;
  const isTeacherOrAdmin = !!user && (activeRole === 'teacher' || activeRole === 'admin');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-3 w-3" />;
      case 'teacher': return <GraduationCap className="h-3 w-3" />;
      default: return <BookOpen className="h-3 w-3" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'border-purple-500 text-purple-600';
      case 'teacher': return 'border-blue-500 text-blue-600';
      default: return 'border-green-500 text-green-600';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin';
      case 'teacher': return 'Teacher';
      default: return 'Student';
    }
  };

  // Determine display role (show student mode if active)
  const displayRole = isInStudentMode ? 'student-mode' : activeRole;
  const getDisplayRoleLabel = () => {
    if (isInStudentMode) return 'Student Mode';
    return getRoleLabel(activeRole);
  };
  const getDisplayRoleColor = () => {
    if (isInStudentMode) return 'border-amber-500 text-amber-600';
    return getRoleColor(activeRole);
  };
  const getDisplayRoleIcon = () => {
    if (isInStudentMode) return <UserCircle className="h-3 w-3" />;
    return getRoleIcon(activeRole);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Show Student ID badge for students */}
      {!user && studentId && (
        <Badge variant="secondary" className="text-xs font-mono hidden sm:flex">
          ID: {studentId}
        </Badge>
      )}
      
      {/* Show active role badge for users with multiple roles or in student mode */}
      {(hasMultipleRoles || isInStudentMode) && (
        <Badge variant="outline" className={`text-xs hidden sm:flex gap-1 ${getDisplayRoleColor()}`}>
          {getDisplayRoleIcon()}
          {getDisplayRoleLabel()}
        </Badge>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {displayName || 'User'}
              </p>
              {isInStudentMode && teacherStudentId && (
                <p className="text-xs font-mono text-amber-600">
                  {teacherStudentId}
                </p>
              )}
              {!user && studentId && (
                <p className="text-xs font-mono text-primary/80">
                  {studentId}
                </p>
              )}
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
              
              {/* Current role badge */}
              <Badge 
                variant="outline" 
                className={`mt-1.5 w-fit gap-1 ${getDisplayRoleColor()}`}
              >
                {getDisplayRoleIcon()}
                {getDisplayRoleLabel()}
                {hasMultipleRoles && !isInStudentMode && (
                  <span className="text-muted-foreground ml-1">
                    ({userRoles.length} roles)
                  </span>
                )}
              </Badge>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          {/* Role Switcher only for signed-in HKBU users */}
          {user && (hasMultipleRoles || isTeacherOrAdmin) && (
            <>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Switch Role
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup 
                    value={isInStudentMode ? 'student-mode' : activeRole} 
                    onValueChange={(v) => {
                      if (v === 'student-mode') {
                        if (!isInStudentMode) handleToggleStudentMode();
                      } else {
                        if (isInStudentMode) logoutStudent();
                        setActiveRole(v as 'admin' | 'teacher' | 'student');
                      }
                    }}
                  >
                    {userRoles.includes('admin') && (
                      <DropdownMenuRadioItem value="admin" className="gap-2">
                        <Shield className="h-4 w-4 text-purple-600" />
                        Admin
                      </DropdownMenuRadioItem>
                    )}
                    {userRoles.includes('teacher') && (
                      <DropdownMenuRadioItem value="teacher" className="gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        Teacher
                      </DropdownMenuRadioItem>
                    )}
                    {isTeacherOrAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioItem value="student-mode" className="gap-2">
                          <UserCircle className="h-4 w-4 text-amber-600" />
                          <div className="flex flex-col">
                            <span>Student Mode</span>
                            <span className="text-xs text-muted-foreground font-mono">
                              {teacherStudentId}
                            </span>
                          </div>
                        </DropdownMenuRadioItem>
                      </>
                    )}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
            </>
          )}
          
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}