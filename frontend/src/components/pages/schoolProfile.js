import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Mail, Building2, Clock, BookOpen, Phone, Globe, Users, GraduationCap, Award, Calendar, ImageIcon, X, Trophy } from 'lucide-react';
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import axios from 'axios';
import Header from "./Header"
import svgImage from '../../assets/badge.svg'
import ApplyButton from './ApplyButton';
import AddSchoolImagesForm from '../dashboard/AddSchoolImagesForm';

const SchoolProfile = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [facilities, setFacilities] = useState([]);
  const [admissionOpen, setAdmissionOpen] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/schools/${id}`);
        if (response.data.success) {
          setSchool(response.data.data);
          // Check if admissions are open based on dates
          const now = new Date();
          const admissionStart = new Date(response.data.data.admissions?.startDate);
          const admissionEnd = new Date(response.data.data.admissions?.endDate);
          setAdmissionOpen(now >= admissionStart && now <= admissionEnd);
          
          // Set facilities if available
          if (response.data.data.facilities) {
            setFacilities(response.data.data.facilities);
          }
        } else {
          setError(response.data.message || 'Failed to fetch school data');
        }
      } catch (error) {
        console.error('Error details:', error.response || error);
        setError(
          error.response?.data?.message || 
          error.message || 
          'An error occurred while fetching school data'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSchoolData();
    }
  }, [id]);

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading school information...</p>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              {error || "Failed to load school information"}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/95">
      <Header/>
      <div className="bg-gradient-to-r from-slate-50 via-slate-100 to-slate-200 dark:from-gray-900/50 dark:via-gray-900/30 dark:to-gray-900/50 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-lg border-2 border-indigo-100/50">
              <img 
                src={school.media.logo || "/api/placeholder/80/80"} 
                alt={`${school.name} logo`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className='flex items-center gap-2'>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200">
                  {school.name}
                </h1>
                {school.metadata.isVerified && (
                  <Badge className="border-0" variant="secondary">
                    <span className="flex items-center gap-2 p-1">
                      <img src={svgImage} alt="Verified" className="w-4 h-4" />
                      Verified
                    </span>
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300 border-0">
                  {school.type}
                </Badge>
                <Badge variant="outline" className="border-violet-200 text-violet-600 dark:border-violet-400/20 dark:text-violet-300">
                  {school.category}
                </Badge>
                {school.curriculum?.map(curr => (
                   <Badge key={curr} variant="outline" className="border-blue-200 text-blue-600 dark:border-blue-400/20 dark:text-blue-300">
                     {curr}
                   </Badge>
                ))}
              </div>
            </div>
            <Button className="bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-md hover:shadow-lg transition-all duration-200 border-0">
              Apply Now
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="overview" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-white dark:bg-gray-900 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
            {["overview", "programs", "facilities", "gallery", "admissions"].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-750 data-[state=active]:to-blue-950 
                          data-[state=active]:text-indigo-700 dark:data-[state=active]:from-indigo-950 dark:data-[state=active]:to-blue-950 
                          dark:data-[state=active]:text-indigo-300 capitalize"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2  shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-indigo-500" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200">
                      School Overview
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                          <p className="text-lg font-semibold text-secondary-foreground">{school.stats.studentCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Teaching Staff</p>
                          <p className="text-lg font-semibold text-secondary-foreground">{school.stats.teacherCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Average Class Size</p>
                          <p className="text-lg font-semibold text-secondary-foreground">{school.stats.classSize} students</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Location</p>
                          <p className="text-lg font-semibold text-secondary-foreground">{school.location.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">School Hours</p>
                          <p className="text-lg font-semibold text-secondary-foreground">8:00 AM - 4:30 PM</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 " />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Email</p>
                          <a 
                            href={`mailto:${school.contact.email}`}
                            className="text-lg font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          >
                            {school.contact.email}
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5" />
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Phone</p>
                          <a 
                            href={`tel:${school.contact.phone}`}
                            className="text-lg font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                          >
                            {school.contact.phone}
                          </a>
                        </div>
                      </div>
                      {school.contact.website && (
                        <div className="flex items-center gap-3">
                          <Globe className="w-5 h-5 " />
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Website</p>
                            <a 
                              href={school.contact.website.startsWith('http') ? school.contact.website : `https://${school.contact.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lg font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
                            >
                              {school.contact.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-secondary-foreground'>UCE Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Division 1</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{school.performance.UCE.div1Count}</span>
                        <Badge variant="secondary">
                          {Math.round((school.performance.UCE.div1Count / school.stats.studentCount) * 100)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Division 2</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{school.performance.UCE.div2Count}</span>
                        <Badge variant="secondary">
                          {Math.round((school.performance.UCE.div2Count / school.stats.studentCount) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className='text-secondary-foreground'>UACE Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Above 18 points</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{school.performance.UACE.div1Count}</span>
                        <Badge variant="secondary">
                          {Math.round((school.performance.UACE.div1Count / school.stats.studentCount) * 100)}%
                        </Badge>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Below 10 points</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{school.performance.UACE.div2Count}</span>
                        <Badge variant="secondary">
                          {Math.round((school.performance.UACE.div2Count / school.stats.studentCount) * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="programs" className="bg-background/95 text-foreground">
            <div className="grid gap-6">
              {/* Curriculum Levels Section */}
              <Card className="shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-500" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200">
                      Academic Programs
                    </span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Comprehensive education pathways offered at {school.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-8">
                    {school.curriculum?.map((level) => (
                      <div key={level} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-blue-600"></div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{level}</h3>
                        </div>
                        
                        <div className="ml-4 space-y-6">
                          <div>
                            <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                              Available Subjects
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {level === 'O-Level' && school.subjects?.oLevel?.map((subject, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 
                                           hover:border-indigo-300 dark:hover:border-indigo-700
                                           text-gray-700 dark:text-gray-300 hover:text-indigo-600 
                                           dark:hover:text-indigo-400 bg-white dark:bg-gray-900 
                                           hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                                >
                                  {subject}
                                </Badge>
                              ))}
                              {level === 'A-Level' && school.subjects?.aLevel?.map((subject, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 
                                           hover:border-indigo-300 dark:hover:border-indigo-700
                                           text-gray-700 dark:text-gray-300 hover:text-indigo-600 
                                           dark:hover:text-indigo-400 bg-white dark:bg-gray-900 
                                           hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                                >
                                  {subject}
                                </Badge>
                              ))}
                              {level === 'Cambridge' && school.subjects?.cambridge?.map((subject, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="px-3 py-1.5 border border-gray-200 dark:border-gray-700 
                                           hover:border-indigo-300 dark:hover:border-indigo-700
                                           text-gray-700 dark:text-gray-300 hover:text-indigo-600 
                                           dark:hover:text-indigo-400 bg-white dark:bg-gray-900 
                                           hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200"
                                >
                                  {subject}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {school.programDetails?.[level] && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                                Program Details
                              </h4>
                              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {Object.entries(school.programDetails[level]).map(([key, value]) => (
                                  <div 
                                    key={key}
                                    className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 
                                             hover:border-indigo-100 dark:hover:border-indigo-900
                                             bg-white dark:bg-gray-900 shadow-sm hover:shadow-md
                                             transition-all duration-200"
                                  >
                                    <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 capitalize">
                                      {key.replace(/_/g, ' ')}
                                    </h5>
                                    <p className="text-gray-900 dark:text-gray-100">
                                      {value}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Extra-Curricular Section */}
              {school.extraCurricular && (
                <Card className="shadow-sm hover:shadow-md transition-all duration-200">
                  <CardHeader className="border-b border-gray-100 dark:border-gray-800">
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" />
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-200">
                        Extra-Curricular Activities
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {school.extraCurricular.map((activity) => (
                        <div 
                          key={activity.name}
                          className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 
                                   hover:border-amber-100 dark:hover:border-amber-900
                                   bg-white dark:bg-gray-900
                                   transition-all duration-200"
                        >
                          <h4 className="text-gray-900 dark:text-gray-100 font-medium mb-1">
                            {activity.name}
                          </h4>
                          {activity.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {activity.description}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          <TabsContent value="facilities" className="bg-background/95 text-foreground">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-amber-600" />
                  School Facilities
                </CardTitle>
                <CardDescription>
                  Explore our state-of-the-art facilities and amenities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {facilities.map((facility, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg border">
                      {facility.icon && (
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <img src={facility.icon} alt={facility.name} className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-foreground">{facility.name}</h4>
                        <p className="text-sm text-muted-foreground">{facility.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admissions" className="bg-background/95 text-foreground">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Admission Information
                </CardTitle>
                <CardDescription>
                  Important dates and requirements for admission
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Application Deadline</h4>
                      <p className="text-sm text-muted-foreground">
                        {school.admissions?.applicationDeadline ? 
                          new Date(school.admissions.applicationDeadline).toLocaleDateString() :
                          'Not specified'
                        }
                      </p>
                      
                      <h4 className="font-semibold mb-2 mt-4">Available Spots</h4>
                      {school.admissions?.availableSpots && (
                        <div className="space-y-2">
                          {school.admissions.availableSpots.dayStudents && (
                            <p className="text-sm text-muted-foreground">
                              Day Students: {school.admissions.availableSpots.dayStudents}
                            </p>
                          )}
                          {school.admissions.availableSpots.boardingStudents && (
                            <p className="text-sm text-muted-foreground">
                              Boarding Students: {school.admissions.availableSpots.boardingStudents}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Requirements</h4>
                      <ul className="list-disc list-inside space-y-2">
                        {school.admissions?.requirements?.map((req, index) => (
                          <li key={index} className="text-muted-foreground">
                            {req.name} {req.required && <Badge variant="secondary">Required</Badge>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">Term Dates</h4>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {school.admissions?.termDates?.map((term, index) => (
                        <div key={index} className="p-4 rounded-lg border">
                          <h5 className="font-medium mb-2">{term.term}</h5>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>Start: {new Date(term.startDate).toLocaleDateString()}</p>
                            <p>End: {new Date(term.endDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button className="w-full" size="lg">
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gallery" className="bg-background/20 text-foreground">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-500" />
                  School Gallery
                </CardTitle>
                <CardDescription>
                  View our school facilities and activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[200px] gap-4">
                  {school.media?.gallery && Array.isArray(school.media.gallery) && school.media.gallery.length > 0 ? (
                    school.media.gallery.map((image, index) => {
                      const isLarge = image.isMain || index % 5 === 0;
                      return (
                        <div
                          key={index}
                          className={cn(
                            "group relative cursor-pointer overflow-hidden rounded-xl",
                            isLarge ? "col-span-2 row-span-2" : "col-span-1 row-span-1"
                          )}
                          onClick={() => handleImageClick(image.url)}
                        >
                          <img
                            src={image.url}
                            alt={image.caption || `School image ${index + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              {image.isMain && (
                                <Badge className="mb-2 bg-primary/70 hover:bg-primary/80">
                                  Featured Image
                                </Badge>
                              )}
                              {image.caption && (
                                <p className="text-sm font-medium text-white/90 line-clamp-2">
                                  {image.caption}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/50 mb-4" />
                      <p className="text-lg font-medium text-muted-foreground">No gallery images available</p>
                      <p className="text-sm text-muted-foreground/80">Check back later for updates</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showImageModal && selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-background rounded-lg max-w-4xl w-full mx-auto">
              <div className="sticky top-0 z-50 flex justify-end p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-accent"
                  onClick={() => setShowImageModal(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="p-4">
                <div className="relative w-full h-full rounded-lg overflow-hidden">
                  <img
                    src={selectedImage}
                    alt="Gallery preview"
                    className="w-full h-auto object-contain rounded-lg"
                    style={{ maxHeight: 'calc(90vh - 100px)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchoolProfile;