
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {

  await prisma.material.createMany({
    data: [
      {
        name: "Aluminum Can",
        type: "Metal",
        photoUrl: "https://example.com/aluminum-can.jpg",
        co2Saved: 1.2,
        waterSaved: 3.5,
      },
      {
        name: "Plastic Bottle",
        type: "Plastic",
        photoUrl: "https://example.com/plastic-bottle.jpg",
        co2Saved: 0.8,
        waterSaved: 2.1,
      },
      {
        name: "Glass Jar",
        type: "Glass",
        photoUrl: "https://example.com/glass-jar.jpg",
        co2Saved: 1.5,
        waterSaved: 4.0,
      },
      {
        name: "Cardboard Box",
        type: "Paper",
        photoUrl: "https://example.com/cardboard-box.jpg",
        co2Saved: 0.6,
        waterSaved: 1.8,
      },
      {
        name: "Steel Can",
        type: "Metal",
        photoUrl: "https://example.com/steel-can.jpg",
        co2Saved: 1.1,
        waterSaved: 3.0,
      },
    ],
     skipDuplicates: true
  });

  console.log("Seed data inserted");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
