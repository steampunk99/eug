import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { schoolService } from "@/services/schoolService";
import { useAuth } from "@/context/AuthContext";
import DashboardLayout from "../../DashboardLayout";

export default function SchoolVerification() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const data = await schoolService.getSchools({
        sort: "-createdAt",
        select: "name,location,type,category,metadata",
      });
      setSchools(data.docs || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch schools",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (schoolId, currentStatus) => {
    try {
      await schoolService.updateSchool(schoolId, {
        'metadata.isVerified': !currentStatus
      });

      // Update local state
      setSchools((prevSchools) =>
        prevSchools.map((school) =>
          school._id === schoolId
            ? {
                ...school,
                metadata: {
                  ...school.metadata,
                  isVerified: !currentStatus,
                },
              }
            : school
        )
      );

      toast({
        title: "Success",
        description: `School ${!currentStatus ? "verified" : "unverified"} successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive",
      });
    }
  };

  return (

    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">School Verification</h2>
      </div>
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>School Verification Management</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schools.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No schools found
                      </TableCell>
                    </TableRow>
                  ) : (
                    schools.map((school) => (
                      <TableRow key={school._id}>
                        <TableCell className="font-medium">{school.name}</TableCell>
                        <TableCell>
                          {school.location.district}, {school.location.region}
                        </TableCell>
                        <TableCell>{school.type}</TableCell>
                        <TableCell>{school.category}</TableCell>
                        <TableCell>
                          <Badge
                            variant={school.metadata.isVerified ? "success" : "secondary"}
                          >
                            {school.metadata.isVerified ? "Verified" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={school.metadata.isVerified ? "destructive" : "default"}
                            size="sm"
                            onClick={() =>
                              toggleVerification(school._id, school.metadata.isVerified)
                            }
                          >
                            {school.metadata.isVerified ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Unverify
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Verify
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>

  );
}
