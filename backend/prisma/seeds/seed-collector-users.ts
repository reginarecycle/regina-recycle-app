import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding collector users...');

  // ── Find dfc collector ────────────────────────────────────────────────────
  const collector = await prisma.user.findFirst({
    where: { email: 'wowipeh651@qvmao.com' },
  });

  if (!collector) {
    console.error('Collector dfc not found! Make sure wowipeh651@qvmao.com exists.');
    return;
  }

  console.log('Found collector:', collector.userId);

  // ── Find materials ────────────────────────────────────────────────────────
  const materials = await prisma.material.findMany({ take: 5 });
  if (materials.length === 0) {
    console.error('No materials found! Run the materials seed first.');
    return;
  }

  // ── Create test customers ─────────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('Test@123', 10);

  const customerData = [
    { name: 'Dylan White',   email: 'dylan.white@test.com',   phone: '+1 (306) 555-0125', city: 'Downtown'    },
    { name: 'Sarah Keen',    email: 'sarah.keen@test.com',    phone: '+1 (306) 555-0126', city: 'Wascana View' },
    { name: 'Emma Wilson',   email: 'emma.wilson@test.com',   phone: '+1 (306) 555-0127', city: 'Lakeview'    },
    { name: 'Nolan Roberts', email: 'nolan.roberts@test.com', phone: '+1 (306) 555-0128', city: 'Cathedral'   },
    { name: 'Marcus Chen',   email: 'marcus.chen@test.com',   phone: '+1 (306) 555-0129', city: 'Heritage'    },
  ];

  for (const c of customerData) {
    // Create or find customer
    let customer = await prisma.user.findFirst({ where: { email: c.email } });

    if (!customer) {
      customer = await prisma.user.create({
        data: {
          name:          c.name,
          email:         c.email,
          password:      hashedPassword,
          phoneNumber:   c.phone,
          role:          'CUSTOMER',
          status:        'ACTIVE',
          emailVerified: true,
          agreedToTerms: true,
        },
      });
      console.log('Created customer:', customer.name);
    } else {
      console.log('Customer already exists:', customer.name);
    }

    // Create address for customer
    let address = await prisma.address.findFirst({ where: { userId: customer.userId } });
    if (!address) {
      address = await prisma.address.create({
        data: {
          userId:     customer.userId,
          line1:      '123 Main Street',
          city:       c.city,
          province:   'Saskatchewan',
          postalCode: 'S4P 3Y2',
          isPrimary:  true,
        },
      });
    }

    // Create wallet for customer
    const existingWallet = await prisma.wallet.findFirst({ where: { userId: customer.userId } });
    if (!existingWallet) {
      await prisma.wallet.create({
        data: { userId: customer.userId, balance: 0 },
      });
    }

    // Create 3 completed pickups per customer linked to dfc
    for (let i = 0; i < 3; i++) {
      const scheduledAt = new Date();
      scheduledAt.setDate(scheduledAt.getDate() - (i + 1) * 7);

      const pickup = await prisma.pickup.create({
        data: {
          requesterUserId:  customer.userId,
          collectorUserId:  collector.userId,
          addressId:        address.addressId,
          scheduledAt,
          status:           'COMPLETED',
          estimatedCost:    15.0,
          estimatedEarning: 12.0,
          actualEarning:    12.0,
        },
      });

      // Add pickup items
      const mat = materials[i % materials.length];
      await prisma.pickupItem.create({
        data: {
          pickupId:   pickup.pickupId,
          materialId: mat.materialId,
          quantity:   5,
        },
      });
    }

    console.log('Created 3 pickups for:', customer.name);
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
