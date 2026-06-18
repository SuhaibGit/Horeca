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
}

export default UserService;