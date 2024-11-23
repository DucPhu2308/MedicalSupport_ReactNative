import React, { createContext, useMemo, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";

const SocketContext = createContext();

export const useSocket = () => {
    const socket = useContext(SocketContext);
    if (!socket) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return socket;
};

export const SocketProvider = ({ children }) => {
    const { token } = useAuth();

    const socket = useMemo(() => io(`${process.env.EXPO_PUBLIC_API_URL}`, {
        extraHeaders: {
            token: token
        }
    }), [token]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
