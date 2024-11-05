import { Schema, model } from "mongoose";

const possibleTopicsSchema = new Schema({
    name: String,
});

export default model("possibleTopic", possibleTopicsSchema);