import { Router } from "express";
import { findUser, search } from "./controllers";

const router = Router();

router.get("/search", search);
router.get("/users/:username", findUser);

export default router;
