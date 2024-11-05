import { Router } from "express";
import blogRouter from "./blog";
import CDNRouter from "./CDN";
import possibleTopicsRouter from "./possibleTopics";

const router = Router();

router.use("/blog", blogRouter);
router.use("/CDN", CDNRouter);
router.use("/possibleTopics", possibleTopicsRouter)

export default router;