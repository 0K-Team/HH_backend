import { Schema, model } from "mongoose";

const gardenSchema = new Schema({
    plants: [
        {
            plant_type: {
                type: String,
                required: true
            },
            species: String,
            growth_stage: String,
            planted_date: {
                type: Date,
                required: true
            },
            points_earned: Number
        }
    ],
    total_points: Number,
    eco_simulation: {
        current_environmental_impact: {
            carbon_offset: Number,
            oxygen_generated: Number,
            biodiversity_score: Number
        },
        future_projections: {
            carbon_offset: Number,
            oxygen_generated: Number,
            biodiversity_score: Number  
        },
        growth_progress: [
            {
                date: Date,
                carbon_offset: Number,
                oxygen_generated: Number
            }
        ]
    }
});

export default model("garden", gardenSchema);