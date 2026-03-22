/*
  Warnings:

  - You are about to drop the `materials` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "WithdrawType" AS ENUM ('INTERAC', 'BANK_TRANSFER');

-- DropForeignKey
ALTER TABLE "collector_pricing" DROP CONSTRAINT "collector_pricing_materialId_fkey";

-- DropForeignKey
ALTER TABLE "pickup_items" DROP CONSTRAINT "pickup_items_materialId_fkey";

-- DropForeignKey
ALTER TABLE "pickup_snapshots" DROP CONSTRAINT "pickup_snapshots_materialId_fkey";

-- AlterTable
ALTER TABLE "withdraw_requests" ADD COLUMN     "accountHolderName" TEXT,
ADD COLUMN     "accountNumber" TEXT,
ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "routingNumber" TEXT,
ADD COLUMN     "withdrawType" "WithdrawType" NOT NULL DEFAULT 'INTERAC',
ALTER COLUMN "interacEmail" DROP NOT NULL;

-- DropTable
DROP TABLE "materials";

-- CreateTable
CREATE TABLE "Material" (
    "materialId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "photoUrl" TEXT,
    "co2Saved" DOUBLE PRECISION,
    "waterSaved" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("materialId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Material_name_key" ON "Material"("name");

-- CreateIndex
CREATE INDEX "Material_type_idx" ON "Material"("type");

-- AddForeignKey
ALTER TABLE "collector_pricing" ADD CONSTRAINT "collector_pricing_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("materialId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_items" ADD CONSTRAINT "pickup_items_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("materialId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_snapshots" ADD CONSTRAINT "pickup_snapshots_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("materialId") ON DELETE RESTRICT ON UPDATE CASCADE;
