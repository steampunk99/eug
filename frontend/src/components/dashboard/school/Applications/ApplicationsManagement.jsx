import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { schoolService } from '@/services/schoolService';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal,Loader2, FileDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from 'date-fns';
import ApplicationTimeline from './ApplicationTimeline';
import InterviewScheduler from './InterviewScheduler';
import { useToast } from '@/components/ui/use-toast';

export default function ApplicationsManagement({ schoolId: propSchoolId }) {
  const { schoolId: paramSchoolId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {toast} = useToast()
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1,
    limit: 10
  });

  // Use propSchoolId if available, otherwise use paramSchoolId
  const finalSchoolId = propSchoolId || paramSchoolId;

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };

  // Fetch applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!finalSchoolId) {
          setError('No school selected');
          return;
        }

        const response = await schoolService.getSchoolApplications(finalSchoolId, filters);
        console.log('Raw API Response:', response); // Debug log
        
        if (!response.success || !response.data) {
          throw new Error('Invalid response format from server');
        }

        setApplications(response.data.applications || []);
        setPagination({
          total: response.data.pagination.total || 0,
          pages: response.data.pagination.pages || 0,
          currentPage: response.data.pagination.page || 1,
          limit: response.data.pagination.limit || 10
        });
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        setError(error.message || 'Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [finalSchoolId, filters]);

  if (!finalSchoolId) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <p className="text-muted-foreground">Loading school data...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[200px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  // Handle status update
  const handleStatusUpdate = async (applicationId, newStatus) => {
    try {
      setLoading(true);
      await schoolService.updateApplicationStatus(finalSchoolId, applicationId, newStatus);
      
      // Refresh applications list
      const response = await schoolService.getSchoolApplications(finalSchoolId, filters);
      if (!response.success || !response.data) {
        throw new Error('Failed to refresh applications');
      }
      
      setApplications(response.data.applications || []);
      setPagination({
        total: response.data.pagination.total || 0,
        pages: response.data.pagination.pages || 0,
        currentPage: response.data.pagination.page || 1,
        limit: response.data.pagination.limit || 10
      });

      // Show success toast
      toast({
        title: "Status Updated",
        description: `Application status has been updated to ${newStatus}`,
        variant: "success",
      });
    } catch (err) {
      console.error('Error updating application status:', err);
      // Show error toast
      toast({
        title: "Error",
        description: err.message || "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle batch status update
  const handleBatchStatusUpdate = async (status) => {
    if (!selectedApplications.length) {
      toast({
        title: "No Applications Selected",
        description: "Please select applications to update",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Process each application update sequentially
      await Promise.all(selectedApplications.map(async (applicationId) => {
        await schoolService.updateApplicationStatus(finalSchoolId, applicationId, status);
      }));

      // Refresh the applications list
      const response = await schoolService.getSchoolApplications(finalSchoolId, filters);
      if (response.data) {
        setApplications(response.data.applications || []);
      }

      setSelectedApplications([]);
      
      toast({
        title: "Batch Update Complete",
        description: `Selected applications have been ${status.toLowerCase()}`,
        variant: "success",
      });
    } catch (err) {
      console.error('Error in batch update:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (file) => {
    try {
      await schoolService.uploadApplicationDocument(finalSchoolId, selectedApplication._id, file, {
        type: file.type,
        name: file.name
      });
      // Refresh application details
      const data = await schoolService.getApplicationDetails(finalSchoolId, selectedApplication._id);
      setSelectedApplication(data);
    } catch (err) {
      console.error('Error uploading document:', err);
    }
  };

  // View application details
  const viewApplicationDetails = async (applicationId) => {
    try {
      const data = await schoolService.getApplicationDetails(finalSchoolId, applicationId);
      setSelectedApplication(data);
    } catch (err) {
      console.error('Error fetching application details:', err);
    }
  };

  // Handle export
  const handleExport = async () => {
    try {
      setLoading(true);
      await schoolService.exportApplicationsToExcel(finalSchoolId, {
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      
      toast({
        title: "Export Successful",
        description: "Applications have been exported to Excel",
        variant: "success",
      });
    } catch (err) {
      console.error('Error exporting applications:', err);
      toast({
        title: "Export Failed",
        description: err.message || "Failed to export applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Batch Actions */}
      {selectedApplications.length > 0 && (
        <div className="bg-muted p-4 rounded-lg flex items-center justify-between">
          <p>{selectedApplications.length} applications selected</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleBatchStatusUpdate('Approved')}
            >
              Approve Selected
            </Button>
            <Button
              variant="outline"
              onClick={() => handleBatchStatusUpdate('Rejected')}
            >
              Reject Selected
            </Button>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          {/* Status Filter */}
          <Select
            value={filters.status}
            onValueChange={(value) => handleFilterChange('status', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export Button */}
        <Button
          onClick={handleExport}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileDown className="h-4 w-4" />
          )}
          Export to Excel
        </Button>
      </div>

      {/* Applications Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox
                checked={selectedApplications.length === applications.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedApplications(applications.map(app => app._id));
                  } else {
                    setSelectedApplications([]);
                  }
                }}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date Applied</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Interview Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((application) => (
            <TableRow key={application._id}>
              <TableCell>
                <Checkbox
                  checked={selectedApplications.includes(application._id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedApplications([...selectedApplications, application._id]);
                    } else {
                      setSelectedApplications(selectedApplications.filter(id => id !== application._id));
                    }
                  }}
                />
              </TableCell>
              <TableCell>{application.personalInfo.name}</TableCell>
              <TableCell>{format(new Date(application.createdAt), 'PP')}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  application.applicationStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                  application.applicationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.applicationStatus}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  application.payment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.payment.status}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  application.interview?.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  application.interview?.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {application.interview?.status || 'Not Scheduled'}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => viewApplicationDetails(application._id)}
                  >
                    View
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(application._id, 'Approved')}
                        disabled={application.payment.status !== 'Completed' || application.applicationStatus === 'Approved'}
                        className={application.applicationStatus === 'Approved' ? 'text-green-600' : ''}
                      >
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(application._id, 'Rejected')}
                        disabled={application.payment.status !== 'Completed' || application.applicationStatus === 'Rejected'}
                        className={application.applicationStatus === 'Rejected' ? 'text-red-600' : ''}
                      >
                        Reject
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusUpdate(application._id, 'Pending')}
                        disabled={application.payment.status !== 'Completed' || application.applicationStatus === 'Pending'}
                        className={application.applicationStatus === 'Pending' ? 'text-yellow-600' : ''}
                      >
                        Mark as Pending
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <div>
          Showing {applications.length} of {pagination.total} applications
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}
            disabled={filters.page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}
            disabled={filters.page === pagination.pages}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Application Details Dialog */}
      <Dialog
        open={!!selectedApplication}
        onOpenChange={() => setSelectedApplication(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <div className="space-y-6">
              {/* Personal and Academic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Personal Information</h3>
                  <p>Name: {selectedApplication.personalInfo.name}</p>
                  <p>Date of Birth: {format(new Date(selectedApplication.personalInfo.dateOfBirth), 'PP')}</p>
                  <p>Gender: {selectedApplication.personalInfo.gender}</p>
                  <p>Address: {selectedApplication.personalInfo.address}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Academic Information</h3>
                  <p>Previous School: {selectedApplication.academicInfo.previousSchool}</p>
                  <p>Grades: {selectedApplication.academicInfo.grades}</p>
                </div>
              </div>
              
              {/* Essay Answer */}
              {selectedApplication.essayAnswer && (
                <div>
                  <h3 className="font-semibold">Essay Answer</h3>
                  <p>{selectedApplication.essayAnswer}</p>
                </div>
              )}

              {/* Payment Information */}
              <div>
                <h3 className="font-semibold">Payment Information</h3>
                <p>Status: {selectedApplication.payment.status}</p>
                <p>Amount: UGX {selectedApplication.payment.amount}</p>
                {selectedApplication.payment.transactionId && (
                  <p>Transaction ID: {selectedApplication.payment.transactionId}</p>
                )}
                {selectedApplication.payment.paymentMethod && (
                  <p>Payment Method: {selectedApplication.payment.paymentMethod}</p>
                )}
              </div>

              {/* Documents */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Documents</h3>
                  <Input
                    type="file"
                    onChange={(e) => handleDocumentUpload(e.target.files[0])}
                    className="max-w-xs"
                  />
                </div>
                <div className="space-y-2">
                  {selectedApplication.documents?.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Uploaded on {format(new Date(doc.uploadedAt), 'PP')}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(doc.url, '_blank')}
                      >
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interview Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Interview</h3>
                  {!selectedApplication.interview?.scheduled && (
                    <InterviewScheduler
                      applicationId={selectedApplication._id}
                      onScheduled={() => viewApplicationDetails(selectedApplication._id)}
                    />
                  )}
                </div>
                {selectedApplication.interview?.scheduled && (
                  <div className="space-y-2">
                    <p>Status: {selectedApplication.interview.status}</p>
                    <p>Date & Time: {format(new Date(selectedApplication.interview.dateTime), 'PPp')}</p>
                    <p>Location: {selectedApplication.interview.location}</p>
                    {selectedApplication.interview.notes && (
                      <p>Notes: {selectedApplication.interview.notes}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Timeline */}
              <ApplicationTimeline timeline={selectedApplication.timeline} />
            </div>
          )}
        </DialogContent>
      </Dialog>
     
    </div>
  );
}
