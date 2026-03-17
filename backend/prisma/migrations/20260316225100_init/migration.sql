-- AlterTable
ALTER TABLE "notification_preferences" ADD COLUMN     "emailPayment" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "agreedToTerms" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "agreedToTermsAt" TIMESTAMP(3),
ADD COLUMN     "emailOtp" TEXT,
ADD COLUMN     "emailOtpExpiresAt" TIMESTAMP(3),
ADD COLUMN     "passwordOtp" TEXT,
ADD COLUMN     "passwordOtpExpiresAt" TIMESTAMP(3);
