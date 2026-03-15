// src/pickups/pickups.material.factory.ts
import { BasePricingStrategy } from './strategies/base-pricing.strategy';
import { BulkPricingStrategy } from './strategies/bulk-pricing.strategy';
import { PricingStrategy } from './strategies/abstract-pricing.strategy';

interface CollectorBulkConfig {
  bulkIncentiveEnabled: boolean;
  bulkThreshold: number;
}

export class PickupPricingFactory {
  /**
   * Selects the correct pricing strategy for a single pickup item.
   *
   * Logic:
   *  - Collector has bulk incentive ON + quantity meets/exceeds threshold → BulkPricingStrategy
   *  - Otherwise → BasePricingStrategy
   */
  static selectStrategy(
    quantity: number,
    collectorProfile: CollectorBulkConfig,
  ): PricingStrategy {
    const { bulkIncentiveEnabled, bulkThreshold } = collectorProfile;

    if (bulkIncentiveEnabled && quantity >= bulkThreshold) {
      return new BulkPricingStrategy();
    }

    return new BasePricingStrategy();
  }
}