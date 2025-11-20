import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = '988552';
  const email = 'admin@local.test';

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { username },
    update: { password: hashed, email, role: 'admin' },
    create: { username, email, password: hashed, role: 'admin' },
  });

  console.log(`Seed complete: user=${username} password=${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
