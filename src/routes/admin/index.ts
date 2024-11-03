import { Router } from "express";
import blogRouter from "./blog";
import CDNRouter from "./CDN";

const router = Router();

router.use("/blog", blogRouter);
router.use("/CDN", CDNRouter);

export default router;