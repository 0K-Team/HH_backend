import { Schema, model } from "mongoose";

const schema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    currentQuiz: {
        _id: {
            type: String,
            required: true
        },
        currentQuestionId: {
            type: Number,
            required: true
        }
    }
});

export default model("currentQuiz", schema);