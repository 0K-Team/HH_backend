import { Schema, model } from "mongoose";

const schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: Number,
    currency: String,
    productUrl: String,
    description: {
        type: String,
        required: true
    },
    carbonFootprint: {
        co2Emission: String,
        unit: String
    },
    durability: String,
    recyclingInfo: String,
    imageUrl: String,
    ecoCertification: String,
    ecoFriendly: Boolean
})

export default model("product", schema);