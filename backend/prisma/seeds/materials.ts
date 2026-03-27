import { PrismaClient } from '@prisma/client';

const materials = [
  {
    name:        'Glass Bottles',
    type:        'recyclable',
    description: 'Clear & Coloured',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720018/glass_jar_rzu3cl.webp',
    co2Saved:    1.5,
    waterSaved:  4.0,
  },
  {
    name:        'PET Plastic',
    type:        'recyclable',
    description: 'Water & soft drink bottles',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773718729/plastic_bottle_duowdx.webp',
    co2Saved:    0.8,
    waterSaved:  2.1,
  },
  {
    name:        'Aluminium Cans',
    type:        'recyclable',
    description: 'Beverages only',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773718590/aluminum_can_muzqie.webp',
    co2Saved:    1.2,
    waterSaved:  3.5,
  },
  {
    name:        'Cardboard',
    type:        'recyclable',
    description: 'Corrugated & flat, flattened',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720424/cardboard_naeggh.jpg',
    co2Saved:    0.6,
    waterSaved:  1.8,
  },
  {
    name:        'HDPE Plastic',
    type:        'recyclable',
    description: 'Milk jugs & detergent containers',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773718729/plastic_bottle_duowdx.webp',
    co2Saved:    0.9,
    waterSaved:  2.4,
  },
  {
    name:        'Steel Cans',
    type:        'recyclable',
    description: 'Food & beverage tins',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720361/steel_can_gkzqgr.webp',
    co2Saved:    1.1,
    waterSaved:  3.0,
  },
  {
    name:        'Tetra Pak',
    type:        'recyclable',
    description: 'Juice, milk & soup cartons',
    photoUrl:    null,
    co2Saved:    0.7,
    waterSaved:  2.0,
  },
  {
    name:        'Newspaper & Paper',
    type:        'recyclable',
    description: 'Dry, unsoiled paper only',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1774382800/annie-spratt-hWJsOnaWTqs-unsplash_fnc4zy.jpg',
    co2Saved:    0.5,
    waterSaved:  1.4,
  },
  {
    name:        'Electronics',
    type:        'hazardous',
    description: 'Phones, monitors & small appliances',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1774382790/christopher-gower-_aXa21cf7rY-unsplash_hgxqfg.jpg',
    co2Saved:    2.0,
    waterSaved:  5.0,
  },
  {
    name:        'Batteries',
    type:        'hazardous',
    description: 'All types — household & automotive',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773873765/battery_jovvg2.webp',
    co2Saved:    1.0,
    waterSaved:  2.5,
  },
  {
    name:        'Scrap Metal',
    type:        'recyclable',
    description: 'Ferrous & non-ferrous metals',
    photoUrl:    null,
    co2Saved:    1.3,
    waterSaved:  3.2,
  },
  {
    name:        'Soft Plastics',
    type:        'recyclable',
    description: 'Bags, wrap & film plastics',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1774382743/teslariu-mihai-Vebp8agAUxU-unsplash_nno7kr.jpg',
    co2Saved:    0.2,
    waterSaved:  0.5,
  },
];

export default async function seedMaterials(prisma: PrismaClient) {
  console.log('Seeding materials...');

  for (const material of materials) {
    await prisma.material.upsert({
      where:  { name: material.name },
      update: {
        type:        material.type,
        description: material.description,
        photoUrl:    material.photoUrl,
        co2Saved:    material.co2Saved,
        waterSaved:  material.waterSaved,
      },
      create: material,
    });
  }

  console.log(`Successfully seeded ${materials.length} materials`);
}
