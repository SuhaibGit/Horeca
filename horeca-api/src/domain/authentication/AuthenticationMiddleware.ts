import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const loginSchema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

export const registerSchema = z
    .object({
        full_name: z.string().min(1).optional(),
        name: z.string().min(1).optional(),
        email: z.string().email(),
    })
    .refine((d) => d.full_name || d.name, {
        message: "full_name is required",
        path: ["full_name"],
    });