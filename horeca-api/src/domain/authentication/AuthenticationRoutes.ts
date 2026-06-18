import { Router } from "express";
import AuthenticationController from "./AuthenticationController";
import { loginSchema } from "./AuthenticationMiddleware";
import { validateSchema } from "../../Utility/middleware";
import { registerSchema } from "./AuthenticationMiddleware";
import { verifyJWT_MW } from "../../config/middlewares";

const router = Router();
const controller = new AuthenticationController();

router.post(
    "/authenticate/credential",
    validateSchema(loginSchema),
    controller.authenticate
);
router.post("/register/account", validateSchema(registerSchema), controller.register);
router.post("/verify-verification-code", controller.validateRegisterOtp);
router.post("/create-password", controller.createPassword);
router.get("/me", verifyJWT_MW, controller.getMe);
export default router;