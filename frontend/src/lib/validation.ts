import { z } from "zod";

const addressSchema = z.object({
  line1: z.string().min(1, "Address is required"),
  line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const userRegistrationSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Must contain uppercase, lowercase, number and special character"
      ),
    confirmPassword: z.string(),
    address: addressSchema,
    terms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
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
    address: addressSchema,
    licenseID: z.string().min(1, "Business License ID is required"),
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
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Must contain uppercase, lowercase, number and special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
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

export const deleteSchema = z.object({
  confirmText: z.string(),
}).refine((data) => data.confirmText === "DELETE", {
  message: 'Please type "DELETE" to confirm',
  path: ["confirmText"],
});

export type DeleteAccountFormValues = z.infer<typeof deleteSchema>;

export const withdrawAmountSchema = z.object({
amount: z.number().positive("Amount must be greater than 0"),
});

export const withdrawBankSchema = z.object({
  accountHolder: z
    .string()
    .min(2, "Account holder name is required")
    .regex(/^[^0-9]*$/, "Account holder name cannot contain numbers"),
  bankName: z
    .string()
    .min(2, "Bank name is required")
    .regex(/^[^0-9]*$/, "Bank name cannot contain numbers"),
  accountNumber: z
    .string()
    .min(4, "Account number must be at least 4 digits")
    .regex(/^\d+$/, "Account number must contain digits only"),
  routingNumber: z
    .string()
    .min(4, "Routing number must be at least 4 digits")
    .regex(/^\d+$/, "Routing number must contain digits only"),
});

export type WithdrawAmountFormValues = z.infer<typeof withdrawAmountSchema>;
export type WithdrawBankFormValues   = z.infer<typeof withdrawBankSchema>;


export const addFundsAmountSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be greater than 0"),
});

export const addFundsCardSchema = z.object({
  cardNumber: z
    .string()
    .min(16, "Card number must be 16 digits")
    .regex(/^\d{4} \d{4} \d{4} \d{4}$/, "Enter a valid card number"),
  cardName: z
    .string()
    .min(2, "Card name is required")
    .regex(/^[^0-9]*$/, "Card name cannot contain numbers"),
  expiry: z
    .string()
    .regex(/^\d{2}\/\d{2}$/, "Enter a valid expiry date (MM/YY)"),
  cvv: z
    .string()
    .length(3, "CVV must be exactly 3 digits")
    .regex(/^\d{3}$/, "CVV must contain digits only"),
});

export type AddFundsAmountFormValues = z.infer<typeof addFundsAmountSchema>;
export type AddFundsCardFormValues   = z.infer<typeof addFundsCardSchema>;
export type PaymentMethod = "card" | "mobile" | null;