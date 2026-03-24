import { PrismaClient } from '@prisma/client';
export default async function seedMaterials(prisma: PrismaClient) {
  await prisma.material.createMany({
    skipDuplicates: true,
    data: [
      {
        name: "Aluminum Can",
        type: "recyclable",
        description: "Rinse before placing in the blue bin — even a quick rinse helps prevent contamination.",
        photoUrl: "https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773718590/aluminum_can_muzqie.webp",
        co2Saved: 1.2,
        waterSaved: 3.5,
      },
      {
        name: "Plastic Bottle",
        type: "recyclable",
        description: "Remove the cap and rinse thoroughly — caps are often a different plastic type.",
        photoUrl: "https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773718729/plastic_bottle_duowdx.webp",
        co2Saved: 0.8,
        waterSaved: 2.1,
      },
      {
        name: "Glass Jar",
        type: "recyclable",
        description: "Remove lids and rinse before recycling — glass can be recycled indefinitely without losing quality.",
        photoUrl: "https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720018/glass_jar_rzu3cl.webp",
        co2Saved: 1.5,
        waterSaved: 4.0,
      },
      {
        name: "Cardboard Box",
        type: "recyclable",
        description: "Flatten all boxes before recycling — greasy or wet cardboard goes in compost, not recycling.",
        photoUrl: "https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720424/cardboard_naeggh.jpg",
        co2Saved: 0.6,
        waterSaved: 1.8,
      },
      {
        name: "Steel Can",
        type: "recyclable",
        description: "Rinse and place in the blue bin — steel cans are 100% recyclable and can be reused endlessly.",
        photoUrl: "https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720361/steel_can_gkzqgr.webp",
        co2Saved: 1.1,
        waterSaved: 3.0,
      },
      {
        name: "Battery",
        type: "hazardous",
        description: "Never put in regular bins — drop off at designated e-waste or battery collection points.",
        photoUrl: "https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773873765/battery_jovvg2.webp",
        co2Saved: 1.0,
        waterSaved: 2.5,
      },
    ],
  });

  console.log("Seed data inserted");
}

