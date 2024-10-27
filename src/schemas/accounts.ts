import { Schema, model } from "mongoose";

const accountSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    avatarHash: {
        type: String,
        required: true
    },
    providerID: {
        type: String
    },
    points: Number
});

export default model("account", accountSchema);