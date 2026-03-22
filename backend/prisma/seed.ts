import { PrismaClient } from '@prisma/client';
import seedMaterials from './seeds/materials';
import seedTips from './seeds/tips';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');
  
  try {
    await seedMaterials(prisma);
    await seedTips(prisma);
    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });