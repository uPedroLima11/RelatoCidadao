/*
  Warnings:

  - You are about to alter the column `email` on the `postagens` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `postagens` MODIFY `email` VARCHAR(191) NOT NULL;
