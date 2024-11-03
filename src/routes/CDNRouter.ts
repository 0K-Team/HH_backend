import express, { Request, Response } from 'express';
import { downloadCDN } from '../assets/download';

const router = express.Router();

router.get("/:filename", async (req: Request, res: Response) => {
    const filename = req.params.filename;
    try {
        await downloadCDN(filename, res);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
})

export default router;