import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/features/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { WeekAssignmentPage } from "./pages/WeekAssignmentPage";
import AssessmentPage from "./pages/AssessmentPage";
import { AppLayout } from "@/components/layout/AppLayout";
import Staff from "./pages/Staff";
import LessonPage from "./pages/LessonPage";
import Lesson1Page from "./pages/Lesson1Page";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import PreCourseWritingPage from "./pages/PreCourseWritingPage";
import AdminDashboard from "./pages/AdminDashboard";
import SettingsPage from "./pages/SettingsPage";
import JoinSessionPage from "./pages/JoinSessionPage";
import UnitPage from "./pages/UnitPage";
import HourPage from "./pages/HourPage";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import LabSpacePage from "./pages/LabSpacePage";
import {
  Week1Page,
  Week2Page,
  Week3Page,
  Week4Page,
  Week5Page,
  Week6Page,
  Week7Page,
  Week8Page,
  Week9Page,
  Week10Page,
  Week11Page,
  Week12Page,
  Week13Page,
} from "./pages/weeks";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route index element={<Navigate to="/course_info" replace />} />
              <Route path="course_info" element={<Index />} />
              <Route path="auth" element={<AuthPage />} />
              <Route path="auth/callback" element={<AuthCallback />} />
              <Route path="assessment" element={<AssessmentPage />} />
              
              {/* Individual Week Pages */}
              <Route path="week/1" element={<Week1Page />} />
              <Route path="week/2" element={<Week2Page />} />
              <Route path="week/3" element={<Week3Page />} />
              <Route path="week/4" element={<Week4Page />} />
              <Route path="week/5" element={<Week5Page />} />
              <Route path="week/6" element={<Week6Page />} />
              <Route path="week/7" element={<Week7Page />} />
              <Route path="week/8" element={<Week8Page />} />
              <Route path="week/9" element={<Week9Page />} />
              <Route path="week/10" element={<Week10Page />} />
              <Route path="week/11" element={<Week11Page />} />
              <Route path="week/12" element={<Week12Page />} />
              <Route path="week/13" element={<Week13Page />} />
              
              {/* Week Sub-pages */}
              <Route path="week/:weekId/hour/:hourId" element={<HourPage />} />
              <Route path="week/1/assignment/pre-course-writing" element={<PreCourseWritingPage />} />
              <Route path="week/2/assignment/pre-course-writing" element={<PreCourseWritingPage />} />
              <Route path="week/:weekId/assignment/:assignmentId" element={<WeekAssignmentPage />} />
              <Route path="week/1/lesson/1" element={<Lesson1Page />} />
              <Route path="week/:weekId/lesson/:lessonId" element={<LessonPage />} />
              <Route path="week/:weekId/unit/:unitId" element={<UnitPage />} />
              
              {/* Other Pages */}
              <Route path="staff" element={<Staff />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="join" element={<JoinSessionPage />} />
              <Route path="join/:code" element={<JoinSessionPage />} />
              <Route path="lab" element={<LabSpacePage />} />
              <Route path="my-progress" element={<StudentDashboard />} />
              <Route path="teacher-dashboard" element={<TeacherDashboard />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
