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
                default: 0
            },
            fertilizerNeeded: {
                type: Number,
                default: 0
            },
            planted: {
                type: Date,
                default: () => new Date()
            },
            lastWatered: Date,
            lastFertilized: Date,
            harvestable: Boolean,
            weedsRemovedNeeded: {
                type: Number,
                default: 0
            }
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
    }
});

export default model("garden", gardenSchema);