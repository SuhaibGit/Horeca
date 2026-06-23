import { Response } from "express";
import { AuthRequest } from "../../config/middlewares";
import UserService from "./UserService";

class UserController {
    updateMe = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.user_id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const service = new UserService();
            const result = await service.updateProfile(userId, req.body);
            return res.status(result.success ? 200 : 400).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Server error";
            return res.status(500).json({ success: false, message });
        }
    };
}

export default UserController;