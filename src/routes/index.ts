import { Router } from "express";
import getAvatar from "./getAvatarRoute";
import uploadAvatar from "./uploadAvatarRoute";

const router = Router();

router.use("/getAvatar", getAvatar);
router.use("/uploadAvatar", uploadAvatar);

export default router;