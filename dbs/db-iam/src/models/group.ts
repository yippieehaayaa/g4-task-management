import { prisma } from "../client";

type CreateGroupInput = {
  name: string;
  description?: string;
};

type UpdateGroupInput = {
  name?: string;
  description?: string;
};

type ListGroupsInput = {
  page: number;
  limit: number;
  search?: string;
};

const listGroups = async (input: ListGroupsInput) => {
  const where = {
    deletedAt: null,
    ...(input.search && {
      name: { contains: input.search, mode: "insensitive" as const },
    }),
  };

  return await prisma.group.findMany({
    where,
    include: {
      roles: { where: { deletedAt: null } },
      identities: {
        where: { deletedAt: null },
        select: { id: true, username: true, email: true },
      },
    },
    skip: (input.page - 1) * input.limit,
    take: input.limit,
    orderBy: { createdAt: "desc" },
  });
};

const countGroups = async (search?: string) => {
  return await prisma.group.count({
    where: {
      deletedAt: null,
      ...(search && {
        name: { contains: search, mode: "insensitive" as const },
      }),
    },
  });
};

const createGroup = async (input: CreateGroupInput) => {
  return await prisma.group.create({ data: input });
};

const findGroupById = async (id: string) => {
  return await prisma.group.findUnique({
    where: { id, deletedAt: null },
    include: { roles: true, identities: true },
  });
};

const findGroupByName = async (name: string) => {
  return await prisma.group.findUnique({
    where: { name, deletedAt: null },
  });
};

const updateGroup = async (id: string, input: UpdateGroupInput) => {
  return await prisma.group.update({
    where: { id, deletedAt: null },
    data: input,
  });
};

const softDeleteGroup = async (id: string) => {
  return await prisma.group.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
};

const addIdentitiesToGroup = async (groupId: string, identityIds: string[]) => {
  return await prisma.group.update({
    where: { id: groupId, deletedAt: null },
    data: { identityIds: { push: identityIds } },
  });
};

const removeIdentitiesFromGroup = async (
  groupId: string,
  identityIds: string[],
) => {
  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) throw new Error("Group not found");

  const filtered = group.identityIds.filter((id) => !identityIds.includes(id));

  return await prisma.group.update({
    where: { id: groupId },
    data: { identityIds: { set: filtered } },
  });
};

const addRolesToGroup = async (groupId: string, roleIds: string[]) => {
  return await prisma.group.update({
    where: { id: groupId, deletedAt: null },
    data: { roleIds: { push: roleIds } },
  });
};

const removeRolesFromGroup = async (groupId: string, roleIds: string[]) => {
  const group = await prisma.group.findUnique({ where: { id: groupId } });
  if (!group) throw new Error("Group not found");

  const filtered = group.roleIds.filter((id) => !roleIds.includes(id));

  return await prisma.group.update({
    where: { id: groupId },
    data: { roleIds: { set: filtered } },
  });
};

export {
  listGroups,
  countGroups,
  createGroup,
  findGroupById,
  findGroupByName,
  updateGroup,
  softDeleteGroup,
  addIdentitiesToGroup,
  removeIdentitiesFromGroup,
  addRolesToGroup,
  removeRolesFromGroup,
};
