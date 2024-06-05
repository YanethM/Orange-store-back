/*
  Warnings:

  - A unique constraint covering the columns `[identification]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `associeted_vice_presidency` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cod_cost_center` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost_center` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `division` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_surname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identification` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_city` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `second_surname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vice_presidency` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `associeted_vice_presidency` VARCHAR(191) NOT NULL,
    ADD COLUMN `cod_cost_center` VARCHAR(191) NOT NULL,
    ADD COLUMN `company` VARCHAR(191) NOT NULL,
    ADD COLUMN `cost_center` VARCHAR(191) NOT NULL,
    ADD COLUMN `division` VARCHAR(191) NOT NULL,
    ADD COLUMN `first_surname` VARCHAR(191) NOT NULL,
    ADD COLUMN `identification` VARCHAR(191) NOT NULL,
    ADD COLUMN `payment_city` VARCHAR(191) NOT NULL,
    ADD COLUMN `position` VARCHAR(191) NOT NULL,
    ADD COLUMN `second_surname` VARCHAR(191) NOT NULL,
    ADD COLUMN `vice_presidency` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_identification_key` ON `User`(`identification`);
