import { Router } from "express";
import EventSchema from "../schemas/events";
import { validateBody, validateParams } from "../middlewares/validate";
import { EventValidator, EventValidatorEdit, ObjectIdValidatorParams } from "../validators";
import user from "../middlewares/user";

const router = Router();

router.get("/", async (_, res) => {
    const events = await EventSchema.find();

    res.send(events);
});

router.post("/", validateBody(EventValidator), user(), async (req, res) => {
    // @ts-ignore
    const event = await EventSchema.create({...req.body, awaiting: true, members: [], organizer: req.user.id});

    res.send(event);
});

router.get("/:id", validateParams(ObjectIdValidatorParams), async (req, res) => {
    const { id } = req.params;

    const event = await EventSchema.findById(id);
    if (!event) return res.sendStatus(404), undefined;

    res.send(event);
})

router.post("/:id/members/me", validateParams(ObjectIdValidatorParams), user(), async (req, res) => {
    const { id } = req.params;

    const event = await EventSchema.findByIdAndUpdate(id, {
        $addToSet: {
            // @ts-ignore
            members: req.user.id
        }
    }, {
        new: true
    });
    if (!event) return res.sendStatus(404), undefined;

    res.send(event);
});

router.delete("/:id/members/me", validateParams(ObjectIdValidatorParams), user(), async (req, res) => {
    const { id } = req.params;

    const event = await EventSchema.findByIdAndUpdate(id, {
        $pull: {
            // @ts-ignore
            members: req.user.id
        }
    }, {
        new: true
    });
    if (!event) return res.sendStatus(404), undefined;

    res.send(event);
});

router.delete("/:id", validateParams(ObjectIdValidatorParams), user(), async (req, res) => {
    const { id } = req.params;

    const event = await EventSchema.findById(id);
    if (!event) return res.sendStatus(404), undefined;

    // @ts-ignore
    if (event.organizer != req.user.id) return res.sendStatus(403), undefined;
    
    await EventSchema.findByIdAndDelete(id);

    res.send(event);
});

router.patch("/:id", validateParams(ObjectIdValidatorParams), validateBody(EventValidatorEdit), user(), async (req, res) => {
    const { id } = req.params;
    
    const oldEvent = await EventSchema.findById(id);
    if (!oldEvent) return res.sendStatus(404), undefined;

    // @ts-ignore
    if (oldEvent.organizer != req.user.id) return res.sendStatus(403), undefined;

    const event = await EventSchema.findByIdAndUpdate(id, req.body, { new: true });
    if (!event) return res.sendStatus(404), undefined;

    res.send(event);
});

export default router;