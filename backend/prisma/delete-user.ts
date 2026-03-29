/**
 * Usage: npx ts-node prisma/delete-user.ts <email>
 * Example: npx ts-node prisma/delete-user.ts jane@example.com
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: npx ts-node prisma/delete-user.ts <email>");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  console.log(`Deleting user: ${user.name} (${user.userId})`);

  await prisma.$transaction(async (tx) => {
    // Delete wallet manually (no cascade set — intentional audit preservation)
    await tx.wallet.deleteMany({ where: { userId: user.userId } });
    // Delete the user (all other relations cascade or set null)
    await tx.user.delete({ where: { userId: user.userId } });
  });

  console.log("User deleted successfully.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
