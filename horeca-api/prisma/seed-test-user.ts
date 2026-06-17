import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    const hash = bcrypt.hashSync("password123", 10);

    await prisma.user.upsert({
        where: { email: "test@example.com" },
        update: {},
        create: {
            full_name: "Test User",
            email: "test@example.com",
            password_hash: hash,
            is_active: true,
        },
    });

    console.log("Test user ready: test@example.com / password123");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());