import { BookOpen, CalendarRange, MessageCircle, PanelLeftClose, Sparkles, Target, Settings, CheckCircle2, XCircle, Loader2, Shield, Radio } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { getWeekMetaById, getAssignmentById } from "@/data";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

type WeekNavItem = {
  title: string;
  url: string;
  assignments: { id: string; title: string; weight: string }[];
  hours?: { number: number; title: string }[];
  specialPages?: { id: string; title: string; icon: string }[];
};

const weeks: WeekNavItem[] = Array.from({ length: 13 }, (_, index) => {
  const id = index + 1;
  const meta = getWeekMetaById(id);
  const assignmentIds = meta?.assignmentIds || [];
  
  const assignments = assignmentIds
    .map((aid) => {
      const assignment = getAssignmentById(aid);
      return assignment 
        ? { id: aid, title: assignment.title, weight: assignment.weight }
        : null;
    })
    .filter((a): a is { id: string; title: string; weight: string } => a !== null);

  // Add hours for weeks 1-5
  const hours = id <= 5 ? [
    { number: 1, title: "Hour 1" },
    { number: 2, title: "Hour 2" },
    { number: 3, title: "Hour 3" },
  ] : undefined;

  // Special pages for specific weeks
  const specialPages = id === 2 ? [
    { id: "feedback", title: "Pre-course Writing Feedback", icon: "feedback" }
  ] : undefined;

  return {
    title: `Week ${id}`,
    url: `/week/${id}`,
    assignments,
    hours,
    specialPages,
  };
});

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const location = useLocation();
  const { isTeacher, isAdmin } = useAuth();
  const collapsed = state === "collapsed";
  const currentPath = location.pathname;
  
  const [aiStatus, setAiStatus] = useState<"checking" | "active" | "inactive">("checking");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data } = await supabase.functions.invoke("check-api-status");
        const hasActive = data?.statuses?.some((s: { available: boolean }) => s.available);
        setAiStatus(hasActive ? "active" : "inactive");
      } catch {
        setAiStatus("inactive");
      }
    };
    checkStatus();
  }, []);

  const isActive = (path: string) => currentPath === path;

  // Build navigation items based on role
  const overviewItems = [
    { title: "Course overview", url: "/course_info", icon: BookOpen },
    { title: "Lab Space", url: "/lab", icon: Radio },
    { title: "Settings", url: "/settings", icon: Settings, showStatus: true },
  ];

  // Only show "My Progress" for students (not teachers/admins)
  if (!isTeacher && !isAdmin) {
    overviewItems.push({ title: "My Progress", url: "/my-progress", icon: Target, showStatus: false });
  }

  // Add admin dashboard for teachers/admins
  if (isTeacher || isAdmin) {
    overviewItems.push({ title: "Teacher Dashboard", url: "/teacher-dashboard", icon: MessageCircle, showStatus: false });
    overviewItems.push({ title: "Admin Dashboard", url: "/admin", icon: Shield, showStatus: false });
    overviewItems.push({ title: "Staff Space", url: "/staff", icon: Settings, showStatus: false });
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <SidebarHeader className="flex flex-row items-center justify-end px-2 py-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-7 w-7 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
        >
          <PanelLeftClose className="h-4 w-4" />
          <span className="sr-only">Close sidebar</span>
        </Button>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-4 px-2 py-3">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/60">
            <Sparkles className="h-3.5 w-3.5 text-sidebar-primary" />
            {!collapsed && <span>Course</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {overviewItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground">
                    <NavLink
                      to={item.url}
                      end
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                    >
                      <item.icon className="h-3.5 w-3.5" />
                      {!collapsed && <span>{item.title}</span>}
                      {item.showStatus && !collapsed && (
                        <span className="ml-auto">
                          {aiStatus === "checking" ? (
                            <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                          ) : aiStatus === "active" ? (
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                          ) : (
                            <XCircle className="h-3 w-3 text-muted-foreground" />
                          )}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/60">
            <CalendarRange className="h-3.5 w-3.5 text-sidebar-primary" />
            {!collapsed && <span>Weekly units</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {weeks.map((week) => {
                const active = isActive(week.url);

                return (
                  <div key={week.title}>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild data-active={active}>
                        <NavLink
                          to={week.url}
                          end
                          className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sidebar-accent/40 text-[10px] font-semibold text-sidebar-foreground">
                            {week.title.replace("Week ", "W")}
                          </span>
                          {!collapsed && <span className="truncate">{week.title}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    {!collapsed && week.hours?.map((hour) => {
                      const hourPath = `${week.url}/hour/${hour.number}`;
                      const hourActive = isActive(hourPath);

                      return (
                        <SidebarMenuItem key={hour.number}>
                          <SidebarMenuButton asChild data-active={hourActive}>
                            <NavLink
                              to={hourPath}
                              end
                              className="flex items-center gap-2 rounded-md px-6 py-1.5 text-[11px] text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                            >
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/20 text-[9px] font-semibold text-primary">
                                {hour.number}
                              </span>
                              <span className="truncate">{hour.title}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                    {!collapsed && week.assignments.map((assignment) => {
                      const assignmentPath = `${week.url}/assignment/${assignment.id}`;
                      const assignmentActive = isActive(assignmentPath);

                      return (
                        <SidebarMenuItem key={assignment.id}>
                          <SidebarMenuButton asChild data-active={assignmentActive}>
                            <NavLink
                              to={assignmentPath}
                              end
                              className="flex items-center gap-2 rounded-md px-6 py-1.5 text-[11px] text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                            >
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-sidebar-accent/40 text-[9px] font-semibold text-sidebar-foreground">
                                A
                              </span>
                              <span className="truncate">{assignment.title} ({assignment.weight})</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                    {!collapsed && week.specialPages?.map((page) => {
                      const pagePath = `${week.url}/${page.id}`;
                      const pageActive = isActive(pagePath);

                      return (
                        <SidebarMenuItem key={page.id}>
                          <SidebarMenuButton asChild data-active={pageActive}>
                            <NavLink
                              to={pagePath}
                              end
                              className="flex items-center gap-2 rounded-md px-6 py-1.5 text-[11px] text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                            >
                              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-amber-500/20 text-[9px] font-semibold text-amber-600">
                                F
                              </span>
                              <span className="truncate">{page.title}</span>
                            </NavLink>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </div>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/60">
            <MessageCircle className="h-3.5 w-3.5 text-sidebar-primary" />
            {!collapsed && <span>AI tutor</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <p className="px-1 text-[11px] text-sidebar-foreground/70">
              {!collapsed
                ? "Open any week to ask the AI tutor questions about the lesson and your writing."
                : "Ask AI in each week."}
            </p>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebar;
