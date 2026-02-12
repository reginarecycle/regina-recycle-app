/*
  Warnings:

  - You are about to drop the column `description` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the `notification_preferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_notifications` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `channel` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_userId_fkey";

-- DropForeignKey
ALTER TABLE "collector_pricing" DROP CONSTRAINT "collector_pricing_collectorUserId_fkey";

-- DropForeignKey
ALTER TABLE "collector_pricing" DROP CONSTRAINT "collector_pricing_materialId_fkey";

-- DropForeignKey
ALTER TABLE "collector_profiles" DROP CONSTRAINT "collector_profiles_userId_fkey";

-- DropForeignKey
ALTER TABLE "customer_dobs" DROP CONSTRAINT "customer_dobs_userId_fkey";

-- DropForeignKey
ALTER TABLE "notification_preferences" DROP CONSTRAINT "notification_preferences_userId_fkey";

-- DropForeignKey
ALTER TABLE "payment_methods" DROP CONSTRAINT "payment_methods_userId_fkey";

-- DropForeignKey
ALTER TABLE "pickup_items" DROP CONSTRAINT "pickup_items_materialId_fkey";

-- DropForeignKey
ALTER TABLE "pickup_items" DROP CONSTRAINT "pickup_items_pickupId_fkey";

-- DropForeignKey
ALTER TABLE "pickup_snapshots" DROP CONSTRAINT "pickup_snapshots_pickupId_fkey";

-- DropForeignKey
ALTER TABLE "pickups" DROP CONSTRAINT "pickups_requesterUserId_fkey";

-- DropForeignKey
ALTER TABLE "topup_requests" DROP CONSTRAINT "topup_requests_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_notifications" DROP CONSTRAINT "user_notifications_notificationId_fkey";

-- DropForeignKey
ALTER TABLE "user_notifications" DROP CONSTRAINT "user_notifications_userId_fkey";

-- DropForeignKey
ALTER TABLE "wallet_transactions" DROP CONSTRAINT "wallet_transactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "wallet_transactions" DROP CONSTRAINT "wallet_transactions_walletId_fkey";

-- DropForeignKey
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_userId_fkey";

-- DropForeignKey
ALTER TABLE "withdraw_requests" DROP CONSTRAINT "withdraw_requests_userId_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "description",
ADD COLUMN     "body" TEXT,
ADD COLUMN     "channel" "NotificationChannel" NOT NULL,
ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "type" "NotificationType" NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "emailAccountActivity" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailMarketing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailPickupReminder" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "inAppAlerts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "inAppPickupReminder" BOOLEAN NOT NULL DEFAULT true;

-- DropTable
DROP TABLE "notification_preferences";

-- DropTable
DROP TABLE "user_notifications";

-- CreateIndex
CREATE INDEX "addresses_userId_idx" ON "addresses"("userId");

-- CreateIndex
CREATE INDEX "collector_pricing_collectorUserId_idx" ON "collector_pricing"("collectorUserId");

-- CreateIndex
CREATE INDEX "collector_pricing_materialId_idx" ON "collector_pricing"("materialId");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "payment_methods_userId_idx" ON "payment_methods"("userId");

-- CreateIndex
CREATE INDEX "pickup_items_materialId_idx" ON "pickup_items"("materialId");

-- CreateIndex
CREATE INDEX "pickup_snapshots_pickupId_idx" ON "pickup_snapshots"("pickupId");

-- CreateIndex
CREATE INDEX "pickups_requesterUserId_idx" ON "pickups"("requesterUserId");

-- CreateIndex
CREATE INDEX "pickups_collectorUserId_idx" ON "pickups"("collectorUserId");

-- CreateIndex
CREATE INDEX "pickups_status_idx" ON "pickups"("status");

-- CreateIndex
CREATE INDEX "topup_requests_userId_idx" ON "topup_requests"("userId");

-- CreateIndex
CREATE INDEX "wallet_transactions_userId_idx" ON "wallet_transactions"("userId");

-- CreateIndex
CREATE INDEX "wallet_transactions_walletId_idx" ON "wallet_transactions"("walletId");

-- CreateIndex
CREATE INDEX "withdraw_requests_userId_idx" ON "withdraw_requests"("userId");

-- AddForeignKey
ALTER TABLE "customer_dobs" ADD CONSTRAINT "customer_dobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collector_profiles" ADD CONSTRAINT "collector_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collector_pricing" ADD CONSTRAINT "collector_pricing_collectorUserId_fkey" FOREIGN KEY ("collectorUserId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collector_pricing" ADD CONSTRAINT "collector_pricing_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("materialId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickups" ADD CONSTRAINT "pickups_requesterUserId_fkey" FOREIGN KEY ("requesterUserId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_items" ADD CONSTRAINT "pickup_items_pickupId_fkey" FOREIGN KEY ("pickupId") REFERENCES "pickups"("pickupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_items" ADD CONSTRAINT "pickup_items_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("materialId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_snapshots" ADD CONSTRAINT "pickup_snapshots_pickupId_fkey" FOREIGN KEY ("pickupId") REFERENCES "pickups"("pickupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("walletId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topup_requests" ADD CONSTRAINT "topup_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdraw_requests" ADD CONSTRAINT "withdraw_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
