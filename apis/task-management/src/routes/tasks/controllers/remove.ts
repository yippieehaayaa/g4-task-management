import { softDeleteTask } from "@g4/db-task-management";
import { typedHandler } from "../../../utils/typedHandler";

const remove = typedHandler<{ id: string }>(async (req, res) => {
  await softDeleteTask(res.locals.params.id, req.identity.sub);
  res.sendStatus(204);
});

export { remove };
