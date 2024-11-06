import { Router } from "express";
import { DiscountValidator, ObjectIdValidatorParams, ProductValidator } from "../../validators";
import { validateBody, validateParams } from "../../middlewares/validate";
import ProductSchema from "../../schemas/products";
import DiscountSchema from "../../schemas/discounts";

const router = Router();

router.post("/", validateBody(ProductValidator), async (req, res) => {
    const product = await ProductSchema.create(req.body);
    
    res.send(product);
});

router.put("/:id", validateBody(ProductValidator), validateParams(ObjectIdValidatorParams), async (req, res) => {
    const product = await ProductSchema.findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: true });
    if (!product) return res.sendStatus(404), undefined;

    res.send(product);
});

router.delete("/:id", validateParams(ObjectIdValidatorParams), async (req, res) => {
    const product = await ProductSchema.findByIdAndDelete(req.params.id);
    if (!product) return res.sendStatus(404), undefined;

    res.send(product);
});

router.post("/discount", validateBody(DiscountValidator), async (req, res) => {
    const discount = await DiscountSchema.create(req.body);

    res.send(discount);
});

router.put("/discount/:id", validateBody(DiscountValidator), validateParams(ObjectIdValidatorParams), async (req, res) => {
    const discount = await DiscountSchema.findByIdAndUpdate(req.params.id, req.body, { new: true, upsert: true });
    if (!discount) return res.sendStatus(404), undefined;

    res.send(discount);
});

router.delete("/discount/:id", validateParams(ObjectIdValidatorParams), async (req, res) => {
    const discount = await DiscountSchema.findByIdAndDelete(req.params.id);
    if (!discount) return res.sendStatus(404), undefined;

    res.send(discount);
});

export default router;