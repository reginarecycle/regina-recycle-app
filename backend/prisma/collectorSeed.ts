import { PrismaClient, PickupStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const collector = await prisma.user.findUnique({
    where: { email: 'collector1@example.com' },
    select: { userId: true, email: true, role: true },
  });

  if (!collector) {
    throw new Error(
      'Collector user not found. First register collector1@example.com in Swagger.',
    );
  }

  if (collector.role !== 'COLLECTOR') {
    throw new Error('The user exists but is not a COLLECTOR.');
  }

  const collectorProfile = await prisma.collectorProfile.findUnique({
  where: { userId: collector.userId },
});

if (!collectorProfile) {
  throw new Error(
    'Collector profile not found. Register the collector through Swagger first.',
  );
}

  const materialData = [
    {
      name: 'Plastic Bottle',
      type: 'PLASTIC',
      photoUrl: 'https://example.com/plastic-bottle.png',
      co2Saved: 1.5,
      waterSaved: 2.1,
    },
    {
      name: 'Glass Bottle',
      type: 'GLASS',
      photoUrl: 'https://example.com/glass-bottle.png',
      co2Saved: 2.3,
      waterSaved: 3.2,
    },
    {
      name: 'Aluminum Can',
      type: 'METAL',
      photoUrl: 'https://example.com/aluminum-can.png',
      co2Saved: 1.9,
      waterSaved: 2.5,
    },
    {
      name: 'Cardboard Box',
      type: 'PAPER',
      photoUrl: 'https://example.com/cardboard-box.png',
      co2Saved: 1.2,
      waterSaved: 1.8,
    },
  ];

  for (const material of materialData) {
    await prisma.material.upsert({
      where: { name: material.name },
      update: {
        type: material.type,
        photoUrl: material.photoUrl,
        co2Saved: material.co2Saved,
        waterSaved: material.waterSaved,
      },
      create: material,
    });
  }

  const materials = await prisma.material.findMany({
    select: { materialId: true },
  });

  const customers: { userId: string }[] = [];

  for (let i = 1; i <= 5; i++) {
    const customer = await prisma.user.upsert({
      where: { email: `customer${i}@example.com` },
      update: {},
      create: {
        userId: `customer-${i}`,
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        password:
          '$2b$10$Vh8C8M7n0Y9lQW6c0mQv3u7k0vA5fY9n3m4FhW8mQ8m2bVQw5dL2C',
        role: 'CUSTOMER',
        phoneNumber: `30655500${i}`,
        emailVerified: true,
        agreedToTerms: true,
      },
      select: { userId: true },
    });

    customers.push(customer);

    await prisma.address.upsert({
      where: { addressId: `address-${i}` },
      update: {},
      create: {
        addressId: `address-${i}`,
        userId: customer.userId,
        line1: `${i} Main Street`,
        city: 'Regina',
        province: 'SK',
        postalCode: 'S4P3Y2',
        isPrimary: true,
      },
    });
  }

  const existingPickups = await prisma.pickup.count({
    where: { collectorUserId: collector.userId },
  });

  if (existingPickups === 0) {
    const statuses = [
      PickupStatus.PENDING,
      PickupStatus.ACCEPTED,
      PickupStatus.IN_PROGRESS,
      PickupStatus.COMPLETED,
      PickupStatus.CANCELLED,
    ];

    for (let i = 0; i < 10; i++) {
      await prisma.pickup.create({
        data: {
          pickupId: `pickup-${i + 1}`,
          requesterUserId: customers[i % customers.length].userId,
          collectorUserId: collector.userId,
          addressId: `address-${(i % customers.length) + 1}`,
          status: statuses[i % statuses.length],
          scheduledAt: new Date(),
          estimatedEarning: 20 + i,
          items: {
            create: [
              {
                materialId: materials[i % materials.length].materialId,
                quantity: (i % 5) + 1,
              },
            ],
          },
        },
      });
    }
  }

  console.log('Collector seed completed for:', collector.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
