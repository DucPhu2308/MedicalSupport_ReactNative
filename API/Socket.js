import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

const initSocket = async () => {
    const token = await AsyncStorage.getItem('token');
    return io('http://192.168.2.14:4000', {
        extraHeaders: {
            token: `${token}`
        }
    });
}

export const socket = await initSocket();