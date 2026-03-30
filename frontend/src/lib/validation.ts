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
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const collectorRegistrationSchema = z
  .object({
    name: z.string().min(1, "Company Name is required"),
    email: z.string().email("Invalid email address"),
    address: addressSchema,
    licenseID: z.string().regex(/^\d{9}$/, "Business license must be exactly 9 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
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
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().refine(
    (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    "Invalid email address"
  ),
  phone: z.string().refine(
    (v) => !v || v.replace(/\D/g, "").length === 10,
    "Enter a valid 10-digit Canadian phone number"
  ),
  dateOfBirth: z.string()
    .refine((v) => !v || /^\d{2}-\d{2}-\d{4}$/.test(v), "Enter date as DD-MM-YYYY")
    .refine((v) => {
      if (!v) return true;
      const [dd, mm, yyyy] = v.split("-").map(Number);
      const d = new Date(Date.UTC(yyyy, mm - 1, dd));
      return d.getUTCFullYear() === yyyy && d.getUTCMonth() === mm - 1 && d.getUTCDate() === dd;
    }, "Invalid date"),
  address: z.string(),
});

export type ProfileDetailsFormValues = z.infer<typeof profileDetailsSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Password must be at least 8 characters"),

    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

    confirmPassword: z.string().min(8, "Confirm Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export const collectorProfileSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessEmail: z.string().email("Invalid email address"),
  businessPhone: z.string().optional(),
  registrationNumber: z.string().min(1, "Registration number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  provinceState: z.string().min(1, "Province/State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export type CollectorProfileFormValues = z.infer<typeof collectorProfileSchema>;

export const collectorSecuritySchema = z
  .object({
    currentPassword: z.string().min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(6, "Confirm Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"],
  });

export type CollectorSecurityFormValues = z.infer<typeof collectorSecuritySchema>;
export const createWithdrawSchema = (availableBalance: number) =>
  z.object({
    amount: z
      .string()
      .min(1, "Amount is required.")
      .refine((val) => !isNaN(Number(val)), "Enter a valid amount.")
      .refine((val) => Number(val) > 0, "Amount must be greater than 0.")
      .refine((val) => Number(val) <= availableBalance, "Amount cannot exceed available balance."),
    recipientEmail: z
      .string()
      .min(1, "Recipient email is required.")
      .email("Enter a valid email address."),
    securityQuestion: z.string().optional(),
    securityAnswer:   z.string().optional(),
    message:          z.string().optional(),
  });

export type WithdrawFormValues = z.infer<ReturnType<typeof createWithdrawSchema>>;

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
    .regex(/^\d{7}$/, "Account number must be exactly 7 digits"),
  transitNumber: z
    .string()
    .regex(/^\d{5}$/, "Transit number must be exactly 5 digits"),
  institutionNumber: z
    .string()
    .regex(/^\d{3}$/, "Institution number must be exactly 3 digits"),
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
    .regex(/^\d{2}\/\d{2}$/, "Enter a valid expiry date (MM/YY)")
    .refine((val) => {
      const [mm, yy] = val.split("/").map(Number);
      if (!mm || mm < 1 || mm > 12) return false;
      const now = new Date();
      const expDate = new Date(2000 + yy, mm - 1, 1);
      return expDate >= new Date(now.getFullYear(), now.getMonth(), 1);
    }, "Card has expired"),
  cvv: z
    .string()
    .length(3, "CVV must be exactly 3 digits")
    .regex(/^\d{3}$/, "CVV must contain digits only"),
});

export type AddFundsAmountFormValues = z.infer<typeof addFundsAmountSchema>;
export type AddFundsCardFormValues   = z.infer<typeof addFundsCardSchema>;
export type PaymentMethod = "card" | "mobile" | null;
