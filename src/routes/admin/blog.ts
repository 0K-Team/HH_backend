import { Router } from "express";
import { BlogValidator } from "../../validators";
import BlogSchema from "../../schemas/blogs";

const router = Router();

router.post("/", async (req, res) => {
    const validated = BlogValidator.validate(req.body);
    if (validated.error) return res.sendStatus(400), undefined;
    const blog = await BlogSchema.create(validated.value);

    res.send(blog);
})

router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    const blog = await BlogSchema.findByIdAndDelete(id);

    res.sendStatus(blog ? 200 : 404);
})

export default router;