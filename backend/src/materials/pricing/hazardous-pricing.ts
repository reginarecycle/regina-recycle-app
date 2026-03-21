import { PricingStrategy } from './pricing-strategy';

export class HazardousPricing extends PricingStrategy {

  private hazardousFee: number = 5;

  estimateCost(
    qty: number,
    basePrice: number,
    bulkRate: number
  ): number {

    if (!this.validate(qty)) {
      throw new Error("Quantity must be greater than 0");
    }

    let cost = qty * basePrice;

    if (qty >= 50) {
      cost = cost * bulkRate;
    }

    return cost + this.hazardousFee;
  }
}
