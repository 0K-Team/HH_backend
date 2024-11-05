import { Router } from "express";
import GardenSchema from "../schemas/garden";
import passport from "passport";
import { GardenHandler } from "../handlers/gardenHandler";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate";
import { ObjectIdValidatorParams, UserIdValidator } from "../validators";
import Joi from "joi";

const router = Router();

router.get("/me", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const garden = await GardenSchema.findOneAndUpdate({
        // @ts-ignore
        user: req.user.id
    }, { }, { upsert: true, new: true });

    res.send(garden);
});

router.get("/user/:id", validateParams(Joi.object({ id: UserIdValidator })), async (req, res) => {
    const { id } = req.params;

    const garden = await GardenSchema.findOne({
        user: id
    });

    if (!garden) res.sendStatus(404);
    else res.send(garden);
})

router.get("/top", validateQuery(Joi.object({
    page: Joi.number(),
    limit: Joi.number()
})), async (req, res) => {
    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 10;
    if (page < 1) return res.sendStatus(400), undefined;
    if (limit > 100) return res.sendStatus(400), undefined;

    const start = (page - 1) * limit;
    const total = await GardenSchema.countDocuments();
    const pages = Math.ceil(total / limit);

    const posts = await GardenSchema
        .aggregate()
        .addFields({
            score: { 
                $multiply: [{
                    $size: "$plants"
                }, {
                    $reduce: {
                        input: "$plants",
                        initialValue: 0,
                        in: { $add: [ "$$value", "$$this.growthStage" ] }
                    }
                }]
            }  
        })
        .sort({ score: -1 })
        .skip(start)
        .limit(limit)
        .exec();

    res.json({
        page,
        limit,
        data: posts,
        total,
        pages
    })
})

router.post("/me/action/:id", validateParams(ObjectIdValidatorParams), validateBody(Joi.object({ action: Joi.string().valid("water", "fertilizer", "weeds") })), passport.authenticate("jwt", { session: false }), async (req, res) => {    
    const { id } = req.params;
    const { action } = req.body;
    // @ts-ignore
    const user = req.user.id;

    const garden = await GardenSchema.findOne({
        user,
        "plants._id": id
    }, {
        "plants.$": 1
    });

    const currentPlant = garden ? garden.plants[0] : null;
    
    if (!currentPlant) return res.sendStatus(404), undefined;

    let actionRes = null;

    if (action == "water") actionRes = await GardenHandler.water(user, id);
    else if (action == "fertilizer") actionRes = await GardenHandler.fertilize(user, id);
    else if (action == "weeds") actionRes = await GardenHandler.weedsRemove(user, id);
    else return res.status(400).send("Unknown action"), undefined;

    if (actionRes[0]) {
        const error = actionRes[0];
        if (error == 1) return res.status(404).send("This user does not have a garden yet"), undefined;
        if (error == 2) return res.status(404).send("This plant does not exist"), undefined;
        return res.status(400).send("Action rejected"), undefined;
    }

    res.send(actionRes[1]);
})

export default router;