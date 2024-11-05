import { Router } from "express";
import { validateBody } from "../../middlewares/validate";
import Joi from "joi";
import possibleTopics from "../../schemas/possibleTopics";

const router = Router();

router.post("/", validateBody(Joi.object({ topic: Joi.string().required().max(30) })), async (req, res) => {
    const { topic } = req.body;

    const result = possibleTopics.create({
        name: topic,
    })

    res.send(result);
})

export default router;