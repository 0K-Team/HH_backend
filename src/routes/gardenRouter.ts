import { Router } from "express";
import GardenSchema from "../schemas/garden";
import passport from "passport";

const router = Router();

router.get("/me", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const garden = await GardenSchema.findOneAndUpdate({
        // @ts-ignore
        user: req.user.id
    }, { }, { upsert: true, new: true });

    res.send(garden);
});

router.get("/user/:id", async (req, res) => {
    const { id } = req.params;

    const garden = await GardenSchema.findOne({
        user: id
    });

    if (!garden) res.sendStatus(404);
    else res.send(garden);
})

router.get("/top", async (req, res) => {
    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 10;
    if (page < 1) return res.sendStatus(400), undefined;
    if (limit > 100) return res.sendStatus(400), undefined;

    const start = (page - 1) * limit;
    const total = await GardenSchema.countDocuments();
    const pages = Math.ceil(total / limit);

    if (page > pages) return res.sendStatus(400), undefined;

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

export default router;