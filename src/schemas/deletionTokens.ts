import { Schema, model } from "mongoose";

const schema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    }
});

export default model("deletionToken", schema);