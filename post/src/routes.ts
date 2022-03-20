import { Router } from "express";
import { createPost, post, posts, deletePost } from "./controllers";
import { isAuth, validate } from "./middleware";
import { createPostSchema } from "./validate";
const router = Router();

router.get("/posts", posts);
router.get("/posts/:id", post);
router.post("/posts", isAuth, validate(createPostSchema), createPost);
router.delete("/posts/:id", isAuth, deletePost);

export default router;
