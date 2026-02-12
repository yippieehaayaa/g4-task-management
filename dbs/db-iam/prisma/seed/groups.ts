import type { PrismaClient, Role } from "../../generated/client";

const seedGroups = async (
  prisma: PrismaClient,
  roles: { superadmin: Role },
) => {
  const administrators = await prisma.group.upsert({
    where: { name: "administrators" },
    update: { roleIds: [roles.superadmin.id] },
    create: {
      name: "administrators",
      description: "Administrator group",
      roleIds: [roles.superadmin.id],
    },
  });

  return { administrators };
};

export { seedGroups };