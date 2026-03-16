/*
  Warnings:

  - A unique constraint covering the columns `[userId,line1,postalCode]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "addresses_userId_line1_postalCode_key" ON "addresses"("userId", "line1", "postalCode");
