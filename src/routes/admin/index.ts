import { Router } from "express";
import blogRouter from "./blog";
import CDNRouter from "./CDN";
import topics from "./preferredTopics";
import products from "./products";
import events from "./events";
import plants from "./plants";
import locations from "./locations";
import quiz from "./quiz";

const router = Router();

router.use("/blog", blogRouter);
router.use("/CDN", CDNRouter);
router.use("/preferredTopics", topics);
router.use("/products", products);
router.use("/events", events);
router.use("/plants", plants);
router.use("/locations", locations);
router.use("/quiz", quiz);

export default router;