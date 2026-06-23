import cors from "cors";
import { Express } from "express";

const corsOpts = {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
    credentials: true,
};

const securitySetup = (app: Express, express: typeof import("express")) => {
    app.use(cors(corsOpts));
    app.use(express.json());
};

export default securitySetup;