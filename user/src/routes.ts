import { Router } from "express";
import { 
    register, 
    login, 
    me, 
    forgotPassword, 
    changePassword, 
    accountEditEmail, 
    accountEditUsername, 
    accountEditAvatar, 
    findUser, 
    search 
} from "./controllers";
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

router.get("/users/@me", isAuth, me);
router.get('/users/search', search);
router.get('/users/:username', findUser);
router.post("/users/@me/edit/email", isAuth, validate(accountEditEmailSchema), accountEditEmail);
router.post("/users/@me/edit/username", isAuth, validate(accountEditUsernameSchema), accountEditUsername);
router.post("/users/@me/edit/avatar", isAuth, accountEditAvatar);
router.post("/login", validate(loginSchema), login);
router.post("/register", validate(registerSchema), register);
router.post("/forgotpassword", validate(forgotPasswordSchema), forgotPassword);
router.post("/changepassword", validate(changePasswordSchema), changePassword);

export default router;
