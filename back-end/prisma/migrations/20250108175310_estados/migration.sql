/*
  Warnings:

  - You are about to drop the `cidades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estados` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cidades` DROP FOREIGN KEY `cidades_estadoId_fkey`;

-- DropForeignKey
ALTER TABLE `postagens` DROP FOREIGN KEY `postagens_cidadeId_fkey`;

-- DropForeignKey
ALTER TABLE `postagens` DROP FOREIGN KEY `postagens_estadoId_fkey`;

-- DropIndex
DROP INDEX `postagens_cidadeId_fkey` ON `postagens`;

-- DropIndex
DROP INDEX `postagens_estadoId_fkey` ON `postagens`;

-- DropTable
DROP TABLE `cidades`;

-- DropTable
DROP TABLE `estados`;
