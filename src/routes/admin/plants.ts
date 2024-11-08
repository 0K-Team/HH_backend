import { Router } from "express";
import { validateBody } from "../../middlewares/validate";
import PlantSchema from "../../schemas/plants";
import Joi from "joi";

const router = Router();

router.post("/", validateBody(Joi.object({ name: Joi.string().required(), type: Joi.string().required(), price: Joi.number().default(0) })), async (req, res) => {
    const plant = await PlantSchema.create(req.body);

    res.send(plant);
});

export default router;