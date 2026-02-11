import { type PolicyEffect, prisma } from "../client";

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

const createPolicy = async (input: CreatePolicyInput) => {
  return await prisma.policy.create({ data: input });
};

const findPolicyById = async (id: string) => {
  return await prisma.policy.findUnique({
    where: { id, deletedAt: null },
  });
};

const findPolicyByName = async (name: string) => {
  return await prisma.policy.findUnique({
    where: { name, deletedAt: null },
  });
};

const updatePolicy = async (id: string, input: UpdatePolicyInput) => {
  return await prisma.policy.update({
    where: { id, deletedAt: null },
    data: input,
  });
};

const softDeletePolicy = async (id: string) => {
  return await prisma.policy.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

export {
  createPolicy,
  findPolicyById,
  findPolicyByName,
  updatePolicy,
  softDeletePolicy,
};
