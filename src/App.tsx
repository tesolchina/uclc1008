import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { WeekPage } from "./pages/WeekPage";
import { WeekAssignmentPage } from "./pages/WeekAssignmentPage";
import AssessmentPage from "./pages/AssessmentPage";
import { AppLayout } from "@/components/layout/AppLayout";
import Staff from "./pages/Staff";
import LessonPage from "./pages/LessonPage";
import Lesson1Page from "./pages/Lesson1Page";
import AuthPage from "./pages/AuthPage";
import AuthCallback from "./pages/AuthCallback";
import Week1Page from "./pages/Week1Page";
import PreCourseWritingPage from "./pages/PreCourseWritingPage";
import AdminDashboard from "./pages/AdminDashboard";
import SettingsPage from "./pages/SettingsPage";
import JoinSessionPage from "./pages/JoinSessionPage";

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
              <Route index element={<Index />} />
              <Route path="auth" element={<AuthPage />} />
              <Route path="auth/callback" element={<AuthCallback />} />
              <Route path="assessment" element={<AssessmentPage />} />
              <Route path="week/1" element={<Week1Page />} />
              <Route path="week/:weekId" element={<WeekPage />} />
              <Route path="week/2/assignment/pre-course-writing" element={<PreCourseWritingPage />} />
              <Route path="week/:weekId/assignment/:assignmentId" element={<WeekAssignmentPage />} />
              <Route path="week/1/lesson/1" element={<Lesson1Page />} />
              <Route path="week/:weekId/lesson/:lessonId" element={<LessonPage />} />
              <Route path="staff" element={<Staff />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="join" element={<JoinSessionPage />} />
              <Route path="join/:code" element={<JoinSessionPage />} />
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