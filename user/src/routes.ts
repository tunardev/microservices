import { Router } from "express";
import { register, login, me, forgotPassword, changePassword, accountEditEmail, accountEditUsername, accountEditAvatar } from "./controllers";
import { 
    forgotPasswordSchema, 
    loginSchema, 
    registerSchema, 
    changePasswordSchema, 
    accountEditEmailSchema, 
    accountEditUsernameSchema 
} from "./schemas";
import { validate, isAuth } from "./middleware";

const router = Router();

router.get("/@me", isAuth, me);
router.post("/@me/edit/email", isAuth, validate(accountEditEmailSchema), accountEditEmail);
router.post("/@me/edit/username", isAuth, validate(accountEditUsernameSchema), accountEditUsername);
router.post("/@me/edit/avatar", isAuth, accountEditAvatar);
router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/forgotpassword", validate(forgotPasswordSchema), forgotPassword);
router.post("/changepassword", validate(changePasswordSchema), changePassword);

export default router;
