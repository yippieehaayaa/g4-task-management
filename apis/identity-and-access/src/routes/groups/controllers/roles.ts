import { addRolesToGroup, removeRolesFromGroup } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

type Body = { roleIds: string[] };

const addRoles = typedHandler<{ id: string }, Body>(async (req, res) => {
  const group = await addRolesToGroup(req.params.id, req.body.roleIds);
  res.json({ data: group });
});

const removeRoles = typedHandler<{ id: string }, Body>(async (req, res) => {
  const group = await removeRolesFromGroup(req.params.id, req.body.roleIds);
  res.json({ data: group });
});

export { addRoles, removeRoles };
