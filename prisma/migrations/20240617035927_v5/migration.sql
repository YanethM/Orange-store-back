/*
  Warnings:

  - Added the required column `stock` to the `Size` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Size` ADD COLUMN `stock` INTEGER NOT NULL;
