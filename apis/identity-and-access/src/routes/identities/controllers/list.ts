import { countIdentities, listIdentities } from "@g4/db-iam";
import type { listIdentitiesQuerySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Query = z.infer<typeof listIdentitiesQuerySchema>;

const list = typedHandler<unknown, unknown, Query>(async (_req, res) => {
  const { page, limit, search, status, kind } = res.locals.query;

  const [data, total] = await Promise.all([
    listIdentities({ page, limit, search, status, kind }),
    countIdentities({ search, status, kind }),
  ]);

  res.json({ data, meta: { page, limit, total } });
});

export { list };
