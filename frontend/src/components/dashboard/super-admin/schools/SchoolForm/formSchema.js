import * as z from "zod";

// Validation schemas for each step
export const basicInfoSchema = z.object({
  name: z.string().min(3, "School name must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["Day", "Boarding", "Mixed"]),
  category: z.enum(["Government", "Private", "Religious", "International"]),
  curriculum: z.array(z.enum(["O-Level", "A-Level", "Cambridge"])).min(1, "Select at least one curriculum"),
});

export const locationSchema = z.object({
  location: z.object({
    district: z.string().min(2, "District is required"),
    region: z.enum(["Northern", "Eastern", "Western", "Central"]),
    address: z.string().min(5, "Full address is required"),
    coordinates: z.object({
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    }).optional(),
  }),
});

export const feesSchema = z.object({
  fees: z.object({
    admissionFee: z.number().min(0, "Admission fee must be a positive number"),
    tuitionFee: z.object({
      dayStudent: z.number().min(0).optional(),
      boardingStudent: z.number().min(0).optional(),
    }),
    otherFees: z.array(z.object({
      name: z.string().min(2, "Fee name required"),
      amount: z.number().min(0, "Amount must be positive"),
      term: z.string().min(1, "Term is required"),
    })).optional(),
  }),
});

export const contactSchema = z.object({
  contact: z.object({
    email: z.string().email("Invalid email address").optional(),
    phone: z.string().min(10, "Phone number is required"),
    alternativePhone: z.string().optional(),
    website: z.string().url("Invalid website URL").optional(),
  }),
});

export const admissionsSchema = z.object({
  admissions: z.object({
    applicationDeadline: z.date(),
    availableSpots: z.object({
      dayStudents: z.number().min(0).optional(),
      boardingStudent: z.number().min(0).optional(),
    }).optional(),
    requirements: z.array(z.object({
      name: z.string().min(2, "Requirement name needed"),
      required: z.boolean(),
    })).optional(),
    termDates: z.array(z.object({
      term: z.string().min(1, "Term name required"),
      startDate: z.date(),
      endDate: z.date(),
    })).optional(),
  }),
});

export const subjectsSchema = z.object({
  subjects: z.object({
    oLevel: z.array(z.string()).optional(),
    aLevel: z.array(z.string()).optional(),
    cambridge: z.array(z.string()).optional(),
  }),
});

export const facilitiesSchema = z.object({
  facilities: z.array(z.object({
    name: z.string().min(2, "Facility name required"),
    description: z.string().optional(),
  })).optional(),
});

export const mediaSchema = z.object({
  media: z.object({
    logo: z.string().optional(),
    gallery: z.array(z.object({
      url: z.string().url("Invalid image URL"),
      caption: z.string().optional(),
      isMain: z.boolean().optional(),
    })).optional(),
  }),
});

// Combine all schemas for final validation
export const completeSchoolSchema = basicInfoSchema
  .merge(locationSchema)
  .merge(feesSchema)
  .merge(contactSchema)
  .merge(admissionsSchema)
  .merge(subjectsSchema)
  .merge(facilitiesSchema)
  .merge(mediaSchema);
