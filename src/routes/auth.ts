import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import AccountSchema from "../schemas/accounts";

const router = Router();

router.get("/google", passport.authenticate("google"));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/", session: false }), (req, res) => {
    if (!req.user) return res.sendStatus(401), undefined;
    // @ts-ignore
    const { _id, email, id } = req.user;
    const token = jwt.sign({
        id: _id,
        email,
        accountID: id
    }, process.env.JWT_SECRET as string);
    res.cookie("jwt", token);
    res.redirect("/dash");
});

router.get("/googleToken", passport.authenticate("googleToken", { failureRedirect: "/", session: false }), (req, res) => {
    if (!req.user) return res.sendStatus(401), undefined;
    // @ts-ignore
    const { _id, email, id } = req.user;
    const token = jwt.sign({
        id: _id,
        email,
        accountID: id
    }, process.env.JWT_SECRET as string);
    res.cookie("jwt", token);
    res.send(token);
});

router.get("/facebook", passport.authenticate("facebook"));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/", session: false }), (req, res) => {
    if (!req.user) return res.sendStatus(401), undefined;
    // @ts-ignore
    const { _id, email, id } = req.user;
    const token = jwt.sign({
        id: _id,
        email,
        accountID: id
    }, process.env.JWT_SECRET as string);
    res.cookie("jwt", token);
    res.redirect("/dash");
});

router.post("/facebook/email", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { email } = req.body;

    await AccountSchema.updateOne({
        // @ts-ignore
        id: req.user.id,
        email: { $exists: false }
    }, {
        email
    })

    res.sendStatus(200);
})

export default router;