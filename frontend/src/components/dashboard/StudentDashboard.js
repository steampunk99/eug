import React from 'react';
import DashboardLayout from './DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"


export default function StudentDashboard() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">1,234</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">$12,345</p>
          </CardContent>
        </Card>
        {/* Add more cards as needed */}
      </div>
    </DashboardLayout>
  );
}