import { addPoliciesToRole, removePoliciesFromRole } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

type Body = { policyIds: string[] };

const addPolicies = typedHandler<{ id: string }, Body>(async (_req, res) => {
  const role = await addPoliciesToRole(
    res.locals.params.id,
    res.locals.body.policyIds,
  );
  res.json({ data: role });
});

const removePolicies = typedHandler<{ id: string }, Body>(async (_req, res) => {
  const role = await removePoliciesFromRole(
    res.locals.params.id,
    res.locals.body.policyIds,
  );
  res.json({ data: role });
});

export { addPolicies, removePolicies };
