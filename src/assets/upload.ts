import { containerClient } from '../azureBlobClient';

export const upload = async (buffer: Buffer, filename: string): Promise<string> => {
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
  
    await blockBlobClient.upload(buffer, buffer.length);
    return filename;
};

export const uploadAvatar = async (buffer: Buffer, userID: string, avatarHash: string) => {
    return upload(buffer, `avatars/${userID}/${avatarHash}`);
}

export const uploadPostImage = async (buffer: Buffer, postID: string, filename: string) => {
    return upload(buffer, `avatars/${postID}/${filename}`);
}

export const uploadCDN = async (buffer: Buffer, filename: string) => {
    return upload(buffer, `CDN/${filename}`);
}