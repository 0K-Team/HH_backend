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
            growthStage: {
                type: Number,
                default: 0
            },
            wateringNeeded: {
                type: Number,
                default: () => Math.floor(Math.random() * 4)
            },
            fertilizerNeeded: {
                type: Number,
                default: () => Math.floor(Math.random() * 4)
            },
            weedsRemovedNeeded: {
                type: Number,
                default: () => Math.floor(Math.random() * 4)
            },
            planted: {
                type: Date,
                default: () => new Date()
            },
            lastWatered: Date,
            lastFertilized: Date,
            harvestable: Boolean,
        }
    ],
    userActions: {
        wateringCount: {
            type: Number,
            default: 0
        },
        wateringMaxCount: {
            type: Number,
            default: 10,
        },
        wateringRefill: Date,
        fertilizingCount: {
            type: Number,
            default: 0
        },
        fertilizingMaxCount:  {
            type: Number,
            default: 10,
        },
        fertilizingRefill: Date,
        weedsRemoved: {
            type: Number,
            default: 0
        },
        weedsMaxRemoved:  {
            type: Number,
            default: 10,
        },
        weedsRefill: Date
    },
    lastPlantAdded: Date
});

export default model("garden", gardenSchema);