import { Router } from "express";
import UserPreferenceSchema from "../../schemas/userPreferences";
import { validateBody } from "../../middlewares/validate";
import Joi from "joi";
import { LANGUAGE_CODES } from "../../constants";

const router = Router();

router.get("/", async (req, res) => {
    const preferences = await UserPreferenceSchema.findOneAndUpdate({
        // @ts-ignore
        user: req.user.id
    }, { }, { upsert: true });

    res.send(preferences);
});

router.put("/language", validateBody(Joi.object({ language: Joi.string().valid(...LANGUAGE_CODES) })), async (req, res) => {
    const preferences = await UserPreferenceSchema.findOneAndUpdate({
        // @ts-ignore
        user: req.user.id
    }, {
        language: req.body.language
    }, {
        new: true,
        upsert: true
    });

    res.send(preferences);
});

router.put("/theme", validateBody(Joi.object({ theme: Joi.string().valid("light", "dark") })), async (req, res) => {
    const preferences = await UserPreferenceSchema.findOneAndUpdate({
        // @ts-ignore
        user: req.user.id
    }, {
        theme: req.body.theme
    }, {
        new: true,
        upsert: true
    });

    res.send(preferences);
});

export default router;