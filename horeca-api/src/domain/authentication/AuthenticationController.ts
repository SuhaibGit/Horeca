import { Request, Response } from "express";
import AuthenticationService from "./AuthenticationService";

class AuthenticationController {
    authenticate = async (req: Request, res: Response) => {
        try {
            const service = new AuthenticationService();
            const { username, password } = req.body;
            const response = await service.authenticate(username, password);

            if (response.success) {
                return res.status(200).json(response);
            }
            return res.status(401).json(response);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Server error";
            return res.status(500).json({ success: false, message });
        }
    };
    register = async (req: Request, res: Response) => {
        const service = new AuthenticationService();
        const result = await service.register(req.body);
        return res.status(result.success ? 200 : 400).json(result);
    };
    validateRegisterOtp = async (req: Request, res: Response) => {
        const service = new AuthenticationService();
        const result = await service.validateRegisterOtp(req.body.guid, req.body.code);
        return res.status(result.success ? 200 : 400).json(result);
    };
    createPassword = async (req: Request, res: Response) => {
        const service = new AuthenticationService();
        const result = await service.createPassword(req.body);
        return res.status(result.success ? 200 : 400).json(result);
    };
}

export default AuthenticationController;