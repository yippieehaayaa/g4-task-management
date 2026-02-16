import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import account from "./account";
import admin from "./admin";
import auth from "./auth";
import groups from "./groups";
import identities from "./identities";
import main from "./main";
import policies from "./policies";
import roles from "./roles";

const router = Router();

router.use("/", main);
router.use("/auth", auth);
router.use("/account", authenticate, account);
router.use("/identities", authenticate, identities);
router.use("/roles", authenticate, roles);
router.use("/policies", authenticate, policies);
router.use("/groups", authenticate, groups);
router.use("/admin", authenticate, admin);

export default router;
