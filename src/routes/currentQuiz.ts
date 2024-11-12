import express from 'express';
import Joi from 'joi';
import { validateBody } from '../middlewares/validate';
import currentQuizSchema from '../schemas/currentQuiz';
import quizzes from '../schemas/quizzes';

const router = express.Router();

router.post("/", validateBody(Joi.object({
    currentQuiz: Joi.object().keys({
        _id: Joi.string().required(),
        currentQuestionId: Joi.number().required()
    })
})), async (req, res) => {
    try {
        const { currentQuiz } = req.body;
        // @ts-ignore
        const userId = req.user.id;
        await currentQuizSchema.findOneAndUpdate({
            user: userId,
        }, {
            currentQuiz: {
                _id: currentQuiz._id,
                currentQuestionId: currentQuiz.currentQuestionId
            }
        }).exec();

        res.status(200).send("State saved successfully");
    } catch (error) {
        res.status(500).send(error);
    }
    
});

router.get("/", async (req, res) => {
    try {
        // @ts-ignore
        const userId = req.user.id;

        const firstQuiz = await quizzes.findOne();
        const firstQuizId = firstQuiz?._id;

        const userState = await currentQuizSchema.findOneAndUpdate({ user: userId }, {
            $setOnInsert: {
              "currentQuiz._id": firstQuizId,
              "currentQuiz.currentQuestionId": 0
            }
          }, { new: true, upsert: true });

        res.status(200).json(userState?.currentQuiz);
    } catch (error) {
        res.status(500).send(error);
    }
});

export default router;