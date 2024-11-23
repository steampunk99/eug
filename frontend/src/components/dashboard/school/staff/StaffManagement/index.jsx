import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { schoolService } from "@/services/schoolService";
import StaffList from "./StaffList";
import AssociateUserModal from "../AssociateUserModal";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import AddStaffModal from "./AddStaffModal";

const StaffManagement = ({ school }) => {
  const [loading, setLoading] = useState(true);
  const [staffList, setStaffList] = useState([]);
  const [showAssociateModal, setShowAssociateModal] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { schoolId } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchStaffList = async () => {
    try {
      setLoading(true);
      const response = await schoolService.getSchoolStaff(school._id);
      setStaffList(response.data);
    } catch (error) {
      console.error("Error fetching staff:", error);
      toast({
        title: "Error",
        description: "Failed to fetch staff list",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (school?._id) {
      fetchStaffList();
    }
  }, [school]);

  const handleStaffUpdate = async (staffId, data) => {
    try {
      await schoolService.updateStaffMember(school._id, staffId, data);
      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
      fetchStaffList();
    } catch (error) {
      console.error("Error updating staff:", error);
      toast({
        title: "Error",
        description: "Failed to update staff member",
        variant: "destructive",
      });
    }
  };

  const handleStaffRemove = async (staffId) => {
    try {
      await schoolService.removeStaffMember(school._id, staffId);
      toast({
        title: "Success",
        description: "Staff member removed successfully",
      });
      fetchStaffList();
    } catch (error) {
      console.error("Error removing staff:", error);
      toast({
        title: "Error",
        description: "Failed to remove staff member",
        variant: "destructive",
      });
    }
  };

  const handleAddStaff = async (staffData) => {
    try {
      await schoolService.addStaffMember(school._id, staffData);
      toast({
        title: "Success",
        description: "Staff member added successfully",
      });
      fetchStaffList();
      setIsAddModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to add staff member",
        variant: "destructive",
      });
    }
  };

  const canManageStaff = user?.role === 'superadmin' || 
    (user?.role === 'admin' && school?.adminId === user?.id);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Staff Management</CardTitle>
        {canManageStaff && (
          <div className="flex space-x-2">
            <Button onClick={() => setShowAssociateModal(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Associate User
            </Button>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <StaffList
          loading={loading}
          staffList={staffList}
          onUpdate={handleStaffUpdate}
          onRemove={handleStaffRemove}
          canManageStaff={canManageStaff}
        />
      </CardContent>

      <AssociateUserModal
        schoolId={school._id}
        open={showAssociateModal}
        onClose={() => setShowAssociateModal(false)}
        onSuccess={fetchStaffList}
      />

      <AddStaffModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddStaff}
      />
    </Card>
  );
};

export default StaffManagement;
