/*
  Warnings:

  - Added the required column `userId` to the `Pickup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pickup" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Pickup" ADD CONSTRAINT "Pickup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
