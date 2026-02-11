import { z } from "zod";

const createRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const updateRoleSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

const addPoliciesToRoleSchema = z.object({
  roleId: z.string().min(1),
  policyIds: z.array(z.string().min(1)).min(1),
});

const removePoliciesFromRoleSchema = z.object({
  roleId: z.string().min(1),
  policyIds: z.array(z.string().min(1)).min(1),
});

const assignRoleToIdentitySchema = z.object({
  identityId: z.string().min(1),
  roleId: z.string().min(1),
});

const removeRoleFromIdentitySchema = z.object({
  identityId: z.string().min(1),
  roleId: z.string().min(1),
});

export {
  createRoleSchema,
  updateRoleSchema,
  addPoliciesToRoleSchema,
  removePoliciesFromRoleSchema,
  assignRoleToIdentitySchema,
  removeRoleFromIdentitySchema,
};
