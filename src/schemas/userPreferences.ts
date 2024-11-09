import { Schema, model } from "mongoose";
import { LANGUAGE_CODES } from "../constants";

const schema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    language: {
        type: String,
        enum: LANGUAGE_CODES,
        default: "EN"
    },
    theme: {
        type: String,
        enum: ["light", "dark"],
        default: "dark"
    }
});

export default model("userPreference", schema);