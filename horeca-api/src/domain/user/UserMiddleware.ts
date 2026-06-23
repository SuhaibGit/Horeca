import { z } from "zod";

export const updateProfileSchema = z.object({
    full_name: z.string().min(1, "Name is required").optional(),
    email: z.string().email("Invalid email").optional(),
}).refine((data) => data.full_name || data.email, {
    message: "At least one field (full_name or email) is required",
});