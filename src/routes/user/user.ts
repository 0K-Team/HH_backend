import { Router } from "express";
import AccountData from "../../schemas/accounts"
import { UserValidator } from "../../validators";

const router = Router();

router.get("/me", (req, res) => {
    res.send(req.user);
})

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    
    const user = await AccountData.findOne({
        id
    });

    if (!user) return res.sendStatus(404), undefined;

    res.send(user);
})

router.patch("/me/username", async (req, res) => {
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
})

router.patch("/me/firstName", async (req, res) => {
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
})

router.patch("/me/lastName", async (req, res) => {
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
})

router.patch("/me/bio", async (req, res) => {
    const { bio } = req.body;

    const user = await AccountData.findOne({
        // @ts-ignore
        id: req.user.id
    });

    // @ts-ignore
    const validated = UserValidator.validate({ ...user?.toObject(), bio });
    if (validated.error) return res.sendStatus(400), console.log(validated.error.details), undefined;

    const newUser = await AccountData.findOneAndUpdate({
        // @ts-ignore
        id: req.user.id
    }, { bio }, { new: true });

    res.send(newUser);
})

router.patch("/me/location", async (req, res) => {
    const { location } = req.body;

    const newUser = await AccountData.findOneAndUpdate({
        // @ts-ignore
        id: req.user.id
    }, { location }, { new: true });

    res.send(newUser);
})

router.patch("/me/country", async (req, res) => {
    const { country } = req.body;

    const user = await AccountData.findOneAndUpdate({
        // @ts-ignore
        id: req.user.id
    }, { country }, { new: true });

    res.send(user);
})

router.post("/me/preferredTopics/:topic", async (req, res) => {
    const topic: String = req.params.topic;
    //@ts-ignore
    const id = req.user.id;

    const response = await AccountData.findOneAndUpdate({
        id,
    }, {
        $push: { preferredTopics: topic },
    }, { new: true });

    res.send(response);
})

router.delete("/me/preferredTopics/:topic", async (req, res) => {
    const topic: String = req.params.topic;
    //@ts-ignore
    const id = req.user.id;

    const response = await AccountData.findOneAndUpdate({
        id,
    }, {
        $pull: { preferredTopics: topic },
    }, { new: true });

    res.send(response);
})

router.post("/me/configure", async (req, res) => {
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
})

export default router;