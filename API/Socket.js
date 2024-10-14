import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";

let socket;

const initSocket = async () => {
    const token = await AsyncStorage.getItem('token');
    return io('http://192.168.56.1:4000', {
        extraHeaders: {
            token: `${token}`
        }
    });
}

export const connectSocket = async () => {
    if (socket) {
        return socket;
    }
    socket = await initSocket();
    // socket.on('connect', () => {
    //     console.log('Socket connected');
    // });
    // socket.on('disconnect', () => {
    //     console.log('Socket disconnected');
    // });
    return socket;
}