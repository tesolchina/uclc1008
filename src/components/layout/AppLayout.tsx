import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ApiKeyStatusIndicator } from "@/components/api/ApiKeyStatusIndicator";
const Header = () => {
  const { toggleSidebar, open } = useSidebar();
  const isMobile = useIsMobile();
  
  // Always show menu button on mobile, or when sidebar is closed on desktop
  const showMenuButton = isMobile || !open;
  
  return (
    <header className="flex h-14 items-center gap-3 border-b bg-background/80 px-3 sm:px-4 backdrop-blur">
      {showMenuButton && (
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="shrink-0 h-9 w-9"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      )}
      <div className="flex flex-1 items-center justify-between gap-3 overflow-hidden">
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-xs font-medium text-muted-foreground tracking-wide uppercase">
            UCLC 1008 University English I
          </p>
          <h1 className="truncate text-sm font-semibold">AI-Assisted Learning Hub</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
          <ApiKeyStatusIndicator />
          <div className="hidden items-center gap-3 md:flex">
            <span className="rounded-full bg-secondary/70 px-2 py-1 text-[11px] font-medium">
              AI-empowered lessons
            </span>
            <Separator orientation="vertical" className="h-6" />
            <span>13-week course</span>
          </div>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export const AppLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col">
        <Header />

        <div className="flex min-h-0 flex-1">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto bg-background/60 px-3 py-5 sm:px-6 sm:py-7">
            <div className="mx-auto max-w-5xl space-y-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
