import NotificationSchema from "../schemas/notifications";

export interface Notification {
    name: string;
    description?: string;
    icon?: string;
    read?: boolean;
}

export class NotificationHandler {
    static async sendNotification(user: string, notification: Notification) {
        await NotificationSchema.updateOne({
            user
        }, {
            $addToSet: {
                notifications: notification
            }
        });
    }
}