import { Router } from "express";
import { register, login, me, forgotPassword, changePassword } from "./controllers";
import { forgotPasswordSchema, loginSchema, registerSchema, changePasswordSchema } from "./schemas";
import { validate } from "./middleware";

const router = Router();

router.get("/@me", me);
router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/forgotpassword", validate(forgotPasswordSchema), forgotPassword);
router.post("/changepassword", validate(changePasswordSchema), changePassword);

export default router;
