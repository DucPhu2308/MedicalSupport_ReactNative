import { memo, useCallback, useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { useDispatch } from "react-redux";
import { fetchNotifications } from "../redux/slices/notificationSlice";
import { Snackbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MessageType } from "../API/ChatAPI";
import { getUnreadCount } from "../redux/slices/chatSlice";
import { View } from "react-native";
import { useAuth } from "../contexts/AuthContext";


const SocketEventListener = memo(() => {
    const { user } = useAuth();
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

    const handleNewMessage = (message) => {
        if (message.sender._id === user._id) return;
        snackbarType = 'message';
        setShowSnackbar(true);
        if (message.type === MessageType.TEXT) {
            setNotification(`Bạn có tin nhắn mới từ ${message.sender.lastName}`);
        } else if (message.type === MessageType.IMAGE) {
            setNotification(`${message.sender.lastName} đã gửi ảnh cho bạn`);
        } else if (message.type === MessageType.APPOINTMENT) {
            setNotification(`${message.sender.lastName} đã gửi lời mời cuộc hẹn cho bạn`);
        }
        dispatch(getUnreadCount());
    };

    const handleNewNotification = (notification) => {
        snackbarType = 'notification';
        setShowSnackbar(true);
        setNotification(notification.content);
        dispatch(fetchNotifications());
    };

    useEffect(() => {
        console.log('Socket event listener attached');
        if (socket) {
            socket.on('new-notification', handleNewNotification);
            socket.on('receive-message', handleNewMessage);
        }

        return () => {
            if (socket) {
                console.log('Socket event listener detached');
                socket.off('new-notification', handleNewNotification);
                socket.off('receive-message', handleNewMessage);
            }
        }
    }, [socket]);

    return (
        <View style={{zIndex: 100}}>
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
        </View>
    );
});

export default SocketEventListener;