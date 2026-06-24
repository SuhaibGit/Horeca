import { Router } from "express";
import VenueController from "./VenueController";
import { validateSchema } from "../../Utility/middleware";
import { venueCreateSchema, venueUpdateSchema } from "./VenueMiddleware";

const venueRouter = Router();
const controller = new VenueController();

venueRouter.post("/", validateSchema(venueCreateSchema), controller.createVenue);
venueRouter.get("/me", controller.getMyVenue);
venueRouter.patch("/me", validateSchema(venueUpdateSchema), controller.updateMyVenue);

export default venueRouter;
