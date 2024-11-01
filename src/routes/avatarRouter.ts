import express, { Request, Response } from 'express';
import { downloadAvatar } from '../assets/download';
import { uploadAvatar } from '../assets/upload';

const router = express.Router();

router.get('/:userID/:avatarHash', async (req: Request, res: Response) => {
    try {
        res.setHeader('Content-Type', 'image/jpeg');
        await downloadAvatar(req.params.userID, req.params.avatarHash, res);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

router.post('/:userID/:avatarHash', async (req: Request, res: Response) => {
    try {
        // Create a buffer from the incoming request
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => {
            chunks.push(chunk); // Collect the incoming data chunks
        });

        req.on('end', async () => {
            const buffer = Buffer.concat(chunks); // Concatenate all chunks into a single buffer
            const { userID, avatarHash } = req.params;

            // Upload the file using the buffer
            const fileUrl = await uploadAvatar(buffer, userID, avatarHash);
            res.status(200).json({ message: 'File uploaded successfully', fileUrl });
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;