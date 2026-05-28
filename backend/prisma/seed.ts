import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const defaultCategories = ['Work', 'Home', 'Personal', 'Errands', 'Study'];

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });

  for (const name of defaultCategories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const all = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  console.log(
    `Seeded ${all.length} categories: ${all.map((c) => c.name).join(', ')}`,
  );
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
