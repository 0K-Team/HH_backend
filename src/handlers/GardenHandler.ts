import { CronJob } from "cron";
import GardenSchema from "../schemas/garden";

export interface Garden {
    user: string;
    plants: Plant[];
    userActions: UserActions;
    lastPlantAdded: Date;
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
    fertilizingRefill?: Date;

    weedsRemoved?: number;
    weedsMaxRemoved?: number;
    weedsRefill?: Date;
}

export class GardenHandler {
    job: CronJob;
    constructor () {
        this.job = CronJob.from({
            cronTime: "0 */15 * * * *",
            start: true,
            onTick: () => {
                this.addPlants();
            }
        })
    }

    async addPlants() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const updated = await GardenSchema
            .aggregate()
            .match({
                $or: [
                    { lastPlantAdded: { $lte: yesterday } },
                    { lastPlantAdded: { $exists: false } },
                ],
                $expr: {
                    $lte: [
                        { $size: "$plants" },
                        9
                    ]
                }
            })
            .lookup({
                from: "plants",
                pipeline: [
                    { $sample: { size: 1} },
                    { $project: { name: 1, type: 1, _id: 0 } }
                ],
                as: "randomPlant"
            })
            .addFields({
                plants: {
                    $concatArrays: ["$plants", "$randomPlant"]
                },
                lastPlantAdded: new Date().toISOString()
            })
            .project({
                randomPlant: 0
            });

            const operations = updated.map(garden => ({
            updateOne: {
                filter: { _id: garden._id },
                update: {
                    $set: {
                        plants: garden.plants,
                        lastPlantAdded: garden.lastPlantAdded
                    }
                }
            }
        }));

        if (operations.length > 0) await GardenSchema.bulkWrite(operations);
    }

    static async updatePlants(user: string) {
        const userData = await GardenSchema.findOne({
            user
        });

        if (!userData) return;

        const plants = [];

        for (const plant of userData.plants) {
            if (plant.wateringNeeded == 0 && plant.fertilizerNeeded == 0 && plant.weedsRemovedNeeded == 0 && plant.growthStage < 4) {
                plant.growthStage++;
                plant.wateringNeeded = Math.floor(Math.random() * 4);
                plant.fertilizerNeeded = Math.floor(Math.random() * 4);
                plant.weedsRemovedNeeded = Math.floor(Math.random() * 4);
            }
            plants.push(plant);
        }

        await GardenSchema.updateOne({
            user
        }, {
            $set: {
                plants
            }
        });
    }

    static async updateCapabilities(user: string) {
        const userData = await GardenSchema.findOne({
            user
        });

        if (!userData) return;

        const userActions = userData.userActions as UserActions;

        const newData: Partial<UserActions> = {};

        const date = new Date();
        date.setDate(date.getDate() + 3);

        const now = new Date();

        if (!userActions.wateringRefill) newData.wateringRefill = date;
        else if (userActions.wateringRefill < now) {
            newData.wateringMaxCount = (userActions.wateringMaxCount ?? 0) + 10;
            newData.wateringRefill = date;
        }
        if (!userActions.fertilizingRefill) newData.fertilizingRefill = date;
        else if (userActions.fertilizingRefill < now) {
            newData.fertilizingMaxCount = (userActions.fertilizingMaxCount ?? 0) + 10;
            newData.fertilizingRefill = date;
        }
        if (!userActions.weedsRefill) newData.weedsRefill = date;
        else if (userActions.weedsRefill < now) {
            newData.weedsMaxRemoved = (userActions.weedsMaxRemoved ?? 0) + 10;
            newData.weedsRefill = date;
        }

        if (Object.keys(newData).length > 0) {
            await GardenSchema.updateOne({
                user
            }, {
                userActions: newData
            });
        }
    }

    static async getPlant(user: string, plant: string): Promise<[number | null, Garden | null, Plant | null]> {
        GardenHandler.updateCapabilities(user);
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

        GardenHandler.updatePlants(user);

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

        GardenHandler.updatePlants(user);

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

        GardenHandler.updatePlants(user);

        return [null, newPlant];
    }
}