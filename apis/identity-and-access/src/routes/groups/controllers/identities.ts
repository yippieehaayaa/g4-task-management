import { addIdentitiesToGroup, removeIdentitiesFromGroup } from "@g4/db-iam";
import { typedHandler } from "../../../utils/typedHandler";

type Body = { identityIds: string[] };

const addIdentities = typedHandler<{ id: string }, Body>(async (_req, res) => {
  const group = await addIdentitiesToGroup(
    res.locals.params.id,
    res.locals.body.identityIds,
  );
  res.json({ data: group });
});

const removeIdentities = typedHandler<{ id: string }, Body>(
  async (_req, res) => {
    const group = await removeIdentitiesFromGroup(
      res.locals.params.id,
      res.locals.body.identityIds,
    );
    res.json({ data: group });
  },
);

export { addIdentities, removeIdentities };
