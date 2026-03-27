import { PrismaClient } from '@prisma/client';


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
    description: 'Wine bottles, juice jars, and condiment containers.',
    tips:        'Rinse thoroughly and remove metal caps or lids before recycling.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720018/glass_jar_rzu3cl.webp',
    co2Saved:    1.5,
    waterSaved:  4.0,
  },
  {
    name:        'PET Plastic',
    type:        'recyclable',
    description: 'Water, juice, and soft drink bottles.',
    tips:        'Remove the cap and rinse thoroughly before recycling.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773718729/plastic_bottle_duowdx.webp',
    co2Saved:    0.8,
    waterSaved:  2.1,
  },
  {
    name:        'Aluminium Cans',
    type:        'recyclable',
    description: 'Soda cans, beer cans, and energy drink cans.',
    tips:        'Rinse out food residue. Labels can be left on.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773718590/aluminum_can_muzqie.webp',
    co2Saved:    1.2,
    waterSaved:  3.5,
  },
  {
    name:        'Cardboard',
    type:        'recyclable',
    description: 'Shipping boxes, packaging, and clean pizza boxes.',
    tips:        'Flatten boxes completely. Remove styrofoam or plastic packing materials.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720424/cardboard_naeggh.jpg',
    co2Saved:    0.6,
    waterSaved:  1.8,
  },
  {
    name:        'HDPE Plastic',
    type:        'recyclable',
    description: 'Milk jugs, detergent bottles, and shampoo containers.',
    tips:        'Rinse thoroughly. Remove caps if they are less than 2 inches in diameter.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773718729/plastic_bottle_duowdx.webp',
    co2Saved:    0.9,
    waterSaved:  2.4,
  },
  {
    name:        'Steel Cans',
    type:        'recyclable',
    description: 'Canned food, vegetables, and soup containers.',
    tips:        'Rinse and place in the blue bin. Labels can be left on.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773720361/steel_can_gkzqgr.webp',
    co2Saved:    1.1,
    waterSaved:  3.0,
  },
  {
    name:        'Tetra Pak',
    type:        'recyclable',
    description: 'Juice cartons, milk cartons, and soup packaging.',
    tips:        'Rinse thoroughly and flatten to save space in the blue bin.',
    photoUrl:    null,
    co2Saved:    0.7,
    waterSaved:  2.0,
  },
  {
    name:        'Newspaper & Paper',
    type:        'recyclable',
    description: 'Newsprint, office paper, magazines, and flyers.',
    tips:        'Keep dry and bundle together. Wet or food-soiled paper goes to compost.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1774382800/annie-spratt-hWJsOnaWTqs-unsplash_fnc4zy.jpg',
    co2Saved:    0.5,
    waterSaved:  1.4,
  },
  {
    name:        'Electronics',
    type:        'hazardous',
    description: 'Old laptops, smartphones, tablets, and cables.',
    tips:        'Drop off at designated e-waste recycling depots only. Do not discard in trash.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1774382790/christopher-gower-_aXa21cf7rY-unsplash_hgxqfg.jpg',
    co2Saved:    2.0,
    waterSaved:  5.0,
  },
  {
    name:        'Batteries',
    type:        'hazardous',
    description: 'AA, AAA, Lithium-ion, and button cell batteries.',
    tips:        'Do not bin. Drop off at designated collection centers or hardware stores.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1773873765/battery_jovvg2.webp',
    co2Saved:    1.0,
    waterSaved:  2.5,
  },
  {
    name:        'Scrap Metal',
    type:        'recyclable',
    description: 'Pipes, frames, and metal appliance parts.',
    tips:        'Remove non-metal attachments where possible before drop-off.',
    photoUrl:    'https://res.cloudinary.com/dxhy4qyzp/image/upload/v1774640376/photo-1723365316514-8509dea457f2_ewwaee.jpg',
    co2Saved:    1.3,
    waterSaved:  3.2,
  },
  {
    name:        'Soft Plastics',
    type:        'recyclable',
    description: 'Grocery bags, bread bags, and stretch wrap.',
    tips:        'Do not place in curbside bins. Drop off at grocery store return points.',
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
