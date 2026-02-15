import { type PolicyEffect, prisma } from "../client";
import { PolicyNotFoundError } from "../errors";

type CreatePolicyInput = {
  name: string;
  description?: string;
  effect: PolicyEffect;
  actions: string[];
  resources: string[];
};

type UpdatePolicyInput = {
  name?: string;
  description?: string;
  effect?: PolicyEffect;
  actions?: string[];
  resources?: string[];
};

type ListPoliciesInput = {
  page: number;
  limit: number;
  search?: string;
};

const listPolicies = async (input: ListPoliciesInput) => {
  const where = {
    deletedAt: { isSet: false },
    ...(input.search && {
      name: { contains: input.search, mode: "insensitive" as const },
    }),
  };

  return await prisma.policy.findMany({
    where,
    skip: (input.page - 1) * input.limit,
    take: input.limit,
    orderBy: { createdAt: "desc" },
  });
};

const countPolicies = async (search?: string) => {
  return await prisma.policy.count({
    where: {
      deletedAt: { isSet: false },
      ...(search && {
        name: { contains: search, mode: "insensitive" as const },
      }),
    },
  });
};

const createPolicy = async (input: CreatePolicyInput) => {
  return await prisma.policy.create({ data: input });
};

const findPolicyById = async (id: string) => {
  return await prisma.policy.findUnique({
    where: { id, deletedAt: { isSet: false } },
  });
};

const findPolicyByIdOrThrow = async (id: string) => {
  const policy = await findPolicyById(id);
  if (!policy) throw new PolicyNotFoundError();
  return policy;
};

const findPolicyByName = async (name: string) => {
  return await prisma.policy.findUnique({
    where: { name, deletedAt: { isSet: false } },
  });
};

const updatePolicy = async (id: string, input: UpdatePolicyInput) => {
  const existing = await findPolicyById(id);
  if (!existing) throw new PolicyNotFoundError();

  return await prisma.policy.update({
    where: { id, deletedAt: { isSet: false } },
    data: input,
  });
};

const softDeletePolicy = async (id: string) => {
  const existing = await findPolicyById(id);
  if (!existing) throw new PolicyNotFoundError();

  return await prisma.policy.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export {
  listPolicies,
  countPolicies,
  createPolicy,
  findPolicyById,
  findPolicyByIdOrThrow,
  findPolicyByName,
  updatePolicy,
  softDeletePolicy,
};
