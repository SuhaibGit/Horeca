-- CreateTable
CREATE TABLE `venue` (
    `venue_id` INTEGER NOT NULL AUTO_INCREMENT,
    `owner_user_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `category` VARCHAR(64) NOT NULL,
    `brand_color` VARCHAR(16) NOT NULL DEFAULT '#0A46A6',
    `logo_url` VARCHAR(512) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `venue_owner_user_id_idx`(`owner_user_id`),
    PRIMARY KEY (`venue_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `venue` ADD CONSTRAINT `venue_owner_user_id_fkey` FOREIGN KEY (`owner_user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
