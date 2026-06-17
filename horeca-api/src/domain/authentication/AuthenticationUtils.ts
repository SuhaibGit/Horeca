import jwt from "jsonwebtoken";
import { jwtConfig } from "../../config/config";

class AuthenticationUtils {
    static generateJwtToken(userId: number) {
        return jwt.sign(
            { userId, user_id: userId, sub: String(userId) },
            jwtConfig.secret,
            { expiresIn: "7d" }
        );
    }

    static verifyJWTTokenPromise(token: string): Promise<jwt.JwtPayload> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, jwtConfig.secret, (err, decoded) => {
                if (err || !decoded) return reject(err);
                resolve(decoded as jwt.JwtPayload);
            });
        });
    }
}

export default AuthenticationUtils;