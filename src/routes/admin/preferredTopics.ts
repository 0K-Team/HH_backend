import { Router } from "express";
import { validateBody } from "../../middlewares/validate";
import Joi from "joi";
import TopicSchema from "../../schemas/topics";

const router = Router();

router.post("/", validateBody(Joi.object({ topic: Joi.string().required().max(60) })), async (req, res) => {
    const { topic } = req.body;

    const result = TopicSchema.create({
        name: topic,
    })

    res.send(result);
})

router.post("/bulk", validateBody(Joi.object({ topics: Joi.array().items(Joi.string().max(60)).required() })), async (req, res) => {
    const { topics } = req.body;
    const result = await TopicSchema.create(topics.map((a: string) => ({ name: a })));

    res.send(result);
});

export default router;