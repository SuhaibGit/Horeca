import { Router, Request, Response } from "express";
import { logoUpload } from "./uploadConfig";

const router = Router();

router.post("/logo", (req: Request, res: Response) => {
    logoUpload.single("file")(req, res, (err: unknown) => {
        if (err) {
            const message = err instanceof Error ? err.message : "Upload failed";
            return res.status(400).json({ success: false, message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        return res.status(201).json({
            success: true,
            url: `/uploads/${req.file.filename}`,
        });
    });
});

export default router;
