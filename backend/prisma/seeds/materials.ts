import { PrismaClient } from '@prisma/client';

// Old material names that were renamed — must be removed to avoid duplicates.
// We delete their CollectorPricing rows first (FK), then the material itself.
const LEGACY_NAMES = [
  'Aluminum Can',
  'Plastic Bottle',
  'Glass Jar',
  'Cardboard Box',
  'Steel Can',
  'Battery',
  'Newspaper',
  'Food Scraps',
  'Paint Can',
  'Yard Waste',
  'Plastic Bag',
];

const materials = [
  {
    name:        'Glass Bottles',
    type:        'recyclable',
    description: 'Reusable glass containers for beverages, sauces, and condiments',
    tips:        'Rinse before drop-off and remove metal lids — glass can be recycled indefinitely without losing purity.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720018/glass_jar_rzu3cl.webp',
    co2Saved:    1.5,
    waterSaved:  4.0,
  },
  {
    name:        'PET Plastic',
    type:        'recyclable',
    description: 'Lightweight plastic bottles for water, juice, and soft drinks',
    tips:        'Remove the cap and rinse thoroughly — caps are often a different plastic type and sorted separately.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773718729/plastic_bottle_duowdx.webp',
    co2Saved:    0.8,
    waterSaved:  2.1,
  },
  {
    name:        'Aluminium Cans',
    type:        'recyclable',
    description: 'Thin-walled metal cans used for beverages like soda, beer, and energy drinks',
    tips:        'A quick rinse is all it takes — aluminium is one of the most valuable recyclables and can be reprocessed endlessly.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773718590/aluminum_can_muzqie.webp',
    co2Saved:    1.2,
    waterSaved:  3.5,
  },
  {
    name:        'Cardboard',
    type:        'recyclable',
    description: 'Multi-layered paper-based material used for boxes, packaging, and shipping',
    tips:        'Flatten all boxes before drop-off — wet or greasy cardboard (e.g. pizza boxes) should go to compost, not recycling.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720424/cardboard_naeggh.jpg',
    co2Saved:    0.6,
    waterSaved:  1.8,
  },
  {
    name:        'HDPE Plastic',
    type:        'recyclable',
    description: 'Rigid plastic containers used for milk, water jugs, and detergent bottles',
    tips:        'Rinse out residue and leave the cap on — HDPE is one of the safest and most widely recycled plastics.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773718729/plastic_bottle_duowdx.webp',
    co2Saved:    0.9,
    waterSaved:  2.4,
  },
  {
    name:        'Steel Cans',
    type:        'recyclable',
    description: 'Steel containers used for canned food, vegetables, soups, and beverages',
    tips:        'Rinse and place in the blue bin — steel cans are 100% recyclable and can be remelted and reused endlessly.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720361/steel_can_gkzqgr.webp',
    co2Saved:    1.1,
    waterSaved:  3.0,
  },
  {
    name:        'Tetra Pak',
    type:        'recyclable',
    description: 'Multi-layer cartons used for juice, milk, broth, and soup packaging',
    tips:        'Rinse, flatten, and reseal — Tetra Pak cartons are fully recyclable but require a specialised processing facility.',
    photoUrl:    null,
    co2Saved:    0.7,
    waterSaved:  2.0,
  },
  {
    name:        'Newspaper & Paper',
    type:        'recyclable',
    description: 'Dry paper products including newsprint, office paper, magazines, and flyers',
    tips:        'Keep dry and bundle together — wet or food-soiled paper cannot be recycled and should go to compost instead.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1774382800/annie-spratt-hWJsOnaWTqs-unsplash_fnc4zy.jpg',
    co2Saved:    0.5,
    waterSaved:  1.4,
  },
  {
    name:        'Electronics',
    type:        'hazardous',
    description: 'Electronic devices including phones, laptops, monitors, and small appliances',
    tips:        'Never place in regular bins — drop off at a certified e-waste facility to prevent toxic materials from entering landfills.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1774382790/christopher-gower-_aXa21cf7rY-unsplash_hgxqfg.jpg',
    co2Saved:    2.0,
    waterSaved:  5.0,
  },
  {
    name:        'Batteries',
    type:        'hazardous',
    description: 'Portable power cells including household AA/AAA, button cells, and automotive batteries',
    tips:        'Never throw in the trash — drop off at a designated battery collection point to prevent chemical leaks into soil and water.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773873765/battery_jovvg2.webp',
    co2Saved:    1.0,
    waterSaved:  2.5,
  },
  {
    name:        'Scrap Metal',
    type:        'recyclable',
    description: 'Ferrous and non-ferrous metal pieces including pipes, frames, and appliance parts',
    tips:        'Remove non-metal attachments where possible — scrap metal is highly valuable and recycling it saves significant energy over mining new ore.',
    photoUrl:    null,
    co2Saved:    1.3,
    waterSaved:  3.2,
  },
  {
    name:        'Soft Plastics',
    type:        'recyclable',
    description: 'Flexible plastic films including grocery bags, bread bags, and stretch wrap',
    tips:        'Do not place in curbside bins — collect and drop off at a grocery store soft-plastic return point for proper processing.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1774382743/teslariu-mihai-Vebp8agAUxU-unsplash_nno7kr.jpg',
    co2Saved:    0.2,
    waterSaved:  0.5,
  },
];

export default async function seedMaterials(prisma: PrismaClient) {
  console.log('Seeding materials...');

  // Delete legacy materials — remove their CollectorPricing FK rows first,
  // then the material. PickupSnapshot uses Restrict so skip if pickups exist.
  for (const name of LEGACY_NAMES) {
    const mat = await prisma.material.findUnique({ where: { name } });
    if (!mat) continue;

    const hasPickupSnapshots = await prisma.pickupSnapshot.count({
      where: { materialId: mat.materialId },
    });

    if (hasPickupSnapshots > 0) {
      console.log(`  Skipping legacy material "${name}" — referenced by pickup snapshots`);
      // At minimum, update its description/tips so it looks correct
      await prisma.material.update({
        where: { materialId: mat.materialId },
        data:  { description: `[Legacy] ${name}`, tips: null },
      });
      continue;
    }

    await prisma.collectorPricing.deleteMany({ where: { materialId: mat.materialId } });
    await prisma.pickupItem.deleteMany({ where: { materialId: mat.materialId } });
    await prisma.material.delete({ where: { materialId: mat.materialId } });
    console.log(`  Removed legacy material: ${name}`);
  }

  // Upsert canonical materials
  for (const material of materials) {
    await prisma.material.upsert({
      where:  { name: material.name },
      update: {
        type:        material.type,
        description: material.description,
        tips:        material.tips,
        photoUrl:    material.photoUrl,
        co2Saved:    material.co2Saved,
        waterSaved:  material.waterSaved,
      },
      create: material,
    });
  }

  console.log(`Successfully seeded ${materials.length} materials`);
}
