import { Router } from "express";
import userRouter from "./user";
import friendsRouter from "./friends";

const router = Router();

router.use("/friends", friendsRouter);
router.use("/", userRouter);

export default router;