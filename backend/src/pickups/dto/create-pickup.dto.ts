// src/pickups/dto/create-pickup.dto.ts

export class CreatePickupItemDto {
  materialId: string;
  quantity: number;
}

export class CreatePickupDto {
  scheduledAt: string;          // ISO date string e.g. "2025-04-01T10:00:00Z"
  addressId: string;            // must belong to the requesting user
  items: CreatePickupItemDto[]; // one or more materials
}