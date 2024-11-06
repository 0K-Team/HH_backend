import { Router } from "express";
import { validateParams, validateQuery } from "../middlewares/validate";
import Joi from "joi";
import ProductSchema from "../schemas/products";
import DiscountSchema from "../schemas/discounts";
import { ObjectIdValidatorParams } from "../validators";

const router = Router();

router.get("/", validateQuery(Joi.object({
    category: Joi.string(),
    page: Joi.number(),
    limit: Joi.number()
})), async (req, res) => {
    const { category } = req.query;

    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 10;
    if (page < 1) return res.sendStatus(400), undefined;
    if (limit > 100) return res.sendStatus(400), undefined;

    const start = (page - 1) * limit;
    const total = await ProductSchema.countDocuments();
    const pages = Math.ceil(total / limit);

    const query: { category?: string } = {};
    if (category) query["category"] = category as string;

    
    const posts = await ProductSchema.find(query).skip(start).limit(limit);

    res.json({
        page,
        limit,
        data: posts,
        total,
        pages
    });
});

router.get("/:id", validateParams(ObjectIdValidatorParams), async (req, res) => {
    const product = await ProductSchema.findById(req.params.id);
    if (!product) return res.sendStatus(404), undefined;

    res.send(product)
});

router.get("/discounts", async (_, res) => {
    const discounts = await DiscountSchema.find();

    res.send(discounts);
});

router.get("/discounts/:id", validateParams(ObjectIdValidatorParams), async (req, res) => {
    const discount = await DiscountSchema.findById(req.params.id);
    if (!discount) return res.sendStatus(404), undefined;

    res.send(discount)
});

export default router;