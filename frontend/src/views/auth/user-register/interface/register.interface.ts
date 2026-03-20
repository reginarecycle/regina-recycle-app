export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role: "CUSTOMER" | "COLLECTOR";
    agreedToTerms: boolean;
    address: {
        line1: string;
        line2?: string;
        city: string;
        province: string;
        postalCode: string;
        latitude?: number;
        longitude?: number;
    };
    licenseId?: string,
}