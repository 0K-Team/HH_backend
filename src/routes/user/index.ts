import { Router } from "express";
import userRouter from "./user";
import friendsRouter from "./friends";
import preferencesRouter from "./preferences";

const router = Router();

router.use("/friends", friendsRouter);
router.use("/", userRouter);
router.use("/me/preferences", preferencesRouter);

export default router;