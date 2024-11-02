import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketProvider";
import { useDispatch } from "react-redux";
import { fetchNotifications } from "../redux/slices/notificationSlice";
import { Snackbar } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";


const SocketEventListener = () => {
    const socket = useSocket();
    const navigation = useNavigation();
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [notification, setNotification] = useState(null);
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const handleNewNotification = (notification) => {
            setShowSnackbar(true);
            setNotification(notification);
            dispatch(fetchNotifications());
        };
        if (socket) {
            socket.on('new-notification', (notification) => handleNewNotification(notification));
        }

        return () => {
            if (socket) {
                socket.off('new-notification');
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
                        onPress: () => {
                            setShowSnackbar(false);
                            navigation.navigate('Notification');
                        }
                    }}
                    style={{ bottom: insets.bottom + 50 }}
                >
                    {notification && notification.content}
                </Snackbar>
            )}
        </>
    );
}

export default SocketEventListener;