import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import friendsRouter from "./friends";

const router = Router();

router.use("/auth", authRouter);
router.use("/friends", friendsRouter);
router.use("/", userRouter);

export default router;