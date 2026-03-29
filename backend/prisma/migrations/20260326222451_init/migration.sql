-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'COLLECTOR');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EMAIL_PICKUP_REMINDER', 'IN_APP_PICKUP_REMINDER', 'ACCOUNT_ACTIVITY', 'PAYMENT_ACTIVITY', 'MARKETING', 'ALERT');

-- CreateEnum
CREATE TYPE "PickupStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'ACCEPTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TxType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "TxStatus" AS ENUM ('PENDING', 'FAILED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CARD', 'MOBILE_PAYMENT');

-- CreateEnum
CREATE TYPE "WithdrawType" AS ENUM ('INTERAC', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "PricingStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "users" (
    "userId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "password" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
    "agreedToTermsAt" TIMESTAMP(3),
    "emailOtp" TEXT,
    "emailOtpExpiresAt" TIMESTAMP(3),
    "passwordOtp" TEXT,
    "passwordOtpExpiresAt" TIMESTAMP(3),
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "customer_dobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_dobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collector_profiles" (
    "collectorProfileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "licenseId" TEXT NOT NULL,
    "serviceFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "feeType" TEXT NOT NULL DEFAULT 'PERCENTAGE',
    "bulkIncentiveEnabled" BOOLEAN NOT NULL DEFAULT false,
    "bulkThreshold" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collector_profiles_pkey" PRIMARY KEY ("collectorProfileId")
);

-- CreateTable
CREATE TABLE "notification_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailPickupReminder" BOOLEAN NOT NULL DEFAULT true,
    "emailAccountActivity" BOOLEAN NOT NULL DEFAULT true,
    "emailMarketing" BOOLEAN NOT NULL DEFAULT false,
    "emailPayment" BOOLEAN NOT NULL DEFAULT false,
    "inAppPickupReminder" BOOLEAN NOT NULL DEFAULT true,
    "inAppAlerts" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "addressId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("addressId")
);

-- CreateTable
CREATE TABLE "materials" (
    "materialId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "photoUrl" TEXT,
    "co2Saved" DOUBLE PRECISION,
    "waterSaved" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("materialId")
);

-- CreateTable
CREATE TABLE "collector_pricing" (
    "collectorPricingId" TEXT NOT NULL,
    "collectorUserId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "basePrice" DECIMAL(14,2) NOT NULL,
    "bulkPrice" DECIMAL(14,2),
    "status" "PricingStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "collector_pricing_pkey" PRIMARY KEY ("collectorPricingId")
);

-- CreateTable
CREATE TABLE "pickups" (
    "pickupId" TEXT NOT NULL,
    "requestNumber" SERIAL NOT NULL,
    "requesterUserId" TEXT,
    "collectorUserId" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "addressId" TEXT,
    "photoUrl" TEXT,
    "status" "PickupStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "estimatedEarning" DECIMAL(14,2),
    "actualEarning" DECIMAL(14,2),
    "estimatedCost" DECIMAL(14,2),
    "note" TEXT,

    CONSTRAINT "pickups_pkey" PRIMARY KEY ("pickupId")
);

-- CreateTable
CREATE TABLE "pickup_items" (
    "pickupId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "pickup_items_pkey" PRIMARY KEY ("pickupId","materialId")
);

-- CreateTable
CREATE TABLE "pickup_rejections" (
    "pickupId" TEXT NOT NULL,
    "collectorId" TEXT NOT NULL,
    "reason" TEXT,
    "comment" TEXT,
    "rejectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pickup_rejections_pkey" PRIMARY KEY ("pickupId","collectorId")
);

-- CreateTable
CREATE TABLE "pickup_snapshots" (
    "snapshotId" TEXT NOT NULL,
    "pickupId" TEXT NOT NULL,
    "materialId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "basePrice" DECIMAL(14,2) NOT NULL,
    "bulkPrice" DECIMAL(14,2),
    "bulkThreshold" INTEGER,
    "priceUsed" DECIMAL(14,2) NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pickup_snapshots_pkey" PRIMARY KEY ("snapshotId")
);

-- CreateTable
CREATE TABLE "wallets" (
    "walletId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "balance" DECIMAL(14,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("walletId")
);

-- CreateTable
CREATE TABLE "wallet_transactions" (
    "transactionId" TEXT NOT NULL,
    "referenceNumber" TEXT,
    "walletId" TEXT NOT NULL,
    "userId" TEXT,
    "type" "TxType" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "status" "TxStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wallet_transactions_pkey" PRIMARY KEY ("transactionId")
);

-- CreateTable
CREATE TABLE "topup_requests" (
    "topUpId" TEXT NOT NULL,
    "userId" TEXT,
    "paymentMethodId" TEXT,
    "amount" DECIMAL(14,2) NOT NULL,
    "status" "TxStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "topup_requests_pkey" PRIMARY KEY ("topUpId")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "paymentMethodId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PaymentMethodType" NOT NULL,
    "cardLast4" TEXT,
    "cardBrand" TEXT,
    "expMonth" INTEGER,
    "expYear" INTEGER,
    "mobileProvider" TEXT,
    "phoneNumber" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_methods_pkey" PRIMARY KEY ("paymentMethodId")
);

-- CreateTable
CREATE TABLE "withdraw_requests" (
    "withdrawId" TEXT NOT NULL,
    "userId" TEXT,
    "interacEmail" TEXT,
    "securityQuestion" TEXT,
    "securityAnswer" TEXT,
    "bankName" TEXT,
    "accountHolderName" TEXT,
    "accountNumber" TEXT,
    "routingNumber" TEXT,
    "withdrawType" "WithdrawType" NOT NULL DEFAULT 'INTERAC',
    "amount" DECIMAL(14,2) NOT NULL,
    "status" "TxStatus" NOT NULL DEFAULT 'PENDING',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),

    CONSTRAINT "withdraw_requests_pkey" PRIMARY KEY ("withdrawId")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notificationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notificationId")
);

-- CreateTable
CREATE TABLE "tips" (
    "tipId" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tips_pkey" PRIMARY KEY ("tipId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE UNIQUE INDEX "customer_dobs_userId_key" ON "customer_dobs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "collector_profiles_userId_key" ON "collector_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "collector_profiles_licenseId_key" ON "collector_profiles"("licenseId");

-- CreateIndex
CREATE INDEX "collector_profiles_licenseId_idx" ON "collector_profiles"("licenseId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_preferences_userId_key" ON "notification_preferences"("userId");

-- CreateIndex
CREATE INDEX "addresses_userId_idx" ON "addresses"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "addresses_userId_line1_postalCode_key" ON "addresses"("userId", "line1", "postalCode");

-- CreateIndex
CREATE UNIQUE INDEX "materials_name_key" ON "materials"("name");

-- CreateIndex
CREATE INDEX "materials_type_idx" ON "materials"("type");

-- CreateIndex
CREATE INDEX "collector_pricing_collectorUserId_idx" ON "collector_pricing"("collectorUserId");

-- CreateIndex
CREATE INDEX "collector_pricing_materialId_idx" ON "collector_pricing"("materialId");

-- CreateIndex
CREATE INDEX "collector_pricing_status_idx" ON "collector_pricing"("status");

-- CreateIndex
CREATE UNIQUE INDEX "collector_pricing_collectorUserId_materialId_key" ON "collector_pricing"("collectorUserId", "materialId");

-- CreateIndex
CREATE INDEX "pickups_requesterUserId_idx" ON "pickups"("requesterUserId");

-- CreateIndex
CREATE INDEX "pickups_collectorUserId_idx" ON "pickups"("collectorUserId");

-- CreateIndex
CREATE INDEX "pickups_status_idx" ON "pickups"("status");

-- CreateIndex
CREATE INDEX "pickups_scheduledAt_idx" ON "pickups"("scheduledAt");

-- CreateIndex
CREATE INDEX "pickup_items_pickupId_idx" ON "pickup_items"("pickupId");

-- CreateIndex
CREATE INDEX "pickup_items_materialId_idx" ON "pickup_items"("materialId");

-- CreateIndex
CREATE INDEX "pickup_rejections_collectorId_idx" ON "pickup_rejections"("collectorId");

-- CreateIndex
CREATE INDEX "pickup_snapshots_pickupId_idx" ON "pickup_snapshots"("pickupId");

-- CreateIndex
CREATE INDEX "pickup_snapshots_materialId_idx" ON "pickup_snapshots"("materialId");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_userId_key" ON "wallets"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "wallet_transactions_referenceNumber_key" ON "wallet_transactions"("referenceNumber");

-- CreateIndex
CREATE INDEX "wallet_transactions_userId_idx" ON "wallet_transactions"("userId");

-- CreateIndex
CREATE INDEX "wallet_transactions_walletId_idx" ON "wallet_transactions"("walletId");

-- CreateIndex
CREATE INDEX "wallet_transactions_status_idx" ON "wallet_transactions"("status");

-- CreateIndex
CREATE INDEX "wallet_transactions_createdAt_idx" ON "wallet_transactions"("createdAt");

-- CreateIndex
CREATE INDEX "topup_requests_userId_idx" ON "topup_requests"("userId");

-- CreateIndex
CREATE INDEX "payment_methods_userId_idx" ON "payment_methods"("userId");

-- CreateIndex
CREATE INDEX "payment_methods_type_idx" ON "payment_methods"("type");

-- CreateIndex
CREATE INDEX "withdraw_requests_userId_idx" ON "withdraw_requests"("userId");

-- CreateIndex
CREATE INDEX "withdraw_requests_status_idx" ON "withdraw_requests"("status");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- CreateIndex
CREATE INDEX "notifications_userId_type_idx" ON "notifications"("userId", "type");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "tips_active_idx" ON "tips"("active");

-- AddForeignKey
ALTER TABLE "customer_dobs" ADD CONSTRAINT "customer_dobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collector_profiles" ADD CONSTRAINT "collector_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collector_pricing" ADD CONSTRAINT "collector_pricing_collectorUserId_fkey" FOREIGN KEY ("collectorUserId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collector_pricing" ADD CONSTRAINT "collector_pricing_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("materialId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickups" ADD CONSTRAINT "pickups_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("addressId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickups" ADD CONSTRAINT "pickups_requesterUserId_fkey" FOREIGN KEY ("requesterUserId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickups" ADD CONSTRAINT "pickups_collectorUserId_fkey" FOREIGN KEY ("collectorUserId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_items" ADD CONSTRAINT "pickup_items_pickupId_fkey" FOREIGN KEY ("pickupId") REFERENCES "pickups"("pickupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_items" ADD CONSTRAINT "pickup_items_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("materialId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_rejections" ADD CONSTRAINT "pickup_rejections_pickupId_fkey" FOREIGN KEY ("pickupId") REFERENCES "pickups"("pickupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_rejections" ADD CONSTRAINT "pickup_rejections_collectorId_fkey" FOREIGN KEY ("collectorId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_snapshots" ADD CONSTRAINT "pickup_snapshots_pickupId_fkey" FOREIGN KEY ("pickupId") REFERENCES "pickups"("pickupId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pickup_snapshots" ADD CONSTRAINT "pickup_snapshots_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("materialId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "wallets"("walletId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topup_requests" ADD CONSTRAINT "topup_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topup_requests" ADD CONSTRAINT "topup_requests_paymentMethodId_fkey" FOREIGN KEY ("paymentMethodId") REFERENCES "payment_methods"("paymentMethodId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_methods" ADD CONSTRAINT "payment_methods_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdraw_requests" ADD CONSTRAINT "withdraw_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
