import { updateGroup } from "@g4/db-iam";
import type { Request, Response } from "express";

const update = async (req: Request, res: Response) => {
  const group = await updateGroup(req.params.id as string, req.body);
  res.json({ data: group });
};

export { update };
