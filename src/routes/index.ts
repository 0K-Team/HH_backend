import { Router } from "express";
import userRouter from "./user";
import avatarRouter from "./avatarRouter";
import blogRouter from "./blogRouter";
import postsRouter from "./postsRouter";

const router = Router();

router.use("/user", userRouter);

router.use("/avatar", avatarRouter);

router.use("/blog", blogRouter);

router.use("/post", postsRouter);

export default router;