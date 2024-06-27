/*
  Warnings:

  - You are about to drop the column `status` on the `Faq` table. All the data in the column will be lost.
  - Added the required column `position` to the `Faq` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Faq` DROP COLUMN `status`,
    ADD COLUMN `position` INTEGER NOT NULL;
