// src/pickups/dto/update-pickup.dto.ts

export class UpdatePickupDto {
  scheduledAt?: string;       // collector can reschedule
  actualEarning?: number;     // collector sets final amount after verifying materials
  status?: string;            // e.g. IN_PROGRESS, COMPLETED, CANCELLED
}