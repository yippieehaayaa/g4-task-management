import type { PrismaClient, Policy } from "../../generated/client";

const seedRoles = async (prisma: PrismaClient, policies: Policy[]) => {
  const policyIds = policies.map((p) => p.id);

  const superadmin = await prisma.role.upsert({
    where: { name: "superadmin" },
    update: { policyIds },
    create: {
      name: "superadmin",
      description: "Full access to all IAM resources",
      policyIds,
    },
  });

  return { superadmin };
};

export { seedRoles };