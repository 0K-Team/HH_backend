import { Router } from "express";
import passport from "passport";
import User from "../../schemas/accounts"

const router = Router();

router.get("/me", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.send(req.user);
})

router.get("/:user", async (req, res) => {
    const reqUser: String = req.params.user;
    const userAggregate = User.aggregate([
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

export default router;