#!/bin/sh
set -e

echo "Applying migrations…"
npx prisma migrate deploy

echo "Seeding categories (idempotent)…"
node -e "
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
(async () => {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  for (const name of ['Work','Home','Personal','Errands','Study']) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
  }
  await prisma.\$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
"

echo "Starting Nest on port \$PORT…"
exec node dist/main.js
