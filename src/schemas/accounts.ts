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
        required: false,
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
    title: {
        name: String,
    },
    notifications: [
        {
            title: String,
            date: Date
        }
    ],
    friends: [String],
    bio: String,
    achievements: [
        {
            name: String,
            date_awarded: Date
        }
    ],
    skills: [String],
    badges: [String],
    location: String,
    preferred_topics: [String],
    points: Number
});

export default model("account", accountSchema);