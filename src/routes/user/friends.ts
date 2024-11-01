import { Router } from "express";
import FriendRequestsSchema from "../../schemas/friendRequests";
import AccountSchema from "../../schemas/accounts";

const router = Router();

router.get("/me", async (req, res) => {
    const user = await AccountSchema.findOne({
        // @ts-ignore
        id: req.user.id
    })

    res.send(user?.friends ?? []);
})

// ingoing request
router.get("/requests", async (req, res) => {
    const requests = await FriendRequestsSchema.findOne({
        // @ts-ignore
        target: req.user.id
    });

    res.send(requests ?? []);
})

// outgoing requests
router.get("/requests/me", async (req, res) => {
    const requests = await FriendRequestsSchema.findOne({
        // @ts-ignore
        sender: req.user.id
    });

    res.send(requests ?? []);
})

// new request (user id)
router.post("/requests/me/:id", async (req, res) => {
    const { id } = req.params;
    // @ts-ignore
    const userID = req.user.id;

    if (id == userID) return res.sendStatus(400), undefined;

    const user = await AccountSchema.findOne({
        id: userID
    });

    if (user?.friends.includes(id)) return res.sendStatus(400), undefined;

    // max 1 request to the same person is allowed
    const request = await FriendRequestsSchema.findOneAndUpdate({
        // @ts-ignore
        sender: req.user.id,
        target: id
    }, {}, {
        upsert: true,
        new: true
    })

    res.send(request);
})

// reject an ingoing request (user id)
router.delete("/requests/:id", async (req, res) => {
    const { id } = req.params;
    
    const request = await FriendRequestsSchema.findOneAndDelete({
        // @ts-ignore
        target: req.user.id,
        sender: id
    })

    res.sendStatus(request ? 200 : 404);
})

// retract an outgoing request (user id)
router.delete("/requests/me/:id", async (req, res) => {
    const { id } = req.params;

    const request = await FriendRequestsSchema.findOneAndDelete({
        // @ts-ignore
        sender: req.user.id,
        target: id
    })

    res.sendStatus(request ? 200 : 404);
})

// accept an ingoing request (user id)
router.post("/requests/:id", async (req, res) => {
    const { id } = req.params;
    // @ts-ignore
    const userID = req.user.id;

    const request = await FriendRequestsSchema.findOneAndDelete({
        target: userID,
        sender: id
    })

    if (request) {
        await AccountSchema.updateOne({
            id
        }, {
            $addToSet: {
                friends: userID
            }
        })
        await AccountSchema.updateOne({
            id: userID
        }, {
            $addToSet: {
                friends: id
            }
        })
        res.sendStatus(200);
    } else res.sendStatus(404);
})

export default router;