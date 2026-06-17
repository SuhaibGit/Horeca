import dotenv from "dotenv";
dotenv.config();

export const jwtConfig = {
    secret: process.env.SECRET || "dev-secret-change-me",
    saltRound: 10,
};