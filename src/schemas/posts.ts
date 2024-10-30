import { Schema, model } from "mongoose";

const postSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: Date,
    likes: [String],
    tags: [String],
    images: [String]
});

export default model("post", postSchema);