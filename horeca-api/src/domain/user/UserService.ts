import UserRepository from "./UserRepository";

class UserService {
    private repo = new UserRepository();

    findByEmail(email: string) {
        return this.repo.findByEmail(email);
    }

    create(user: Parameters<UserRepository["create"]>[0]) {
        return this.repo.create(user);
    }

    update(userId: number, data: Record<string, unknown>) {
        return this.repo.update(userId, data);
    }
    findById(userId: number) {
        return this.repo.findById(userId);
    }
    async updateProfile(userId: number, data: { full_name?: string; email?: string }) {
        if (data.email) {
            const existing = await this.repo.findByEmail(data.email);
            if (existing && existing.user_id !== userId) {
                return { success: false, message: "Email is already in use" };
            }
        }

        const updated = await this.repo.update(userId, {
            ...(data.full_name && { full_name: data.full_name.trim() }),
            ...(data.email && { email: data.email.trim().toLowerCase() }),
        });

        return {
            success: true,
            user: {
                user_id: updated.user_id,
                email: updated.email,
                full_name: updated.full_name,
            },
        };
    }
}

export default UserService;