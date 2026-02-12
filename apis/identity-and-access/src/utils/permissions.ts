import { prisma } from "@g4/db-iam";

const resolvePermissions = async (identityId: string): Promise<string[]> => {
  const identity = await prisma.identity.findUnique({
    where: { id: identityId },
    select: {
      roles: {
        where: { deletedAt: null },
        select: {
          policies: {
            where: { deletedAt: null },
            select: { effect: true, actions: true },
          },
        },
      },
      groups: {
        where: { deletedAt: null },
        select: {
          roles: {
            where: { deletedAt: null },
            select: {
              policies: {
                where: { deletedAt: null },
                select: { effect: true, actions: true },
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
    policies: { effect: string; actions: string[] }[],
  ) => {
    for (const policy of policies) {
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
    processPolicies(role.policies);
  }

  for (const group of identity.groups) {
    for (const role of group.roles) {
      processPolicies(role.policies);
    }
  }

  return [...allowed].filter((action) => !denied.has(action));
};

export { resolvePermissions };
