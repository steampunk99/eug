import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SchoolSettings({ schoolId, school }) {
  if (!school) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">No school data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
          <CardDescription>View and update your school's basic information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name</Label>
              <Input id="schoolName" defaultValue={school.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" defaultValue={school.email} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input id="phone" defaultValue={school.phone} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue={school.address} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>School Preferences</CardTitle>
          <CardDescription>Configure your school's system preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Preferences configuration coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}