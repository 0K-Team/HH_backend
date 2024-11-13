import { Router } from "express";
import PostSchema from "../schemas/posts";
import AccountSchema from "../schemas/accounts";
import user from "../middlewares/user";
import { ObjectIdValidatorParams, PostValidator } from "../validators";
import { validateParams, validateQuery, validateBody } from "../middlewares/validate";
import Joi from "joi";
import { cache, cacheDestroy, cacheRemove } from "../middlewares/cache";
import { CacheHandler } from "../handlers/CacheHandler";
import multer from "multer";
import { uploadPostImage } from "../assets/upload";

const router = Router();

const postCache = new CacheHandler();
const postPagesCache = new CacheHandler();

router.get("/", validateQuery(Joi.object({
    user: Joi.string().pattern(/^[0-9]{15}$/).length(15),
    tag: Joi.string(),
    page: Joi.number(),
    limit: Joi.number()
})), cache(postPagesCache, (req) => {
    return `${req.query.page ?? 1}-${req.query.limit ?? 10}-${req.query.user ?? ""}-${req.query.tag ?? ""}`
}), async (req, res) => {
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

router.get("/:id", validateParams(ObjectIdValidatorParams), cache(postCache), async (req, res) => {
    const { id } = req.params;
    const post = await PostSchema.findById(id);

    if (!post) return res.status(404), undefined;
    res.send(post);
});

const upload = multer({
    limits: {
        fileSize: 1024 * 1024 * 10
    }
});

router.post("/", validateBody(Joi.object({
    content: Joi.string().min(1).max(300).required(),
    tags: Joi.array().items(Joi.string().max(64))
})), upload.array("files"), cacheDestroy(postPagesCache), user(), async (req, res) => {
    // @ts-ignore
    if (!req.user || !req.user.id) return res.sendStatus(401), undefined;
    const {
        content,
        tags
    } = req.body;

    const files = req.files as Express.Multer.File[];
    const images: string[] = files?.map(f => f.originalname);

    const post = await PostSchema.create({
        // @ts-ignore
        author: req.user.id,
        images,
        content,
        tags, 
        date: new Date().toISOString()
    });

    if (files && files.length > 0) {
        files.forEach(file => {
            uploadPostImage(file.buffer, post._id.toString(), file.originalname)
        })
    }

    res.status(200).send(post);
});

router.delete("/:id", validateParams(ObjectIdValidatorParams), cacheDestroy(postPagesCache), cacheRemove(postCache), user(), async (req, res) => {
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
    res.status(200).send("OK");
});

router.put("/:id", validateParams(ObjectIdValidatorParams), validateBody(Joi.object({
    content: Joi.string().min(1).max(300).required(),
    tags: Joi.array().items(Joi.string().min(1).max(64)),
    images: Joi.array().items(Joi.string())
})), cacheDestroy(postPagesCache), cache(postCache, undefined, undefined, true), user(), async (req, res) => {
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
    res.status(200).send(newPost);
});

router.post("/like/:id", validateParams(ObjectIdValidatorParams), cacheDestroy(postPagesCache), cache(postCache, undefined, undefined, true), user(), async (req, res) => {
    const { id } = req.params;
    
    const post = await PostSchema.findByIdAndUpdate(id, {
        $addToSet: {
            // @ts-ignore
            likes: req.user.id
        }
    }, { new: true })

    res.status(200).send(post);
});

router.delete("/like/:id", validateParams(ObjectIdValidatorParams), cacheDestroy(postPagesCache), cache(postCache, undefined, undefined, true), user(), async (req, res) => {
    const { id } = req.params;
    
    const post = await PostSchema.findByIdAndUpdate(id, {
        $pull: {
            // @ts-ignore
            likes: req.user.id
        }
    }, { new: true })

    res.status(200).send(post);
});

export default router;