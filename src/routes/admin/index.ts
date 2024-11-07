import { Router } from "express";
import blogRouter from "./blog";
import CDNRouter from "./CDN";
import topics from "./preferredTopics";
import products from "./products";
import events from "./events";

const router = Router();

router.use("/blog", blogRouter);
router.use("/CDN", CDNRouter);
router.use("/preferredTopics", topics);
router.use("/products", products);
router.use("/events", events);

export default router;