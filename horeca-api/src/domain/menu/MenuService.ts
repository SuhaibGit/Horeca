import { Prisma } from "@prisma/client";
import VenueRepository from "../venue/VenueRepository";
import MenuRepository, { MenuItemUpdateData } from "./MenuRepository";

type MenuItemRecord = {
    menu_item_id: number;
    venue_id: number;
    name: string;
    description: string | null;
    price: Prisma.Decimal;
    category: string;
    fulfillment_type: string;
    serving_periods: Prisma.JsonValue;
    image_url: string | null;
    tags: Prisma.JsonValue;
    allergens: Prisma.JsonValue;
    is_available: boolean;
};

type MenuItemPayload = {
    menu_item_id: number;
    venue_id: number;
    name: string;
    description: string | null;
    price: number;
    category: string;
    fulfillment_type: string;
    serving_periods: string[];
    image_url: string | null;
    tags: string[];
    allergens: string[];
    is_available: boolean;
};

function toMenuItemPayload(item: MenuItemRecord): MenuItemPayload {
    return {
        menu_item_id: item.menu_item_id,
        venue_id: item.venue_id,
        name: item.name,
        description: item.description,
        price: Number(item.price),
        category: item.category,
        fulfillment_type: item.fulfillment_type,
        serving_periods: item.serving_periods as string[],
        image_url: item.image_url,
        tags: item.tags as string[],
        allergens: item.allergens as string[],
        is_available: item.is_available,
    };
}

type MenuItemCreateBody = {
    name: string;
    description?: string;
    price: number;
    category: string;
    fulfillment_type?: string;
    serving_periods: string[];
    image_url?: string;
    tags?: string[];
    allergens?: string[];
    is_available?: boolean;
};

class MenuService {
    private menuRepo = new MenuRepository();
    private venueRepo = new VenueRepository();

    private async getUserVenue(userId: number) {
        return this.venueRepo.findByOwnerId(userId);
    }

    async listItems(userId: number) {
        const venue = await this.getUserVenue(userId);
        if (!venue) {
            return { success: false as const, message: "Venue not found" };
        }

        const items = await this.menuRepo.findByVenueId(venue.venue_id);
        return {
            success: true as const,
            items: items.map(toMenuItemPayload),
        };
    }

    async getItem(userId: number, menuItemId: number) {
        const venue = await this.getUserVenue(userId);
        if (!venue) {
            return { success: false as const, message: "Venue not found" };
        }

        const item = await this.menuRepo.findById(menuItemId);
        if (!item || item.venue_id !== venue.venue_id) {
            return { success: false as const, message: "Menu item not found" };
        }

        return { success: true as const, item: toMenuItemPayload(item) };
    }

    async createItem(userId: number, body: MenuItemCreateBody) {
        const venue = await this.getUserVenue(userId);
        if (!venue) {
            return { success: false as const, message: "Venue not found" };
        }

        const item = await this.menuRepo.create({
            venue_id: venue.venue_id,
            name: body.name,
            description: body.description,
            price: body.price,
            category: body.category,
            fulfillment_type: body.fulfillment_type,
            serving_periods: body.serving_periods,
            image_url: body.image_url ?? null,
            tags: body.tags,
            allergens: body.allergens,
            is_available: body.is_available,
        });

        return { success: true as const, item: toMenuItemPayload(item) };
    }

    async updateItem(userId: number, menuItemId: number, data: MenuItemUpdateData) {
        const venue = await this.getUserVenue(userId);
        if (!venue) {
            return { success: false as const, message: "Venue not found" };
        }

        const existing = await this.menuRepo.findById(menuItemId);
        if (!existing || existing.venue_id !== venue.venue_id) {
            return { success: false as const, message: "Menu item not found" };
        }

        const updated = await this.menuRepo.update(menuItemId, data);
        return { success: true as const, item: toMenuItemPayload(updated) };
    }

    async deleteItem(userId: number, menuItemId: number) {
        const venue = await this.getUserVenue(userId);
        if (!venue) {
            return { success: false as const, message: "Venue not found" };
        }

        const existing = await this.menuRepo.findById(menuItemId);
        if (!existing || existing.venue_id !== venue.venue_id) {
            return { success: false as const, message: "Menu item not found" };
        }

        await this.menuRepo.delete(menuItemId);
        return { success: true as const, message: "Menu item deleted" };
    }
}

export default MenuService;
