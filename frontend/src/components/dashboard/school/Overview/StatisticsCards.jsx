import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, XCircle, Clock, TrendingUp } from "lucide-react";
import { schoolService } from '@/services/schoolService';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

const cardStyles = {
  total: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10",
  approved: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10",
  rejected: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10",
  pending: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10"
};

const iconStyles = {
  total: "text-blue-500 dark:text-blue-400",
  approved: "text-green-500 dark:text-green-400",
  rejected: "text-red-500 dark:text-red-400",
  pending: "text-orange-500 dark:text-orange-400"
};

export default function StatisticsCards({ schoolId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log('Fetching stats for school ID:', schoolId);
        setLoading(true);
        setError(null);
        const data = await schoolService.getSchoolDashboardStats(schoolId);
        console.log('Received dashboard stats:', data);
        
        if (!data) {
          console.log('No data received from server');
          throw new Error('No data received from server');
        }

        // Format stats from status distribution
        const formattedStats = {
          total: data.data.totalApplications || 0,
          approved: data.data.statusDistribution?.Approved || 0,
          rejected: data.data.statusDistribution?.Rejected || 0,
          pending: data.data.statusDistribution?.Pending || 0
        };
        
        console.log('Setting formatted stats:', formattedStats);
        setStats(formattedStats);
        
        // Format trends data for charts
        if (data.data.applicationTrends && Array.isArray(data.data.applicationTrends)) {
          console.log('Raw trends data:', data.data.applicationTrends);
          const formattedChartData = data.data.applicationTrends.map(item => ({
            date: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
            totalApplications: item.total || 0,
            approvedApplications: item.approved || 0,
            rejectedApplications: item.rejected || 0,
            pendingApplications: item.pending || 0
          }));
          console.log('Formatted chart data:', formattedChartData);
          setChartData(formattedChartData);
        } else {
          console.log('No chart data available or invalid format');
          setChartData([]); // Set empty array as fallback
        }
      } catch (error) {
        console.error('Error details:', error);
        setError(error.message || 'Failed to load statistics');
      } finally {
        console.log('Finished loading, setting loading state to false');
        setLoading(false);
      }
    };

    if (schoolId) {
      console.log('School ID available, initiating fetch');
      fetchStats();
    } else {
      console.log('No school ID available');
    }
  }, [schoolId]);

  if (loading) {
    return <div className="animate-pulse space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="h-32">
            <div className="h-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          </Card>
        ))}
      </div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4 bg-red-100 dark:bg-red-900/20 rounded-lg">Error: {error}</div>;
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Applications Card */}
        <Card className={cardStyles.total}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Users className={`h-4 w-4 ${iconStyles.total}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <Area type="monotone" dataKey="totalApplications" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Approved Applications Card */}
        <Card className={cardStyles.approved}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className={`h-4 w-4 ${iconStyles.approved}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved || 0}</div>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <Area type="monotone" dataKey="approvedApplications" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Rejected Applications Card */}
        <Card className={cardStyles.rejected}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className={`h-4 w-4 ${iconStyles.rejected}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected || 0}</div>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <Area type="monotone" dataKey="rejectedApplications" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Pending Applications Card */}
        <Card className={cardStyles.pending}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className={`h-4 w-4 ${iconStyles.pending}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending || 0}</div>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <Area type="monotone" dataKey="pendingApplications" stroke="#f97316" fill="#f97316" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Application Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="totalApplications" name="Total" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="approvedApplications" name="Approved" stackId="2" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                <Area type="monotone" dataKey="rejectedApplications" name="Rejected" stackId="2" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                <Area type="monotone" dataKey="pendingApplications" name="Pending" stackId="2" stroke="#f97316" fill="#f97316" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
