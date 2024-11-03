import { Router } from "express";
import { uploadCDN } from '../../assets/upload';

const router = Router();

router.post("/:filename", async (req, res) => {
    try {
        const filename = req.params.filename;
        // Create a buffer from the incoming request
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => {
            chunks.push(chunk); // Collect the incoming data chunks
        });

        req.on('end', async () => {
            const buffer = Buffer.concat(chunks); // Concatenate all chunks into a single buffer

            // Upload the file using the buffer
            const fileUrl = await uploadCDN(buffer, filename);
            res.status(200).json({ message: 'File uploaded successfully', fileUrl });
        });
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
})

export default router;