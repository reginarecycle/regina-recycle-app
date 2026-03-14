/*
  Warnings:

  - A unique constraint covering the columns `[content]` on the table `tips` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "agreedToTermsAt" TIMESTAMP(3),
ADD COLUMN     "emailOtp" TEXT,
ADD COLUMN     "emailOtpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "passwordOtp" TEXT,
ADD COLUMN     "passwordOtpExpiresAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "tips_content_key" ON "tips"("content");
