import { countIdentities, listIdentities } from "@g4/db-iam";
import type { listIdentitiesQuerySchema } from "@g4/schemas/iam";
import type { z } from "zod";
import { typedHandler } from "../../../utils/typedHandler";

type Query = z.infer<typeof listIdentitiesQuerySchema>;

const list = typedHandler<unknown, unknown, Query>(async (req, res) => {
  const { page, limit, search, status, kind } = req.query;

  const input = { page, limit, search, status, kind } as Parameters<
    typeof listIdentities
  >[0];

  const [data, total] = await Promise.all([
    listIdentities(input),
    countIdentities({ search, status, kind } as Parameters<
      typeof countIdentities
    >[0]),
  ]);

  res.json({ data, meta: { page, limit, total } });
});

export { list };
