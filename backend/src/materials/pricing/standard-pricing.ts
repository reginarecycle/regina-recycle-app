import { PricingStrategy } from './pricing-strategy';

export class StandardPricing extends PricingStrategy {

  estimateCost(
    qty: number,
    basePrice: number,
    bulkRate: number
  ): number {

    if (!this.validate(qty)) {
      throw new Error("Quantity must be greater than 0");
    }

    if (qty >= 50) {
      return qty * basePrice * bulkRate;
    }

    return qty * basePrice;
  }
}