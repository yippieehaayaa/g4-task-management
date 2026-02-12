import { Router } from "express";
import { getJwks } from "../../utils/jwt";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.get("/.well-known/jwks.json", (_req, res) => {
  res.json(getJwks());
});

export default router;
