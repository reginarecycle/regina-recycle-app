import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tips = [
  'Rinse milk containers before storage to prevent odors.',
  'Flatten cardboard boxes to save space in your recycling bin.',
  'Remove bottle caps before recycling plastic bottles.',
  'Glass jars can be recycled indefinitely without losing quality.',
  'Rinse food residue off containers before placing them in recycling.',
  'Plastic bags cannot go in curbside recycling — drop them off at grocery stores instead.',
  'Aluminum cans are one of the most valuable recyclables — always recycle them.',
  'Paper that is wet or greasy, like pizza boxes, cannot be recycled.',
  'Electronics should never go in regular recycling — find an e-waste drop-off near you.',
  'Composting food scraps reduces landfill waste and creates nutrient-rich soil.',
  'Shredded paper should be placed in a paper bag before recycling.',
  'Aerosol cans are recyclable as long as they are completely empty.',
  'Styrofoam is not accepted in most curbside recycling programs.',
  'Buying products with less packaging helps reduce waste at the source.',
  'Reusing glass jars for food storage is better than recycling them.',
  'Batteries should never go in the trash — drop them off at designated collection points.',
  'Recycling one aluminum can saves enough energy to power a TV for three hours.',
  'Black plastic containers are often not recyclable due to sorting technology limitations.',
  'Clothing and textiles can be donated or dropped off at textile recycling bins.',
  'A single recycled plastic bottle saves enough energy to power a light bulb for six hours.',
];

export default async function seedTips(prisma: PrismaClient) {
  console.log('Seeding tips...');
  
  for (const content of tips) {
    const existing = await prisma.tip.findFirst({ where: { content } });
    if (!existing) {
      await prisma.tip.create({
        data: {
          content,
          active: true,
        },
      });
    }
  }
  
  console.log(`Successfully seeded ${tips.length} tips`);
}