/*
  Warnings:

  - You are about to drop the `ProductGender` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `ProductGender` DROP FOREIGN KEY `ProductGender_productId_fkey`;

-- DropTable
DROP TABLE `ProductGender`;
