/*
  Warnings:

  - You are about to drop the column `passwordHash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `securityAnswerHash` on the `withdraw_requests` table. All the data in the column will be lost.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "pickups" DROP CONSTRAINT "pickups_requesterUserId_fkey";

-- DropForeignKey
ALTER TABLE "topup_requests" DROP CONSTRAINT "topup_requests_userId_fkey";

-- DropForeignKey
ALTER TABLE "wallet_transactions" DROP CONSTRAINT "wallet_transactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "wallets" DROP CONSTRAINT "wallets_userId_fkey";

-- DropForeignKey
ALTER TABLE "withdraw_requests" DROP CONSTRAINT "withdraw_requests_userId_fkey";

-- AlterTable
ALTER TABLE "pickups" ALTER COLUMN "requesterUserId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "topup_requests" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "passwordHash",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "password" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "wallet_transactions" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "withdraw_requests" DROP COLUMN "securityAnswerHash",
ADD COLUMN     "securityAnswer" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "pickups" ADD CONSTRAINT "pickups_requesterUserId_fkey" FOREIGN KEY ("requesterUserId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallet_transactions" ADD CONSTRAINT "wallet_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topup_requests" ADD CONSTRAINT "topup_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdraw_requests" ADD CONSTRAINT "withdraw_requests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
