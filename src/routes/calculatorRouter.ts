import express, { Request, Response } from 'express';
import { validateParams } from '../middlewares/validate';
import { CalculatorValidator } from '../validators';

import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const router = express.Router();

router.post("/", validateParams(CalculatorValidator), async (req: Request, res: Response) => {
    const { 
        transport: { car_usage, fuel_type, weekly_km, flight_frequency, public_transport_usage },
        energy: { energy_source, water_heating_source, monthly_kWh, energy_efficiency },
        water: { shower_time, bathtub_usage },
        waste: { waste_segregation, food_waste, plastic_usage },
        food: { meat_consumption, local_food_preference },
        leisure: { movie_watch_time, shopping_frequency }
    } = req.body;

    //* TRANSPORT
    const carEmissionFactorList: { [key: number]: number } = {
        0: 0.192,
        1: 0.174,
        2: 0.085,
        3: 0.1,
        4: 0.1
    }
    const carEmissionFactor = carEmissionFactorList[fuel_type];
    
    const carDistanceList: { [key: number]: number } = {
        0: 25,
        1: 100,
        2: 225,
        3: 500
    }
    const carDistance = carDistanceList[car_usage];
    
    const carEmission = carDistance * carEmissionFactor;

    const carFreqFactorList: { [key: number]: number } = {
        0: 0.5,
        1: 1,
        2: 2,
        3: 4
    }
    const carFreqFactor = carFreqFactorList[weekly_km];

    const carEmissionWeek = carEmission * carFreqFactor;    // TODO: TO SEND OUT

    const planeEmissionWeekList: { [key: number]: number } = {
        0: 0,
        1: 4.32,
        2: 13,
        3: 20,
    }
    const planeEmissionWeek = planeEmissionWeekList[flight_frequency];    // TODO: TO SEND OUT

    const publicEmissionWeekList: { [key: number]: number } = {
        0: 0,
        1: 3.5,
        2: 10,
        3: 24,
    }
    const publicEmissionWeek = publicEmissionWeekList[public_transport_usage];    // TODO: TO SEND OUT



    //* ENERGY
    const energySourceFactorList: { [key: number]: number } = {
        0: 0.95,
        1: 0.5,
        2: 0.4,
        3: 0.03,
    }
    const energySourceFactor = energySourceFactorList[energy_source]; 

    const waterHeatingSourceList: { [key: number]: number } = {
        0: 0.4,
        1: 0.5,
        2: 0.95,
        3: 0.03,
    }
    const waterHeatingSource = waterHeatingSourceList[water_heating_source];

    const powerUsageList: { [key: number]: number } = {
        0: 20,
        1: 40,
        2: 60,
        3: 80,
    }
    const powerUsage = powerUsageList[monthly_kWh]; 

    const energyEfficiencyList: { [key: number]: number } = {
        0: 1,
        1: 0.7,
        2: 0.4,
    }
    const energyEfficiency = energyEfficiencyList[energy_efficiency]; 

    const energyEmission = energySourceFactor * powerUsage * energyEfficiency + waterHeatingSource * 385;   // TODO: TO SEND OUT

    //* Water
    const showerTimeList: { [key: number]: number } = {
        0: 0.06,
        1: 0.12,
        2: 0.16,
        3: 0.24,
    }
    const showerTime = showerTimeList[shower_time]; 

    const bathFreqList: { [key: number]: number } = {
        0: 0.06,
        1: 0.12,
        2: 0.25,
        3: 0.5,
    }
    const bathFreq = bathFreqList[bathtub_usage]; 

    const waterEmission = showerTime + bathFreq;    // TODO: TO SEND OUT

    //* Garbage
    const segregationList: { [key: number]: number } = {
        0: 0.5,
        1: 0.7,
        2: 1,
    }
    const segregation = segregationList[waste_segregation]; 

    const foodWasteList: { [key: number]: number } = {
        0: 0.2,
        1: 0.5,
        2: 1.5,
        3: 2.5,
    }
    const foodWaste = foodWasteList[food_waste]; 

    const plasticUsageList: { [key: number]: number } = {
        0: 1,
        1: 0.5,
        2: 0.3,
        3: 0,
    }
    const plasticUsage = plasticUsageList[plastic_usage]; 

    const garbageEmission = (foodWaste + plasticUsage) * segregation;   // TODO: TO SEND OUT

    //* Food
    const meatUsageList: { [key: number]: number } = {
        0: 5,
        1: 3,
        2: 1,
        3: 0.5,
        4: 0,
    }
    const meatUsage = meatUsageList[meat_consumption]; 

    const seasonalLocalFoodList: { [key: number]: number } = {
        0: 0.3,
        1: 0.5,
        2: 0.8,
        3: 1,
    }
    const seasonalLocalFood = seasonalLocalFoodList[local_food_preference]; 

    const foodEmission = meatUsage * seasonalLocalFood;     // TODO: TO SEND OUT

    //* Free Time
    const watchTimeList: { [key: number]: number } = {
        0: 0.5,
        1: 1.5,
        2: 2.5,
        3: 4,
    }
    const watchTimeEmission = watchTimeList[movie_watch_time];     // TODO: TO SEND OUT

    const newClothesList: { [key: number]: number } = {
        0: 1.5,
        1: 8,
        2: 11,
    }
    const newClothesEmission = newClothesList[shopping_frequency];   // TODO: TO SEND OUT


    //* Sumup
    const totalEmission = carEmissionWeek + planeEmissionWeek + publicEmissionWeek + energyEmission + waterEmission + garbageEmission + foodEmission + watchTimeEmission + newClothesEmission;

    //* AI Summary

    async function getGroqChatCompletion() {
        return groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: `Suggest short recommendation how to improve mine CO2 emission forom this date_awarded (without formatting) (2-3 sentences) (Without introduction) (Without "To reduce your CO2 emissions" or anything else)
                    car_CO2_emission: ${carEmissionWeek},
                    plane_CO2_emission: ${planeEmissionWeek},
                    public_transport_CO2_emission: ${publicEmissionWeek},
                    energy_CO2_emission: ${energyEmission},
                    water_CO2_emission: ${waterEmission},
                    garbage_CO2_emission: ${garbageEmission},
                    food_CO2_emission: ${foodEmission},
                    watch_time_CO2_emission: ${watchTimeEmission},
                    shopping_CO2_emission: ${newClothesEmission},
                    `,
                },
            ],
            model: "llama3-8b-8192",
        });
    }

    const groqAnswer = await getGroqChatCompletion();
    const groqContent = groqAnswer.choices[0]?.message?.content || "";

    //* SEND
    const result = {
        "total_emission_week": totalEmission,
        "specific_emission": {
            "car": carEmissionWeek,
            "plane": planeEmissionWeek,
            "public_transport": publicEmissionWeek,
            "energy": energyEmission,
            "water": waterEmission,
            "garbage": garbageEmission,
            "food": foodEmission,
            "watch_time": watchTimeEmission,
            "shopping": newClothesEmission,
        },
        "AI_suggestion": groqContent
    } 

    res.send(result);
})

export default router;