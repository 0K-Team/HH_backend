import { Router } from "express";
import PostSchema from "../schemas/posts";
import passport from "passport";
import joi from "joi";
import { PostValidator } from "../validators";

const router = Router();

router.get("/", async (req, res) => {
    const page = parseInt(req.query.page as string) ?? 1; 
    const limit = parseInt(req.query.limit as string) ?? 10;
    if (page < 1) return res.status(400), undefined;
    if (limit > 100) return res.status(400), undefined;

    const start = (page - 1) * limit;
    const total = await PostSchema.countDocuments();
    const pages = Math.ceil(total / limit);

    if (page > pages) return res.status(400), undefined;

    const posts = await PostSchema.find().skip(start).limit(limit);

    res.json({
        page,
        limit,
        data: posts,
        total,
        pages
    })
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const post = await PostSchema.findById(id);

    if (!post) res.status(404), undefined;
    res.send(post);
});

router.post("/", passport.authenticate("jwt"), async (req, res) => {
    // @ts-ignore
    if (!req.user || !req.user.id) return res.status(401), undefined;
    const {
        content,
        images,
        tags
    } = req.body;

    // @ts-ignore
    const validated = PostValidator.validate({author: req.user.id, content, images, tags})
    if (validated.error) return res.status(400), undefined;
    
    const post = await PostSchema.create(validated.value);
    res.send(post);
});

router.put("/:id", passport.authenticate("jwt"), async (req, res) => {
    // @ts-ignore
    if (!req.user || !req.user.id) return res.status(401), undefined;

    const { content, tags, images } = req.body;
    const { id } = req.params;

    const post = await PostSchema.findById(id);

    if (!post) return res.status(404), undefined;
    // @ts-ignore
    if (post && post.author != req.user.id) return res.status(403), undefined;

    const validated = PostValidator.validate({...post, content, tags, images});
    if (validated.error) return res.status(400), undefined;
    
    const newPost = await PostSchema.findByIdAndUpdate(id, validated.value);
    res.send(newPost);
})

router.post("/:id", passport.authenticate("jwt"), async (req, res) => {
    // @ts-ignore
    if (!req.user || !req.user.id) return res.status(401), undefined;

    const { id } = req.params;
    
    const post = await PostSchema.findByIdAndUpdate(id, {
        $addToSet: {
            // @ts-ignore
            likes: req.user.id
        }
    })

    res.send(post?.likes.length);
})

export default router;