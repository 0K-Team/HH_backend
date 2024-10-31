import { Router } from "express";
import passport from "passport";
import AccountData from "../../schemas/accounts"
import { Aggregate } from "mongoose";

const router = Router();

router.get("/me", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.send(req.user);
})

router.get("/:user", async (req, res) => {
    const reqUser: String = await req.params.user;
    const userAggregate = AccountData.aggregate([
        { $match: { username: reqUser } },
        { $project: { _id: 0, id: 1, username: 1, avatarHash: 1, title: 1, bio: 1, achievements: 1, skills: 1, badges: 1, location: 1, preferredTopics: 1 } }
    ]);

    try {
        const result = await userAggregate.exec();
        res.send(result);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.patch("/me/changeUsername/:newName", passport.authenticate("jwt", { session: false }), (req, res) => {
    const newUsername: String = req.params.newName;
    try {
        const result = AccountData.findOneAndUpdate({
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

export default router;