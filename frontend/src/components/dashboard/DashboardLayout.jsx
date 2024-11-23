import React, { useContext } from "react";
import { useAuth } from "../../context/AuthContext";
import { navigationConfig } from "./NavConfig";
import  InsetHeader  from "./InsetHeader";
import  {SidebarNav}  from "../ui/sidebar-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "../ui/sidebar";
import logo from "../../assets/LOGOs.png";
import logod from "../../assets/logo-dark.png";
import { DarkModeContext } from "../../context/DarkMode";
import { cn } from "../../lib/utils";


export default function DashboardLayout({ children }) {
  const {isDark} = useContext(DarkModeContext)
  const { user } = useAuth();
  const role = user?.role || "student";

  // Get navigation items based on user role
  const navigation = React.useMemo(() => {
    return navigationConfig[role] || navigationConfig.student;
  }, [role]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="grid min-h-screen w-full lg:grid-cols-[auto_1fr]">
        <Sidebar className="hidden lg:block">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <img
                src={isDark ? logod : logo}
                alt="Logo"
                className="h-12 w-auto"
              />
              {/* <span className="font-semibold">EnrollUg</span> */}
            </div>
          </SidebarHeader>
          <SidebarContent className="flex flex-col gap-4 p-4">
            <SidebarNav items={navigation.main} role={role} />
          </SidebarContent>
          <SidebarFooter className="p-4">
            <SidebarNav items={navigation.secondary} role={role} secondary />
          </SidebarFooter>
        </Sidebar>
        <div className="flex flex-col">
          <InsetHeader />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
