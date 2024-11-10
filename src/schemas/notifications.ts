import { Schema, model } from "mongoose";

const schema = new Schema({
    user: {
        type: String,
        required: String
    },
    notifications: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                description: String,
                icon: String,
                read: Boolean
            }
        ],
        default: []
    }
});

export default model("notification", schema);