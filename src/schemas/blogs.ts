import { Schema, model } from "mongoose";

const blogSchema = new Schema({
    image: {
        type: String,
        required: false,
    },
    title: {
        type: String,
        require: true,
    },
    author: {
        type: String,
        require: true,
    },
    content: {
        type: String,
        require: true,
    }
});

export default model("blog", blogSchema);