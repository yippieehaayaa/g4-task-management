import { PrismaClient } from "../../generated/client";
import { seedGroups } from "./groups";
import { seedIdentities } from "./identities";
import { seedPolicies } from "./policies";
import { seedRoles } from "./roles";

const prisma = new PrismaClient();

const seed = async () => {
  const policies = await seedPolicies(prisma);
  console.log("Policies seeded: %d", policies.length);

  const roles = await seedRoles(prisma, policies);
  console.log("Roles seeded: %s", Object.keys(roles).join(", "));

  const groups = await seedGroups(prisma, roles);
  console.log("Groups seeded: %s", Object.keys(groups).join(", "));

  const identities = await seedIdentities(prisma, roles, groups);
  console.log("Identities seeded: %s", Object.keys(identities).join(", "));

  console.log("\nDefault credentials: superadmin / Admin@1234");
};

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());