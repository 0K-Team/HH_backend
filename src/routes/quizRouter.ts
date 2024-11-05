import { Router } from "express";
import QuizSchema from "../schemas/quizzes";
import { validateParams, validateQuery } from "../middlewares/validate";
import { ObjectIdValidator } from "../validators";
import Joi from "joi";

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

router.get("/:id", validateParams(ObjectIdValidator), async (req, res) => {
    try {
        const result = await QuizSchema.findById(req.params.id);
        
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

export default router;