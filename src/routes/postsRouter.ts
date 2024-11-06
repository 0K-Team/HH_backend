import { Router } from "express";
import PostSchema from "../schemas/posts";
import AccountSchema from "../schemas/accounts";
import passport from "passport";
import { ObjectIdValidatorParams, PostValidator } from "../validators";
import { validateParams, validateQuery, validateBody } from "../middlewares/validate";
import Joi from "joi";

const router = Router();

router.get("/", validateQuery(Joi.object({
    user: Joi.string().pattern(/^[0-9]{15}$/).length(15),
    tag: Joi.string(),
    page: Joi.number(),
    limit: Joi.number()
})), async (req, res) => {
    const { user, tag } = req.query;

    const page = parseInt(req.query.page as string) || 1; 
    const limit = parseInt(req.query.limit as string) || 10;
    if (page < 1) return res.sendStatus(400), undefined;
    if (limit > 100) return res.sendStatus(400), undefined;

    const start = (page - 1) * limit;
    const total = await PostSchema.countDocuments();
    const pages = Math.ceil(total / limit);

    const query: { author?: string, tags?: string } = {};
    if (user) query["author"] = user as string;
    if (tag) query["tags"] = tag as string;

    const posts = await PostSchema.find(query).sort({ createdAt: -1 }).skip(start).limit(limit);

    res.json({
        page,
        limit,
        data: posts,
        total,
        pages
    });
});

router.get("/:id", validateParams(ObjectIdValidatorParams), async (req, res) => {
    const { id } = req.params;
    const post = await PostSchema.findById(id);

    if (!post) res.status(404), undefined;
    res.send(post);
});

router.post("/", validateBody(Joi.object({
    content: Joi.string().min(1).max(300).required(),
    images: Joi.array().items(Joi.string()),
    tags: Joi.array().items(Joi.string().max(64))
})), passport.authenticate("jwt", { session: false }), async (req, res) => {
    // @ts-ignore
    if (!req.user || !req.user.id) return res.sendStatus(401), undefined;
    const {
        content,
        images,
        tags
    } = req.body;

    // @ts-ignore
    const validated = PostValidator.validate({author: req.user.id, content, images, tags, date: new Date().toISOString()})
    if (validated.error) return res.sendStatus(400), undefined;

    const post = await PostSchema.create(validated.value);
    res.send(post);
});

router.delete("/:id", validateParams(ObjectIdValidatorParams), passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { id } = req.params;

    const post = await PostSchema.findById(id);

    if (!post) return res.sendStatus(404), undefined;

    // @ts-ignore
    const userID = req.user.id;
    const user = await AccountSchema.findOne({
        id: userID
    })

    // @ts-ignore
    if (post && post.author != userID && !user?.admin) return res.sendStatus(403), undefined;
   
    await PostSchema.findByIdAndDelete(id);
    res.sendStatus(200);
})

router.put("/:id", validateParams(ObjectIdValidatorParams), validateBody(Joi.object({
    content: Joi.string().min(1).max(300).required(),
    tags: Joi.array().items(Joi.string().min(1).max(64)),
    images: Joi.array().items(Joi.string())
})), passport.authenticate("jwt", { session: false }), async (req, res) => {
    // @ts-ignore
    if (!req.user || !req.user.id) return res.sendStatus(401), undefined;

    const { content, tags, images } = req.body;
    const { id } = req.params;

    const post = await PostSchema.findById(id);

    if (!post) return res.sendStatus(404), undefined;
    // @ts-ignore
    if (post && post.author != req.user.id) return res.sendStatus(403), undefined;

    const validated = PostValidator.validate({...post, content, tags, images});
    if (validated.error) return res.sendStatus(400), undefined;
    
    const newPost = await PostSchema.findByIdAndUpdate(id, validated.value);
    res.send(newPost);
})

router.post("/like/:id", validateParams(ObjectIdValidatorParams), passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { id } = req.params;
    
    const post = await PostSchema.findByIdAndUpdate(id, {
        $addToSet: {
            // @ts-ignore
            likes: req.user.id
        }
    }, { new: true })

    res.status(200).send(post);
})

router.delete("/like/:id", validateParams(ObjectIdValidatorParams), passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { id } = req.params;
    
    const post = await PostSchema.findByIdAndUpdate(id, {
        $pull: {
            // @ts-ignore
            likes: req.user.id
        }
    }, { new: true })

    res.status(200).send(post);
})

export default router;