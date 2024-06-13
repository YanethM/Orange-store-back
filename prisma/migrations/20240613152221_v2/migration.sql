/*
  Warnings:

  - Made the column `background` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Product` MODIFY `background` VARCHAR(191) NOT NULL;
