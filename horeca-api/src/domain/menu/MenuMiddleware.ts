import { z } from "zod";

const fulfillmentTypes = ["All Channels", "Dine In Only", "Delivery Only"] as const;

export const menuItemCreateSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.number().positive("Price must be greater than 0"),
    category: z.string().min(1, "Category is required"),
    fulfillment_type: z.enum(fulfillmentTypes).optional(),
    serving_periods: z.array(z.string()).min(1, "At least one serving period is required"),
    image_url: z.string().optional(),
    tags: z.array(z.string()).optional(),
    allergens: z.array(z.string()).optional(),
    is_available: z.boolean().optional(),
});

export const menuItemUpdateSchema = z
    .object({
        name: z.string().min(1, "Name is required").optional(),
        description: z.string().optional(),
        price: z.number().positive("Price must be greater than 0").optional(),
        category: z.string().min(1, "Category is required").optional(),
        fulfillment_type: z.enum(fulfillmentTypes).optional(),
        serving_periods: z.array(z.string()).min(1).optional(),
        image_url: z.string().nullable().optional(),
        tags: z.array(z.string()).optional(),
        allergens: z.array(z.string()).optional(),
        is_available: z.boolean().optional(),
    })
    .refine(
        (data) =>
            data.name !== undefined ||
            data.description !== undefined ||
            data.price !== undefined ||
            data.category !== undefined ||
            data.fulfillment_type !== undefined ||
            data.serving_periods !== undefined ||
            data.image_url !== undefined ||
            data.tags !== undefined ||
            data.allergens !== undefined ||
            data.is_available !== undefined,
        { message: "At least one field is required" }
    );
