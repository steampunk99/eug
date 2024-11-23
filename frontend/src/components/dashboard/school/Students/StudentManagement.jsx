import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import StudentProfileCard from './StudentProfileCard';
import { format } from 'date-fns';
import { Search, Plus, Filter } from 'lucide-react';
import studentService from '@/services/studentService';
import { useToast } from "@/components/ui/use-toast"

export default function StudentManagement({ schoolId }) {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterClass, setFilterClass] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const {toast} = useToast()

    useEffect(() => {
        if (schoolId) {
            fetchStudents();
        }
    }, [schoolId]);

    const fetchStudents = async () => {
        try {
            console.log('Fetching students for school:', schoolId);
            setLoading(true);
            const response = await studentService.getStudents(schoolId);
            console.log('API Response:', response);
            
            if (response.success && Array.isArray(response.data)) {
                console.log('Processing enrollments:', response.data);
                
                const processedStudents = response.data
                    .filter(enrollment => enrollment.student && enrollment.student.user)
                    .map(enrollment => ({
                        id: enrollment.student._id,
                        name: enrollment.student.user.name,
                        email: enrollment.student.user.email,
                        phone: enrollment.student.user.phoneNumber,
                        class: enrollment.student.class,
                        stream: enrollment.student.stream,
                        admissionNumber: enrollment.student.admissionNumber,
                        enrollmentId: enrollment._id,
                        enrollmentDate: enrollment.enrollmentDate,
                        studentStatus: enrollment.studentStatus
                    }));
                
                console.log('Processed students:', processedStudents);
                setStudents(processedStudents);
            } else {
                console.error('Invalid response format:', response);
                setStudents([]);
                toast({
                    title: "Error",
                    description: "Failed to load students - invalid data format",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            setStudents([]); 
            toast({
                title: "Error",
                description: error.response?.data?.message || "Failed to fetch students",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClassFilter = (value) => {
        setFilterClass(value);
    };

    const handleStatusFilter = (value) => {
        setFilterStatus(value);
    };

    const filteredStudents = students.filter(student => {
        const matchesSearch = 
            student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesClass = filterClass === 'all' || student.class === filterClass;
        const matchesStatus = filterStatus === 'all' || student.studentStatus === filterStatus;

        return matchesSearch && matchesClass && matchesStatus;
    });

    const getStatusColor = (status) => {
        const colors = {
            'Active': 'bg-green-500/15 text-green-700',
            'Graduated': 'bg-blue-500/15 text-blue-700',
            'Withdrawn': 'bg-red-500/15 text-red-700',
            'Suspended': 'bg-orange-500/15 text-orange-700'
        };
        return colors[status] || 'bg-gray-500/15 text-gray-700';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Students</h2>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-8"
                        />
                    </div>
                </div>
                <Select value={filterClass} onValueChange={handleClassFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Classes</SelectItem>
                        <SelectItem value="S1">S1</SelectItem>
                        <SelectItem value="S2">S2</SelectItem>
                        <SelectItem value="S3">S3</SelectItem>
                        <SelectItem value="S4">S4</SelectItem>
                        <SelectItem value="S5">S5</SelectItem>
                        <SelectItem value="S6">S6</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={handleStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Graduated">Graduated</SelectItem>
                        <SelectItem value="Withdrawn">Withdrawn</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Student List and Profile View */}
            <div className="grid grid-cols-12 gap-6">
                {/* Student List */}
                <Card className="col-span-5">
                    <ScrollArea className="h-[calc(100vh-280px)]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.map((student) => (
                                    <TableRow
                                        key={student.id}
                                        className={`cursor-pointer ${
                                            selectedStudent?.id === student.id ? 'bg-muted' : ''
                                        }`}
                                        onClick={() => setSelectedStudent(student)}
                                    >
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {student.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {student.admissionNumber}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {student.class} {student.stream}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(student.studentStatus)}>
                                                {student.studentStatus}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </Card>

                {/* Student Profile */}
                <div className="col-span-7">
                    {selectedStudent ? (
                        <StudentProfileCard student={selectedStudent} />
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            Select a student to view their profile
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}