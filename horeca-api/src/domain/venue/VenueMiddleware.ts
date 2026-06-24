import { z } from "zod";

export const venueCreateSchema = z.object({
  name: z.string().min(1, "Venue name is required"),
  category: z.string().min(1, "Category is required"),
  brand_color: z.string().optional(),
  logo_url: z.string().optional(),
});

export const venueUpdateSchema = z
  .object({
    name: z.string().min(1, "Venue name is required").optional(),
    category: z.string().min(1, "Category is required").optional(),
    brand_color: z.string().optional(),
    logo_url: z.string().nullable().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.category !== undefined ||
      data.brand_color !== undefined ||
      data.logo_url !== undefined,
    { message: "At least one field is required" }
  );
