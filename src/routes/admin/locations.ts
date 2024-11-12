import { Router } from "express";
import { validateBody } from "../../middlewares/validate";
import LocationSchema from "../../schemas/locations";
import Joi from "joi";

const router = Router();

router.post("/", validateBody(Joi.object({
    name: Joi.string().required(),
    coordinates: Joi.object({
        latitude: Joi.number().required(),
        longitude: Joi.number().required()
    }).required(),
    address: Joi.string(),
    type: Joi.string(),
    description: Joi.string(),
    image: Joi.string().default(null),
    opening_hours: Joi.object({
        monday: Joi.string(),
        tuesday: Joi.string(),
        wednesday: Joi.string(),
        thursday: Joi.string(),
        friday: Joi.string(),
        saturday: Joi.string(),
        sunday: Joi.string()
    })
})), async (req, res) => {
    const location = await LocationSchema.create(req.body);

    res.send(location);
});

router.delete("/", validateBody(Joi.object({
    _id: Joi.string().required()
})), async (req, res) => {
    const location = await LocationSchema.deleteOne({
        _id: req.body._id,
    });

    res.send(location);
});

export default router;