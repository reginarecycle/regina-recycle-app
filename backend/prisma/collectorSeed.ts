import { PrismaClient, PickupStatus, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding WITHOUT bcrypt...');

  // ---------------------------
  // 1. FIND COLLECTOR
  // ---------------------------
  const collector = await prisma.user.findUnique({
    where: { email: 'collector1@example.com' },
  });

  if (!collector) {
    throw new Error('Create collector via Swagger first');
  }

  // ---------------------------
  // 2. MATERIALS
  // ---------------------------
  const materials = await prisma.material.findMany();

  // ---------------------------
  // 3. CUSTOMERS (PLAIN PASSWORD)
  // ---------------------------
  const customers: { userId: string; addressId: string }[] = [];

  for (let i = 1; i <= 5; i++) {
    const user = await prisma.user.upsert({
      where: { email: `customer${i}@example.com` },
      update: {
        password: 'Password123!', // ❌ plain text
      },
      create: {
        userId: `customer-${i}`,
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        password: 'Password123!', // ❌ plain text
        role: Role.CUSTOMER,
        phoneNumber: `30655500${i}`,
        emailVerified: true,
        agreedToTerms: true,
      },
    });

    const address = await prisma.address.upsert({
      where: { addressId: `address-${i}` },
      update: {},
      create: {
        addressId: `address-${i}`,
        userId: user.userId,
        line1: `${i} Main Street`,
        city: 'Regina',
        province: 'SK',
        postalCode: 'S4P3Y2',
        isPrimary: true,
      },
    });

    customers.push({
      userId: user.userId,
      addressId: address.addressId,
    });
  }

  // ---------------------------
  // 4. PICKUPS
  // ---------------------------
  const statuses = [
    PickupStatus.PENDING,
    PickupStatus.ACCEPTED,
    PickupStatus.IN_PROGRESS,
    PickupStatus.COMPLETED,
    PickupStatus.CANCELLED,
  ];

  for (let i = 0; i < 10; i++) {
    const customer = customers[i % customers.length];

    const pickup = await prisma.pickup.create({
      data: {
        pickupId: `pickup-${Date.now()}-${i}`,
        requesterUserId: customer.userId,
        collectorUserId: collector.userId,
        addressId: customer.addressId,
        status: statuses[i % statuses.length],
        scheduledAt: new Date(),
        estimatedEarning: 20 + i,
      },
    });

    await prisma.pickupItem.create({
      data: {
        pickupId: pickup.pickupId,
        materialId: materials[i % materials.length].materialId,
        quantity: (i % 5) + 1,
      },
    });
  }

  console.log('✅ Seed complete (NO bcrypt)');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

