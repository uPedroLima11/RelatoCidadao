/*
  Warnings:

  - Made the column `nome` on table `postagens` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `postagens` MODIFY `nome` VARCHAR(191) NOT NULL;
