import { Schema, model } from "mongoose";

const locationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    coordinates: {
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    },
    address: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    opening_hours: {
        monday: {
            type: String,
            required: true
        },
        tuesday: {
            type: String,
            required: true
        },
        wednesday: {
            type: String,
            required: true
        },
        thursday: {
            type: String,
            required: true
        },
        friday: {
            type: String,
            required: true
        },
        saturday: {
            type: String,
            required: true
        },
        sunday: {
            type: String,
            required: true
        }
    }
});

export default model("location", locationSchema);