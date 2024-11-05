import { Router } from "express";
import QuizSchema from "../schemas/quizzes";
import { validateParams } from "../middlewares/validate";
import { ObjectIdValidator } from "../validators";

const router = Router();

router.get("/", async (_, res) => {
    try {
        const result = await QuizSchema.aggregate([
            { $project: { topic: 1, description: 1, category: 1, difficulty_level: 1, points_reward: 1 } }
        ]).exec();
        
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.get("/:id", validateParams(ObjectIdValidator), async (req, res) => {
    try {
        const result = await QuizSchema.findById(req.params.id);
        
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

export default router;