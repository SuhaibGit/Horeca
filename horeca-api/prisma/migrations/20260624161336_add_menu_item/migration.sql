-- CreateTable
CREATE TABLE `menu_item` (
    `menu_item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `venue_id` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `price` DECIMAL(10, 2) NOT NULL,
    `category` VARCHAR(64) NOT NULL,
    `fulfillment_type` VARCHAR(32) NOT NULL DEFAULT 'All Channels',
    `serving_periods` JSON NOT NULL,
    `image_url` VARCHAR(512) NULL,
    `tags` JSON NOT NULL,
    `allergens` JSON NOT NULL,
    `is_available` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `menu_item_venue_id_idx`(`venue_id`),
    PRIMARY KEY (`menu_item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `menu_item` ADD CONSTRAINT `menu_item_venue_id_fkey` FOREIGN KEY (`venue_id`) REFERENCES `venue`(`venue_id`) ON DELETE CASCADE ON UPDATE CASCADE;
