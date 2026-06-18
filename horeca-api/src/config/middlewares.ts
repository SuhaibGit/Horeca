import { Request, Response, NextFunction } from "express";
import AuthenticationUtils from "../domain/authentication/AuthenticationUtils";
import { prisma } from "./dbConnection";

export type AuthRequest = Request & {
    user?: {
        user_id: number;
        email: string;
        full_name: string;
    };
};
export async function verifyJWT_MW(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized. Token missing.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = await AuthenticationUtils.verifyJWTTokenPromise(token);
        const userId = Number(decoded.userId);

        const user = await prisma.user.findUnique({
            where: { user_id: userId },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. User not found.",
            });
        }

        req.user = {
            user_id: user.user_id,
            email: user.email,
            full_name: user.full_name,
        };

        next();
    } catch {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
}