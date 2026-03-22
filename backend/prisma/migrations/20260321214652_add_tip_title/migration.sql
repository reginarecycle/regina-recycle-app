/*
  Warnings:

  - You are about to drop the `Material` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "collector_pricing" DROP CONSTRAINT "collector_pricing_materialId_fkey";

-- DropForeignKey
ALTER TABLE "pickup_items" DROP CONSTRAINT "pickup_items_materialId_fkey";

-- DropForeignKey
ALTER TABLE "pickup_snapshots" DROP CONSTRAINT "pickup_snapshots_materialId_fkey";

-- AlterTable
ALTER TABLE "tips" ADD COLUMN     "title" TEXT;

-- DropTable
DROP TABLE "Material";

-- CreateTable
CREATE TABLE "materials" (
    "materialId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "photoUrl" TEXT,
    "co2Saved" DOUBLE PRECISION,
    "waterSaved" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("materialId")
);

-- CreateIndex
CREATE UNIQUE INDEX "materials_name_key" ON "materials"("name");

-- CreateIndex
CREATE INDEX "materials_type_idx" ON "materials"("type");

-- AddForeignKey
ALTER TABLE "collector_pricing" ADD CONSTRAINT "collector_pricing_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("materialId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_items" ADD CONSTRAINT "pickup_items_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("materialId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_snapshots" ADD CONSTRAINT "pickup_snapshots_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("materialId") ON DELETE RESTRICT ON UPDATE CASCADE;
