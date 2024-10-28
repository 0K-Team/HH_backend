import { Router } from "express";
import passport from "passport";

const router = Router();

router.get("/me", passport.authenticate("jwt", { session: false }), (req, res) => {
    res.send(req.user);
})

export default router;