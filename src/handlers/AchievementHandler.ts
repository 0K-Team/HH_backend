import AccountSchema from "../schemas/accounts";
import { Achievement } from "../types/user";

export class AchievementHandler {
    static async grantAchievement(user: string, achievement: Achievement) {
        const userData = await AccountSchema.findOne({
            id: user
        });

        if (!userData?.achievements.find(a => a.id == achievement.id)) {
            return await AccountSchema.findOneAndUpdate({
                id: user
            }, {
                $addToSet: {
                    achievements: achievement
                }
            }, { new: true });
        }
        
        return userData;
    }
}