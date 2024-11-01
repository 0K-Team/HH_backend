import { Router } from "express";
import passport from "passport";
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

router.patch("/me/username/:newName", async (req, res) => {
    const newUsername: String = req.params.newName;
    try {
        const result = await AccountData.findOneAndUpdate({
            //@ts-ignore
            id: req.user.id,
        }, {
            username: newUsername,
        }).exec();
        //@ts-ignore
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.patch("/me/firstName/:newName", async (req, res) => {
    const newFirstName: String = req.params.newName;
    try {
        const result = await AccountData.findOneAndUpdate({
            //@ts-ignore
            id: req.user.id,
        }, {
            $set: { "fullName.givenName": newFirstName },
        }, { new: true }).exec();
        //@ts-ignore
        res.status(200).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
})

router.patch("/me/lastName/:newName", async (req, res) => {
    const newLastName: String = req.params.newName;
    try {
        const result = await AccountData.findOneAndUpdate({
            //@ts-ignore
            id: req.user.id,
        }, {
            $set: { "fullName.familyName": newLastName },
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

export default router;