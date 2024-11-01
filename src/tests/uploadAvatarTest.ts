import { uploadAvatar } from "../assets/upload"
import * as fs from 'fs';

fs.readFile('./src/tests/testAvatar.jpg', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    const buffer = Buffer.from(data);

    console.log("Buffer: ", buffer);

    uploadAvatar(buffer, "123456789012345", "testAvatar.jpg");
});