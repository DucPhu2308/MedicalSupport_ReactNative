import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthAPI from "../API/AuthAPI";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import React, { act, useState } from 'react';

const ResetPasswordScreen = ({ navigation }) => {
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');

    const handleResetPassword = async () => {
        const data = {
            email: await AsyncStorage.getItem('email'),
            password,
            activeCode: otp,
        };

        AuthAPI.resetPassword(data)
            .then(response => {
                console.log(response.data);
                navigation.navigate('Login');
            })
            .catch(error => {
                console.error(error);
                setError(error.response.data.message);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Quên mật khẩu</Text>
            <Text style={styles.errorText}>{error}</Text>

            {/* Text input for password, confirm password */}
            {/* Number input for otp */}
            <TextInput
                value={password}
                onChangeText={setPassword}
                style={styles.input} placeholder="Mật khẩu" secureTextEntry={true} />
            <TextInput
                value={otp}
                onChangeText={setOtp}
                style={styles.input} placeholder="Mã OTP" keyboardType="number-pad" />
            <Button title="Xác nhận" onPress={handleResetPassword} />
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
    subText: {
        marginTop: 20,
    },
});

export default ResetPasswordScreen;