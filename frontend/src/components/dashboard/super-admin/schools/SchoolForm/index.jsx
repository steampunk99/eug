import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { schoolService } from '@/services/schoolService';
import BasicInfoStep from './steps/BasicInfoStep';
import LocationStep from './steps/LocationStep';
import FeesStep from './steps/FeesStep';
import ContactStep from './steps/ContactStep';
import AdmissionsStep from './steps/AdmissionsStep';
import SubjectsStep from './steps/SubjectsStep';
import FacilitiesStep from './steps/FacilitiesStep';
import MediaStep from './steps/MediaStep';
import { completeSchoolSchema } from './formSchema';

const steps = [
  { id: 'basic', title: 'Basic Information', component: () => <BasicInfoStep /> },
  { id: 'location', title: 'Location', component: () => <LocationStep /> },
  { id: 'fees', title: 'Fees Structure', component: () => <FeesStep /> },
  { id: 'contact', title: 'Contact Information', component: () => <ContactStep /> },
  { id: 'admissions', title: 'Admissions', component: () => <AdmissionsStep /> },
  { id: 'subjects', title: 'Subjects', component: () => <SubjectsStep /> },
  { id: 'facilities', title: 'Facilities', component: () => <FacilitiesStep /> },
  { id: 'media', title: 'Media', component: () => <MediaStep /> },
];

export default function SchoolForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: '',
    description: '',
    type: '',
    category: '',
    curriculum: [],
    location: {
      district: '',
      region: '',
      address: '',
      coordinates: { latitude: null, longitude: null },
    },
    fees: {
      admissionFee: 0,
      tuitionFee: { dayStudent: 0, boardingStudent: 0 },
      otherFees: [],
    },
    contact: {
      email: '',
      phone: '',
      alternativePhone: '',
      website: '',
    },
    admissions: {
      applicationDeadline: new Date(),
      availableSpots: { dayStudents: 0, boardingStudents: 0 },
      requirements: [],
      termDates: [],
    },
    subjects: {
      oLevel: [],
      aLevel: [],
      cambridge: [],
    },
    facilities: [],
    media: {
      logo: '',
      gallery: [],
    },
  });

  const form = useForm({
    resolver: zodResolver(completeSchoolSchema),
    mode: 'onChange',
    defaultValues: initialValues,
  });

  useEffect(() => {
    const fetchSchoolData = async () => {
      if (id) {
        try {
          setIsLoading(true);
          console.log('Fetching school data for ID:', id);
          
          const response = await schoolService.getSchoolById(id);
          console.log('Raw API Response:', response);
          
          // Extract school data from the response
          const schoolData = response.data?.data || response.data || response;
          console.log('School data extracted:', schoolData);
          
          if (!schoolData) {
            throw new Error('No school data received from API');
          }

          // Format the date properly
          let applicationDeadline = null;
          if (schoolData.admissions?.applicationDeadline) {
            try {
              applicationDeadline = new Date(schoolData.admissions.applicationDeadline);
              console.log('Formatted application deadline:', applicationDeadline);
            } catch (error) {
              console.error('Error formatting date:', error);
              applicationDeadline = new Date();
            }
          }

          // Ensure all required fields are present with proper formatting
          const formattedData = {
            name: schoolData.name || '',
            description: schoolData.description || '',
            type: schoolData.type || '',
            category: schoolData.category || '',
            curriculum: Array.isArray(schoolData.curriculum) ? schoolData.curriculum : [],
            location: {
              district: schoolData?.location?.district || '',
              region: schoolData?.location?.region || '',
              address: schoolData?.location?.address || '',
              coordinates: schoolData?.location?.coordinates || { latitude: null, longitude: null },
            },
            fees: {
              admissionFee: Number(schoolData?.fees?.admissionFee) || 0,
              tuitionFee: {
                dayStudent: Number(schoolData?.fees?.tuitionFee?.dayStudent) || 0,
                boardingStudent: Number(schoolData?.fees?.tuitionFee?.boardingStudent) || 0,
              },
              otherFees: Array.isArray(schoolData?.fees?.otherFees) ? schoolData.fees.otherFees : [],
            },
            contact: {
              email: schoolData?.contact?.email || '',
              phone: schoolData?.contact?.phone || '',
              alternativePhone: schoolData?.contact?.alternativePhone || '',
              website: schoolData?.contact?.website || '',
            },
            admissions: {
              applicationDeadline: applicationDeadline || new Date(),
              availableSpots: {
                dayStudents: Number(schoolData?.admissions?.availableSpots?.dayStudents) || 0,
                boardingStudents: Number(schoolData?.admissions?.availableSpots?.boardingStudents) || 0,
              },
              requirements: Array.isArray(schoolData?.admissions?.requirements) ? schoolData.admissions.requirements : [],
              termDates: Array.isArray(schoolData?.admissions?.termDates) ? schoolData.admissions.termDates : [],
            },
            subjects: {
              oLevel: Array.isArray(schoolData?.subjects?.oLevel) ? schoolData.subjects.oLevel : [],
              aLevel: Array.isArray(schoolData?.subjects?.aLevel) ? schoolData.subjects.aLevel : [],
              cambridge: Array.isArray(schoolData?.subjects?.cambridge) ? schoolData.subjects.cambridge : [],
            },
            facilities: Array.isArray(schoolData?.facilities) ? schoolData.facilities : [],
            media: {
              logo: schoolData?.media?.logo || '',
              gallery: Array.isArray(schoolData?.media?.gallery) ? schoolData.media.gallery : [],
            },
          };

          console.log('Formatted data for form:', formattedData);
          
          // Update form state
          setInitialValues(formattedData);
          
          // Reset form with formatted data
          form.reset(formattedData);
          
          // Verify form values were set
          const currentValues = form.getValues();
          console.log('Current form values after reset:', currentValues);
          
          toast({
            title: "School data loaded",
            description: "The form has been prefilled with the school's data",
          });
        } catch (error) {
          console.error('Error loading school data:', error);
          toast({
            title: "Error",
            description: error.message || "Failed to load school data",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSchoolData();
  }, [id]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      if (id) {
        await schoolService.updateSchool(id, data);
        toast({
          title: 'Success',
          description: 'School updated successfully',
        });
      } else {
        await schoolService.createSchool(data);
        toast({
          title: 'Success',
          description: 'School created successfully',
        });
      }
      navigate('/dashboard/superadmin/schools');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save school',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleNext = async () => {
    try {
      if (currentStep === steps.length - 1) {
        await form.handleSubmit(onSubmit)();
      } else {
        // Get fields for current step
        let fieldsToValidate = [];
        switch(currentStep) {
          case 0: // Basic Info
            fieldsToValidate = ['name', 'description', 'type', 'category', 'curriculum'];
            break;
          case 1: // Location
            fieldsToValidate = ['location.district', 'location.region', 'location.address'];
            break;
          case 2: // Fees
            fieldsToValidate = ['fees.admissionFee', 'fees.tuitionFee'];
            break;
          case 3: // Contact
            fieldsToValidate = ['contact.phone'];
            break;
          case 4: // Admissions
            fieldsToValidate = ['admissions.applicationDeadline', 'admissions.availableSpots'];
            break;
          case 5: // Subjects
            fieldsToValidate = ['subjects'];
            break;
          case 6: // Facilities
            fieldsToValidate = ['facilities'];
            break;
          case 7: // Media
            fieldsToValidate = ['media'];
            break;
        }

        const isValid = await form.trigger(fieldsToValidate);
        
        if (isValid) {
          setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
        } else {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields correctly",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to proceed to next step",
        variant: "destructive",
      });
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <FormProvider {...form}>
      <div className="container mx-auto py-6">
        <Card className="p-6">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight">
              {id ? 'Edit School' : 'Add New School'}
            </h2>
            <p className="text-muted-foreground">
              {currentStep + 1} of {steps.length} - {steps[currentStep].title}
            </p>
          </div>

          <Progress
            value={progress}
            className="mb-8"
          />

          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
            {steps[currentStep].component()}
            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {currentStep === steps.length - 1
                  ? isLoading
                    ? 'Saving...'
                    : 'Save School'
                  : 'Next'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </FormProvider>
  );
}
