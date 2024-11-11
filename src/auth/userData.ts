import accounts from "../schemas/accounts"
import friendRequests from "../schemas/friendRequests";
import garden from "../schemas/garden";
import notifications from "../schemas/notifications";
import posts from "../schemas/posts";
import userPreferences from "../schemas/userPreferences";

export const deleteUserData = async (user: string) => {
    await accounts.deleteOne({
        id: user
    });

    await friendRequests.deleteMany({
        $or: [
            { sender: user },
            { target: user }
        ]
    });

    await garden.deleteOne({
        user
    });

    await notifications.deleteOne({
        user
    });

    await posts.updateMany({
        author: user
    }, {
        author: "000000000000000"
    });
    
    await posts.updateMany(
        { likes: user },
        { $set: { "likes.$": "000000000000000" } }
    );

    await userPreferences.deleteOne({
        user
    });
}