import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { schoolService } from "@/services/schoolService";
import StaffList from "../../school/staff/StaffManagement/StaffList";
import AssociateUserModal from "../../school/staff/AssociateUserModal";

const SuperAdminStaffManagement = () => {
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState([]);  
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [staffList, setStaffList] = useState([]);  
  const [showAssociateModal, setShowAssociateModal] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        const response = await schoolService.getSchools();
        console.log("Schools response:", response);
        
        if (response && response.schools) {
          setSchools(response.schools);
          if (response.schools.length > 0) {
            console.log("Setting first school:", response.schools[0]);
            setSelectedSchool(response.schools[0]._id);
          }
        } else {
          console.error("Invalid schools response format:", response);
          setSchools([]);
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
        toast({
          title: "Error",
          description: "Failed to fetch schools",
          variant: "destructive",
        });
        setSchools([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    const fetchStaffList = async () => {
      if (!selectedSchool) return;
      try {
          const response = await schoolService.getSchoolStaff(selectedSchool);
          console.log("Staff API response before:", response);
          setStaffList(Array.isArray(response) ? response : []);
          console.log("Staff API response after set to arrary:", response);
      } catch (error) {
          console.error("Error fetching staff:", error);
          setStaffList([]); // Fallback
      }
  };
  

    fetchStaffList();
  }, [selectedSchool]);

  const handleSchoolChange = (schoolId) => {
    console.log("School selected:", schoolId);
    setSelectedSchool(schoolId);
  };

  const handleStaffUpdate = async (staffId, data) => {
    try {
      await schoolService.updateStaffMember(selectedSchool, staffId, data);
      toast({
        title: "Success",
        description: "Staff member updated successfully",
      });
      const response = await schoolService.getSchoolStaff(selectedSchool);
      setStaffList(response);
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
      await schoolService.removeStaffMember(selectedSchool, staffId);
      toast({
        title: "Success",
        description: "Staff member removed successfully",
      });
      const response = await schoolService.getSchoolStaff(selectedSchool);
      setStaffList(response);
    } catch (error) {
      console.error("Error removing staff:", error);
      toast({
        title: "Error",
        description: "Failed to remove staff member",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Staff Management</CardTitle>
          <CardDescription>
            Manage staff members across all schools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            {loading ? (
              <div>Loading schools...</div>
            ) : (
              <>
                <Select
                  value={selectedSchool}
                  onValueChange={handleSchoolChange}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select a school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools && schools.length > 0 ? (
                      schools?.map((school) => (
                        <SelectItem key={school._id} value={school._id}>
                          {school.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No schools available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => setShowAssociateModal(true)}
                  disabled={!selectedSchool}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Staff Member
                </Button>
              </>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">Loading staff...</div>
          ) : selectedSchool ? (
            <StaffList
              loading={loading}
              staff={staffList}
              onUpdate={handleStaffUpdate}
              onRemove={handleStaffRemove}
              canManageStaff={true}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Select a school to manage its staff
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSchool && (
        <AssociateUserModal
          schoolId={selectedSchool}
          open={showAssociateModal}
          onClose={() => setShowAssociateModal(false)}
          onSuccess={async () => {
            const response = await schoolService.getSchoolStaff(selectedSchool);
            setStaffList(response);
          }}
        />
      )}
    </div>
  );
};

export default SuperAdminStaffManagement;
