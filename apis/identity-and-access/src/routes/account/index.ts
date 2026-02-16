import { Router } from "express";
import { getIdentity } from "./controllers/identity";

const router = Router();

router.get("/identity", getIdentity);

export default router;
