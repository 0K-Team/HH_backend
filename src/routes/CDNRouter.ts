import express, { Request, Response } from 'express';
import { downloadCDN } from '../assets/download';
import Joi from 'joi';
import { validateParams } from '../middlewares/validate';

const router = express.Router();

router.get("/:filename", validateParams(Joi.object({ filename: Joi.string().required() })), async (req: Request, res: Response) => {
    const filename = req.params.filename;
    try {
        await downloadCDN(filename, res);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
})

export default router;