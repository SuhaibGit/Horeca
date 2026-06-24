import { Express, Request, Response, Router } from "express";
import AuthenticationRoutes from "../domain/authentication/AuthenticationRoutes";
import { verifyJWT_MW } from "../config/middlewares";
import UserRoutes from "../domain/user/UserRoutes";
import VenueRoutes from "../domain/venue/VenueRoutes";
import UploadRoutes from "../domain/upload/UploadRoutes";
import MenuRoutes from "../domain/menu/MenuRoutes";
const publicRouter = Router();
publicRouter
    .get("/", (_req: Request, res: Response) => {
        res.send("Horeca API");
    })
    .use("/auth", AuthenticationRoutes);

const protectedRouter = Router();
protectedRouter.use(verifyJWT_MW);
protectedRouter.use("/users", UserRoutes);
protectedRouter.use("/venues", VenueRoutes);
protectedRouter.use("/uploads", UploadRoutes);
protectedRouter.use("/menu-items", MenuRoutes);

const routerSetup = (app: Express) => {
    app.use(publicRouter);
    app.use(protectedRouter);
};

export default routerSetup;