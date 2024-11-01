import { downloadAvatar } from "../assets/download"
import * as fs from "fs"

const filename = "testAvatar.jpg";
const writeStream = fs.createWriteStream(`./src/tests/output/${filename}`);

downloadAvatar("123456789012345", filename, writeStream);

writeStream.on('finish', () => {
    console.log('File has been written successfully.');
});

writeStream.on('error', (err) => {
    console.error('Error writing file:', err);
});
