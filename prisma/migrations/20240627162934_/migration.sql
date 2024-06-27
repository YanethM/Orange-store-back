/*
  Warnings:

  - You are about to drop the column `gender` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Product` DROP COLUMN `gender`;

-- CreateTable
CREATE TABLE `ProductGender` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productId` INTEGER NOT NULL,
    `gender` VARCHAR(191) NOT NULL,

    INDEX `ProductGender_productId_idx`(`productId`),
    UNIQUE INDEX `ProductGender_productId_gender_key`(`productId`, `gender`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductGender` ADD CONSTRAINT `ProductGender_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
