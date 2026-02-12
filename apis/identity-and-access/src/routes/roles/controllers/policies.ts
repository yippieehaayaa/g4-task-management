import { addPoliciesToRole, removePoliciesFromRole } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

type Body = { policyIds: string[] };

const addPolicies = typedHandler<{ id: string }, Body>(async (req, res) => {
  const role = await addPoliciesToRole(req.params.id, req.body.policyIds);
  res.json({ data: role });
});

const removePolicies = typedHandler<{ id: string }, Body>(async (req, res) => {
  const role = await removePoliciesFromRole(req.params.id, req.body.policyIds);
  res.json({ data: role });
});

export { addPolicies, removePolicies };
