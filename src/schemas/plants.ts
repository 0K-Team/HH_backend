import { Schema, model } from "mongoose";

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    description: String
});

export default model("plant", schema);