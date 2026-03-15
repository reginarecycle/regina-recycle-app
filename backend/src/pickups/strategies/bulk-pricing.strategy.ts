// src/pickups/strategies/bulk-pricing.strategy.ts
import { Decimal } from '@prisma/client/runtime/library';
import { PricingStrategy } from './abstract-pricing.strategy';

/**
 * Used when collector has bulk incentive enabled AND quantity meets bulkThreshold.
 * Uses bulkPrice per unit — falls back to basePrice if bulkPrice not set.
 */
export class BulkPricingStrategy extends PricingStrategy {
  getPricePerUnit(basePrice: Decimal, bulkPrice: Decimal | null): Decimal {
    return bulkPrice ?? basePrice;
  }
}