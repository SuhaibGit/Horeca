import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.get("/", (_req, res) => {
    res.send("Horeca API is running");
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});