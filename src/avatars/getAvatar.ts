import { BlobClient } from '@azure/storage-blob';
import { containerClient } from '../azureBlobClient';
import { Writable } from 'stream';

const getAvatar = async (filename: string, writableStream: Writable) => {
  const blobClient: BlobClient = await containerClient.getBlobClient(filename);

  const downloadResponse = await blobClient.download();

  if (!downloadResponse.errorCode && downloadResponse?.readableStreamBody) {
    downloadResponse.readableStreamBody.pipe(writableStream);
    console.log(`download of ${filename} succeeded`);
  }
}

export default getAvatar;