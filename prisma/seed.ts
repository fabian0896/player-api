import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const email = process.env.DEFAULT_EMAIL!;
const password = process.env.DEFAULT_PASSWORD!;
const name = process.env.DEFAULT_NAME!;

const prisma = new PrismaClient();

(async () => {
  const hashedPassword = await hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      avatar: 'https://avatars.dicebear.com/api/big-ears-neutral/1.svg',
      role: 'admin',
    },
  });
})()
  .finally(async () => {
    await prisma.$disconnect();
  });
