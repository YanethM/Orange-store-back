/*
  Warnings:

  - You are about to drop the column `gender` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Orders` ADD COLUMN `gender` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Product` DROP COLUMN `gender`;
