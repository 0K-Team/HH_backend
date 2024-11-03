import { Router } from "express";
import QuizSchema from "../schemas/quizzes";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const result = await QuizSchema.aggregate([
            { $project: { topic: 1, description: 1, category: 1, difficulty_level: 1, points_reward: 1 } }
        ]).exec();
        
        await res.status(200).send(result);
    } catch (error) {
        await res.status(500).send(error);
    }
})

router.get("/:id", async (req, res) => {
    try {
        const result = await QuizSchema.findById(req.params.id);
        
        await res.status(200).send(result);
    } catch (error) {
        await res.status(500).send(error);
    }
})

export default router;