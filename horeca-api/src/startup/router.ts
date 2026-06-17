import { Express, Request, Response, Router } from "express";
import AuthenticationRoutes from "../domain/authentication/AuthenticationRoutes";

const publicRouter = Router();
publicRouter
    .get("/", (_req: Request, res: Response) => {
        res.send("Horeca API");
    })
    .use("/auth", AuthenticationRoutes);

const protectedRouter = Router();
// later: protectedRouter.use(verifyJWT_MW)

const routerSetup = (app: Express) => {
    app.use(publicRouter);
    app.use(protectedRouter);
};

export default routerSetup;