import React from "react"
import { Routes, Route } from "react-router-dom"
import StatisticsCards from "./overview/StatisticsCards"
import ActivityTimeline from "./overview/ActivityTimeline"
import QuickActions from "./overview/QuickActions"
import SchoolsList from "./schools/SchoolsList"
import SchoolForm from "./schools/SchoolForm"
import SchoolVerification from "./schools/SchoolVerification"
import UsersList from "./users/UsersList"
import UserForm from "./users/UserForm"
import UserRoles from "./users/UserRoles"
import UserActivity from "./users/UserActivity"
import UserInvite from "./users/UserInvite"
import UserProfile from "./users/UserProfile"
import DashboardLayout from "../DashboardLayout"
import StaffManagement from "./staff/StaffManagement"
import { LayoutDashboardIcon } from "lucide-react"

function Overview() {
  return (
    <div className="space-y-4 h-auto">

    <div className="flex items-center gap-2">
    <span className="text-emerald-500"><LayoutDashboardIcon /></span> 
      <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
    </div>
    <p className="text-muted-foreground">
        Welcome to Enroll-Ug Super Admin Dashboard</p>
      <StatisticsCards />
      <QuickActions />
      <ActivityTimeline />
    </div>
  )
}

export default function SuperAdminDashboard() {
  return (
    <DashboardLayout>
      <div className="flex h-screen">
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto py-6">
            <Routes>
              <Route index element={<Overview />} />
              <Route path="schools" element={<SchoolsList />} />
              <Route path="schools/verification" element={<SchoolVerification />} />
              <Route path="schools/new" element={<SchoolForm />} />
              <Route path="schools/edit/:id" element={<SchoolForm />} />
              <Route path="schools/staff" element={<StaffManagement />} />
              <Route path="users" element={<UsersList />} />
              <Route path="users/new" element={<UserForm />} />
              <Route path="users/edit/:id" element={<UserForm />} />
              <Route path="users/roles" element={<UserRoles />} />
              <Route path="users/activity" element={<UserActivity />} />
              <Route path="users/invite" element={<UserInvite />} />
              <Route path="users/profiles" element={<UserProfile />} />
            </Routes>
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}
