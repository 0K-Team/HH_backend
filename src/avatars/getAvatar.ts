import { containerClient } from '../azureBlobClient';
import { Response } from 'express';

const getAvatar = async (filename: string, res: Response) => {
  const blockBlobClient = containerClient.getBlockBlobClient(filename);

  const downloadBlockBlobResponse = await blockBlobClient.download(0);
  if (downloadBlockBlobResponse.readableStreamBody) {
    // Pipe the readable stream directly to the response
    downloadBlockBlobResponse.readableStreamBody.pipe(res);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
};

export default getAvatar;