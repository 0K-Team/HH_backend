import { Router } from "express";
import userRouter from "./user";
import avatarRouter from "./avatarRouter";
import blogRouter from "./blogRouter";
import postsRouter from "./postsRouter";
import passport from "passport";

const router = Router();

router.use("/user", passport.authenticate("jwt", { session: false} ), userRouter);

router.use("/avatar", avatarRouter);

router.use("/blogs", blogRouter);

router.use("/posts", postsRouter);

export default router;