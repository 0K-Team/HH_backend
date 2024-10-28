import { Router } from "express";
import userRouter from "./user";
import avatarRouter from "./avatarRouter";

const router = Router();

router.use("/user", userRouter);

router.use("/avatar", avatarRouter);

export default router;