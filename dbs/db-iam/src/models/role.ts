import { prisma } from "../client";
import { IdentityNotFoundError, RoleNotFoundError } from "../errors";

type CreateRoleInput = {
  name: string;
  description?: string;
};

type UpdateRoleInput = {
  name?: string;
  description?: string;
};

type ListRolesInput = {
  page: number;
  limit: number;
  search?: string;
};

const listRoles = async (input: ListRolesInput) => {
  const where = {
    deletedAt: { isSet: false },
    ...(input.search && {
      name: { contains: input.search, mode: "insensitive" as const },
    }),
  };

  return await prisma.role.findMany({
    where,
    include: { policies: { where: { deletedAt: { isSet: false } } } },
    skip: (input.page - 1) * input.limit,
    take: input.limit,
    orderBy: { createdAt: "desc" },
  });
};

const countRoles = async (search?: string) => {
  return await prisma.role.count({
    where: {
      deletedAt: { isSet: false },
      ...(search && {
        name: { contains: search, mode: "insensitive" as const },
      }),
    },
  });
};

const createRole = async (input: CreateRoleInput) => {
  return await prisma.role.create({ data: input });
};

const findRoleById = async (id: string) => {
  return await prisma.role.findUnique({
    where: { id, deletedAt: { isSet: false } },
    include: { policies: true },
  });
};

const findRoleByIdOrThrow = async (id: string) => {
  const role = await findRoleById(id);
  if (!role) throw new RoleNotFoundError();
  return role;
};

const findRoleByName = async (name: string) => {
  return await prisma.role.findUnique({
    where: { name, deletedAt: { isSet: false } },
  });
};

const updateRole = async (id: string, input: UpdateRoleInput) => {
  const existing = await findRoleById(id);
  if (!existing) throw new RoleNotFoundError();

  return await prisma.role.update({
    where: { id, deletedAt: { isSet: false } },
    data: input,
  });
};

const softDeleteRole = async (id: string) => {
  const existing = await findRoleById(id);
  if (!existing) throw new RoleNotFoundError();

  return await prisma.role.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

const addPoliciesToRole = async (roleId: string, policyIds: string[]) => {
  const existing = await findRoleById(roleId);
  if (!existing) throw new RoleNotFoundError();

  return await prisma.role.update({
    where: { id: roleId, deletedAt: { isSet: false } },
    data: { policyIds: { push: policyIds } },
  });
};

const removePoliciesFromRole = async (roleId: string, policyIds: string[]) => {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw new RoleNotFoundError();

  const filtered = role.policyIds.filter((id) => !policyIds.includes(id));

  return await prisma.role.update({
    where: { id: roleId },
    data: { policyIds: { set: filtered } },
  });
};

const assignRoleToIdentity = async (identityId: string, roleId: string) => {
  const identity = await prisma.identity.findUnique({
    where: { id: identityId, deletedAt: { isSet: false } },
  });
  if (!identity) throw new IdentityNotFoundError();

  return await prisma.identity.update({
    where: { id: identityId, deletedAt: { isSet: false } },
    data: { roleIds: { push: roleId } },
  });
};

const removeRoleFromIdentity = async (identityId: string, roleId: string) => {
  const identity = await prisma.identity.findUnique({
    where: { id: identityId },
  });
  if (!identity) throw new IdentityNotFoundError();

  const filtered = identity.roleIds.filter((id) => id !== roleId);

  return await prisma.identity.update({
    where: { id: identityId },
    data: { roleIds: { set: filtered } },
  });
};

export {
  listRoles,
  countRoles,
  createRole,
  findRoleById,
  findRoleByIdOrThrow,
  findRoleByName,
  updateRole,
  softDeleteRole,
  addPoliciesToRole,
  removePoliciesFromRole,
  assignRoleToIdentity,
  removeRoleFromIdentity,
};
