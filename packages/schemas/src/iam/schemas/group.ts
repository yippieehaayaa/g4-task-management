import { z } from "zod";

const createGroupSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const updateGroupSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

const addIdentitiesToGroupSchema = z.object({
  groupId: z.string().min(1),
  identityIds: z.array(z.string().min(1)).min(1),
});

const removeIdentitiesFromGroupSchema = z.object({
  groupId: z.string().min(1),
  identityIds: z.array(z.string().min(1)).min(1),
});

const addRolesToGroupSchema = z.object({
  groupId: z.string().min(1),
  roleIds: z.array(z.string().min(1)).min(1),
});

const removeRolesFromGroupSchema = z.object({
  groupId: z.string().min(1),
  roleIds: z.array(z.string().min(1)).min(1),
});

export {
  createGroupSchema,
  updateGroupSchema,
  addIdentitiesToGroupSchema,
  removeIdentitiesFromGroupSchema,
  addRolesToGroupSchema,
  removeRolesFromGroupSchema,
};
