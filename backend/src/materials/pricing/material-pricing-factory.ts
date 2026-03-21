import { PricingStrategy } from "./pricing-strategy";
import { StandardPricing } from "./standard-pricing";
import { HazardousPricing } from "./hazardous-pricing";

export class MaterialPricingFactory {
  createStrategy(type: string): PricingStrategy {
    if (type === "glass") {
      return new StandardPricing();
    }

    if (type === "batteries") {
      return new HazardousPricing();
    }

    throw new Error("Unknown material type");
  }
}
