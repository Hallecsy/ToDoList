-- CreateTable
CREATE TABLE `todos` (
    `uuid` VARCHAR(50) NOT NULL,
    `titre` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `priorite` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `isDone` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
