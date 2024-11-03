import { Schema, model } from "mongoose";

const gardenSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    plants: [
        {
            name: {
                type: String,
                required: true
            },
            type: {
                type: String,
                required: true
            },
            growthStage: Number,
            wateringNeeded: Number,
            fertilizerNeeded: Number,
            planted: {
                type: Date,
                default: () => new Date()
            },
            lastWatered: Date,
            lastFertilized: Date,
            harvestable: Boolean,
            weedsRemovedNeeded: Number
        }
    ],
    userActions: {
        wateringCount: {
            type: Number,
            default: 0
        },
        wateringMaxCount: Number,
        wateringRefill: Date,
        fertilizingCount: {
            type: Number,
            default: 0
        },
        fertilizingMaxCount: Number,
        fertilizingRefill: Date,
        weedsRemoved: {
            type: Number,
            default: 0
        },
        weedsMaxRemoved: Number,
        weedsRefill: Date
    }
});

export default model("garden", gardenSchema);