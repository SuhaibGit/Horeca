import { Router } from "express";
import UserController from "./UserController";
import { updateProfileSchema } from "./UserMiddleware";
import { validateSchema } from "../../Utility/middleware";

const router = Router();
const controller = new UserController();

router.patch(
    "/me",
    validateSchema(updateProfileSchema),
    controller.updateMe
);

export default router;