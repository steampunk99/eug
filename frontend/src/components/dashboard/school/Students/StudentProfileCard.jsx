import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from 'date-fns';
import {
    Book,
    GraduationCap,
    History,
    FileText,
    Phone,
    Mail,
    MapPin,
    User,
    Calendar,
    Activity,
    AlertCircle,
    DollarSign
} from 'lucide-react';

export default function StudentProfileCard({ student }) {
    const getStatusColor = (status) => {
        const colors = {
            'Active': 'bg-green-500/15 text-green-700 hover:bg-green-500/25',
            'Graduated': 'bg-blue-500/15 text-blue-700 hover:bg-blue-500/25',
            'Withdrawn': 'bg-red-500/15 text-red-700 hover:bg-red-500/25',
            'Suspended': 'bg-orange-500/15 text-orange-700 hover:bg-orange-500/25'
        };
        return colors[status] || 'bg-gray-500/15 text-gray-700 hover:bg-gray-500/25';
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return format(new Date(date), 'PPP');
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="academic">Academic</TabsTrigger>
                        <TabsTrigger value="activities">Activities</TabsTrigger>
                        <TabsTrigger value="documents">Documents</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview">
                        <div className="space-y-6">
                            {/* Header with Avatar */}
                            <div className="flex items-start gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={student.user?.avatar} />
                                    <AvatarFallback>
                                        {student.user?.name
                                            ? student.user?.name.charAt(0).toUpperCase()
                                            : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold">{student?.name} {student.user?.lastName}</h2>
                                            <p className="text-gray-500">Admission No: {student.admissionNumber}</p>
                                        </div>
                                        <Badge className={getStatusColor(student.studentStatus)}>
                                            {student.studentStatus}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Personal Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <span>{student.user?.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                            <span>{student.user?.phoneNumber || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span>{student.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span>DOB: {formatDate(student.dateOfBirth)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <span>Gender: {student.gender}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Guardian Information */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">Guardian Information</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-500" />
                                            <span>{student.guardian?.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-gray-500" />
                                            <span>{student.guardian?.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-500" />
                                            <span>{student.guardian?.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span>{student.guardian?.address || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Medical Information */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Medical Information</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Blood Group</p>
                                        <p>{student.medicalInfo?.bloodGroup || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Allergies</p>
                                        <p>{student.medicalInfo?.allergies?.join(', ') || 'None'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Academic Tab */}
                    <TabsContent value="academic">
                        <div className="space-y-6">
                            {/* Current Academic Info */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="p-4 border rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <GraduationCap className="h-5 w-5 text-blue-500" />
                                        <h3 className="font-semibold">Class</h3>
                                    </div>
                                    <p>{student.class} {student.stream}</p>
                                </div>
                            </div>

                            {/* Academic Records */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Academic Records</h3>
                                {student.academicRecords?.map((record, index) => (
                                    <Card key={index} className="p-4">
                                        <div className="flex justify-between mb-4">
                                            <h4 className="font-semibold">{record.term} - {record.year}</h4>
                                            <div className="text-sm text-gray-500">
                                                Attendance: {record.attendance?.present || 0}/{
                                                    (record.attendance?.present || 0) + 
                                                    (record.attendance?.absent || 0) + 
                                                    (record.attendance?.excused || 0)
                                                } days
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 gap-4">
                                            {record.subjects?.map((subject, idx) => (
                                                <div key={idx} className="text-sm">
                                                    <p className="font-medium">{subject.name}</p>
                                                    <p className="text-gray-500">Score: {subject.score}</p>
                                                    <p className="text-gray-500">Grade: {subject.grade}</p>
                                                </div>
                                            ))}
                                        </div>
                                        {record.classTeacherRemarks && (
                                            <p className="mt-4 text-sm text-gray-600">
                                                Teacher's Remarks: {record.classTeacherRemarks}
                                            </p>
                                        )}
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    {/* Activities Tab */}
                    <TabsContent value="activities">
                        <div className="space-y-6">
                            {/* Extra-curricular Activities */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Extra-curricular Activities</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {student.activities?.map((activity, index) => (
                                        <Card key={index} className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h4 className="font-semibold">{activity.name}</h4>
                                                    <p className="text-sm text-gray-500">{activity.role}</p>
                                                </div>
                                                <Badge>
                                                    {formatDate(activity.period?.start)} - {
                                                        activity.period?.end ? formatDate(activity.period.end) : 'Present'
                                                    }
                                                </Badge>
                                            </div>
                                            {activity.achievements?.length > 0 && (
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium">Achievements:</p>
                                                    <ul className="list-disc list-inside text-sm text-gray-600">
                                                        {activity.achievements.map((achievement, idx) => (
                                                            <li key={idx}>{achievement}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            {/* Disciplinary Records */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Disciplinary Records</h3>
                                <div className="space-y-4">
                                    {student.disciplinaryRecords?.map((record, index) => (
                                        <Card key={index} className="p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <AlertCircle className="h-5 w-5 text-orange-500" />
                                                        <h4 className="font-semibold">{record.incident}</h4>
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-2">{record.action}</p>
                                                </div>
                                                <Badge className={
                                                    record.status === 'Resolved' ? 'bg-green-500/15 text-green-700' :
                                                    record.status === 'Pending' ? 'bg-yellow-500/15 text-yellow-700' :
                                                    'bg-red-500/15 text-red-700'
                                                }>
                                                    {record.status}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-2">
                                                Date: {formatDate(record.date)}
                                            </p>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* Documents Tab */}
                    <TabsContent value="documents">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                {student.documents?.map((doc, index) => (
                                    <Card key={index} className="p-4">
                                        <div className="flex items-start gap-4">
                                            <FileText className="h-8 w-8 text-blue-500" />
                                            <div className="flex-1">
                                                <h4 className="font-semibold">{doc.name}</h4>
                                                <p className="text-sm text-gray-500">{doc.type}</p>
                                                <p className="text-sm text-gray-500">
                                                    Uploaded: {formatDate(doc.uploadedAt)}
                                                </p>
                                            </div>
                                            <a 
                                                href={doc.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-700 text-sm"
                                            >
                                                View
                                            </a>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
