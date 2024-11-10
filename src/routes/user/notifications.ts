import { Router } from "express";
import NotificationSchema from "../../schemas/notifications";
import { validateParams } from "../../middlewares/validate";
import { ObjectIdValidatorParams } from "../../validators";

const router = Router();

router.get("/", async (req, res) => {
    const notifs = await NotificationSchema.findOneAndUpdate({
        // @ts-ignore
        user: req.user.id
    }, { }, { 
        new: true,
        upsert: true
    });

    res.send(notifs.notifications);
});

router.delete("/:id", validateParams(ObjectIdValidatorParams), async (req, res) => {
    const notifs = await NotificationSchema.findOneAndUpdate({
        // @ts-ignore
        user: req.user.id,
        "notifications._id": req.params.id
    }, {
        $set: {
            "notifications.$.read": true
        }
    }, {
        new: true
    });

    if (!notifs) return res.sendStatus(404), undefined;

    res.send(notifs);
});

export default router;