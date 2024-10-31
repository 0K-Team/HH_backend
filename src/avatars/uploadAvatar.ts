import { containerClient } from '../azureBlobClient';
import { BlockBlobClient } from '@azure/storage-blob';


const uploadAvatar = async (buffer: Buffer, filename: string): Promise<string> => {
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
  
    // Upload the buffer directly to Azure Blob Storage
    await blockBlobClient.upload(buffer, buffer.length);
    return `/avatar/${filename}`; // Return the URL of the uploaded file
  };

export default uploadAvatar;