import express, { Request, Response } from 'express';
import BlogData from "../schemas/blogs";

const router = express.Router();

router.get("/all", async (req: Request, res: Response) => {
    const blogs = await BlogData.find();
    res.json(blogs);
});

router.get("/:id", async (req: Request, res: Response) => {
    const id = await req.params.id;
    const blog = await BlogData.findById(id);
    res.json(blog);
});

export default router;