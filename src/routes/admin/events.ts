import { Router } from "express";
import { validateBody, validateParams } from "../../middlewares/validate";
import { EventValidatorEdit, ObjectIdValidatorParams } from "../../validators";
import EventSchema from "../../schemas/events";
import user from "../../middlewares/user";

const router = Router();

router.get("/", async (_, res) => {
    const events = await EventSchema.find({ awaiting: true });

    res.send(events);
})

router.post("/approve/:id", validateParams(ObjectIdValidatorParams), async (req, res) => {
    const { id } = req.params;

    const oldEvent = await EventSchema.findById(id);
    if (!oldEvent) return res.sendStatus(404), undefined;
    if (!oldEvent.awaiting) return res.sendStatus(400), undefined;

    const event = await EventSchema.findByIdAndUpdate(id, {
        awaiting: false
    });

    res.send(event);
});

router.delete("/approve/:id", validateParams(ObjectIdValidatorParams), async (req, res) => {
    const { id } = req.params;

    const oldEvent = await EventSchema.findById(id);
    if (!oldEvent) return res.sendStatus(404), undefined;
    if (!oldEvent.awaiting) return res.sendStatus(400), undefined;

    const event = await EventSchema.findByIdAndDelete(id);
    if (!event) return res.sendStatus(404), undefined;

    res.send(event);
});

router.delete("/:id", validateParams(ObjectIdValidatorParams), user(), async (req, res) => {
    const { id } = req.params;
    
    const event = await EventSchema.findByIdAndDelete(id);
    if (!event) return res.sendStatus(404), undefined;

    res.send(event);
});

router.patch("/:id", validateParams(ObjectIdValidatorParams), validateBody(EventValidatorEdit), async (req, res) => {
    const { id } = req.params;

    const event = await EventSchema.findByIdAndUpdate(id, req.body, { new: true });
    if (!event) return res.sendStatus(404), undefined;

    res.send(event);
});


export default router;