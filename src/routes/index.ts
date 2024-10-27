import { Router } from "express";
import userRouter from "./user";
import getAvatar from "./getAvatarRoute";
import uploadAvatar from "./uploadAvatarRoute";

const router = Router();

router.use("/user", userRouter);

router.use("/getAvatar", getAvatar);
router.use("/uploadAvatar", uploadAvatar);

export default router;