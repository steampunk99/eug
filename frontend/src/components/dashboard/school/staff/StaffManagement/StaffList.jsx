import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { schoolService } from "@/services/schoolService";
import EditStaffModal from "./EditStaffModal";

const StaffList = ({ staff, loading, onUpdate, canManageStaff }) => {
  const [editingStaff, setEditingStaff] = useState(null);
  const { toast } = useToast();

  const handleUpdateStaff = async (staffId, data) => {
    try {
      await schoolService.updateStaffMember(staffId, data);
      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
      onUpdate();
      setEditingStaff(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update staff member",
        variant: "destructive",
      });
    }
  };

  const handleRemoveStaff = async (staffId) => {
    if (!window.confirm("Are you sure you want to remove this staff member?")) {
      return;
    }

    try {
      await schoolService.removeStaffMember(staffId);
      toast({
        title: "Success",
        description: "Staff member removed successfully",
      });
      onUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove staff member",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading staff members...</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Permissions</TableHead>
    
            <TableHead>Assigned Date</TableHead>
            {canManageStaff && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff?.map((member) => (
            <TableRow key={member._id}>
              <TableCell>{member.user.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{member.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={member.status === 'active' ? 'success' : 
                          member.status === 'pending' ? 'warning' : 'destructive'}
                >
                  {member.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {member.permissions?.map((permission, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{new Date(member.assignedAt).toLocaleDateString()}</TableCell>
              {canManageStaff && (
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingStaff(member)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleRemoveStaff(member._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingStaff && (
        <EditStaffModal
          staff={editingStaff}
          open={!!editingStaff}
          onClose={() => setEditingStaff(null)}
          onUpdate={handleUpdateStaff}
        />
      )}
    </>
  );
};

export default StaffList;
