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
    createdAt: {
        type: String,
        required: true,
        default: () => new Date().toISOString()
    },
    likes: [String],
    tags: [String],
    images: [String]
});

export default model("post", postSchema);