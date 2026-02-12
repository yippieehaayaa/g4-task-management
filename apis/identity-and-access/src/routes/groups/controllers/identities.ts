import { addIdentitiesToGroup, removeIdentitiesFromGroup } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

type Body = { identityIds: string[] };

const addIdentities = typedHandler<{ id: string }, Body>(async (req, res) => {
  const group = await addIdentitiesToGroup(req.params.id, req.body.identityIds);
  res.json({ data: group });
});

const removeIdentities = typedHandler<{ id: string }, Body>(
  async (req, res) => {
    const group = await removeIdentitiesFromGroup(
      req.params.id,
      req.body.identityIds,
    );
    res.json({ data: group });
  },
);

export { addIdentities, removeIdentities };
