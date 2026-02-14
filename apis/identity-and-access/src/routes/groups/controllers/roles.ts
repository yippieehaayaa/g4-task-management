import { addRolesToGroup, removeRolesFromGroup } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

type Body = { roleIds: string[] };

const addRoles = typedHandler<{ id: string }, Body>(async (_req, res) => {
  const group = await addRolesToGroup(
    res.locals.params.id,
    res.locals.body.roleIds,
  );
  res.json({ data: group });
});

const removeRoles = typedHandler<{ id: string }, Body>(async (_req, res) => {
  const group = await removeRolesFromGroup(
    res.locals.params.id,
    res.locals.body.roleIds,
  );
  res.json({ data: group });
});

export { addRoles, removeRoles };
