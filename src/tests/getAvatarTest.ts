import getAvatar from "../avatars/getAvatar"
import * as fs from "fs"

const filename = "testAvatar.jpg";
const writeStream = fs.createWriteStream(`./src/tests/output/${filename}`);

getAvatar(filename, writeStream);

writeStream.on('finish', () => {
    console.log('File has been written successfully.');
});

writeStream.on('error', (err) => {
    console.error('Error writing file:', err);
});
