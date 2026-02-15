import { updateTask } from "@g4/db-task-management";
import type { updateTaskSchema } from "@g4/schemas/task-management";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof updateTaskSchema>;

const update = typedHandler<{ id: string }, Body>(async (req, res) => {
  const task = await updateTask(
    res.locals.params.id,
    req.identity.sub,
    res.locals.body,
  );

  res.json({ data: task });
});

export { update };
