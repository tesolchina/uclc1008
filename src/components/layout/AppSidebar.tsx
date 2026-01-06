import { BookOpen, CalendarRange, MessageCircle, Sparkles, Target } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { getWeekMetaById, getAssignmentById } from "@/data";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

type WeekNavItem = {
  title: string;
  url: string;
  assignments: { id: string; title: string; weight: string }[];
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

  return {
    title: `Week ${id}`,
    url: `/week/${id}`,
    assignments,
  };
});

const overviewItems = [
  { title: "Course overview", url: "/", icon: BookOpen },
  { title: "Assessment & goals", url: "/#assessment", icon: Target },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
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
