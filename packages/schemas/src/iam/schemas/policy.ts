import { z } from "zod";
import { policyEffectSchema } from "./enums";

const createPolicySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  effect: policyEffectSchema,
  actions: z.array(z.string().min(1)).min(1),
  resources: z.array(z.string().min(1)).min(1),
});

const updatePolicySchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  effect: policyEffectSchema.optional(),
  actions: z.array(z.string().min(1)).min(1).optional(),
  resources: z.array(z.string().min(1)).min(1).optional(),
});

export { createPolicySchema, updatePolicySchema };
