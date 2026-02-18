/*
  Warnings:

  - You are about to drop the column `price` on the `collector_pricing` table. All the data in the column will be lost.
  - You are about to drop the column `body` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `channel` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `deliveredAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedEarning` on the `pickup_snapshots` table. All the data in the column will be lost.
  - You are about to drop the column `totalItems` on the `pickup_snapshots` table. All the data in the column will be lost.
  - You are about to drop the column `emailAccountActivity` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailMarketing` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emailPickupReminder` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `inAppAlerts` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `inAppPickupReminder` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `tips_of_the_day` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `materials` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `basePrice` to the `collector_pricing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `notifications` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `type` to the `payment_methods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basePrice` to the `pickup_snapshots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `materialId` to the `pickup_snapshots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceUsed` to the `pickup_snapshots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `pickup_snapshots` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CARD', 'MOBILE_PAYMENT');

-- AlterTable
ALTER TABLE "collector_pricing" DROP COLUMN "price",
ADD COLUMN     "basePrice" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "bulkPrice" DECIMAL(14,2);

-- AlterTable
ALTER TABLE "collector_profiles" ADD COLUMN     "bulkIncentiveEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "bulkThreshold" INTEGER NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "body",
DROP COLUMN "channel",
DROP COLUMN "deliveredAt",
ADD COLUMN     "message" TEXT NOT NULL,
ALTER COLUMN "title" SET NOT NULL;

-- AlterTable
ALTER TABLE "payment_methods" ADD COLUMN     "mobileProvider" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "type" "PaymentMethodType" NOT NULL;

-- AlterTable
ALTER TABLE "pickup_snapshots" DROP COLUMN "estimatedEarning",
DROP COLUMN "totalItems",
ADD COLUMN     "basePrice" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "bulkPrice" DECIMAL(14,2),
ADD COLUMN     "bulkThreshold" INTEGER,
ADD COLUMN     "materialId" TEXT NOT NULL,
ADD COLUMN     "priceUsed" DECIMAL(14,2) NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "pickups" ADD COLUMN     "estimatedEarning" DECIMAL(14,2);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailAccountActivity",
DROP COLUMN "emailMarketing",
DROP COLUMN "emailPickupReminder",
DROP COLUMN "inAppAlerts",
DROP COLUMN "inAppPickupReminder";

-- DropTable
DROP TABLE "tips_of_the_day";

-- DropEnum
DROP TYPE "NotificationChannel";

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailPickupReminder" BOOLEAN NOT NULL DEFAULT true,
    "emailAccountActivity" BOOLEAN NOT NULL DEFAULT true,
    "emailMarketing" BOOLEAN NOT NULL DEFAULT false,
    "inAppPickupReminder" BOOLEAN NOT NULL DEFAULT true,
    "inAppAlerts" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tips" (
    "tipId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tips_pkey" PRIMARY KEY ("tipId")
);

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "notification_preferences"("userId");

-- CreateIndex
CREATE INDEX "tips_active_idx" ON "tips"("active");

-- CreateIndex
CREATE INDEX "collector_pricing_status_idx" ON "collector_pricing"("status");

-- CreateIndex
CREATE INDEX "collector_profiles_licenseId_idx" ON "collector_profiles"("licenseId");

-- CreateIndex
CREATE UNIQUE INDEX "materials_name_key" ON "materials"("name");

-- CreateIndex
CREATE INDEX "materials_type_idx" ON "materials"("type");

-- CreateIndex
CREATE INDEX "notifications_userId_type_idx" ON "notifications"("userId", "type");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "payment_methods_type_idx" ON "payment_methods"("type");

-- CreateIndex
CREATE INDEX "pickup_items_pickupId_idx" ON "pickup_items"("pickupId");

-- CreateIndex
CREATE INDEX "pickup_snapshots_materialId_idx" ON "pickup_snapshots"("materialId");

-- CreateIndex
CREATE INDEX "pickups_scheduledAt_idx" ON "pickups"("scheduledAt");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "wallet_transactions_status_idx" ON "wallet_transactions"("status");

-- CreateIndex
CREATE INDEX "wallet_transactions_createdAt_idx" ON "wallet_transactions"("createdAt");

-- CreateIndex
CREATE INDEX "withdraw_requests_status_idx" ON "withdraw_requests"("status");

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_snapshots" ADD CONSTRAINT "pickup_snapshots_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("materialId") ON DELETE RESTRICT ON UPDATE CASCADE;
