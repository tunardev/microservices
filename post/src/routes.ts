import { Router } from "express";
import { createPost, post, posts } from "./controllers";
import { isAuth } from "./middleware";
const router = Router();

router.get("/posts", posts);
router.get("/posts/:id", post);
router.post("/posts", isAuth, createPost);

export default router;
