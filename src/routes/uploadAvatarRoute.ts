// src/routes/uploadFile.ts
import express, { Request, Response } from 'express';
import uploadAvatar from '../avatars/uploadAvatar';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    // Create a buffer from the incoming request
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      chunks.push(chunk); // Collect the incoming data chunks
    });

    req.on('end', async () => {
      const buffer = Buffer.concat(chunks); // Concatenate all chunks into a single buffer
      const filename = req.headers['file-name'] as string; // Get the file name from headers

      // Upload the file using the buffer
      const fileUrl = await uploadAvatar(buffer, filename);
      res.status(200).json({ message: 'File uploaded successfully', fileUrl });
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
