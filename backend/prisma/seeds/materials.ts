
import { PrismaClient } from '@prisma/client';
export default async function seedMaterials(prisma: PrismaClient) {
  await prisma.material.createMany({
    data: [
      {
        name: "Aluminum Can",
        type: "Metal",
        photoUrl: "https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773718590/aluminum_can_muzqie.webp",
        co2Saved: 1.2,
        waterSaved: 3.5,
      },
      {
        name: "Plastic Bottle",
        type: "Plastic",
        photoUrl: "https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773718729/plastic_bottle_duowdx.webp",
        co2Saved: 0.8,
        waterSaved: 2.1,
      },
      {
        name: "Glass Jar",
        type: "Glass",
        photoUrl: "https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720018/glass_jar_rzu3cl.webp",
        co2Saved: 1.5,
        waterSaved: 4.0,
      },
      {
        name: "Cardboard Box",
        type: "Paper",
        photoUrl: "https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720424/cardboard_naeggh.jpg",
        co2Saved: 0.6,
        waterSaved: 1.8,
      },
      {
        name: "Steel Can",
        type: "Metal",
        photoUrl: "https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720361/steel_can_gkzqgr.webp",
        co2Saved: 1.1,
        waterSaved: 3.0,
      },

      {
        name: "Battery",
        type: "Batteries",
        photoUrl:"https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773873765/battery_jovvg2.webp",
        co2Saved: 1.0,
        waterSaved: 2.5,

      }
    ],
     skipDuplicates: true
  });

  console.log("Seed data inserted");
}

