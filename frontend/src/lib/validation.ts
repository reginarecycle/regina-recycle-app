import { z } from "zod";

export const userRegistrationSchema = z
  .object({
    fullName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Address is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
      terms: z.literal(true, {
        message: "You must accept the terms and conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // targets the error at the confirmPassword field
  });

export type UserRegistrationFormValues = z.infer<typeof userRegistrationSchema>;


export const loginSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const collectorRegistrationSchema = z
  .object({
    name: z.string().min(1, "Company Name is required"),
    email: z.string().email("Invalid email address"),
    address: z.string().min(1, "Business Address is required"),
    businessLicenseID: z.string().min(1, "Business License ID is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    terms: z.literal(true, {
      message: "You must accept the terms and conditions",
    }),
  });

export type CollectorRegistrationFormValues = z.infer<
  typeof collectorRegistrationSchema
>;  

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address").nonempty("Email is required"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match", 
    path: ["confirmPassword"], 
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const profileDetailsSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  address: z.string().min(1, "Address is required"),
});

export type ProfileDetailsFormValues = z.infer<typeof profileDetailsSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const collectorProfileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessEmail: z.string().email("Invalid email address"),
  businessPhone: z.string().min(1, "Phone number is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  provinceState: z.string().min(1, "Province/State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export type CollectorProfileFormValues = z.infer<typeof collectorProfileSchema>;

export const collectorSecuritySchema = z
  .object({
    currentPassword: z.string().min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type CollectorSecurityFormValues = z.infer<typeof collectorSecuritySchema>;