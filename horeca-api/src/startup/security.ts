import express from "express";
import dotenv from "dotenv";

import appSetup from "./startup/init";
import routerSetup from "./startup/router";
import securitySetup from "./startup/security";
import "./config/dbConnection";

dotenv.config();

const app = express();

securitySetup(app, express);
routerSetup(app);
appSetup(app);