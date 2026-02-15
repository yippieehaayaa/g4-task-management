import { countTasks, listTasks } from "@g4/db-task-management";
import type { listTasksQuerySchema } from "@g4/schemas/task-management";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Query = z.infer<typeof listTasksQuerySchema>;

const list = typedHandler<unknown, unknown, Query>(async (req, res) => {
  const { page, limit, search, status, priority } = res.locals.query;
  const identityId = req.identity.sub;

  const [data, total] = await Promise.all([
    listTasks({ page, limit, search, status, priority, identityId }),
    countTasks({ search, status, priority, identityId }),
  ]);

  res.json({ data, meta: { page, limit, total } });
});

export { list };
