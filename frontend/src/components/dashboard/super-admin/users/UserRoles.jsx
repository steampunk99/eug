import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import { dashboardService } from '../../../../services/dashboardService';

const PERMISSIONS = {
  users: ['view', 'create', 'edit', 'delete'],
  schools: ['view', 'approve', 'reject', 'edit'],
  applications: ['view', 'process', 'approve', 'reject'],
  settings: ['view', 'edit']
};

const UserRoles = () => {
  const { toast } = useToast();
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await dashboardService.getUserRoles();
      console.log('Fetched roles:', response);
      const formattedRoles = response.map(role => ({
        id: role.value,
        name: role.label
      }));
      console.log('Formatted roles:', formattedRoles);
      setRoles(formattedRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive",
      });
    }
  };

  const fetchRolePermissions = async (roleId) => {
    try {
      const response = await dashboardService.getRolePermissions(roleId);
      setRolePermissions(response);
      setSelectedRole(roleId);
    } catch (error) {
      console.error('Error fetching role permissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch role permissions",
        variant: "destructive",
      });
    }
  };

  const handlePermissionChange = async (category, permission) => {
    if (!selectedRole) return;

    const updatedPermissions = { ...rolePermissions };
    const categoryPermissions = updatedPermissions[category] || [];
    
    if (categoryPermissions.includes(permission)) {
      updatedPermissions[category] = categoryPermissions.filter(p => p !== permission);
    } else {
      updatedPermissions[category] = [...categoryPermissions, permission];
    }

    try {
      await dashboardService.updateRolePermissions(selectedRole, updatedPermissions);
      setRolePermissions(updatedPermissions);
      toast({
        title: "Success",
        description: "Permissions updated successfully",
      });
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast({
        title: "Error",
        description: "Failed to update permissions",
        variant: "destructive",
      });
    }
  };

  const handleCreateRole = async () => {
    if (!newRoleName) {
      toast({
        title: "Error",
        description: "Role name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Creating role with name:', newRoleName);
      const response = await dashboardService.createRole(newRoleName);
      console.log('Create role response:', response);
      
      setIsDialogOpen(false);
      setNewRoleName('');
      
      console.log('Refreshing roles list...');
      await fetchRoles();
      
      toast({
        title: "Success",
        description: "Role created successfully",
      });
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Role Management</h2>
          <p className="text-muted-foreground">
            Manage user roles and their permissions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>
                Enter a name for the new role. You can set permissions after creation.
              </DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Role name"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateRole}>Create Role</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Roles</CardTitle>
            <CardDescription>Select a role to manage permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {roles.map((role) => (
                <Button
                  key={role.id}
                  variant={selectedRole === role.id ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => fetchRolePermissions(role.id)}
                >
                  {role.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>Configure permissions for the selected role</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedRole ? (
              <div className="space-y-6">
                {Object.entries(PERMISSIONS).map(([category, permissions]) => (
                  <div key={category} className="space-y-3">
                    <h3 className="font-medium capitalize">{category}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {permissions.map((permission) => (
                        <div key={`${category}-${permission}`} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${category}-${permission}`}
                            checked={rolePermissions[category]?.includes(permission)}
                            onCheckedChange={() => handlePermissionChange(category, permission)}
                          />
                          <label
                            htmlFor={`${category}-${permission}`}
                            className="text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {permission}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                Select a role to view and edit permissions
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserRoles;
