import { Router } from "express";
import blogRouter from "./blog";
import CDNRouter from "./CDN";
import topics from "./topics";
import products from "./products";

const router = Router();

router.use("/blog", blogRouter);
router.use("/CDN", CDNRouter);
router.use("/topics", topics);
router.use("/products", products);

export default router;