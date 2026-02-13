import { prisma } from "@g4/db-iam";

const isActive = <T extends { deletedAt?: Date | null }>(x: T): boolean =>
  !x.deletedAt;

const resolvePermissions = async (identityId: string): Promise<string[]> => {
  const identity = await prisma.identity.findUnique({
    where: { id: identityId },
    select: {
      roles: {
        select: {
          deletedAt: true,
          policies: {
            select: { effect: true, actions: true, deletedAt: true },
          },
        },
      },
      groups: {
        select: {
          deletedAt: true,
          roles: {
            select: {
              deletedAt: true,
              policies: {
                select: { effect: true, actions: true, deletedAt: true },
              },
            },
          },
        },
      },
    },
  });

  if (!identity) return [];

  const allowed = new Set<string>();
  const denied = new Set<string>();

  const processPolicies = (
    policies: { effect: string; actions: string[]; deletedAt?: Date | null }[],
  ): void => {
    for (const policy of policies) {
      if (!isActive(policy)) continue;
      for (const action of policy.actions) {
        if (policy.effect === "DENY") {
          denied.add(action);
        } else {
          allowed.add(action);
        }
      }
    }
  };

  for (const role of identity.roles) {
    if (!isActive(role)) continue;
    processPolicies(role.policies);
  }

  for (const group of identity.groups) {
    if (!isActive(group)) continue;
    for (const role of group.roles) {
      if (!isActive(role)) continue;
      processPolicies(role.policies);
    }
  }

  return [...allowed].filter((action) => !denied.has(action));
};

export { resolvePermissions };
