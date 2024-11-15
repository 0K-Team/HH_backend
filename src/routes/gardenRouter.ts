import { Router } from "express";
import GardenSchema from "../schemas/garden";
import PlantSchema from "../schemas/plants";
import AccountSchema from "../schemas/accounts";
import user from "../middlewares/user";
import { GardenHandler } from "../handlers/GardenHandler";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate";
import { ObjectIdValidatorParams, UserIdValidator } from "../validators";
import Joi from "joi";

const router = Router();

router.get("/me", user(), async (req, res) => {
    // @ts-ignore
    const user = req.user.id;
    await GardenHandler.updateCapabilities(user);
    const garden = await GardenSchema.findOneAndUpdate({
        user
    }, { }, { upsert: true, new: true });

    res.send(garden);
});

router.get("/user/:id", validateParams(Joi.object({ id: UserIdValidator })), async (req, res) => {
    const { id } = req.params;

    const garden = await GardenSchema.findOneAndUpdate({
        user: id
    }, { }, { upsert: true, new: true });

    res.send(garden);
});

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
});

router.get("/plants", async (_, res) => {
    const plants = await PlantSchema.find();

    res.send(plants);
})

router.post("/me/action/:id", validateParams(ObjectIdValidatorParams), validateBody(Joi.object({ action: Joi.string().valid("water", "fertilizer", "weeds") })), user(), async (req, res) => {    
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
        return res.status(400).send("Action rejected " + error), undefined;
    }

    await GardenHandler.updateCapabilities(user);

    const newData = await GardenSchema.findOne({
        user
    });

    res.send(newData);
});

router.post("/me/sell/:id", validateParams(ObjectIdValidatorParams), user(), async (req, res) => {
    const { id } = req.params;
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

    const plant = await PlantSchema.findOne({
        type: currentPlant.type
    });

    if (!plant) return res.sendStatus(400), undefined;

    const price = plant.price * (currentPlant.growthStage / 4);
    
    await AccountSchema.updateOne({
        id: user
    }, {
        $inc: {
            points: price
        }
    });

    const newGarden = await GardenSchema.findOneAndUpdate({
        user
    }, {
        $pull: {
            plants: currentPlant
        }
    }, {
        new: true
    });

    res.send(newGarden);
});

router.post("/me/harvest/:id", validateParams(ObjectIdValidatorParams), user(), async (req, res) => {
    const { id } = req.params;
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

    const plant = await PlantSchema.findOne({
        type: currentPlant.type
    });

    if (!plant) return res.sendStatus(400), undefined;
    if ((currentPlant.growthStage ?? 0) < 4) return res.sendStatus(400), undefined;

    const price = plant.price * currentPlant.growthStage;
    
    await AccountSchema.updateOne({
        id: user
    }, {
        $inc: {
            points: price
        }
    });

    const newGarden = await GardenSchema.findOneAndUpdate({
        user,
        "plants._id": id
    }, {
        $set: {
            "plants.$.growthStage": 0,
            "plants.$.wateringNeeded": Math.floor(Math.random() * 4),
            "plants.$.fertilizerNeeded": Math.floor(Math.random() * 4),
            "plants.$.weedsRemovedNeeded": Math.floor(Math.random() * 4)
        }
    }, {
        new: true
    });

    res.send(newGarden);
});

export default router;