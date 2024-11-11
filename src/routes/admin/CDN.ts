import { Router } from "express";
import { uploadCDN } from '../../assets/upload';
import { listAllCDN } from "../../assets/download";
import Joi from "joi";
import { validateParams } from "../../middlewares/validate";
import multer from 'multer';

const router = Router();

const upload = multer();

router.post("/:filename", validateParams(Joi.object({ filename: Joi.string().required() })), upload.single('file'), async (req, res) => {
    try {
        const filename = req.params.filename;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' }), undefined;
        }

        // Upload the file using the buffer
        const fileUrl = await uploadCDN(file.buffer, filename);
        res.status(200).json({ message: 'File uploaded successfully', fileUrl });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.get("/", async (_, res) => {
    try {
        const allCDN = await listAllCDN();

        res.status(200).send(allCDN);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;