// src/pickups/strategies/base-pricing.strategy.ts
import { Decimal } from '@prisma/client/runtime/library';
import { PricingStrategy } from './abstract-pricing.strategy';

/**
 * Used when bulk incentive is disabled OR quantity is below bulkThreshold.
 * Simply returns the collector's basePrice per unit.
 */
export class BasePricingStrategy extends PricingStrategy {
  getPricePerUnit(basePrice: Decimal): Decimal {
    return basePrice;
  }
}