import { ScrollArea } from "../../../ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"
import { useEffect, useState } from "react"
import { dashboardService } from "../../../../services/dashboardService"
import { format, formatDistanceToNow } from 'date-fns'

const ACTIVITY_TYPES = {
  login: "logged in",
  logout: "logged out",
  create_user: "created a user",
  update_user: "updated user",
  delete_user: "deleted user",
  update_role: "updated role for",
  create_role: "created role",
  update_permissions: "updated permissions for",
  update_status: "updated status for",
  upload_avatar: "updated avatar for",
  view_profile: "viewed profile of",
  create_application: "created application",
  update_application: "updated application",
  delete_application: "deleted application"
};

export default function ActivityTimeline() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await dashboardService.getRecentActivities();
        setActivities(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Failed to load activities');
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityDescription = (activity) => {
    const actionText = ACTIVITY_TYPES[activity.action] || activity.action;
    const metadata = activity.metadata || {};
    let description = actionText;

    if (metadata.targetName) {
      description += ` ${metadata.targetName}`;
    }

    return description;
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recent Activity</h2>
          <p className="text-muted-foreground">
            Here's what's been happening in your system
          </p>
        </div>
      </div>
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading activities...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-destructive">{error}</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">No recent activities</p>
          </div>
        ) : (
          <div className="space-y-8">
            {activities.map((activity, index) => (
              <div key={activity._id || index} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={activity.performedBy?.avatar} alt="Avatar" />
                  <AvatarFallback>{activity.performedBy?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <span className="font-semibold text-amber-500 ">{activity.performedBy?.name || 'Unknown User'}</span>{" "}
                    {getActivityDescription(activity)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.createdAt ? (
                      <span title={format(new Date(activity.createdAt), 'PPpp')}>
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </span>
                    ) : 'Unknown time'}
                  </p>
                  {activity.details && (
                    <p className="text-sm text-emerald-500 mt-1">
                      {activity.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
