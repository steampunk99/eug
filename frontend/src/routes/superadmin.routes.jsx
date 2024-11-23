import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import LoadingScreen from "@/components/LoadingScreen";

const Loadable = (Component) => {
  return React.lazy(() => Promise.resolve({ default: Component }));
};

// Pages
const SuperadminDashboard = Loadable(() => import("@/pages/superadmin/Dashboard"));
const SchoolsList = Loadable(() => import("@/pages/superadmin/schools/SchoolsList"));
const SuperAdminStaffManagement = Loadable(() => 
  import("@/components/dashboard/super-admin/staff/StaffManagement")
);
const PendingVerification = Loadable(() => 
  import("@/pages/superadmin/schools/PendingVerification")
);
const Applications = Loadable(() => import("@/pages/superadmin/schools/Applications"));
const Settings = Loadable(() => import("@/pages/superadmin/settings/Settings"));
const UserManagement = Loadable(() => import("@/pages/superadmin/users/UserManagement"));
const RolesPermissions = Loadable(() => 
  import("@/pages/superadmin/users/RolesPermissions")
);
const ActivityLog = Loadable(() => import("@/pages/superadmin/users/ActivityLog"));
const InviteUsers = Loadable(() => import("@/pages/superadmin/users/InviteUsers"));
const UserProfiles = Loadable(() => import("@/pages/superadmin/users/UserProfiles"));
const SystemSettings = Loadable(() => 
  import("@/pages/superadmin/settings/SystemSettings")
);
const EmailTemplates = Loadable(() => 
  import("@/pages/superadmin/settings/EmailTemplates")
);
const NotificationSettings = Loadable(() => 
  import("@/pages/superadmin/settings/NotificationSettings")
);

const superadminRoutes = {
  path: "superadmin",
  element: <DashboardLayout />,
  children: [
    { path: "", element: <Navigate to="/dashboard/superadmin/overview" /> },
    { 
      path: "overview", 
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <SuperadminDashboard />
        </Suspense>
      )
    },
    {
      path: "schools",
      children: [
        { 
          path: "", 
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <SchoolsList />
            </Suspense>
          )
        },
        { 
          path: "staff", 
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <SuperAdminStaffManagement />
            </Suspense>
          )
        },
        { 
          path: "verification", 
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <PendingVerification />
            </Suspense>
          )
        },
        { 
          path: "applications", 
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <Applications />
            </Suspense>
          )
        },
      ]
    },
    { 
      path: "applications", 
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <Applications />
        </Suspense>
      )
    },
    { 
      path: "settings", 
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <Settings />
        </Suspense>
      )
    },
    {
      path: "users",
      children: [
        { 
          path: "", 
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <UserManagement />
            </Suspense>
          )
        },
        { 
          path: "roles", 
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <RolesPermissions />
            </Suspense>
          )
        },
        { 
          path: "activity", 
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <ActivityLog />
            </Suspense>
          )
        },
        { 
          path: "invite", 
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <InviteUsers />
            </Suspense>
          )
        },
        { 
          path: "profiles", 
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <UserProfiles />
            </Suspense>
          )
        },
      ]
    },
    {
      path: "settings",
      children: [
        { 
          path: "general", 
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <SystemSettings />
            </Suspense>
          )
        },
        { 
          path: "email", 
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <EmailTemplates />
            </Suspense>
          )
        },
        { 
          path: "notifications", 
          element: (
            <Suspense fallback={<LoadingScreen />}>
              <NotificationSettings />
            </Suspense>
          )
        },
      ]
    },
  ],
};

export default superadminRoutes;
