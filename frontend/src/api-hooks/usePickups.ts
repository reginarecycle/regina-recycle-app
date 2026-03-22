
export interface Pickup {
    pickupId: string;
    requesterUserId: string;
    collectorUserId: string;
    scheduledAt: DateTime;
    addressId: string;
    photoUrl?: string
    address?: string;
    status: PickupStatus;
    estimatedEarning?: number;
    actualEarning?: number;
    estimatedCost?: number;
    note?: string;
}