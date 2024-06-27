/*
  Warnings:

  - A unique constraint covering the columns `[position]` on the table `Faq` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Faq_position_key` ON `Faq`(`position`);
