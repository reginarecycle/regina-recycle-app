-- AlterTable
ALTER TABLE "collector_profiles" ADD COLUMN     "feeType" TEXT NOT NULL DEFAULT 'FLAT_FEE';

-- AlterTable
ALTER TABLE "pickups" ADD COLUMN     "estimatedCost" DECIMAL(14,2),
ADD COLUMN     "note" TEXT,
ADD COLUMN     "photoUrl" TEXT;
