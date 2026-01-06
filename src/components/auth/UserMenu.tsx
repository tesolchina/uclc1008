import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogIn, LogOut, User, GraduationCap, BookOpen } from 'lucide-react';

export function UserMenu() {
  const { profile, isAuthenticated, isTeacher, login, logout, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <Button variant="outline" size="sm" onClick={login}>
        <LogIn className="h-4 w-4 mr-2" />
        Sign In
      </Button>
    );
  }

  const initials = profile?.display_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || profile?.email?.[0]?.toUpperCase() || 'U';

  return (
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
              {profile?.display_name || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile?.email}
            </p>
            <Badge 
              variant="outline" 
              className={`mt-1.5 w-fit ${isTeacher ? 'border-blue-500 text-blue-600' : 'border-green-500 text-green-600'}`}
            >
              {isTeacher ? (
                <>
                  <GraduationCap className="h-3 w-3 mr-1" />
                  Teacher
                </>
              ) : (
                <>
                  <BookOpen className="h-3 w-3 mr-1" />
                  Student
                </>
              )}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}