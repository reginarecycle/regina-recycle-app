export class CreatePickupDto {
  scheduledAt: string;
  addressId: string;
  items: {
    materialId: string;
    quantity: number;
  }[];
}
