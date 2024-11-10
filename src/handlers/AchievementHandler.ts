import AccountSchema from "../schemas/accounts";
import { Achievement } from "../types/user";
import { CacheHandler } from "./CacheHandler";

const achievementCache = new CacheHandler<Achievement[]>();

export class AchievementHandler {
    static async grantAchievement(user: string, achievement: Achievement) {
        const userData = await AccountSchema.findOne({
            id: user
        });

        if (!userData?.achievements.find(a => a.id == achievement.id)) {
            const newData = await AccountSchema.findOneAndUpdate({
                id: user
            }, {
                $addToSet: {
                    achievements: achievement
                }
            }, { new: true });

            if (!newData) return;

            achievementCache.cache(user, newData.achievements as Achievement[]);

            return newData;
        }
        
        return userData;
    }

    static async fetchAchievements(user: string) {
        if (achievementCache.has(user)) return achievementCache.get(user);

        const userData = await AccountSchema.findOne({
            id: user
        }, {
            achievements: 1
        });

        if (!userData) return [];

        const achievements = userData.achievements as Achievement[];

        achievementCache.cache(user, achievements);

        return achievements;
    }
}