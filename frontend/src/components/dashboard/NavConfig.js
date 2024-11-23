import { 
  LayoutDashboard,
  School,
  GraduationCap,
  Settings,
  Users,
  FileText,
  Bell,
  MessageSquare,
  LifeBuoy,
  Send,
  LogOut,
  BookOpen,
  ClipboardList,
  Calendar,
  Award,
  Building2,
  UserCog,
  Shield,
  History,
  UserPlus
} from "lucide-react"

import { authService } from "../../services/authService"
import { toast } from "../ui/use-toast"
import { useAuth } from "../../context/AuthContext";

const { logout } = authService;


const handleLogout = async () => {
  try {
    await logout();
    toast({
      title: "Success",
      description: "Logout successful",
    });
  } catch (error) {
    console.error('Logout failed:', error);
    toast({
      title: "Error",
      description: "Logout failed",
      variant: "destructive"
    });
  }
};


export const navigationConfig = {
  "superadmin": {
    main: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard/superadmin",
      },
      {
        title: "School Management",
        icon: School,
        items: [
          { title: "All Schools", path: "/dashboard/superadmin/schools", icon: Building2 },
          { title: "Staff Management", path: "/dashboard/superadmin/schools/staff", icon: Users },
          { title: "Pending Verification", path: "/dashboard/superadmin/schools/verification", icon: FileText },
          { title: "Applications", path: "/dashboard/superadmin/applications", icon: ClipboardList },
          { title: "Settings", path: "/dashboard/superadmin/settings", icon: Settings },
        ],
      },
      {
        title: "User Management",
        icon: Users,
        items: [
          { title: "All Users", path: "/dashboard/superadmin/users", icon: Users },
          { title: "Roles & Permissions", path: "/dashboard/superadmin/users/roles", icon: Shield },
          { title: "Activity Log", path: "/dashboard/superadmin/users/activity", icon: History },
          { title: "Invite Users", path: "/dashboard/superadmin/users/invite", icon: UserPlus },
          { title: "User Profiles", path: "/dashboard/superadmin/users/profiles", icon: UserCog },
        ],
      },
      {
        title: "System Settings",
        icon: Settings,
        items: [
          { title: "General", path: "/dashboard/superadmin/settings/general", icon: Settings },
          { title: "Email Templates", path: "/dashboard/superadmin/settings/email", icon: Send },
          { title: "Notifications", path: "/dashboard/superadmin/settings/notifications", icon: Bell },
        ],
      }
    ],
    secondary: [
      { title: "Notifications", icon: Bell, path: "/notifications", badge: "3" },
      { title: "Messages", icon: MessageSquare, path: "/messages", badge: "5" },
      { title: "Support", icon: LifeBuoy, path: "/support" },
      { title: "Feedback", icon: Send, path: "/feedback" },
      { title: "Profile", icon: UserCog, path: "/profile" },
      { title: "Logout", icon: LogOut, action: handleLogout },
    ]
  },
  "admin": {  
    main: [
      {
        title: "Overview",
        icon: LayoutDashboard,
        path: "/dashboard/admin/overview",
      },
      {
        title: "Staff Management",
        icon: Users,
        items: [
          { title: "All Staff", path: "/dashboard/admin/staff", icon: Users },
          { title: "Add Staff", path: "/dashboard/admin/staff/add", icon: UserPlus },
          { title: "Roles & Permissions", path: "/dashboard/admin/staff/roles", icon: Shield },
        ],
      },
      {
        title: "Applications",
        icon: ClipboardList,
        items: [
          { title: "Manage Applications", path: "/dashboard/admin/applications", icon: FileText },
          { title: "Interview Schedule", path: "/dashboard/admin/applications/schedule", icon: Calendar },
        ],
      },
      {
        title: "Analytics",
        icon: Award,
        path: "/dashboard/admin/statistics",
      },
    ],
    secondary: [
      { title: "Notifications", icon: Bell, path: "/notifications", badge: "2" },
      { title: "Messages", icon: MessageSquare, path: "/messages", badge: "3" },
      { title: "Settings", icon: Settings, path: "/settings" },
      { title: "Support", icon: LifeBuoy, path: "/support" },
      { title: "Logout", icon: LogOut, action: handleLogout },
    ],
  },
  "student": {  
    main: [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard/student",
      },
      {
        title: "My Education",
        icon: GraduationCap,
        items: [
          { title: "Courses", path: "/dashboard/student/courses", icon: BookOpen },
          { title: "Grades", path: "/dashboard/student/grades", icon: Award },
          { title: "Calendar", path: "/dashboard/student/calendar", icon: Calendar },
          { title: "Applications", path: "/dashboard/student/applications", icon: ClipboardList },
        ],
      },
    ],
    secondary: [
      { title: "Notifications", icon: Bell, path: "/notifications", badge: "1" },
      { title: "Messages", icon: MessageSquare, path: "/messages", badge: "2" },
      { title: "Settings", icon: Settings, path: "/settings" },
      { title: "Support", icon: LifeBuoy, path: "/support" },
      { title: "Logout", icon: LogOut, action: handleLogout },
    ],
  },
}