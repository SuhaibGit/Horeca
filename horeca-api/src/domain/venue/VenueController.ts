import { Response } from "express";
import { AuthRequest } from "../../config/middlewares";
import VenueService from "./VenueService";

class VenueController {
  private venueService = new VenueService();

  getMyVenue = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const result = await this.venueService.getMyVenue(userId);
      return res.status(result.success ? 200 : 404).json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({ success: false, message });
    }
  };

  createVenue = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const result = await this.venueService.createVenue(userId, req.body);
      return res.status(result.success ? 201 : 400).json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({ success: false, message });
    }
  };

  updateMyVenue = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.user_id;
      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const result = await this.venueService.updateMyVenue(userId, req.body);
      return res.status(result.success ? 200 : 400).json(result);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Server error";
      return res.status(500).json({ success: false, message });
    }
  };
}

export default VenueController;
