import { Router } from "express";
import userRouter from "./user";
import authRouter from "./auth";
import avatarRouter from "./avatarRouter";
import blogRouter from "./blogRouter";
import postsRouter from "./postsRouter";
import adminRouter from "./admin";
import passport from "passport";
import { admin } from "../middlewares/admin";
import CDNRouter from "./CDNRouter";
import quizRouter from "./quizRouter";
import gardenRouter from "./gardenRouter";

const router = Router();

router.use("/user", passport.authenticate("jwt", { session: false} ), userRouter);
router.use("/auth", authRouter);
router.use("/avatar", avatarRouter);

router.use("/blogs", blogRouter);
router.use("/posts", postsRouter);

router.use("/quizzes", quizRouter);
router.use("/garden", gardenRouter);

router.use("/CDN", CDNRouter);

router.use("/admin", passport.authenticate("jwt", { session: false }), admin(), adminRouter);

export default router;