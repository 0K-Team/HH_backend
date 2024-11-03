import { BlobClient } from '@azure/storage-blob';
import { containerClient } from '../azureBlobClient';
import { Writable } from 'stream';

export const download = async (filename: string, writableStream: Writable) => {
    const blobClient: BlobClient = containerClient.getBlobClient(filename);

    const downloadResponse = await blobClient.download();

    if (!downloadResponse.errorCode && downloadResponse?.readableStreamBody) {
        downloadResponse.readableStreamBody.pipe(writableStream);
    }
}

export const downloadAvatar = async (userID: string, avatarHash: string, writableStream: Writable) => {
    download(`avatars/${userID}/${avatarHash}`, writableStream);
}

export const downloadPostImage = async (postID: string, hash: string, writableStream: Writable) => {
    download(`posts/${postID}/${hash}`, writableStream);
}

export const downloadCDN = async (filename: string, writableStream: Writable) => {
    download(`CDN/${filename}`, writableStream);
}