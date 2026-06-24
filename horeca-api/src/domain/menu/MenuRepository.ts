import { Prisma } from "@prisma/client";
import { prisma } from "../../config/dbConnection";

export type MenuItemUpdateData = {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    fulfillment_type?: string;
    serving_periods?: string[];
    image_url?: string | null;
    tags?: string[];
    allergens?: string[];
    is_available?: boolean;
};

class MenuRepository {
    async findByVenueId(venueId: number) {
        return prisma.menuItem.findMany({
            where: { venue_id: venueId },
            orderBy: { created_at: "desc" },
        });
    }

    async findById(menuItemId: number) {
        return prisma.menuItem.findUnique({
            where: { menu_item_id: menuItemId },
        });
    }

    async create(data: {
        venue_id: number;
        name: string;
        description?: string;
        price: number;
        category: string;
        fulfillment_type?: string;
        serving_periods: string[];
        image_url?: string | null;
        tags?: string[];
        allergens?: string[];
        is_available?: boolean;
    }) {
        return prisma.menuItem.create({
            data: {
                venue_id: data.venue_id,
                name: data.name.trim(),
                description: data.description?.trim() ?? null,
                price: data.price,
                category: data.category.trim(),
                fulfillment_type: data.fulfillment_type ?? "All Channels",
                serving_periods: data.serving_periods,
                image_url: data.image_url ?? null,
                tags: data.tags ?? [],
                allergens: data.allergens ?? [],
                is_available: data.is_available ?? true,
            },
        });
    }

    async update(menuItemId: number, data: MenuItemUpdateData) {
        const patch: Prisma.MenuItemUpdateInput = {};

        if (data.name !== undefined) {
            patch.name = data.name.trim();
        }
        if (data.description !== undefined) {
            patch.description = data.description.trim();
        }
        if (data.price !== undefined) {
            patch.price = data.price;
        }
        if (data.category !== undefined) {
            patch.category = data.category.trim();
        }
        if (data.fulfillment_type !== undefined) {
            patch.fulfillment_type = data.fulfillment_type;
        }
        if (data.serving_periods !== undefined) {
            patch.serving_periods = data.serving_periods;
        }
        if (data.image_url !== undefined) {
            patch.image_url = data.image_url;
        }
        if (data.tags !== undefined) {
            patch.tags = data.tags;
        }
        if (data.allergens !== undefined) {
            patch.allergens = data.allergens;
        }
        if (data.is_available !== undefined) {
            patch.is_available = data.is_available;
        }

        return prisma.menuItem.update({
            where: { menu_item_id: menuItemId },
            data: patch,
        });
    }

    async delete(menuItemId: number) {
        return prisma.menuItem.delete({
            where: { menu_item_id: menuItemId },
        });
    }
}

export default MenuRepository;
