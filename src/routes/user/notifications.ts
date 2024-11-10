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
        user: req.user.id
    }, {
        $pull: {
            notifications: { _id: req.params.id }
        }
    }, {
        new: true,
        upsert: true
    });

    res.send(notifs);
});

export default router;