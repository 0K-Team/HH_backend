import { Router } from "express";
import userRouter from "./user";
import avatarRouter from "./avatarRouter";
import blogRouter from "./blogRouter";

const router = Router();

router.use("/user", userRouter);

router.use("/avatar", avatarRouter);

router.use("/blog", blogRouter);

export default router;