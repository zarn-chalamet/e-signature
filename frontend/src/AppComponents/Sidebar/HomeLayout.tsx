import React from "react";
import { Outlet, Link, useParams, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { mainNav, bottomNav } from "./Sidebar.Config";
import { Signature } from "lucide-react";

// Custom header component that responds to sidebar state
function CollapsibleHeader() {
  const { state } = useSidebar();

  return (
    <SidebarHeader>
      <div className="flex items-center gap-2 py-4">
          <Signature />
          {state === "expanded" && (
            <span className="font-bold text-lg">E-Signature</span>
          )}
        {/* <SidebarTrigger className="mr-2" /> */}
      </div>
    </SidebarHeader>
  );
}

export function HomeLayout() {
  const location = useLocation();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <Sidebar collapsible="icon" variant="floating">
          <CollapsibleHeader />
          <SidebarContent>
            {/* Main Nav */}
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainNav.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <SidebarMenuButton asChild>
                              <Link to={item.href}>
                                <item.icon className="h-5 w-5" />
                                <span>{item.title}</span>
                              </Link>
                            </SidebarMenuButton>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            {item.title}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          {/* Bottom Nav */}
          <SidebarFooter>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {bottomNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <TooltipProvider disableHoverableContent>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <SidebarMenuButton asChild>
                            <Link
                              to={item.href}
                              className={cn(
                                item.destructive && "text-destructive"
                              )}
                            >
                              <item.icon className="h-5 w-5" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 w-full">
          <div className="pt-6 pb-2 flex items-center gap-4">
            <SidebarTrigger className="py-4" />
            <p>|</p>
            {location.pathname == "/" ? (
              <>
                <p className="text-lg font-bold">DASHBOARD</p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold">
                  {location.pathname
                    .split("/")
                    .filter(Boolean)
                    .map((seg) => seg.toUpperCase())}
                </p>
              </>
            )}
          </div>
          <div className="p-6 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default HomeLayout;
