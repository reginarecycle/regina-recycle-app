import { useCreate, useGetOne } from "@/lib/queryHelpers";

export type PickupStatus =
    | "PENDING"
    | "ACCEPTED"
    | "COMPLETED"
    | "CANCELLED";

export interface PickupAddress {
    addressId: string;
    line1: string;
    line2?: string | null;
    city: string;
    province: string;
    postalCode: string;
    latitude?: number | null;
    longitude?: number | null;
}

export interface PickupMaterial {
    materialId: string;
    name: string;
    unit?: string | null;
}

export interface PickupItem {
    pickupItemId?: string;
    materialId: string;
    quantity: number;
    material?: PickupMaterial;
}

export interface PickupUserSummary {
    userId: string;
    name: string;
    email: string;
    phoneNumber?: string | null;
}

export interface PickupSnapshot {
    pickupSnapshotId?: string;
    pickupId: string;
    materialId: string;
    quantity: number;
    basePrice: number;
    bulkPrice?: number | null;
    bulkThreshold?: number | null;
    priceUsed: number;
}

export interface Pickup {
    pickupId: string;
    requesterUserId?: string | null;
    collectorUserId?: string | null;
    scheduledAt: string;
    addressId?: string | null;
    photoUrl?: string | null;
    status: PickupStatus;
    createdAt?: string;
    updatedAt?: string;
    estimatedEarning?: number | null;
    actualEarning?: number | null;
    estimatedCost?: number | null;
    note?: string | null;

    address?: PickupAddress | null;
    items?: PickupItem[];
    snapshots?: PickupSnapshot[];
    requester?: PickupUserSummary | null;
    collector?: PickupUserSummary | null;
}

export interface CreatePickupAddressPayload {
    line1: string;
    line2?: string;
    city: string;
    province: string;
    postalCode: string;
    latitude?: number;
    longitude?: number;
}

export interface CreatePickupItemPayload {
    materialId: string;
    quantity: number;
}

export interface CreatePickupPayload {
    address: CreatePickupAddressPayload;
    scheduledAt: string;
    items: CreatePickupItemPayload[];
    estimatedCost?: number;
    note?: string;
}

export interface CreatePickupFormPayload {
    data: CreatePickupPayload;
    photo?: File;
}

export interface UpdatePickupPayload {
    scheduledAt?: string;
    estimatedCost?: number;
    note?: string;
}

export interface PickupMutationResponse {
    message: string;
    pickup: Pickup;
}

export interface CompletePickupResponse extends PickupMutationResponse {
    actualEarning: number;
}

/**
 * POST /pickups
 * Backend expects multipart/form-data with:
 * - photo: binary file (optional)
 * - data: JSON string of CreatePickupDto
 */
export function useCreatePickup() {
    return useCreate<PickupMutationResponse, FormData>("/pickups", ["pickups"]);
}

/**
 * Helper to build the FormData payload expected by the backend controller.
 */
export function buildCreatePickupFormData(
    payload: CreatePickupFormPayload
): FormData {
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload.data));

    if (payload.photo) {
        formData.append("photo", payload.photo);
    }

    return formData;
}

/**
 * GET /pickups
 * Customer: get own pickups
 */
export function useUserPickups() {
    return useGetOne<Pickup[]>(["pickups", "mine"], "/pickups");
}

/**
 * GET /pickups/requests
 * Collector: get all pending requests
 */
export function usePickupRequests() {
    return useGetOne<Pickup[]>(["pickups", "requests"], "/pickups/requests");
}

/**
 * GET /pickups/:id
 */
export function usePickupById(id?: string) {
    return useGetOne<Pickup>(
        ["pickups", "detail", id ?? ""],
        id ? `/pickups/${id}` : ""
    );
}

/**
 * PATCH /pickups/:id/accept
 */
export function useAcceptPickup(id: string) {
    return useCreate<PickupMutationResponse, undefined>(
        `/pickups/${id}/accept`,
        ["pickups"]
    );
}

/**
 * PATCH /pickups/:id/complete
 */
export function useCompletePickup(id: string) {
    return useCreate<CompletePickupResponse, undefined>(
        `/pickups/${id}/complete`,
        ["pickups"]
    );
}

/**
 * PATCH /pickups/:id
 */
export function useUpdatePickup(id: string) {
    return useCreate<PickupMutationResponse, UpdatePickupPayload>(
        `/pickups/${id}`,
        ["pickups"]
    );
}

/**
 * DELETE /pickups/:id/cancel
 * If your helper supports DELETE separately, use that instead.
 * With your existing helper style, this may still work if it supports custom methods internally.
 */
export function useCancelPickup(id: string) {
    return useCreate<PickupMutationResponse, undefined>(
        `/pickups/${id}/cancel`,
        ["pickups"]
    );
}