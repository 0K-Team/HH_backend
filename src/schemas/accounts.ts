import { Schema, model } from "mongoose";

const accountSchema = new Schema({
    email: String,
    session: String,
    name: String,
    points: Number
});

export default model("account", accountSchema);