import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tips = [
  { title: 'Milk Containers', content: 'Rinse milk containers before storage to prevent odors.' },
  { title: 'Cardboard Boxes', content: 'Flatten cardboard boxes to save space in your recycling bin.' },
  { title: 'Plastic Bottles', content: 'Remove bottle caps before recycling plastic bottles.' },
  { title: 'Glass Jars', content: 'Glass jars can be recycled indefinitely without losing quality.' },
  { title: 'Food Containers', content: 'Rinse food residue off containers before placing them in recycling.' },
  { title: 'Plastic Bags', content: 'Plastic bags cannot go in curbside recycling — drop them off at grocery stores instead.' },
  { title: 'Aluminum Cans', content: 'Aluminum cans are one of the most valuable recyclables — always recycle them.' },
  { title: 'Pizza Boxes', content: 'Paper that is wet or greasy, like pizza boxes, cannot be recycled.' },
  { title: 'Electronics', content: 'Electronics should never go in regular recycling — find an e-waste drop-off near you.' },
  { title: 'Food Scraps', content: 'Composting food scraps reduces landfill waste and creates nutrient-rich soil.' },
  { title: 'Shredded Paper', content: 'Shredded paper should be placed in a paper bag before recycling.' },
  { title: 'Aerosol Cans', content: 'Aerosol cans are recyclable as long as they are completely empty.' },
  { title: 'Styrofoam', content: 'Styrofoam is not accepted in most curbside recycling programs.' },
  { title: 'Reduce Packaging', content: 'Buying products with less packaging helps reduce waste at the source.' },
  { title: 'Glass Storage', content: 'Reusing glass jars for food storage is better than recycling them.' },
  { title: 'Batteries', content: 'Batteries should never go in the trash — drop them off at designated collection points.' },
  { title: 'Aluminum Savings', content: 'Recycling one aluminum can saves enough energy to power a TV for three hours.' },
  { title: 'Black Plastic', content: 'Black plastic containers are often not recyclable due to sorting technology limitations.' },
  { title: 'Clothing & Textiles', content: 'Clothing and textiles can be donated or dropped off at textile recycling bins.' },
  { title: 'Plastic Bottles', content: 'A single recycled plastic bottle saves enough energy to power a light bulb for six hours.' },
];

async function main() {
  console.log('Seeding tips...');

  for (const tip of tips) {
    const existing = await prisma.tip.findFirst({ where: { content: tip.content } });
    if (!existing) {
      await prisma.tip.create({
        data: {
          title: tip.title,
          content: tip.content,
          active: true,
        },
      });
    }
  }

  console.log(`Successfully seeded ${tips.length} tips`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });