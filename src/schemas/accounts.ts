import { Schema, model } from "mongoose";

const accountSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        default: () => new Array(15).fill(0).map(_ => Math.floor(Math.random() * 10)).join("")
    },
    email: String,
    username: {
        type: String,
        required: true,
        default: () => "user" + new Array(4).fill(0).map((_) => Math.floor(Math.random() * 10)).join("")
    },
    fullName: {
        type: {
            givenName: String,
            familyName: String
        },
        required: true
    },
    avatarHash: String,
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
    title: String,
    friends: [String],
    bio: String,
    achievements: [
        {
            name: String,
            dateAwarded: Date,
            description: String,
            icon: String,
            id: String
        }
    ],
    skills: [String],
    location: String,
    country: String,
    preferredTopics: [String],
    points: Number,
    admin: Boolean,
    createdAt: {
        type: String,
        default: () => new Date().toISOString()
    },
    configured: {
        type: Boolean,
        default: false
    },
    mailSent: {
        type: Boolean,
        default: false
    }
});

export default model("account", accountSchema);