import { Router } from "express";
import QuizSchema from "../schemas/quizzes";
import { validateParams, validateQuery } from "../middlewares/validate";
import { ObjectIdValidatorParams, QuizValidator } from "../validators";
import Joi from "joi";
import AccountsSchema from "../schemas/accounts";
import passport from "passport";

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

router.post("/submit", passport.authenticate("jwt", { session: false} ), validateQuery(QuizValidator), async (req, res) => {
    const { _id, answers } = req.body;
    const quiz = await QuizSchema.findById(_id).exec();

    const correct = answers.map(((e: { answer: string | null | undefined; id: number; }) => {
        const question = quiz?.questions?.[`${e.id}`];
        return [e.id, question?.correct_answer === e.answer];
    }));

    const correctAnswers = correct.filter(Boolean).length;
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
    
    const result = JSON.stringify({
        answers: correct.map(([id, isCorrect]: [number, boolean]) => ({ id, isCorrect })),
        percentage: percentage,
        pointsAwarded: points
    });

    res.status(200).send(result);
})

export default router;