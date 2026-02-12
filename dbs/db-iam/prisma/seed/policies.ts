import type { PrismaClient } from "../../generated/client";

const IAM_POLICIES = [
  { name: "iam:identities:read", description: "Read identities" },
  { name: "iam:identities:write", description: "Write identities" },
  { name: "iam:identities:delete", description: "Delete identities" },
  { name: "iam:roles:read", description: "Read roles" },
  { name: "iam:roles:write", description: "Write roles" },
  { name: "iam:roles:delete", description: "Delete roles" },
  { name: "iam:policies:read", description: "Read policies" },
  { name: "iam:policies:write", description: "Write policies" },
  { name: "iam:policies:delete", description: "Delete policies" },
  { name: "iam:groups:read", description: "Read groups" },
  { name: "iam:groups:write", description: "Write groups" },
  { name: "iam:groups:delete", description: "Delete groups" },
  { name: "iam:sessions:read", description: "Read sessions" },
  { name: "iam:sessions:write", description: "Write sessions" },
  { name: "iam:otps:read", description: "Read OTPs" },
  { name: "iam:otps:write", description: "Write OTPs" },
] as const;

const seedPolicies = async (prisma: PrismaClient) => {
  const policies = await Promise.all(
    IAM_POLICIES.map((policy) =>
      prisma.policy.upsert({
        where: { name: policy.name },
        update: {},
        create: {
          name: policy.name,
          description: policy.description,
          effect: "ALLOW",
          actions: [policy.name],
          resources: ["*"],
        },
      }),
    ),
  );

  return policies;
};

export { seedPolicies };