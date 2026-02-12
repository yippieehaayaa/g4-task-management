import { encryptPassword } from "@g4/bcrypt";
import type { PrismaClient, Group, Role } from "../../generated/client";

const SUPERADMIN_USERNAME = "superadmin";
const SUPERADMIN_EMAIL = "admin@g4.dev";
const SUPERADMIN_DEFAULT_PASSWORD = "Admin@1234";

const seedIdentities = async (
  prisma: PrismaClient,
  roles: { superadmin: Role },
  groups: { administrators: Group },
) => {
  const { hash, salt } = await encryptPassword(SUPERADMIN_DEFAULT_PASSWORD);

  const superadmin = await prisma.identity.upsert({
    where: { username: SUPERADMIN_USERNAME },
    update: {
      roleIds: [roles.superadmin.id],
      groupIds: [groups.administrators.id],
    },
    create: {
      username: SUPERADMIN_USERNAME,
      email: SUPERADMIN_EMAIL,
      hash,
      salt,
      changePassword: true,
      active: true,
      kind: "ADMIN",
      status: "ACTIVE",
      roleIds: [roles.superadmin.id],
      groupIds: [groups.administrators.id],
    },
  });

  return { superadmin };
};

export { seedIdentities };