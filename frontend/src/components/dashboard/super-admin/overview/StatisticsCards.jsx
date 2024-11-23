import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card"
import { School, Users, GraduationCap, Activity, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"
import { dashboardService } from "../../../../services/dashboardService"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const cardStyles = {
  schools: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10",
  students: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10",
  admins: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10",
  active: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-900/10"
};

const iconStyles = {
  schools: "text-purple-500 dark:text-purple-400",
  students: "text-blue-500 dark:text-blue-400",
  admins: "text-emerald-500 dark:text-emerald-400",
  active: "text-amber-500 dark:text-amber-400"
};

export default function StatisticsCards() {
  const [stats, setStats] = useState({
    totalSchools: 0,
    totalStudents: 0,
    totalAdmins: 0,
    activeUsers: 0,
    schoolsChange: 0,
    studentsChange: 0,
    adminsChange: 0,
    activeChange: 0,
    trends: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardService.getStatistics();
        setStats(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="h-32">
              <div className="h-full bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className={cardStyles.schools}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <School className={`h-4 w-4 ${iconStyles.schools}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchools}</div>
            <p className={`text-xs ${stats.schoolsChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {stats.schoolsChange > 0 ? "+" : ""}{stats.schoolsChange} from last month
            </p>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.trends}>
                  <Area type="monotone" dataKey="schools" stroke="#9333ea" fill="#9333ea" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className={cardStyles.students}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <GraduationCap className={`h-4 w-4 ${iconStyles.students}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className={`text-xs ${stats.studentsChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {stats.studentsChange > 0 ? "+" : ""}{stats.studentsChange}% from last month
            </p>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.trends}>
                  <Area type="monotone" dataKey="students" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className={cardStyles.admins}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
            <Users className={`h-4 w-4 ${iconStyles.admins}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            <p className={`text-xs ${stats.adminsChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {stats.adminsChange > 0 ? "+" : ""}{stats.adminsChange} from last month
            </p>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.trends}>
                  <Area type="monotone" dataKey="admins" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className={cardStyles.active}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className={`h-4 w-4 ${iconStyles.active}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className={`text-xs ${stats.activeChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {stats.activeChange > 0 ? "+" : ""}{stats.activeChange}% from last hour
            </p>
            <div className="mt-4 h-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.trends}>
                  <Area type="monotone" dataKey="active" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-amber-500" />
            System Growth Trends
          </CardTitle>
          <p className="text-xs font-medium mt-1 ml-auto text-emerald-500">
            Last 7 days
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.trends}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line type="monotone" dataKey="schools" name="Schools" stroke="#9333ea" strokeWidth={2} />
                <Line type="monotone" dataKey="students" name="Students" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="admins" name="Admins" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="active" name="Active Users" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
