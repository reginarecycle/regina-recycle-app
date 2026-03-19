import { useCreate, useGetOne } from "@/lib/queryHelpers";
import type { RegisterPayload } from "@/views/auth/user-register/interface/register.interface";

export interface AuthUser {
    userId: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
}

export interface AuthResetPassword {
    email: string;
    token: string;
    newPassword: string;
}

export interface CurrentUser {
    userId: string;
    name: string;
    email: string;
    role: "CUSTOMER" | "COLLECTOR";
    emailVerified: boolean;
    phoneNumber?: string;
    status: string;
    addresses: {
      addressId: string;
      line1: string;
      line2?: string;
      city: string;
      province: string;
      postalCode: string;
      isPrimary: boolean;
    }[];
    dateOfBirth?: string | null;
    collectorProfile?: {
      licenseId: string;
      serviceFee: number;
      bulkIncentiveEnabled: boolean;
      bulkThreshold: number;
    } | null;
  }

export interface AuthData {
    user: AuthUser;
    token: string;
}

export function useRegister() {
    return useCreate<AuthData, RegisterPayload>("/auth/register", ["auth"]);
}


export function useVerifyEmail() {
    return useCreate<null, { email: string; otp: string }>(
        "/auth/verify-email",
        ["auth"]
    );
}

export function useResendOtp() {
    return useCreate<null, { email: string }>(
        "/auth/resend-otp",
        ["auth"]
    );
}

export function useLogin() {
    return useCreate<AuthData, { email: string; password: string }>("/auth/login", ["auth"]);
}

export function useForgotPassword() {
    return useCreate<null, { email: string }>("/auth/forgot-password", ["auth"]);
}

export function useResetPassword() {
    return useCreate<null, AuthResetPassword>("/auth/reset-password", ["auth"]);
}

export function useCurrentUser() {
    return useGetOne<CurrentUser>(["currentUser"], "/auth/me",{
        staleTime: 1000 * 60 * 5, 
        gcTime: 1000 * 60 * 10, 
      });
}

