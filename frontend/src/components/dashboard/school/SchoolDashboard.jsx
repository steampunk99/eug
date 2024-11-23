import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatisticsCards from "./Overview/StatisticsCards";
import ApplicationsManagement from "./Applications/ApplicationsManagement";
import StudentManagement from "./Students/StudentManagement";
import SchoolSettings from "./Settings/SchoolSettings";
import DashboardLayout from "../DashboardLayout";
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { schoolService } from "@/services/schoolService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const TAB_ROUTES = {
  '/dashboard/admin': 'overview',
  '/dashboard/admin/applications': 'applications',
  '/dashboard/admin/students': 'students',
  '/dashboard/admin/settings': 'settings',
  '/dashboard/admin/analytics': 'analytics'
};

export default function SchoolDashboard() {
  const { user } = useAuth();
  console.log('Current user:', user); // Debug log
  
  const location = useLocation();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get active tab from current route
  const activeTab = TAB_ROUTES[location.pathname] || 'overview';

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        console.log('Fetching school data for user:', user); // Debug log
        setLoading(true);
        setError(null);
        
        if (!user) {
          console.log('No user data available'); // Debug log
          throw new Error('No user data available');
        }

        let schoolData;

        // First try to get school by admin ID if user is staff/admin
        if (user.role === 'staff' || user.role === 'admin') {
          try {
            schoolData = await schoolService.getSchoolByAdminId(user.id);
            if (schoolData?.success && schoolData?.school) {
              setSchool(schoolData.school);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.log('Failed to fetch by admin ID, trying school ID...');
          }
        }

        // If no school found by admin ID or user is not admin, try getting by schoolId
        if (user.schoolId) {
          console.log('Fetching school by schoolId:', user.schoolId); // Debug log
          schoolData = await schoolService.getSchoolById(user.schoolId);
          console.log('School data received by ID:', schoolData); // Debug log
          if (schoolData?.success && schoolData?.school) {
            setSchool(schoolData.school);
            setLoading(false);
            return;
          }
        }

        throw new Error('No school found for this user');
      } catch (error) {
        console.error('Failed to fetch school data:', error);
        setError(error.message || 'Failed to load school data');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSchoolData();
    }
  }, [user]);

  // Handle tab changes
  const handleTabChange = (value) => {
    const route = Object.entries(TAB_ROUTES).find(([_, tab]) => tab === value)?.[0];
    if (route) {
      navigate(route);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            {school?.name || 'School Dashboard'}
          </h2>
        </div>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center h-[200px]">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-muted-foreground">Loading school data...</p>
                </div>
              </div>
            ) : (
              <StatisticsCards schoolId={school?._id} key={school?._id} />
            )}
          </TabsContent>
          
          <TabsContent value="applications">
            {loading ? (
              <div className="flex items-center justify-center h-[200px]">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-muted-foreground">Loading school data...</p>
                </div>
              </div>
            ) : (
              <ApplicationsManagement schoolId={school?._id} />
            )}
          </TabsContent>
          
          <TabsContent value="students">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <StudentManagement default schoolId={school?._id} />
            )}
          </TabsContent>
          
          <TabsContent value="settings">
            {loading ? (
              <div className="flex items-center justify-center h-[200px]">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <p className="text-muted-foreground">Loading school data...</p>
                </div>
              </div>
            ) : (
              <SchoolSettings schoolId={school?._id} school={school} />
            )}
          </TabsContent>

          <TabsContent value="analytics">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium">Analytics Dashboard</h3>
              <p className="text-muted-foreground">Coming soon...</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
