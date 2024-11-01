import { Schema, model } from "mongoose";

const schema = new Schema({
    sender: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    createdAt: {
        type: String,
        default: () => new Date().toISOString()
    }
})

export default model("friendRequest", schema);