// src/pickups/strategies/abstract-pricing.strategy.ts
import { Decimal } from '@prisma/client/runtime/library';

/**
 * Abstract base for pricing strategies.
 * Returns the price PER UNIT to be used — this becomes priceUsed in PickupSnapshot.
 */
export abstract class PricingStrategy {
  abstract getPricePerUnit(
    basePrice: Decimal,
    bulkPrice: Decimal | null,
  ): Decimal;
}