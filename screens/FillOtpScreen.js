import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthAPI from "../API/AuthAPI";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from 'react';

const FillOtpScreen = ({ navigation }) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleFillOtp = async () => {
        const email = await AsyncStorage.getItem('email');
        const data = {
            email,
            activeCode: otp,
        };

        AuthAPI.confirmUser(data)
            .then(response => {
                console.log(response.data);
                AsyncStorage.removeItem('email');
                navigation.navigate('Login');
            })
            .catch(error => {
                console.error(error);
                setError(error.response.data.message);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Nhập mã OTP</Text>
            <Text style={styles.errorText}>{error}</Text>

            <TextInput
                value={otp}
                onChangeText={setOtp}
                style={styles.input} placeholder="Mã OTP" />
            <Button title="Xác nhận" onPress={handleFillOtp} />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        width: 300,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    errorText: {
        color: 'red',
    },
});

export default FillOtpScreen;