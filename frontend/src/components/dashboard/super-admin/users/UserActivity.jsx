import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Search, Filter, Download, CloudLightningIcon } from "lucide-react";
import { format } from "date-fns";
import { dashboardService } from '../../../../services/dashboardService';

const ACTIVITY_TYPES = {
  login: "Login",
  logout: "Logout",
  create_user: "Create User",
  update_user: "Update User",
  delete_user: "Delete User",
  update_role: "Update Role",
  create_role: "Create Role",
  update_permissions: "Update Permissions",
  update_status: "Update Status",
  upload_avatar: "Upload Avatar",
  view_profile: "View Profile"
};

const UserActivity = () => {
  const { toast } = useToast();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    dateRange: "all",
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const data = await dashboardService.getUserActivities();
      setActivities(data);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Error",
        description: "Failed to fetch activity logs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const filteredActivities = activities.filter((activity) => {
    const searchTerm = filters.search.toLowerCase();
    const matchesSearch = !searchTerm || 
      (activity.user?.name?.toLowerCase().includes(searchTerm) ||
       activity.performedBy?.name?.toLowerCase().includes(searchTerm) ||
       activity.details?.toLowerCase().includes(searchTerm));

    const matchesType = !filters.type || activity.action === filters.type;

    return matchesSearch && matchesType;
  });

  const handleExport = () => {
    const csvContent = [
      ['Date', 'User', 'Action', 'Details', 'Performed By'],
      ...filteredActivities.map((activity) => [
        format(new Date(activity.timestamp), 'yyyy-MM-dd HH:mm:ss'),
        activity.user?.name || 'N/A',
        ACTIVITY_TYPES[activity.action] || activity.action,
        activity.details,
        activity.performedBy?.name || 'System'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_log_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div>Loading activity logs...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center w-full">
          <CardTitle>User Activity Log <span className="text-sm text-amber-500">({filteredActivities.length})</span> </CardTitle>
          <CloudLightningIcon className="h-6 w-6 text-emerald-500 animate-pulse" />
        </div>
        <CardDescription>Track all user actions and system events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <Input
              placeholder="Search activities..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange('type', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {Object.entries(ACTIVITY_TYPES).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Performed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredActivities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No activity logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      {format(new Date(activity.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                    </TableCell>
                    <TableCell>{activity.user?.name || 'N/A'}</TableCell>
                    <TableCell>{ACTIVITY_TYPES[activity.action] || activity.action}</TableCell>
                    <TableCell>{activity.details}</TableCell>
                    <TableCell>{activity.performedBy?.name || 'System'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivity;
