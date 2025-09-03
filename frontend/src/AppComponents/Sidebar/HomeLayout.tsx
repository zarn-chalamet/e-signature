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
import { LogOut, Signature } from "lucide-react";
import { logout } from "@/apiEndpoints/Auth";
import { useSelector } from "react-redux";
import { ThemeToggle } from "../ThemeToggle";

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
  const user = useSelector((state: any) => state.user);
  console.log("hello");
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
                              // className={cn(
                              //   item.destructive && "text-destructive"
                              // )}
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
                <SidebarMenuItem>
                  <TooltipProvider disableHoverableContent>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          onClick={() => logout()}
                          className="text-destructive cursor-pointer"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">Logout</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 w-full">
          <div className="pt-6 pb-2 flex items-center justify-between gap-4">
            <SidebarTrigger className="py-4" />

            <div className="flex gap-2">
              <ThemeToggle />
              <div className="relative mr-10">
                <img
                  src={
                    user.image ||
                    "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
                  }
                  alt="User profile"
                  className="h-9 w-9 rounded-full object-cover border-2 border-blue-500/30 hover:border-purple-500/60 transition-all"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
              </div>
            </div>
          </div>
          <div className="px-6 w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default HomeLayout;

{
  /* <p>|</p>
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
            )} */
}
