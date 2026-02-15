import { findTaskByIdOrThrow } from "@g4/db-task-management";
import { typedHandler } from "../../../utils/typedHandler";

const show = typedHandler<{ id: string }>(async (req, res) => {
  const task = await findTaskByIdOrThrow(
    res.locals.params.id,
    req.identity.sub,
  );

  res.json({ data: task });
});

export { show };
