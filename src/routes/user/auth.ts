import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/google", passport.authenticate("google"));
router.get("/google/callback", passport.authenticate("google"), (_, res) => {
    res.redirect("/");
});

router.get("/facebook", passport.authenticate("facebook"));
router.get("/facebook/callback", passport.authenticate("facebook"), (_, res) => {
    res.redirect("/");
});

export default router;