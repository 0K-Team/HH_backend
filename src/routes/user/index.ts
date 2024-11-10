import { Router } from "express";
import userRouter from "./user";
import friendsRouter from "./friends";
import preferencesRouter from "./preferences";
import notificationsRouter from "./notifications";

const router = Router();

router.use("/friends", friendsRouter);
router.use("/", userRouter);
router.use("/me/preferences", preferencesRouter);
router.use("/notifications", notificationsRouter);

export default router;