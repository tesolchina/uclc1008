import { BookOpen, CalendarRange, MessageCircle, Sparkles, Target } from "lucide-react";
import { NavLink } from "@/components/NavLink";
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
  assignment?: string;
};

const weeks: WeekNavItem[] = [
  { title: "Week 1", url: "/week/1" },
  { title: "Week 2", url: "/week/2", assignment: "Pre-course Writing (2.5%) due this week" },
  { title: "Week 3", url: "/week/3", assignment: "Referencing Quiz (2.5%) this week" },
  { title: "Week 4", url: "/week/4" },
  { title: "Week 5", url: "/week/5" },
  { title: "Week 6", url: "/week/6", assignment: "Academic Writing Quiz (15%) in class" },
  { title: "Week 7", url: "/week/7" },
  { title: "Week 8", url: "/week/8" },
  { title: "Week 9", url: "/week/9", assignment: "Argument Construction & Evaluation Draft (15%)" },
  { title: "Week 10", url: "/week/10" },
  { title: "Week 11", url: "/week/11" },
  { title: "Week 12", url: "/week/12", assignment: "Peer Evaluation on Draft (5%)" },
  {
    title: "Week 13",
    url: "/week/13",
    assignment: "Critical Response (20%) & final submissions",
  },
];

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
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
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
                 <SidebarMenuItem key={week.title}>
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
                       {!collapsed && (
                         <span className="flex min-w-0 flex-col">
                           <span className="truncate">{week.title}</span>
                           {week.assignment && (
                             <span className="truncate text-[10px] text-sidebar-foreground/60">
                               {week.assignment}
                             </span>
                           )}
                         </span>
                       )}
                     </NavLink>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
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
