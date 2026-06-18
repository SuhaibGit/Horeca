import UserService from "../user/UserService";
import { compareAsync } from "../../Utility/encrypt";
import AuthenticationUtils from "./AuthenticationUtils";
import { randomInt, randomUUID } from "crypto";
import { prisma } from "../../config/dbConnection";
import { encryptSync } from "../../Utility/encrypt";

class AuthenticationService {
    private userService = new UserService();

    async authenticate(username: string, password: string) {
        const email = username.trim().toLowerCase();
        const user = await this.userService.findByEmail(email);

        if (!user) {
            return { success: false, message: "User does not exist" };
        }

        if (user.is_disabled === "YES") {
            return { success: false, message: "Account has been disabled." };
        }

        if (!user.is_active || !user.password_hash) {
            return {
                success: false,
                message: "Account not activated. Please complete registration.",
            };
        }

        const passwordMatch = await compareAsync(password, user.password_hash);
        if (!passwordMatch) {
            return { success: false, message: "Invalid credentials" };
        }

        const accessToken = AuthenticationUtils.generateJwtToken(user.user_id);

        return {
            success: true,
            accessToken,
            user: {
                user_id: user.user_id,
                email: user.email,
                full_name: user.full_name,
            },
        };
    }
    async register(body: { full_name?: string; name?: string; email: string }) {
        const email = body.email.trim().toLowerCase();
        const full_name = (body.full_name || body.name || "").trim();
        const existing = await this.userService.findByEmail(email);
        if (existing) {
            return { success: false, message: "Email is already registered." };
        }
        const user = await this.userService.create({
            full_name,
            email,
            is_active: false,
        });
        const otp = String(randomInt(100000, 999999));
        const guid = randomUUID();
        const expires_at = new Date(Date.now() + 10 * 60 * 1000);
        await prisma.userOtp.create({
            data: { user_id: user.user_id, otp, guid, expires_at },
        });
        console.log(`[DEV OTP] ${email} → ${otp} (guid: ${guid})`);
        const response: Record<string, unknown> = {
            success: true,
            guid,
            message: "Verification code sent.",
        };
        if (process.env.NODE_ENV === "development") {
            response.otp = otp;
        }
        return response;
    }
    async validateRegisterOtp(guid: string, code: string) {
        const otpRow = await prisma.userOtp.findFirst({
            where: { guid, otp: String(code).trim() },
        });
        if (!otpRow) return { success: false, message: "Invalid OTP" };
        if (otpRow.is_verified) return { success: false, message: "OTP already verified" };
        if (otpRow.expires_at < new Date()) return { success: false, message: "OTP expired" };
        await prisma.userOtp.update({
            where: { id: otpRow.id },
            data: { is_verified: true },
        });
        return { success: true, message: "OTP verified" };
    }
    async createPassword(body: { guid: string; code: string; password: string }) {
        const code = String(body.code).trim();
        const otpRow = await prisma.userOtp.findFirst({
            where: { guid: body.guid, otp: code },
        });
        if (!otpRow || !otpRow.is_verified) {
            return { success: false, message: "Invalid or unverified OTP" };
        }
        const hash = encryptSync(body.password);
        await this.userService.update(otpRow.user_id, {
            password_hash: hash,
            is_active: true,
        });
        return { success: true, message: "Password created" };
    }
    async getMe(userId: number) {
        const user = await this.userService.findById(userId);

        if (!user) {
            return { success: false, message: "User not found" };
        }

        return {
            success: true,
            user: {
                user_id: user.user_id,
                email: user.email,
                full_name: user.full_name,
            },
        };
    }

}

export default AuthenticationService;