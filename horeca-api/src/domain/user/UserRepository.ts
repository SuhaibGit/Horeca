import { prisma } from "../../config/dbConnection";

class UserRepository {
    async findByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() },
        });
    }

    async create(user: {
        full_name: string;
        email: string;
        password_hash?: string | null;
        is_active?: boolean;
    }) {
        return prisma.user.create({
            data: {
                full_name: user.full_name,
                email: user.email.trim().toLowerCase(),
                password_hash: user.password_hash ?? null,
                is_active: user.is_active ?? false,
            },
        });
    }

    async update(userId: number, data: Record<string, unknown>) {
        return prisma.user.update({
            where: { user_id: userId },
            data,
        });
    }
}

export default UserRepository;