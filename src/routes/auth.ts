import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import AccountSchema from "../schemas/accounts";
import { sendAccountRegistration } from "../mailer";
import user from "../middlewares/user";
import { randomUUID } from "crypto";
import DeletionTokenSchema from "../schemas/deletionTokens";
import { deleteUserData } from "../auth/userData";

const router = Router();
const clients: Map<string, WebSocket> = new Map();

router.get("/google", passport.authenticate("google"));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/", session: false }), async (req, res) => {
    if (!req.user) return res.sendStatus(401), undefined;
    // @ts-ignore
    const { _id, email, id, mailSent, username } = req.user;
    const token = jwt.sign({
        id: _id,
        email,
        accountID: id
    }, process.env.JWT_SECRET as string);
    res.cookie("jwt", token);
    if (!mailSent) {
        sendAccountRegistration(email, username);
        // await AccountSchema.updateOne({
        //     id
        // }, {
        //     mailSent: true
        // })
    }
    res.redirect("/dash");
});

router.get("/googleToken", passport.authenticate("googleToken", { failureRedirect: "/", session: false }), async (req, res) => {
    if (!req.user) return res.sendStatus(401), undefined;
    // @ts-ignore
    const { _id, email, id, mailSent, username } = req.user;
    const token = jwt.sign({
        id: _id,
        email,
        accountID: id
    }, process.env.JWT_SECRET as string);
    res.cookie("jwt", token);
    if (!mailSent) {
        sendAccountRegistration(email, username);
        await AccountSchema.updateOne({
            id
        }, {
            mailSent: true
        })
    }
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

router.post("/facebook/email", user(), async (req, res) => {
    const { email } = req.body;

    await AccountSchema.updateOne({
        // @ts-ignore
        id: req.user.id,
        email: { $exists: false }
    }, {
        email
    })

    res.sendStatus(200);
});

router.delete("/me", user(), async (req, res) => {
    const token = randomUUID();
    // @ts-ignore
    const user = req.user.id;
    const userToken = await DeletionTokenSchema.findOne({
        user
    });

    if (userToken) return res.status(409).send("Token already requested"), undefined;

    await DeletionTokenSchema.create({
        user,
        token
    });

    // TODO: implement sending confirmation e-mail

    res.sendStatus(200);
});

router.delete("/me/token", user(), async (req, res) => {
    const { token } = req.body;
    // @ts-ignore
    const user = req.user.id;

    const data = await DeletionTokenSchema.findOne({
        token
    });

    if (!data) return res.sendStatus(404), undefined;

    if (data.user != user) return res.sendStatus(403), undefined;

    await DeletionTokenSchema.deleteOne({
        token
    });

    deleteUserData(user);
    
    res.sendStatus(200);
});

router.ws("/qr", async (ws, req) => {
    if (req.user) return ws.close(4001);
    const clientID = randomUUID();
    clients.set(clientID, ws as unknown as WebSocket);
    const token = jwt.sign(clientID, process.env.JWT_SECRET as string);

    ws.send(`0${token}`);
});

router.post("/qr", user(), async (req, res) => {
    if (!user) return res.sendStatus(401), undefined;
    const { token } = req.body;
    if (!jwt.verify(token, process.env.JWT_SECRET as string)) return res.sendStatus(403), undefined;
    // @ts-ignore
    const { _id, email, id } = req.user;

    const loginToken = jwt.sign({
        id: _id,
        email,
        accountID: id
    }, process.env.JWT_SECRET as string);

    const clientID = jwt.decode(token) as string;

    if (!clients.has(clientID)) return res.sendStatus(400), undefined;

    clients.get(clientID)?.send(`1${loginToken}`);

    clients.get(clientID)?.close(1000);
    clients.delete(clientID);

    res.sendStatus(200);
})

router.post("/jwt", user(), async (req, res) => {
    // @ts-ignore
    const { _id, email, id } = req.user;
    const token = jwt.sign({
        id: _id,
        email,
        accountID: id
    }, process.env.JWT_SECRET as string);
    res.cookie("jwt", token);
    res.sendStatus(200);
})

export default router;