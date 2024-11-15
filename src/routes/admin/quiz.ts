import { Router } from "express";
import { validateBody } from "../../middlewares/validate";
import Joi from "joi";
import QuizSchema from "../../schemas/quizzes";
import { ObjectId } from "mongodb";

const router = Router();

router.post("/", validateBody(Joi.array().items(Joi.object({
    topic: Joi.string(),
    description: Joi.string(),
    questions: Joi.array().items(Joi.object({
        question: Joi.string(),
        answers: Joi.object({
            A: Joi.string(),
            B: Joi.string(),
            C: Joi.string(),
            D: Joi.string()
        }),
        correct_answer: Joi.string()
    })),
    difficulty_level: Joi.string(),
    category: Joi.string(),
    time_limit: Joi.number(),
    points_reward: Joi.number()
}))), async (req, res) => {
    const documents = req.body;
    for (const document of documents) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        document.questions = document.questions.map((a: any) => ({...a, _id: new ObjectId()}))
    }
    await QuizSchema.insertMany(documents);

    res.sendStatus(200);
});

export default router;