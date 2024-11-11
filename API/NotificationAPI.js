import { axiosPrivate } from "./AxiosClient";

export class NotificationAPI {
    static async getNotifications() {
        return axiosPrivate.get("/notification");
    }

    static async markAsRead(notificationIds) {
        return axiosPrivate.put("/notification/mark-as-read", { notificationIds });
    }
}

export const NotificationType = {
    POST_REACT: 'post_like',
    POST_COMMENT: 'post_comment',
    REPLY_COMMENT: 'reply_comment',
    APPOINTMENT_REMINDER: 'appointment_reminder',
    GENERAL: 'general'
};