import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';

const defaultCategories = ['Work', 'Home', 'Personal', 'Errands', 'Study'];

async function main() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
  });
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
