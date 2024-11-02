import { useCallback } from "react";
import NotificationItem from "../components/NotificationItem";
import { FlatList, RefreshControl, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAsRead } from "../redux/slices/notificationSlice";
import { useFocusEffect } from "@react-navigation/native";
import { NotificationType } from "../API/NotificationAPI";
import PostAPI from "../API/PostAPI";
import { AppointmentAPI } from "../API/AppointmentAPI";

const NotificationScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const notifications = useSelector((state) => state.notification.notifications);
    const loading = useSelector((state) => state.notification.loading);

    const fetchNotification = async () => {
        dispatch(fetchNotifications());
    };

    useFocusEffect(
        useCallback(() => {

            return () => {
                // mark all notifications as read on leaving the screen
                const ids = notifications.filter((notification) => notification.isRead === false).map((notification) => notification._id);
                dispatch(markAsRead(ids));
            }
        }, [])
    );

    return (
        <View>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => {
                    const onPress = async () => {
                        if (item.type === NotificationType.POST_REACT 
                            || item.type === NotificationType.POST_COMMENT 
                            || item.type === NotificationType.REPLY_COMMENT) {
                            // get id from noti.actionUrl (e.g. /post/123)
                            const postId = item.actionUrl.split('/')[2];
                            const post = (await PostAPI.getPostById(postId)).data[0];
                            navigation.navigate('PostDetail', { post });
                        } else if (item.type === NotificationType.APPOINTMENT_REMINDER) {
                            const apptId = item.actionUrl.split('/')[2];
                            const appt = (await AppointmentAPI.getAppointmentById(apptId)).data;
                            navigation.navigate('AppointmentDetailScreen', { appointment: appt });
                        }
                        
                    };
                    return <NotificationItem notification={item} onPress={onPress} />
                }}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchNotification} />
                }
            />
        </View>
    );
};

export default NotificationScreen;