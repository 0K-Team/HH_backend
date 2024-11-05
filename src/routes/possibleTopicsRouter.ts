import { Router } from "express";
import possibleTopics from "../schemas/possibleTopics";

const router = Router();

router.get("/", async (req, res) => {
    const possible = await possibleTopics.find();

    res.send(possible);
})

export default router;