import { format } from 'date-fns';
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  FileText,
  Mail
} from 'lucide-react';
import DashboardLayout from "../../DashboardLayout";

const getStatusIcon = (status) => {
  switch (status) {
    case 'Approved':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Rejected':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'Interview Scheduled':
      return <Calendar className="h-4 w-4 text-blue-500" />;
    case 'Document Added':
      return <FileText className="h-4 w-4 text-purple-500" />;
    case 'Email Sent':
      return <Mail className="h-4 w-4 text-indigo-500" />;
    default:
      return <Clock className="h-4 w-4 text-yellow-500" />;
  }
};

export default function ApplicationTimeline({ timeline = [] }) {
  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <h3 className="font-semibold text-lg">Application Timeline</h3>
        <div className="space-y-6">
          {timeline.map((event, index) => (
            <div key={index} className="flex gap-4">
              <div className="mt-1">
                {getStatusIcon(event.status)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">{event.status}</p>
                  <time className="text-sm text-muted-foreground">
                    {format(new Date(event.timestamp), 'PPp')}
                  </time>
                </div>
                {event.comment && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {event.comment}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
