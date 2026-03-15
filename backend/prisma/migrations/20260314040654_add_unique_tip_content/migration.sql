/*
  Warnings:

  - A unique constraint covering the columns `[content]` on the table `tips` will be added. If there are existing duplicate values, this will fail.

*/

-- CreateIndex
CREATE UNIQUE INDEX "tips_content_key" ON "tips"("content");
