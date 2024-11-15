import { Router } from "express";
import QuizSchema from "../schemas/quizzes";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate";
import { ObjectIdValidator, ObjectIdValidatorParams, QuizValidator } from "../validators";
import Joi from "joi";
import AccountsSchema from "../schemas/accounts";
import user from "../middlewares/user";
import { CacheHandler } from "../handlers/CacheHandler";
import { Quiz } from "../types/quiz";
import { cache } from "../middlewares/cache";

const router = Router();
const quizCache = new CacheHandler<Quiz>();

router.get("/", validateQuery(Joi.object({ category: Joi.string() })), async (req, res) => {
    const { category } = req.query;
    try {
        const result = await QuizSchema.find(category ? { 
            category
        } : {}, {
            topic: 1, 
            description: 1, 
            category: 1, 
            difficulty_level: 1,
            points_reward: 1
        });
        
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get("/:id", cache(quizCache), validateParams(ObjectIdValidatorParams), async (req, res) => {
    try {
        const result = await QuizSchema.findById(req.params.id, {
            "questions.correct_answer": 0,
        });
        
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post("/submit", user(), validateQuery(QuizValidator), validateBody(Joi.object({
    _id: ObjectIdValidator,
    answers: Joi.array().items(Joi.object({
        answer: Joi.string(),
        _id: ObjectIdValidator
    }))
})), async (req, res) => {
    const { _id, answers } = req.body;
    const quiz = await QuizSchema.findById(_id).exec();

    const correct = answers.map(((e: { answer: string | null | undefined; _id: string; }) => {
        const question = quiz?.questions?.find(q => q._id.toString() == e._id);
        return [e._id, question?.correct_answer?.toLowerCase() === e.answer?.toLowerCase()];
    }));

    const correctAnswers = correct.filter((a: [string, boolean]) => a[1]).length;
    const percentage = correctAnswers / correct.length;

    const points = percentage * (quiz?.points_reward ?? 0); 
    // @ts-ignore
    AccountsSchema.findOneAndUpdate(
        {
            // @ts-ignore
            id: req.user.id
        }, {
            $inc: {points: points}
        }, { new: true }
    ).exec();

    res.send({
        answers: correct.map(([id, isCorrect]: [number, boolean]) => ({ id, isCorrect })),
        percentage: percentage * 100,
        pointsAwarded: points
    });
})

export default router;