import { Schema, model } from "mongoose";

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    category: {
        type: String,
        required: true
    },
    isOffline: {
        type: Boolean,
        default: true
    },
    location: {
        address: String,
        latitude: Number,
        longitude: Number
    },
    date: Date,
    duration: String,
    organizer: {
        type: String,
        required: true
    },
    image: String,
    additionalInfo: {
        whatToBring: String,
        eventRules: String
    },
    members: {
        type: Array,
        default: []
    },
    awaiting: {
        type: Boolean,
        default: true
    }
})

export default model("event", schema);