import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Roles ───────────────────────────────────────────────────────────
  const roles = await Promise.all(
    [
      { name: "admin", description: "Full system access" },
      { name: "manager", description: "Manages campaigns and team" },
      { name: "designer", description: "Creates visual content" },
      { name: "copywriter", description: "Creates written content" },
    ].map((role) =>
      prisma.role.upsert({
        where: { name: role.name },
        update: {},
        create: role,
      }),
    ),
  );
  console.log(`  ✔ Created ${roles.length} roles`);

  // ─── Campaign Statuses ───────────────────────────────────────────────
  const campaignStatuses = await Promise.all(
    [
      { name: "Draft", description: "Campaign is being planned" },
      { name: "Active", description: "Campaign is live" },
      { name: "Paused", description: "Campaign is temporarily paused" },
      { name: "Completed", description: "Campaign has finished" },
      { name: "Archived", description: "Campaign is archived" },
    ].map((status) =>
      prisma.campaignStatus.upsert({
        where: { name: status.name },
        update: {},
        create: status,
      }),
    ),
  );
  console.log(`  ✔ Created ${campaignStatuses.length} campaign statuses`);

  // ─── Post Statuses ──────────────────────────────────────────────────
  const postStatuses = await Promise.all(
    [
      { name: "Pending", displayOrder: 0, description: "Awaiting work" },
      {
        name: "In Progress",
        displayOrder: 1,
        description: "Currently being worked on",
      },
      { name: "Review", displayOrder: 2, description: "Ready for review" },
    ].map((status) =>
      prisma.postStatus.upsert({
        where: { name: status.name },
        update: {},
        create: status,
      }),
    ),
  );
  console.log(`  ✔ Created ${postStatuses.length} post statuses`);

  // ─── Test Admin User ────────────────────────────────────────────────
  const adminRole = roles.find((r) => r.name === "admin")!;
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@orean.com" },
    update: {},
    create: {
      email: "admin@orean.com",
      name: "Admin User",
      roleId: adminRole.id,
    },
  });
  console.log(`  ✔ Created admin user: ${adminUser.email}`);

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
