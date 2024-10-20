import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const loadAuthData = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            const storedToken = await AsyncStorage.getItem("token");

            if (storedUser) setUser(JSON.parse(storedUser));
            if (storedToken) setToken(storedToken);
        };
        loadAuthData();
    }, []);

    const logout = async () => {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        await AsyncStorage.removeItem("roles");
        setUser(null);
        setToken(null);
    };

    const updateUser = async (newUser) => {
        await AsyncStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
    };

    const updateToken = async (newToken) => {
        await AsyncStorage.setItem("token", newToken);
        setToken(newToken);
    };

    return (
        <AuthContext.Provider value={{ user, logout, updateUser, token, updateToken }}>
            {children}
        </AuthContext.Provider>
    );
};
