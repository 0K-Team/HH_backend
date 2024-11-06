import express, { Request, Response } from 'express';
import BlogData from "../schemas/blogs";
import { validateParams } from '../middlewares/validate';
import { ObjectIdValidatorParams } from '../validators';

const router = express.Router();

router.get("/", async (_, res: Response) => {
    const blogs = await BlogData.find();
    res.json(blogs);
});

router.get("/:id", validateParams(ObjectIdValidatorParams), async (req: Request, res: Response) => {
    const id = req.params.id;
    const blog = await BlogData.findById(id);
    res.json(blog);
});

export default router;