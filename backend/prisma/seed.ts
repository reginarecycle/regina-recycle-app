import { PrismaClient } from '@prisma/client';
import seedMaterials from './seeds/materials';
import seedTips from './seeds/tips';

const prisma = new PrismaClient();

async function main() {
  await seedMaterials(prisma);
  await seedTips(prisma);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
