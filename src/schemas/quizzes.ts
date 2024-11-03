import { Schema, model, Types } from "mongoose";

const quizSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    questions: [
        {
            text: {
                type: String,
                required: true
            },
            options: [
                {
                    text: String
                }
            ],
            correct_option_id: Types.ObjectId
        }
    ],
    difficulty_level: String,
    category: String,
    time_limit: Number,
    points_reward: Number,
});

export default model("quiz", quizSchema);