import { useCallback, useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { useDispatch } from "react-redux";
import { fetchNotifications } from "../redux/slices/notificationSlice";
import { Snackbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MessageType } from "../API/ChatAPI";
import { getUnreadCount } from "../redux/slices/chatSlice";


const SocketEventListener = () => {
    const socket = useSocket();
    const navigation = useNavigation();
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [notification, setNotification] = useState('');
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    var snackbarType = '';

    const snackbarAction = useCallback(() => {
        setShowSnackbar(false);
        if (snackbarType === 'message') {
            navigation.navigate('Chat');
        }
        else if (snackbarType === 'notification')
            navigation.navigate('Notification');
    }, [navigation, snackbarType]);

    useEffect(() => {
        const handleNewNotification = (notification) => {
            setShowSnackbar(true);
            setNotification(notification.content);
            dispatch(fetchNotifications());
            snackbarType = 'notification';
        };

        const handleNewMessage = (message) => {
            setShowSnackbar(true);
            if (message.type === MessageType.TEXT) {
                setNotification(`Bạn có tin nhắn mới từ ${message.sender.lastName}`);
            } else if (message.type === MessageType.IMAGE) {
                setNotification(`${message.sender.lastName} đã gửi ảnh cho bạn`);
            } else if (message.type === MessageType.APPOINTMENT) {
                setNotification(`${message.sender.lastName} đã gửi lời mời cuộc hẹn cho bạn`);
            }
            snackbarType = 'message';
            dispatch(getUnreadCount());
        };
        if (socket) {
            socket.on('new-notification', (notification) => handleNewNotification(notification));
            socket.on('receive-message', (message) => handleNewMessage(message));
        }

        return () => {
            if (socket) {
                socket.off('new-notification');
                socket.off('receive-message');
            }
        }
    }, [socket]);

    return (
        <>
            {(
                <Snackbar
                    visible={showSnackbar}
                    duration={5000}
                    onDismiss={() => setShowSnackbar(false)}
                    action={{
                        label: 'View',
                        onPress: snackbarAction,
                    }}
                    style={{ bottom: insets.bottom + 50 }}
                >
                    {notification}
                </Snackbar>
            )}
        </>
    );
}

export default SocketEventListener;