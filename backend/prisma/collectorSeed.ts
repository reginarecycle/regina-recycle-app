import { PrismaClient, Role, PickupStatus } from '@prisma/client';


const prisma = new PrismaClient();


async function main() {
 console.log('Seeding started...');


 // MATERIALS
 const materialData = [
   { name: 'Plastic Bottle', type: 'PLASTIC', co2Saved: 1.5, waterSaved: 2.1 },
   { name: 'Glass Bottle', type: 'GLASS', co2Saved: 2.3, waterSaved: 3.2 },
   { name: 'Aluminum Can', type: 'METAL', co2Saved: 1.9, waterSaved: 2.5 },
   { name: 'Cardboard Box', type: 'PAPER', co2Saved: 1.2, waterSaved: 1.8 },
   { name: 'Magazine', type: 'PAPER', co2Saved: 0.8, waterSaved: 1.1 },
   {
     name: 'Plastic Container',
     type: 'PLASTIC',
     co2Saved: 1.7,
     waterSaved: 2.4,
   },
   { name: 'Steel Scrap', type: 'METAL', co2Saved: 3.1, waterSaved: 2.8 },
 ];


 for (const material of materialData) {
   await prisma.material.upsert({
     where: { name: material.name },
     update: {
       type: material.type,
       co2Saved: material.co2Saved,
       waterSaved: material.waterSaved,
     },
     create: material,
   });
 }


 // COLLECTOR
 const collector = await prisma.user.upsert({
   where: { email: 'collector@test.com' },
   update: {},
   create: {
     name: 'Test Collector',
     email: 'collector@test.com',
     password: 'hashedpassword',
     role: Role.COLLECTOR,
     emailVerified: true,
     agreedToTerms: true,
   },
 });


 // COLLECTOR PROFILE
 await prisma.collectorProfile.upsert({
  where: { userId: collector.userId },
  update: {
    licenseId: '123456789',
    serviceFee: 10,
  },
  create: {
    userId: collector.userId,
    licenseId: '123456789',
    serviceFee: 10,
  },
});


 // CUSTOMERS
 const customers: { userId: string }[] = [];


 for (let i = 1; i <= 5; i++) {
   const customer = await prisma.user.upsert({
     where: { email: `customer${i}@test.com` },
     update: {},
     create: {
       name: `Customer ${i}`,
       email: `customer${i}@test.com`,
       password: 'hashedpassword',
       role: Role.CUSTOMER,
       emailVerified: true,
       agreedToTerms: true,
     },
     select: {
       userId: true,
     },
   });


   customers.push(customer);
 }


 // ADDRESSES
 for (let i = 0; i < customers.length; i++) {
  const line1 = `${100 + i} Main St`;
  const postalCode = 'S4P3Y2';

  const existingAddress = await prisma.address.findFirst({
    where: {
      userId: customers[i].userId,
      line1,
      postalCode,
    },
  });

  if (!existingAddress) {
    await prisma.address.create({
      data: {
        userId: customers[i].userId,
        line1,
        city: 'Regina',
        province: 'SK',
        postalCode,
        isPrimary: true,
      },
    });
  }
}


 const materials = await prisma.material.findMany();


 // OPTIONAL: only create pickups if none exist for this collector
 const existingPickups = await prisma.pickup.count({
   where: { collectorUserId: collector.userId },
 });


 if (existingPickups === 0) {
   for (let i = 0; i < 10; i++) {
     const customer = customers[i % customers.length];
     const address = await prisma.address.findFirst({
       where: { userId: customer.userId },
     });


     await prisma.pickup.create({
       data: {
         requesterUserId: customer.userId,
         collectorUserId: collector.userId,
         addressId: address?.addressId,
         scheduledAt: new Date(),
         status: [
           PickupStatus.PENDING,
           PickupStatus.ACCEPTED,
           PickupStatus.IN_PROGRESS,
           PickupStatus.COMPLETED,
         ][i % 4],
         estimatedEarning: Math.floor(Math.random() * 20) + 5,
         items: {
           create: [
             {
               materialId: materials[i % materials.length].materialId,
               quantity: Math.floor(Math.random() * 10) + 1,
             },
           ],
         },
       },
     });
   }
 }


 console.log('Seeding finished');
}


main()
 .catch((e) => {
   console.error(e);
   process.exit(1);
 })
 .finally(async () => {
   await prisma.$disconnect();
 });
