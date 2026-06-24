import { Response } from "express";
import { AuthRequest } from "../../config/middlewares";
import MenuService from "./MenuService";

class MenuController {
    private menuService = new MenuService();

    listItems = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.user_id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const result = await this.menuService.listItems(userId);
            return res.status(result.success ? 200 : 404).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Server error";
            return res.status(500).json({ success: false, message });
        }
    };

    getItem = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.user_id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const menuItemId = Number(req.params.id);
            if (!menuItemId) {
                return res.status(400).json({ success: false, message: "Invalid menu item id" });
            }

            const result = await this.menuService.getItem(userId, menuItemId);
            return res.status(result.success ? 200 : 404).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Server error";
            return res.status(500).json({ success: false, message });
        }
    };

    createItem = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.user_id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const result = await this.menuService.createItem(userId, req.body);
            return res.status(result.success ? 201 : 400).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Server error";
            return res.status(500).json({ success: false, message });
        }
    };

    updateItem = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.user_id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const menuItemId = Number(req.params.id);
            if (!menuItemId) {
                return res.status(400).json({ success: false, message: "Invalid menu item id" });
            }

            const result = await this.menuService.updateItem(userId, menuItemId, req.body);
            return res.status(result.success ? 200 : 400).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Server error";
            return res.status(500).json({ success: false, message });
        }
    };

    deleteItem = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.user_id;
            if (!userId) {
                return res.status(401).json({ success: false, message: "Unauthorized" });
            }

            const menuItemId = Number(req.params.id);
            if (!menuItemId) {
                return res.status(400).json({ success: false, message: "Invalid menu item id" });
            }

            const result = await this.menuService.deleteItem(userId, menuItemId);
            return res.status(result.success ? 200 : 404).json(result);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Server error";
            return res.status(500).json({ success: false, message });
        }
    };
}

export default MenuController;
