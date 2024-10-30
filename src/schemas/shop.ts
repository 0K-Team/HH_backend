import { Schema, model } from "mongoose";

const shopSchema = new Schema({
    items: [
        {
            name: {
                type: String,
                required: true
            },
            description: String,
            cost: {
                type: Number,
                required: true
            },
            category: String,
            stock: Number,
            image: String,
            expiry_date: Date
        }
    ]
});

export default model("shop", shopSchema);