import { createTask } from "@g4/db-task-management";
import type { createTaskSchema } from "@g4/schemas/task-management";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Body = z.infer<typeof createTaskSchema>;

const create = typedHandler<unknown, Body>(async (req, res) => {
  const task = await createTask({
    ...res.locals.body,
    identityId: req.identity.sub,
  });

  res.status(201).json({ data: task });
});

export { create };
