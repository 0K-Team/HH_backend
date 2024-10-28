import { Schema, model } from "mongoose";

export const accountSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => new Array(15).fill(0).map(_ => Math.floor(Math.random() * 10)).join("")
    },
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    fullName: {
        type: {
            givenName: String,
            familyName: String
        },
        required: true
    },
    avatarHash: {
        type: String,
        required: true
    },
    provider: {
        type: String,
        enum: ["google", "facebook"],
        required: true
    },
    googleID: {
        type: String,
        unique: true,
        sparse: true
    },
    facebookID: {
        type: String,
        unique: true,
        sparse: true
    },
    points: Number
});

export default model("account", accountSchema);