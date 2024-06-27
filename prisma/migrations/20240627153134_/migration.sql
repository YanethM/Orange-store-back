/*
  Warnings:

  - You are about to drop the column `name` on the `Size` table. All the data in the column will be lost.
  - Added the required column `sizeName` to the `Size` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Size` DROP COLUMN `name`,
    ADD COLUMN `sizeName` VARCHAR(191) NOT NULL;
