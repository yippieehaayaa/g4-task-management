import { countRoles, listRoles } from "@g4/db-iam";
import type { paginationQuerySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Query = z.infer<typeof paginationQuerySchema>;

const list = typedHandler<unknown, unknown, Query>(async (req, res) => {
  const { page, limit, search } = req.query;

  const [data, total] = await Promise.all([
    listRoles({ page, limit, search }),
    countRoles(search),
  ]);

  res.json({ data, meta: { page, limit, total } });
});

export { list };
