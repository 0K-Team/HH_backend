// src/routes/getFile.ts
import express, { Request, Response } from 'express';
import getAvatar from '../avatars/getAvatar';

const router = express.Router();

router.get('/getAvatar/:filename', async (req: Request, res: Response) => {
  try {
    await getAvatar(req.params.filename, res);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

export default router;
