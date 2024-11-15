import { Schema, model } from "mongoose";

const quizSchema = new Schema({
    topic: {
        type: String,
        required: true
    },
    description: String,
    questions: [
        {
            question: {
                type: String,
                required: true
            },
            answers: {
                A: String,
                B: String,
                C: String,
                D: String,
            },
            correct_answer: String,
        }
    ],
    difficulty_level: String,
    category: String,
    time_limit: Number,
    points_reward: Number,
});

export default model("quiz", quizSchema);