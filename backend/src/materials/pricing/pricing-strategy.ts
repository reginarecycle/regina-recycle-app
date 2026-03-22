export abstract class PricingStrategy {

  // Validate quantity
  validate(qty: number): boolean {
    return qty > 0;
  }

  // implemented by subclasses
  abstract estimateCost(
    qty: number,
    basePrice: number,
    bulkRate: number
  ): number;
}