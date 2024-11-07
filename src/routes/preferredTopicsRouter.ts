import { Router } from "express";
import TopicSchema from "../schemas/topics";

const router = Router();

router.get("/", async (_, res) => {
    const topics = await TopicSchema.find();

    res.send(topics);
})

export default router;