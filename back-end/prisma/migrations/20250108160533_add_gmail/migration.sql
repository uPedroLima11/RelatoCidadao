-- CreateTable
CREATE TABLE `estados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `sigla` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `estados_sigla_key`(`sigla`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cidades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `estadoId` INTEGER NOT NULL,

    UNIQUE INDEX `cidades_nome_estadoId_key`(`nome`, `estadoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `postagens` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NOT NULL,
    `localizacao` VARCHAR(191) NOT NULL,
    `foto` VARCHAR(191) NOT NULL,
    `estadoId` INTEGER NOT NULL,
    `cidadeId` INTEGER NOT NULL,
    `email` VARCHAR(255) NOT NULL, -- Mantendo a coluna email aqui para evitar duplicação
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cidades` ADD CONSTRAINT `cidades_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `estados`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postagens` ADD CONSTRAINT `postagens_estadoId_fkey` FOREIGN KEY (`estadoId`) REFERENCES `estados`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `postagens` ADD CONSTRAINT `postagens_cidadeId_fkey` FOREIGN KEY (`cidadeId`) REFERENCES `cidades`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- Removendo duplicação de alterações na coluna email
-- A coluna já foi definida durante a criação da tabela `postagens`.
