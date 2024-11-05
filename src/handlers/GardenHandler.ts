import GardenSchema from "../schemas/garden";

export interface Garden {
    user: string;
    plants: Plant[];
    userActions: UserActions;
}

export interface Plant {
    _id: string;
    name: string;
    type: string;

    growthStage?: number;
    wateringNeeded?: number;
    fertilizerNeeded?: number;
    weedsRemovedNeeded?: number;

    planted?: Date;
    lastWatered?: Date;
    lastFertilized?: Date;

    harvestable?: boolean;
}

export interface UserActions {
    wateringCount?: number;
    wateringMaxCount?: number;
    wateringRefill?: Date;

    fertilizingCount?: number;
    fertilizingMaxCount?: number;
    fertilzingRefill?: Date;

    weedsRemoved?: number;
    weedsMaxRemoved?: number;
    weedsRefill?: number;
}

export class GardenHandler {

    static async getPlant(user: string, plant: string): Promise<[number | null, Garden | null, Plant | null]> {
        const garden = await GardenSchema.findOne({
            user,
            "plants._id": plant
        }, {
            "plants.$": 1
        });

        if (!garden) return [1, null, null];

        const currentPlant = garden.plants[0];

        if (!currentPlant) return [2, null, null];

        // @ts-ignore
        return [null, garden.toObject() as Garden, currentPlant.toObject() as Plant];
    }

    static async water(user: string, plant: string) {
        const [error, garden, currentPlant] = await GardenHandler.getPlant(user, plant);
        if (error || !garden || !currentPlant) return [error, null];

        if ((currentPlant.wateringNeeded ?? 0) <= 0) return [3, null];

        const userActions = garden.userActions;
        if ((userActions?.wateringCount ?? 0) > (userActions?.wateringMaxCount ?? 10)) return [4, null];

        const newPlant = await GardenSchema.findOneAndUpdate({
            user,
            "plants._id": plant
        }, {
            $inc: {
                "plants.$.wateringNeeded": -1,
                "userActions.wateringCount": 1
            },
            $set: {
                "plants.$.lastWatered": new Date()
            }
        }, {
            new: true
        });

        return [null, newPlant];
    }

    static async fertilize(user: string, plant: string) {
        const [error, garden, currentPlant] = await GardenHandler.getPlant(user, plant);
        if (error || !garden || !currentPlant) return [error, null];

        if ((currentPlant.fertilizerNeeded ?? 0) <= 0) return [3, null];

        const userActions = garden.userActions;

        if ((userActions?.fertilizingCount ?? 0) > (userActions?.fertilizingMaxCount ?? 10)) return [4, null];

        const newPlant = await GardenSchema.findOneAndUpdate({
            user,
            "plants._id": plant
        }, {
            $inc: {
                "plants.$.fertilizerNeeded": -1,
                "userActions.fertilizingCount": 1
            },
            $set: {
                "plants.$.lastFertilized": new Date()
            }
        }, {
            new: true
        });

        return [null, newPlant];
    }

    static async weedsRemove(user: string, plant: string) {
        const [error, garden, currentPlant] = await GardenHandler.getPlant(user, plant);
        if (error || !garden || !currentPlant) return [error, null];

        if ((currentPlant.wateringNeeded ?? 0) <= 0) return [3, null];

        const userActions = garden.userActions;

        if ((userActions?.wateringCount ?? 0) > (userActions?.wateringMaxCount ?? 10)) return [4, null];

        const newPlant = await GardenSchema.findOneAndUpdate({
            user,
            "plants._id": plant
        }, {
            $inc: {
                "plants.$.wateringNeeded": -1,
                "userActions.wateringCount": 1
            },
            $set: {
                "plants.$.lastWatered": new Date()
            }
        }, {
            new: true
        });

        return [null, newPlant];
    }
}