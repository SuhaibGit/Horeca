import { Express, Request, Response, Router } from "express";
import AuthenticationRoutes from "../domain/authentication/AuthenticationRoutes";
import { verifyJWT_MW } from "../config/middlewares";
import UserRoutes from "../domain/user/UserRoutes";

const publicRouter = Router();
publicRouter
    .get("/", (_req: Request, res: Response) => {
        res.send("Horeca API");
    })
    .use("/auth", AuthenticationRoutes);

const protectedRouter = Router();
protectedRouter
    .use(verifyJWT_MW)      // every route below needs a token
    .use("/users", UserRoutes);

const routerSetup = (app: Express) => {
    app.use(publicRouter);
    app.use(protectedRouter);
};

export default routerSetup;