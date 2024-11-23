import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "../ui/card";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle, 
} from "../ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Progress } from "../ui/progress";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Check } from 'lucide-react';

const ApplicationForm = ({ school, onClose }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  
  const form = useForm({
    defaultValues: {
      personalInfo: {
        name: '',
        dateOfBirth: '',
        gender: '',
        address: ''
      },
      academicInfo: {
        previousSchool: '',
        grades: ''
      },
      essayAnswer: '',
      payment: {
        phoneNumber: ''
      }
    }
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      
      // Submit application
      const applicationRes = await fetch('https://school-locator.onrender.com/api/schools/application/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: school._id,
          ...data
        })
      });
      
      const applicationData = await applicationRes.json();
      
      if (!applicationData.applicationId) {
        throw new Error(applicationData.message || 'Failed to submit application');
      }
      
      setApplicationId(applicationData.applicationId);
      setStep(4); // Move to payment step
    } catch (error) {
      console.error('Application submission error:', error);
      // Show error alert
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    try {
      setIsSubmitting(true);
      
      const paymentRes = await fetch('https://school-locator.onrender.com/api/schools/application/pay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId,
          paymentMethod,
          phoneNumber: form.getValues('payment.phoneNumber')
        })
      });
      
      const paymentData = await paymentRes.json();
      
      if (paymentData.status === 'Processing') {
        setShowPaymentDialog(true);
      } else {
        throw new Error(paymentData.message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Show error alert
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto text-foreground bg-background/20">
      <CardHeader>
        <CardTitle>SCHOOL APPLICATION FORM</CardTitle>
        <CardTitle>Application to {school?.name}</CardTitle>
        <CardDescription>
          Please complete all required information
        </CardDescription>
        <Progress value={progress} className="mt-2 h-1" />
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="personalInfo.name"
                  rules={{ required: "Name is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalInfo.dateOfBirth"
                  rules={{ required: "Date of birth is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalInfo.gender"
                  rules={{ required: "Gender is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="personalInfo.address"
                  rules={{ required: "Address is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="academicInfo.previousSchool"
                  rules={{ required: "Previous school is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Previous School</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="academicInfo.grades"
                  rules={{ required: "Grades are required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Grades</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Enter your grades (e.g., Mathematics: A, English: B...)"
                        />
</FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="essayAnswer"
                  rules={{ required: "Essay answer is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why do you want to join {school?.name}?</FormLabel>
                      <FormDescription>
                        Write a brief essay explaining your motivation (minimum 200 words)
                      </FormDescription>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          className="min-h-[200px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Application Fee</h3>
                  <p className="text-2xl font-bold">
                    UGX {school?.fees.admissionFee.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-4">
                  <FormLabel>Select Payment Method</FormLabel>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem
                        value="MTN-Uganda"
                        id="mtn"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="mtn"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <div className="space-y-1 text-center">
                          <p className="font-medium leading-none">MTN Mobile Money</p>
                          <p className="text-sm text-muted-foreground">
                            Pay with MTN MoMo
                          </p>
                        </div>
                      </Label>
                    </div>

                    <div>
                      <RadioGroupItem
                        value="Airtel-Uganda"
                        id="airtel"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="airtel"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <div className="space-y-1 text-center">
                          <p className="font-medium leading-none">Airtel Money</p>
                          <p className="text-sm text-muted-foreground">
                            Pay with Airtel Money
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod && (
                    <FormField
                      control={form.control}
                      name="payment.phoneNumber"
                      rules={{ 
                        required: "Phone number is required",
                        pattern: {
                          value: /^(256|0)(7[0-8])[0-9]{7}$/,
                          message: "Invalid phone number format"
                        }
                      }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mobile Money Number</FormLabel>
                          <FormDescription>
                            Enter the number in format: 256773123456
                          </FormDescription>
                          <FormControl>
                            <Input {...field} type="tel" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={isSubmitting}
          >
            Previous
          </Button>
        )}
        
        {step < 4 && (
          <Button
            onClick={() => {
              const currentFields = step === 1 
                ? ['personalInfo.name', 'personalInfo.dateOfBirth', 'personalInfo.gender', 'personalInfo.address']
                : step === 2 
                ? ['academicInfo.previousSchool', 'academicInfo.grades']
                : ['essayAnswer'];

              const isValid = currentFields.every(field => form.getFieldState(field).isDirty);
              if (isValid) {
                setStep(step + 1);
              } else {
                form.trigger(currentFields);
              }
            }}
          >
            Next
          </Button>
        )}

        {step === 4 && (
          <Button
            onClick={handlePayment}
            disabled={isSubmitting || !paymentMethod || !form.getValues('payment.phoneNumber')}
            className="w-full"
          >
            {isSubmitting ? 'Processing...' : 'Pay Application Fee'}
          </Button>
        )}
      </CardFooter>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Processing</DialogTitle>
            <DialogDescription>
              A payment prompt has been sent to your phone. Please complete the payment on your device.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid gap-4">
              <div className="flex items-center gap-4">
                <Check className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium leading-none">
                    Payment request sent
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Check your phone for the payment prompt
                  </p>
                </div>
              </div>
            </div>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="mt-4">
                I didn't receive the prompt
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Payment Issues?</AlertDialogTitle>
                <AlertDialogDescription>
                  If you haven't received the payment prompt:
                  1. Make sure you entered the correct phone number
                  2. Check if you have sufficient balance
                  3. Try again in a few minutes
                  
                  For assistance, contact support at {school?.contact.phone}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
                <AlertDialogAction onClick={handlePayment}>
                  Try Again
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ApplicationForm;