import { Router } from "express";
import AccountData from "../../schemas/accounts"
import { UserIdValidator } from "../../validators";
import Joi from "joi";
import { validateBody, validateParams } from "../../middlewares/validate";
import { COUNTRY_CODES } from "../../constants";
import { CacheHandler } from "../../handlers/CacheHandler";
import { User } from "../../types/user";
import { cache } from "../../middlewares/cache";

const router = Router();
const userCache = new CacheHandler<User>();

router.get("/me", (req, res) => {
    res.send(req.user);
});

router.get("/:id", cache(userCache), validateParams(Joi.object({ id: UserIdValidator })), async (req, res) => {
    const { id } = req.params;
    
    const user = await AccountData.findOne({
        id
    });

    if (!user) return res.sendStatus(404), undefined;

    res.send(user);
});

router.patch("/me/username", validateBody(Joi.object({ username: Joi.string().required().min(2).max(32) })), async (req, res) => {
    const { username } = req.body;
    try {
        const result = await AccountData.findOneAndUpdate({
            //@ts-ignore
            id: req.user.id,
        }, {
            username,
        }).exec();
        //@ts-ignore
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.patch("/me/firstName", validateBody(Joi.object({ firstName: Joi.string().max(32).allow("") })), async (req, res) => {
    const { firstName } = req.body;
    try {
        const result = await AccountData.findOneAndUpdate({
            //@ts-ignore
            id: req.user.id,
        }, {
            $set: { "fullName.givenName": firstName },
        }, { new: true }).exec();
        //@ts-ignore
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.patch("/me/lastName", validateBody(Joi.object({ lastName: Joi.string().max(32).allow("") })), async (req, res) => {
    const { lastName } = req.body;
    try {
        const result = await AccountData.findOneAndUpdate({
            //@ts-ignore
            id: req.user.id,
        }, {
            $set: { "fullName.familyName": lastName },
        }, { new: true }).exec();
        //@ts-ignore
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.patch("/me/bio", validateBody(Joi.object({ bio: Joi.string().required().max(230).allow("") })), async (req, res) => {
    const { bio } = req.body;

    const newUser = await AccountData.findOneAndUpdate({
        // @ts-ignore
        id: req.user.id
    }, { bio }, { new: true });

    res.send(newUser);
});

router.patch("/me/location", validateBody(Joi.object({ location: Joi.string().required().max(100).allow("") })), async (req, res) => {
    const { location } = req.body;

    const newUser = await AccountData.findOneAndUpdate({
        // @ts-ignore
        id: req.user.id
    }, { location }, { new: true });

    res.send(newUser);
});

router.patch("/me/country", validateBody(Joi.object({ country: Joi.string().valid(...Object.keys(COUNTRY_CODES)) })), async (req, res) => {
    const { country } = req.body;

    const user = await AccountData.findOneAndUpdate({
        // @ts-ignore
        id: req.user.id
    }, { country }, { new: true });

    res.send(user);
})

router.post("/me/preferredTopics/:topic", validateParams(Joi.object({ topic: Joi.string().min(1).max(32) })), async (req, res) => {
    const topic = req.params.topic;
    //@ts-ignore
    const id = req.user.id;

    const response = await AccountData.findOneAndUpdate({
        id,
    }, {
        $push: { preferredTopics: topic },
    }, { new: true });

    res.send(response);
})

router.delete("/me/preferredTopics/:topic", validateParams(Joi.object({ topic: Joi.string().min(1).max(32) })), async (req, res) => {
    const topic = req.params.topic;
    //@ts-ignore
    const id = req.user.id;

    const response = await AccountData.findOneAndUpdate({
        id,
    }, {
        $pull: { preferredTopics: topic },
    }, { new: true });

    res.send(response);
});

router.post("/me/configure", validateBody(Joi.object({
    username: Joi.string().min(2).max(32),
    firstName: Joi.string().max(32).allow(""),
    familyName: Joi.string().max(32).allow(""),
    bio: Joi.string().max(230).allow(""),
    location: Joi.string().min(2).max(100).allow(""),
    country: Joi.string().valid(...Object.keys(COUNTRY_CODES))
})), async (req, res) => {
    // @ts-ignore
    const id = req.user.id;
    
    const { username, firstName, lastName, bio, location, country } = req.body;
    
    const oldUser = await AccountData.findOne({
        id
    });

    if (!oldUser || oldUser.configured) return res.sendStatus(400), undefined;

    const user = await AccountData.findOneAndUpdate({
        id
    }, {
        username,
        $set: {
            "fullName.givenName": firstName,
            "fullName.familyName": lastName
        },
        bio,
        location,
        country,
        configured: true
    }, {
        new: true
    });

    res.send(user);
});

router.post("/me/skill", validateBody(Joi.object({ skill: Joi.string().required().max(20) })), async (req, res) => {
    const { skill } = await req.body;

    const user = await AccountData.findOneAndUpdate({
        // @ts-ignore
        id: req.user.id,
    }, {
        $push: { skills: skill },
    }, { new: true });

    res.send(user);
});

router.delete("/me/skill", validateBody(Joi.object({ skill: Joi.string().required().max(20) })), async (req, res) => {
    const { skill } = await req.body;

    const user = await AccountData.findOneAndUpdate({
        // @ts-ignore
        id: req.user.id,
    }, {
        $pull: { skills: skill },
    }, { new: true });

    res.send(user);
});

router.patch("/me/title", validateBody(Joi.object({ title: Joi.string().required().max(20) })), async (req, res) => {
    const { title } = await req.body;

    const user = await AccountData.findOneAndUpdate({
        // @ts-ignore
        id: req.user.id,
    }, {
        title,
    }, { new: true });

    res.send(user);
});

export default router;