import { Router } from "express";
import QuizSchema from "../schemas/quizzes";
import { validateParams, validateQuery } from "../middlewares/validate";
import { ObjectIdValidatorParams, QuizValidator } from "../validators";
import Joi from "joi";
import { ObjectId } from "mongoose";

const router = Router();

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

router.get("/:id", validateParams(ObjectIdValidatorParams), async (req, res) => {
    try {
        const result = await QuizSchema.findById(req.params.id, {
            "questions.correct_answer": 0,
        });
        
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post("/submit", validateQuery(QuizValidator), async (req, res) => {
    const { _id, answers } = req.body;
    const quiz = await QuizSchema.findById(_id).exec();

    const result = answers.map(((e: { answer: string | null | undefined; id: number; }) => {
        const question = quiz?.questions?.[`${e.id}`];
        return question?.correct_answer === e.answer;
    }));

    res.status(200).send(result);
})

export default router;